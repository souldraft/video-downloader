# Support relay setup (about 10 minutes, free)

The app's **💬 Support** form sends each message to a small script that runs on your
Google account. The script emails it to **vteam732@gmail.com** with the screenshot
attached. The email's Reply-To is the user's address, so in Gmail you just press **Reply**.

Until you finish these steps, the Support form still works: it shows your email
address and an "Open email app" button instead of sending by itself.

## 1. Create the script
1. Sign in to Google as **vteam732@gmail.com** and open <https://script.google.com>.
2. Click **New project**. Rename it (top left) to `Video Downloader Support`.
3. Delete the sample code in `Code.gs`, then paste in everything from this folder's `Code.gs`. Press **Ctrl+S**.

## 2. Test that emails arrive
1. In the toolbar's function list, pick **testEmail**, then click **Run**.
2. Google asks for permission the first time: **Review permissions**, choose your account.
   If it says "Google hasn't verified this app", click **Advanced**, then
   **Go to Video Downloader Support (unsafe)**, then **Allow**. It's your own script.
   It only asks to send email as you.
3. Check your Gmail for "[Video Downloader] Test message (TEST-0000)".

## 3. Put it online
1. Click **Deploy**, then **New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. ("Anyone" is needed because
   the app sends without a Google login. People can only *send* to it; nobody can read your email.)
4. Click **Deploy**, then copy the **Web app URL**. It ends in `/exec`.
5. Check it: open that URL in your browser. It should say
   *"Video Downloader support relay is running."*

## 4. Connect the app
1. Open `VideoDownloader.py` and find `SUPPORT_URL = ""` (near the top, under GITHUB_URL).
2. Paste the URL between the quotes: `SUPPORT_URL = "https://script.google.com/macros/s/.../exec"`
3. Double-click `build.bat` to rebuild the app.
4. In the app: **💬 Support**, fill the form, **Send message**. The email should arrive in about a minute.

## Changing the script later
Edit `Code.gs`, save, then **Deploy > Manage deployments > ✏ Edit > Version: New version > Deploy**.
The URL stays the same, so you don't need to rebuild the app.

## Limits and safety (what to know)
- A free Gmail account can send **100 emails a day** from scripts. That's plenty for support.
  When the limit is reached, the app tells the user to email you directly.
- Flood guard: at most **5 messages per hour per support ID** and **40 per hour in total**.
- The URL is inside the app, so someone could dig it out and send junk. The flood guard
  and the daily limit cap the damage. If it ever gets abused, make a **new deployment**
  (new URL), put it in the app, and archive the old one.
- `APP_KEY` in `Code.gs` must match `SUPPORT_APP_KEY` in the app. It is not a password.
  It only stops random web bots.
