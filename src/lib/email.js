import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    // If we don't have email credentials in our .env file, we skip sending
    // an actual email and just print the OTP directly to the terminal for testing!
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log("\n=================================");
      console.log(`🚀 TEST ENVIRONMENT: OTP BYPASS`);
      console.log(`Email to: ${email}`);
      console.log(`Your OTP IS: ${otp}`);
      console.log("=================================\n");
      return true; // Pretend it sent successfully!
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
