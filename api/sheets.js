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

        return res.status(200).json({
          valid: true,
          plusOneCount: Number(rsvpMatch.get("PlusOneCount") || 0),
          party,
          existingRSVP: {
            guestCount: Number(rsvpMatch.get("GuestCount") || 0),
            party,
            comments: String(rsvpMatch.get("Comments") || "").trim(),
          },
        });
      }

      // If not found in RSVPs, search InviteCodes sheet for initial party data
      const inviteSheet = doc.sheetsByTitle["InviteCodes"];
      const inviteRows = await inviteSheet.getRows();

      const inviteMatch = inviteRows.find((row) => {
        const firstName = String(row.get("FirstName") || "").trim().toLowerCase();
        const lastName = String(row.get("LastName") || "").trim().toLowerCase();
        const fullName = `${firstName} ${lastName}`;

        // Check if name matches first+last name
        if (fullName === normalizedName) {
          return true;
        }

        // Check if name matches any party member
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

      if (!inviteMatch) {
        return res.status(200).json({ valid: false });
      }

      let party = [];

      try {
        const rawParty = inviteMatch.get("Party");

        if (rawParty) {
          const parsed = JSON.parse(rawParty);

          party = parsed.map((guest) => {
            if (typeof guest === "string") {
              return {
                name: guest,
                attending: null,
              };
            }

            return {
              name: guest.name || "",
              attending: guest.attending ?? null,
            };
          });
        }
      } catch {
        party = [];
      }

      return res.status(200).json({
        valid: true,
        plusOneCount: Number(inviteMatch.get("MaxGuests") || 0) - 1,
        party,
        existingRSVP: null,
      });
    }

  if (req.method === "POST") {
    const {
      party,
      plusOneCount,
      comments,
    } = req.body ?? {};

    if (!party || !Array.isArray(party) || party.length === 0) {
      return res.status(400).json({ error: "Missing party data" });
    }

    const normalizedParty = party;
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
      PlusOneCount: Number(plusOneCount) || 0,
      GuestCount: normalizedParty.length,
      Comments: comments || "",
      Timestamp: new Date().toISOString(),
    };

    if (existingRow) {
      existingRow.set("Party", rowData.Party);
      existingRow.set("PlusOneCount", rowData.PlusOneCount);
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