const GMAIL_GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function base64Url(input: string) {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildRaw(to: string, subject: string, html: string) {
  const message = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");
  return base64Url(message);
}

/** Sends an email from the connected Vizogen Gmail account. Returns true on success. */
export async function sendGmail(to: string, subject: string, html: string) {
  const lovableApiKey = process.env["LOVABLE_API_KEY"];
  const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
  if (!lovableApiKey || !gmailKey) {
    console.error("Email not configured: missing LOVABLE_API_KEY or GOOGLE_MAIL_API_KEY");
    return false;
  }

  const response = await fetch(`${GMAIL_GATEWAY}/users/me/messages/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableApiKey}`,
      "X-Connection-Api-Key": gmailKey,
    },
    body: JSON.stringify({ raw: buildRaw(to, subject, html) }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Gmail send failed [${response.status}]: ${body}`);
    return false;
  }
  return true;
}
