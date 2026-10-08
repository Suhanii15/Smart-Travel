require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testEmail() {
  try {
    await sgMail.send({
      to: "suhanikabra931@gmail.com",
      from: process.env.EMAIL_FROM,
      subject: "Smart Travel Email Test",
      text: "Your Smart Travel email integration is working!"
    });

    console.log("Test email accepted by SendGrid!");
  } catch (error) {
    console.error(
      "Email failed:",
      error.response?.body || error.message
    );
  }
}

testEmail();