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

      // First, check RSVPs sheet for existing RSVP
      const rsvpsSheet = doc.sheetsByTitle["RSVPs"];
      const rsvpRows = await rsvpsSheet.getRows();

      const rsvpMatch = rsvpRows.find((row) => {
        const primaryName = String(row.get("PrimaryName") || "").trim().toLowerCase();
        return primaryName === normalizedName;
      });

      if (rsvpMatch) {
        let guests = [];

        try {
          const rawGuests = rsvpMatch.get("Guests");

          if (rawGuests) {
            const parsed = JSON.parse(rawGuests);
            guests = parsed.map((guest) => ({
              name: guest.name || "",
              attending: guest.attending ?? null,
            }));
          }
        } catch {
          guests = [];
        }

        const primaryName = String(rsvpMatch.get("PrimaryName") || "").trim();
        const nameParts = primaryName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        return res.status(200).json({
          valid: true,
          firstName,
          lastName,
          email: String(rsvpMatch.get("Email") || "").trim(),
          maxGuests: guests.length,
          party: guests,
          existingRSVP: {
            overallAttendance: String(rsvpMatch.get("OverallAttendance") || "").trim(),
            guestCount: Number(rsvpMatch.get("GuestCount") || 0),
            guests,
            comments: String(rsvpMatch.get("Comments") || "").trim(),
          },
        });
      }

      // If not found in RSVPs, search InviteCodes sheet
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
        firstName: String(inviteMatch.get("FirstName") || "").trim(),
        lastName: String(inviteMatch.get("LastName") || "").trim(),
        maxGuests: Number(inviteMatch.get("MaxGuests") || 0),
        party,
        existingRSVP: null,
      });
    }

  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      attendance,
      guestCount,
      primaryAttending,
      guests,
      guestNames,
      comments,
    } = req.body ?? {};

    if (!firstName || !lastName || !email || !attendance) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const primaryName = `${String(firstName).trim()} ${String(lastName).trim()}`;
    const normalizedPrimaryName = primaryName.toLowerCase();

    const additionalGuests = Array.isArray(guests)
      ? guests
      : Array.isArray(guestNames)
        ? guestNames.map((name) => ({ name, attending: true }))
        : [];

    const normalizedGuests = [
      {
        name: primaryName,
        attending: primaryAttending === true,
      },
      ...additionalGuests.map((guest) => ({
        name: String(guest.name || guest).trim(),
        attending: guest.attending === true,
      })),
    ].filter((guest) => guest.name);

    const sheet = doc.sheetsByTitle["RSVPs"];
    const rows = await sheet.getRows();

    const existingRow = rows.find((row) => {
      return (
        String(row.get("PrimaryName") || "").trim().toLowerCase() ===
        normalizedPrimaryName
      );
    });

    const rowData = {
      PrimaryName: primaryName,
      Email: String(email).trim(),
      OverallAttendance: attendance,
      GuestCount: attendance === "yes" ? normalizedGuests.length : 0,
      Guests: JSON.stringify(normalizedGuests),
      Comments: comments || "",
      Timestamp: new Date().toISOString(),
    };

    if (existingRow) {
      existingRow.set("PrimaryName", rowData.PrimaryName);
      existingRow.set("Email", rowData.Email);
      existingRow.set("OverallAttendance", rowData.OverallAttendance);
      existingRow.set("GuestCount", rowData.GuestCount);
      existingRow.set("Guests", rowData.Guests);
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