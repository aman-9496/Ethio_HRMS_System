import { connectToDB } from "@/lib/mongodb";
import EmergencyLog from "@/models/EmergencyLog";

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    try {
      const { patientName, nationalId, description, vitalSigns, responderEmail } = req.body;

      if (!description || !responderEmail) {
        return res.status(400).json({ error: "Missing required fields (description, responderEmail)" });
      }

      const newLog = await EmergencyLog.create({
        patientName: patientName || "Unknown",
        nationalId: nationalId || "",
        description,
        vitalSigns: vitalSigns || { bloodPressure: "", heartRate: "" },
        responderEmail,
      });

      return res.status(201).json(newLog);
    } catch (error) {
      console.error("Failed to create emergency log:", error);
      return res.status(500).json({ error: "Failed to create emergency log" });
    }
  } else if (req.method === "GET") {
    try {
      // Allow optional filtering by responder email
      const { email } = req.query;
      const filter = email ? { responderEmail: email } : {};

      const logs = await EmergencyLog.find(filter).sort({ createdAt: -1 });
      return res.status(200).json(logs);
    } catch (error) {
      console.error("Failed to fetch emergency logs:", error);
      return res.status(500).json({ error: "Failed to fetch emergency logs" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
