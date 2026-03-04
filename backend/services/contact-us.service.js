import nodemailer from "nodemailer";

export async function sendContactMessage(req, res) {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_ADMIN_USER,
      subject: "New website contact form submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <h2 style="color: #4f46e5; margin-top: 0; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0; color: #333;">
                <strong>Name:</strong> ${name}
              </p>
              <p style="margin: 10px 0; color: #333;">
                <strong>Email:</strong> ${email}
              </p>
              <p style="margin: 10px 0; color: #333;">
                <strong>Subject:</strong> ${subject}
              </p>
            </div>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #4f46e5; border-radius: 4px;">
              <strong style="color: #333;">Message:</strong>
              <p style="margin: 10px 0 0 0; color: #555; line-height: 1.5;">
                ${message.replace(/\n/g, "<br>")}
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            
            <p style="color: #888; font-size: 12px; margin: 0;">
              Sent via SafeStreet website contact form
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Your message has been sent successfully. We'll get back to you soon!" });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ success: false, message: "We're having trouble sending your message. Please try again later." });
  }
}
