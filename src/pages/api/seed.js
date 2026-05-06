import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Doctor from "@/models/Doctor";
import Registrar from "@/models/Registrar";
import FirstAid from "@/models/FirstAid";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    await connectToDB();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Create Super Admin
    await User.findOneAndUpdate(
      { email: "superadmin@cprms.com" },
      {
        firstName: "Super",
        lastName: "Admin",
        name: "Super Admin",
        email: "superadmin@cprms.com",
        phone: "0000000000",
        password: hashedPassword,
        role: "super-admin",
        isVerified: true
      },
      { upsert: true, new: true }
    );

    // 2. Create Doctor
    await Doctor.findOneAndUpdate(
      { email: "doctor@cprms.com" },
      {
        name: "Dr. John Doe",
        email: "doctor@cprms.com",
        phone: "1111111111",
        hospital: "General Hospital",
        specialization: "General Practice",
        role: "doctor",
        doctorId: "DOC001",
        proofDocument: "proof.pdf"
      },
      { upsert: true }
    );
    await User.findOneAndUpdate(
      { email: "doctor@cprms.com" },
      {
        firstName: "John",
        lastName: "Doe",
        name: "Dr. John Doe",
        email: "doctor@cprms.com",
        phone: "1111111111",
        password: hashedPassword,
        role: "doctor",
        isVerified: true
      },
      { upsert: true }
    );

    // 3. Create Registrar
    await Registrar.findOneAndUpdate(
      { email: "registrar@cprms.com" },
      {
        name: "Jane Smith",
        email: "registrar@cprms.com",
        phone: "2222222222",
        role: "registrar",
        hospital: "General Hospital",
        registrarId: "REG001",
        proofDocument: "proof.pdf"
      },
      { upsert: true }
    );
    await User.findOneAndUpdate(
      { email: "registrar@cprms.com" },
      {
        firstName: "Jane",
        lastName: "Smith",
        name: "Jane Smith",
        email: "registrar@cprms.com",
        phone: "2222222222",
        password: hashedPassword,
        role: "registrar",
        isVerified: true
      },
      { upsert: true }
    );

    // 4. Create First Aid
    await FirstAid.findOneAndUpdate(
      { email: "firstaid@cprms.com" },
      {
        name: "Alice Firstaid",
        email: "firstaid@cprms.com",
        phone: "3333333333",
        role: "first-aid",
        hospital: "General Hospital",
        teamId: "FA001",
        proofDocument: "proof.pdf"
      },
      { upsert: true }
    );
    await User.findOneAndUpdate(
      { email: "firstaid@cprms.com" },
      {
        firstName: "Alice",
        lastName: "Firstaid",
        name: "Alice Firstaid",
        email: "firstaid@cprms.com",
        phone: "3333333333",
        password: hashedPassword,
        role: "first-aid",
        isVerified: true
      },
      { upsert: true }
    );

    res.status(200).json({ message: "Database seeded successfully! You can now log in with the test accounts." });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).json({ error: "Failed to seed database", details: error.message });
  }
}
