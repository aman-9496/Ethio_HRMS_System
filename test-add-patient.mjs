import fetch from "node-fetch";

async function run() {
  const payload = {
    nationalId: "P-12345",
    name: "Test Patient",
    phone: "1234567890",
    address: "Test Addr",
    gender: "male",
    emergencyNumber: "0987654321",
    bloodType: "A+",
    birthDate: "1990-01-01",
    otherDisease: "", // purposely empty
    password: "password123",
    diseaseName: "Fever",
    diseaseDescription: "High temp",
    medication: "Paracetamol",
    hospitalName: "Test Hosp",
    doctorName: "Dr. Smith",
    dateAdded: "2026-04-12",
    registeredBy: "Jane Smith",
    registrarHospital: "Test Hosp"
  };

  try {
    const res = await fetch("http://localhost:3000/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      console.log("Success:", await res.json());
    } else {
      console.log("Failed. Status:", res.status);
      console.log("Error body:", await res.json());
    }
  } catch (err) {
    console.error("Fetch threw:", err);
  }
}

run();
