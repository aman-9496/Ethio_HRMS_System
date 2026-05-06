import { MongoClient } from "mongodb";
import fetch from "node-fetch";

async function checkDatabaseAndDebug() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("cprms");
    
    console.log("=== USERS INDEXES ===");
    const indexes = await db.collection("users").indexes();
    console.log(indexes);

    // Run a dummy signup test using the exact API endpoint:
    const randomEmail = "debug" + Date.now() + "@gmail.com";
    console.log("\n=== TESTING API SIGNUP FLOW ===");
    const payload = {
        firstName: "Test",
        lastName: "Debug",
        email: randomEmail,
        phone: "1234567890",
        password: "Password123"
    };

    let res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    
    let text = await res.text();
    console.log(`Payload 1 response: ${res.status} ${text}`);

    // Fetch the OTP from db:
    const otpRec = await db.collection("otps").findOne({ email: randomEmail });
    console.log("Found OTP:", otpRec);

    if (otpRec) {
        payload.otp = otpRec.otp;
        res = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        text = await res.text();
        console.log(`Payload 2 response: ${res.status} ${text}`);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

checkDatabaseAndDebug();
