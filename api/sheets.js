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

      // Check RSVPs sheet for existing RSVP
      const rsvpsSheet = doc.sheetsByTitle["RSVPs"];
      const rsvpRows = await rsvpsSheet.getRows();

      const rsvpMatch = rsvpRows.find((row) => {
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

      if (rsvpMatch) {
        let party = [];
        let plusOnes = [];

        try {
          const rawParty = rsvpMatch.get("Party");

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
          const rawPlusOnes = rsvpMatch.get("PlusOneNames");

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
          plusOneCount: Number(rsvpMatch.get("PlusOneCount") || 0),
          party,
          existingRSVP: {
            guestCount: Number(rsvpMatch.get("GuestCount") || 0),
            party,
            plusOnes,
            comments: String(rsvpMatch.get("Comments") || "").trim(),
          },
        });
      }

      // If not found in RSVPs, search Responses sheet for initial party data
      const responsesSheet = doc.sheetsByTitle["Responses"];
      const responsesRows = await responsesSheet.getRows();

      console.log("Searching for name:", normalizedName);
      console.log("Responses rows found:", responsesRows.length);

      const responseMatch = responsesRows.find((row) => {
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

      if (!responseMatch) {
        return res.status(200).json({ valid: false });
      }

      let party = [];

      try {
        const rawParty = responseMatch.get("Party");

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
        plusOneCount: Number(responseMatch.get("PlusOneCount") || 0),
        party,
        existingRSVP: null,
      });
    }

  if (req.method === "POST") {
    const {
      party,
      plusOnes,
      plusOneCount,
      comments,
    } = req.body ?? {};

    if (!party || !Array.isArray(party) || party.length === 0) {
      return res.status(400).json({ error: "Missing party data" });
    }

    const normalizedParty = party;
    const normalizedPlusOnes = Array.isArray(plusOnes) ? plusOnes : [];
    const firstGuestName = String(party[0].name || "").trim().toLowerCase();

    const sheet = doc.sheetsByTitle["RSVPs"];
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
      GuestCount: normalizedParty.length + normalizedPlusOnes.length,
      Comments: comments || "",
      Timestamp: new Date().toISOString(),
    };

    if (existingRow) {
      existingRow.set("Party", rowData.Party);
      existingRow.set("PlusOneNames", rowData.PlusOneNames);
      existingRow.set("GuestCount", rowData.GuestCount);
      existingRow.set("Comments", rowData.Comments);
      existingRow.set("Timestamp", rowData.Timestamp);

      await existingRow.save();
    } else {
      await sheet.addRow(rowData);
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