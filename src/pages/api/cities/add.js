import { connectToDB } from "@/lib/mongodb";
import City from "@/models/City";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, code, address } = req.body;

      if (!name || !code || !address) {
        return res.status(400).json({ error: "All fields are required" });
      }

      await connectToDB();
      
      const newCity = new City({ name, code, address });
      const savedCity = await newCity.save();

      return res
        .status(200)
        .json({ message: "City added successfully", city: savedCity });
    } catch (error) {
      console.error("Error adding city:", error);
      return res.status(500).json({ error: "Error adding city" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
