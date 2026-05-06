import { MongoClient } from "mongodb";

async function checkDatabase() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("cprms");
    
    // Check all users
    const users = await db.collection("users").find({}).toArray();
    console.log("=== USERS IN DATABASE ===");
    users.forEach(u => console.log(`Email: ${u.email}, Role: ${u.role}, Name: ${u.firstName} ${u.lastName}`));

    // Check all OTPs
    const otps = await db.collection("otps").find({}).sort({createdAt: -1}).limit(5).toArray();
    console.log("\n=== RECENT OTPS ===");
    otps.forEach(o => console.log(`Email: ${o.email}, OTP: ${o.otp}, Expires: ${o.expiresAt}`));

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkDatabase();
