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
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({ error: "Missing invitation code" });
      }

      const sheet = doc.sheetsByTitle["InviteCodes"];
      const rows = await sheet.getRows();

      const normalizedCode = String(code).trim().toLowerCase();

      const match = rows.find((row) => {
        const invitationCode = String(row.get("InvitationCode") || "")
          .trim()
          .toLowerCase();

        return invitationCode === normalizedCode;
      });

      if (!match) {
        return res.status(200).json({ valid: false });
      }

      let party = [];

      try {
        const rawParty = match.get("Party");

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
        firstName: String(match.get("FirstName") || "").trim(),
        lastName: String(match.get("LastName") || "").trim(),
        maxGuests: Number(match.get("MaxGuests") || 0),
        party,
      });
    }

  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      attendance,
      invitationCode,
      guestCount,
      primaryAttending,
      guests,
      guestNames,
      comments,
    } = req.body ?? {};

    if (!firstName || !lastName || !email || !attendance || !invitationCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const normalizedInvitationCode = String(invitationCode).trim().toLowerCase();
    const primaryName = `${String(firstName).trim()} ${String(lastName).trim()}`;

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
        String(row.get("InvitationCode") || "").trim().toLowerCase() ===
        normalizedInvitationCode
      );
    });

    const rowData = {
      InvitationCode: normalizedInvitationCode,
      PrimaryName: primaryName,
      Email: String(email).trim(),
      OverallAttendance: attendance,
      GuestCount: attendance === "yes" ? normalizedGuests.length : 0,
      Guests: JSON.stringify(normalizedGuests),
      Comments: comments || "",
      Timestamp: new Date().toISOString(),
    };

    if (existingRow) {
      existingRow.set("InvitationCode", rowData.InvitationCode);
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