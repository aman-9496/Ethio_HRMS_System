import mongoose from "mongoose";

const EmergencyLogSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      default: "Unknown",
    },
    nationalId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    vitalSigns: {
      bloodPressure: { type: String, default: "" },
      heartRate: { type: String, default: "" },
    },
    responderEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Admitted", "Resolved"],
      default: "Pending",
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.EmergencyLog ||
  mongoose.model("EmergencyLog", EmergencyLogSchema);
