import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export default async function handler(req, res) {

    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID,
      auth
    );

    try {
      await doc.loadInfo();

      // Invite only check (optional)

      if (req.method === "GET") {
        const { code } = req.query;

        if (!code) {
          return res.status(400).json({ error: "Missing invitation code" });
        }

        const sheet = doc.sheetsByTitle["InviteCodes"];
        const rows = await sheet.getRows();

        const normalizedCode = String(code).trim().toLowerCase();

        const match = rows.find(
          (row) =>
            String(row.InvitationCode || "").trim().toLowerCase() === normalizedCode
        );

        if (!match) {
          return res.status(200).json({ valid: false });
        }

        return res.status(200).json({
          valid: true,
          firstName: match.FirstName,
          lastName: match.LastName,
          maxGuests: Number(match.MaxGuests),
        });
      }
    if (req.method === "POST") {
      const { firstName, lastName, email, attendance } = req.body ?? {};

      if (!firstName || !lastName || !email || !attendance) {
        return res.status(400).json({ error: "Missing required fields" });
      }

        const sheet = doc.sheetsByTitle["RSVPs"];
        
        await sheet.addRow({
          Name: `${firstName} ${lastName}`,
          Email: email,
          Attendance: attendance,
          Timestamp: new Date().toISOString(),
        });

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