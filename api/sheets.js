import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export default async function handler(req, res) {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, auth);

  try {
    await doc.loadInfo();

    if (req.method === "GET") {
      const { name } = req.query;

      if (!name) {
        return res.status(400).json({ error: "Missing full name" });
      }

      const normalizedName = String(name).trim().toLowerCase();

      // Check Responses sheet for existing response
      const responsesSheet = doc.sheetsByTitle["Responses"];
      const responsesRows = await responsesSheet.getRows();

      const responseMatch = responsesRows.find((row) => {
        try {
          const rawParty = row.get("Party");
          if (rawParty) {
            const parsed = JSON.parse(rawParty);
            return parsed.some((guest) => {
              const guestName = typeof guest === "string" ? guest : guest.name;
              return String(guestName || "").trim().toLowerCase() === normalizedName;
            });
          }
        } catch {
          return false;
        }
        return false;
      });

      console.log("Searching Responses sheet for:", normalizedName);
      console.log("Responses rows found:", responsesRows.length);

      if (responseMatch) {
        let party = [];
        let plusOnes = [];

        try {
          const rawParty = responseMatch.get("Party");

          if (rawParty) {
            const parsed = JSON.parse(rawParty);
            party = parsed.map((guest) => ({
              name: guest.name || "",
              attending: guest.attending ?? null,
            }));
          }
        } catch {
          party = [];
        }

        try {
          const rawPlusOnes = responseMatch.get("PlusOneNames");

          if (rawPlusOnes) {
            const parsed = JSON.parse(rawPlusOnes);
            plusOnes = parsed.map((guest) => ({
              name: guest.name || "",
              attending: guest.attending ?? null,
            }));
          }
        } catch {
          plusOnes = [];
        }

        return res.status(200).json({
          valid: true,
          plusOneCount: Number(responseMatch.get("PlusOneCount") || 0),
          party,
          existingRSVP: {
            guestCount: Number(responseMatch.get("GuestCount") || 0),
            party,
            plusOnes,
            email: String(responseMatch.get("Email") || "").trim(),
            comments: String(responseMatch.get("Comments") || "").trim(),
          },
        });
      }

      // If not found in Responses, search Guests sheet for initial party data
      const guestsSheet = doc.sheetsByTitle["Guests"];
      const guestsRows = await guestsSheet.getRows();

      console.log("Searching Guests sheet for:", normalizedName);
      console.log("Guests rows found:", guestsRows.length);

      const guestMatch = guestsRows.find((row) => {
        const rawParty = row.get("Party");
        console.log("Row Party field:", rawParty);
        if (rawParty) {
          const partyNames = rawParty.split(",").map((name) => name.trim().toLowerCase());
          console.log("Parsed party names:", partyNames);
          const match = partyNames.includes(normalizedName);
          console.log("Name match:", match);
          return match;
        }
        return false;
      });

      if (!guestMatch) {
        return res.status(200).json({ valid: false });
      }

      let party = [];

      try {
        const rawParty = guestMatch.get("Party");

        if (rawParty) {
          party = rawParty.split(",").map((name) => ({
            name: name.trim(),
            attending: null,
          }));
        }
      } catch {
        party = [];
      }

      return res.status(200).json({
        valid: true,
        plusOneCount: Number(guestMatch.get("PlusOneCount") || 0),
        party,
        existingRSVP: null,
      });
    }

    if (req.method === "POST") {
      const {
        party,
        plusOnes,
        plusOneCount,
        email,
        comments,
      } = req.body ?? {};

    if (!party || !Array.isArray(party) || party.length === 0) {
      return res.status(400).json({ error: "Missing party data" });
    }

    const normalizedParty = party;
    const normalizedPlusOnes = Array.isArray(plusOnes) ? plusOnes : [];
    const firstGuestName = String(party[0].name || "").trim().toLowerCase();

    const sheet = doc.sheetsByTitle["Responses"];
    const rows = await sheet.getRows();

    const existingRow = rows.find((row) => {
      try {
        const rawParty = row.get("Party");
        if (rawParty) {
          const parsed = JSON.parse(rawParty);
          return parsed.some((guest) => {
            const guestName = typeof guest === "string" ? guest : guest.name;
            return String(guestName || "").trim().toLowerCase() === firstGuestName;
          });
        }
      } catch {
        return false;
      }
      return false;
    });

    const rowData = {
      Party: JSON.stringify(normalizedParty),
      PlusOneNames: JSON.stringify(normalizedPlusOnes),
      PlusOneCount: Number(plusOneCount) || 0,
      GuestCount: normalizedParty.length + normalizedPlusOnes.length,
      Email: email || "",
      Comments: comments || "",
      Timestamp: new Date().toISOString(),
    };

    if (existingRow) {
      existingRow.set("Party", rowData.Party);
      existingRow.set("PlusOneNames", rowData.PlusOneNames);
      existingRow.set("PlusOneCount", rowData.PlusOneCount);
      existingRow.set("GuestCount", rowData.GuestCount);
      existingRow.set("Email", rowData.Email);
      existingRow.set("Comments", rowData.Comments);
      existingRow.set("Timestamp", rowData.Timestamp);

      await existingRow.save();
    } else {
      await sheet.addRow(rowData);

      // Send email notification for first-time RSVP
      if (process.env.RESEND_API_KEY) {
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          const partyNames = normalizedParty.map((g) => g.name).join(", ");
          const attendingCount = normalizedParty.filter((g) => g.attending).length;
          const plusOneNames = normalizedPlusOnes.map((g) => g.name).join(", ");
          const plusOneAttendingCount = normalizedPlusOnes.filter((g) => g.attending).length;

          await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "toppin.wedding15@gmail.com",
            subject: "New RSVP Received!",
            html: `
              <h2>New RSVP Submission</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Party Members:</strong> ${partyNames}</p>
              <p><strong>Attending:</strong> ${attendingCount} of ${normalizedParty.length}</p>
              ${plusOneNames ? `<p><strong>Plus Ones:</strong> ${plusOneNames}</p>` : ""}
              ${plusOneNames ? `<p><strong>Plus Ones Attending:</strong> ${plusOneAttendingCount} of ${normalizedPlusOnes.length}</p>` : ""}
              <p><strong>Total Guests:</strong> ${rowData.GuestCount}</p>
              ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ""}
              <p><strong>Submitted:</strong> ${new Date(rowData.Timestamp).toLocaleString()}</p>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Don't fail the RSVP if email fails
        }
      }
    }

    return res.status(200).json({
      message: "RSVP recorded successfully",
    });
  }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}