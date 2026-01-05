import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
    
    const { firstName, lastName, email } = req.body ?? {};
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
      const sheet = doc.sheetsByTitle["RSVPs"];
      
      await sheet.addRow({
        Name: `${firstName} ${lastName}`,
        Email: email,
        Timestamp: new Date().toISOString(),
      });

      res.status(200).json({ message: "RSVP recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to write to sheet" });
  }
}