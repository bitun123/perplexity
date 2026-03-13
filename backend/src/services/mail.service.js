import nodemailer from "nodemailer";

const MAIL_USER = process.env.GOOGLE_USER?.trim();
const MAIL_APP_PASSWORD =
  process.env.GOOGLE_APP_PASSWORD?.trim() || process.env.MAIL_APP_PASSWORD?.trim();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID?.trim();
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET?.trim();
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN?.trim();

function buildConfigError(message) {
  const error = new Error(message);
  error.name = "MailConfigurationError";
  return error;
}

function getBaseTransportOptions() {
  return {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
  };
}

function getPasswordTransport() {
  if (!MAIL_USER || !MAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    ...getBaseTransportOptions(),
    auth: {
      user: MAIL_USER,
      pass: MAIL_APP_PASSWORD,
    },
  });
}

async function getAccessToken() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw buildConfigError(
      "Missing Gmail OAuth environment variables. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN, or use GOOGLE_APP_PASSWORD.",
    );
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Failed to generate Gmail access token.",
    );
  }

  return data.access_token;
}

async function getOAuthTransport() {
  if (!MAIL_USER) {
    throw buildConfigError(
      "Missing GOOGLE_USER. Set the Gmail address used to send emails.",
    );
  }

  const accessToken = await getAccessToken();

  return nodemailer.createTransport({
    ...getBaseTransportOptions(),
    auth: {
      type: "OAuth2",
      user: MAIL_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken,
    },
  });
}

async function getTransporter() {
  if (!MAIL_USER) {
    throw buildConfigError(
      "Missing GOOGLE_USER. Set GOOGLE_USER and either GOOGLE_APP_PASSWORD or Gmail OAuth variables.",
    );
  }

  return getPasswordTransport() || (await getOAuthTransport());
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const transporter = await getTransporter();

    const mailOptions = {
      from: MAIL_USER,
      to,
      subject,
      html,
      text,
    };

    console.log("Sending email to:", to);
    const details = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", details.response);
    return details;
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
}
