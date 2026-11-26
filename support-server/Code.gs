/**
 * Video Downloader - support relay (Google Apps Script)
 *
 * The app's Support form sends each message here. This script emails it to you,
 * with the screenshot attached and Reply-To set to the user, so in Gmail you just
 * press Reply. Runs free on your own Google account. Setup: see SETUP.md.
 */

const TO = "vteam732@gmail.com";          // where support messages arrive
const APP_KEY = "vd-support-v1";          // must match SUPPORT_APP_KEY in VideoDownloader.py
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;  // the app sends JPEGs of about 0.2-1 MB
const MAX_PER_ID_PER_HOUR = 5;            // flood guard per support ID
const MAX_PER_HOUR_TOTAL = 40;            // flood guard for everyone together

function doPost(e) {
  try {
    const p = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (p.key !== APP_KEY) return reply_(false, "This app version can't send messages. Please update it.");

    const email = String(p.email || "").trim().slice(0, 200);
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(email)) return reply_(false, "Please enter a valid email address.");
    const message = String(p.message || "").trim().slice(0, 8000);
    if (message.length < 10) return reply_(false, "Please describe the problem in a sentence or two.");

    const sid = String(p.support_id || "unknown").replace(/[^A-Z0-9-]/g, "").slice(0, 20) || "unknown";
    if (!underLimit_("id_" + sid, MAX_PER_ID_PER_HOUR) || !underLimit_("all", MAX_PER_HOUR_TOTAL)) {
      return reply_(false, "Too many messages right now. Please try again in an hour, or email " + TO + ".");
    }
    if (MailApp.getRemainingDailyQuota() < 1) {
      return reply_(false, "The support inbox is full for today. Please email " + TO + " directly.");
    }

    const topic = String(p.subject || "Support").replace(/[\r\n]/g, " ").slice(0, 80);
    const body = [
      "From: " + email,
      "Support ID: " + sid,
      "App version: " + String(p.app_version || "?").slice(0, 20),
      "Subject: " + topic,
      "",
      message,
      "",
      "----- App details -----",
      String(p.diagnostics || "(not included)").slice(-20000),
    ].join("\n");

    const options = { replyTo: email, name: "Video Downloader Support" };
    if (p.image_b64) {
      const bytes = Utilities.base64Decode(String(p.image_b64));
      if (bytes.length <= MAX_IMAGE_BYTES) {
        options.attachments = [Utilities.newBlob(bytes, "image/jpeg", "screenshot-" + sid + ".jpg")];
      }
    }
    MailApp.sendEmail(TO, "[Video Downloader] " + topic + " (" + sid + ")", body, options);
    return reply_(true, "");
  } catch (err) {
    console.error(err);
    return reply_(false, "The support server had a problem. Please email " + TO + ".");
  }
}

// Opening the web-app link in a browser shows this: a quick "is it running?" check.
function doGet() {
  return ContentService.createTextOutput("Video Downloader support relay is running.");
}

// Run this once from the editor (select testEmail, press Run) to check emails arrive.
function testEmail() {
  const fake = {
    key: APP_KEY, email: TO, subject: "Test message", support_id: "TEST-0000", app_version: "test",
    message: "This is a test from the Apps Script editor. If you can read this, the relay works.",
    diagnostics: "App: Video Downloader (test)",
  };
  const out = doPost({ postData: { contents: JSON.stringify(fake) } });
  Logger.log(out.getContent());
}

function underLimit_(name, max) {
  const cache = CacheService.getScriptCache();
  const key = "n_" + name;
  const n = Number(cache.get(key) || 0);
  if (n >= max) return false;
  cache.put(key, String(n + 1), 3600);  // counts reset an hour after the first message
  return true;
}

function reply_(ok, error) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok, error: error }))
    .setMimeType(ContentService.MimeType.JSON);
}
