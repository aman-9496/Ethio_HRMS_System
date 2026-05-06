import fetch from "node-fetch";

async function testFlow() {
  const email = "autotest" + Math.random() + "@example.com";
  const password = "Password123";

  console.log("1. Starting Signup for:", email);
  let res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email,
      phone: "1234567890",
      password
    })
  });

  let data = await res.json();
  console.log("Signup response 1:", data);

  // Connect to DB and fetch the OTP directly because we can't read the terminal
  console.log("Fetching OTP from DB...");
  const { connectToDB } = await import("./src/lib/mongodb.js");
  const OTP = (await import("./src/models/OTP.js")).default;
  await connectToDB();
  const otpRecord = await OTP.findOne({ email });
  console.log("OTP Record found:", otpRecord);

  if (!otpRecord) throw new Error("No OTP saved in DB!");

  console.log("2. Verifying OTP...", otpRecord.otp);
  res = await fetch("http://localhost:3000/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email,
      phone: "1234567890",
      password,
      otp: otpRecord.otp
    })
  });

  data = await res.json();
  console.log("Signup response 2:", data);

  console.log("3. Attempting to Login via NextAuth...");
  const loginRes = await fetch("http://localhost:3000/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      csrfToken: "mocktoken" // nextauth might complain if missing csrf
    })
  });
  
  if (loginRes.status === 200) {
     console.log("Login HTTP 200 OK!");
  } else {
     console.log("Login HTTP code:", loginRes.status);
  }
}

testFlow().catch(console.error);
