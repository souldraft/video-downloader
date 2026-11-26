# Changelog: what we've done

## v2.1.0 (2026-11-26)

**Changed: everything is free, with optional donations**
- The screen recorder, camera bubble / cutout and pause are now free for everyone. There is no Pro version and no licence key.
- **⭐ Get Pro** is now **☕ Tip the developer** ("Buy me a chai"). It opens a small window with amount buttons (₹20, ₹50, ₹100, ₹200, ₹300), a tick box ("I'm giving this voluntarily, from my own bank account, to support the developer…"), a UPI QR code for the chosen amount (scan with GPay, PhonePe, Paytm or any UPI app), the UPI ID with a Copy button, and a link to the website. **The QR code, UPI ID and Copy stay off until the box is ticked**, and the tick is never saved, so it starts unticked every time. The UPI payment note is "Video Downloader voluntary donation". Donations go straight to the bank account and don't unlock anything.
- The support ID at the top no longer shows a plan ("Free plan" is gone). The Support form's "Payment or licence" subject is now "Donation question".
- The website's pricing section is now a donate box with the same tick box and QR codes (no cookies or storage, and it starts unticked after Back/Forward too), and the terms, refund and privacy pages describe donations instead of sales. The licence thank-you page was removed.
- New small dependency: `segno` (BSD-3-Clause) draws the QR codes. `build.bat` installs it.
- **Support messages now send from the app.** The support relay (Google Apps Script) is live and its link is set in `SUPPORT_URL`, so the 💬 Support form emails the developer directly, with the screenshot attached.

**Tested:** 10 new self-tests (UPI ID check, ₹20–₹300 limits, UPI link format and payment note, the agreed tick-box wording, a bad ID refused, QR picture made, the UPI ID is set), all passing. 13/13 checks on the real window: opens unticked; QR, UPI ID and Copy off until ticked (a disabled Copy copies nothing); ticking shows them; Copy copies the UPI ID; picking ₹100 updates the QR; unticking hides them again; reopening starts unticked; nothing saved to settings. The website box passed the same checks in Chrome (desktop and phone), plus a reload starts unticked and nothing is stored. The QR codes in the app window, on the website and in all five picture files were decoded and matched the UPI link for each amount. Shiva scanned a test QR with his UPI app and saw his name. Not yet tested: the Windows .exe and a real payment.

---

## v2.0.0 (2026-11-26)

Version 2 = everything since v1.2.2: Support form + support ID, Get Pro dialog, the compact recorder bar, camera bubble + Cutout, and the live mic icon (details in the v1.3.0 to v1.5.0 entries below, and here).


**New: pause / resume**
- A small **pause** icon right next to Start (icon only, the bar grew by one icon). Click it to pause. The icon turns into an amber **▶**, and the timer stands still in amber. Click ▶ to go on. Paused time is left out of the video.
- How it works: each stretch between pauses is its own video piece. On save the pieces are joined without re-encoding, and every sound track is cut to exactly the same clock times, so voice and picture stay in step after any number of pauses. If the screen capture won't start again after a pause, the app saves what was recorded so far.
- Tested: 6 new self-tests, plus a real recording with a pause (flash + beep before, during and after the pause). The video has exactly 2 flashes and 2 beeps (the one during the pause is gone), sound lined up within 33-47 ms (about one video frame), video and sound the same length (6.93 s / 6.91 s).

**Changed: compact dark recorder bar (icons only)**
- The bar is smaller and black again (like the first REC bar), with icons only: **Start/Stop**, timer, **mic**, **PC sound**, **camera ▾**, **⚙**, **✕**. Hover any icon for its name. On Windows the icons come from Windows' own icon font (Segoe Fluent Icons / MDL2, as in the Snipping Tool), with proper "mic off" and "muted" icons. Emoji are used where that font is missing.
- Tooltips close on their own as soon as the pointer is off the icon, and they never appear in recordings.

**New: live mic icon**
- When the mic is on, its icon shows what it hears: **grey** when it's quiet, **green** (brighter when louder) when you speak, **red** after 2.5 s of non-stop talking (or when very loud). It works before you press Start (a listen-only meter; nothing is saved) and during the recording.
- The log now says which microphone is used ("Recording the microphone from: …").
- If a recording's mic track is only silence, the result shows **"⚠ The microphone recorded only silence"**, and the terminal lists what to check: the mic mute key (F8 on many HP laptops), Sound > Input, and microphone privacy.

**New: camera ▾ menu**
- **▾ next to the camera** picks **Bubble (round)** or **Cutout (no background)**, the size (Small / Medium / Large / Extra large), and which camera. Picking a style turns the camera on. These options left ⚙. (The style "Circle" is now called "Bubble"; old settings carry over.)

**Fixed: cutout glitches** (holes in hands, floating specks, edges trailing behind moving hands, trouble in dim rooms)
- The AI now sees a contrast-boosted copy of each frame (better in dim light). Smoothing now follows fast movement at once and only calms small flicker. The mask is cleaned: specks are removed and pinholes closed. The cut threshold is slightly lower, so hands stay solid.

**Tested:** 9 new self-tests (mask clean-up: pinhole filled, speck removed, outline kept; mic colours; mic meter level with a test tone; silent vs working mic detection), all passing. 18/18 checks on the real window with a fake microphone and a photo as the camera: compact bar, icons, mic grey → green → red → grey, tooltip shows and closes by itself, ⚙ without camera items, ▾ menu (Cutout turns the camera on, size, back to Bubble), a recording with a silent mic → warning + mic name in the log, a recording with voice → "✓ Saved" and voice in the MP4 (-19.9 dB peak). Cutout on the sample portrait: background 100% see-through, face 0%, about 26 ms per frame at Extra large. Not yet tested: the Windows .exe, your real mic and webcam, and the Windows icon font look.

---

## v1.5.0 (2026-11-25)

**New: Cutout camera (no background, like streamers)**
- **⚙ > Camera style**: *Circle* (as before) or **Cutout (no background)**. Cutout finds you in every camera frame and makes everything else see-through, so only you appear over the screen, with no circle or box. It follows the camera size you pick.
- New size **Extra large** (420 px at 100% scaling) next to Small / Medium / Large.
- How it works: Google's MediaPipe selfie segmentation model (`selfie_segmentation.onnx`, 0.5 MB, Apache 2.0; licence in `selfie_segmentation.LICENSE.txt`) runs through `onnxruntime` in the camera thread, about 4 ms per frame. The edges are smoothed over frames to cut flicker. The see-through part uses the same Windows colour key as the round bubble, so you drag the cutout by clicking on yourself.
- If background removal isn't available (onnxruntime missing or the model file missing), the app says so and shows the circle instead.
- `build.bat` installs `onnxruntime` as an **optional** package (the build still finishes without it) and packs the model + licence into the .exe.

**Tested:** 2 new self-tests (an empty grey picture becomes fully see-through; first frame in under 1 s), all passing. 10/10 checks on the real window with a portrait photo as the camera: style + size menu (incl. Extra large), cut-out frames live (background corner 100% see-through, face 0%), Extra large resizes, a **real recording with the cut-out person in the saved MP4**, missing model → message + circle, camera process closed. Not yet tested: the Windows .exe with onnxruntime packed in, a real webcam, and the Windows see-through effect (the test screen shows the removed area as dark grey).

---

## v1.4.0 (2026-11-25)

**New: compact recorder bar (like the Windows Snipping Tool)**
- **⏺ Record screen** now opens a small bar at the top of the screen instead of a dialog: **● Start**, a **00:00:00** timer, toggles for **🎙 Mic**, **🔊 PC sound** and **📷 Camera** (green = on, struck through = off), **⚙** settings and **✕** close.
- ⚙ holds frame rate (30/60 fps), quality (Standard/High), show the mouse pointer, minimise the app while recording, camera size (Small/Medium/Large), which camera (when you have more than one), and the save folder. All choices are remembered.
- Start → 3-second countdown (**✕ Cancel** goes back to the bar) → **■ Stop** with a blinking dot and the running time → saved. Mic, sound and ⚙ are locked while recording; the camera can be switched on or off at any time. The bar never appears in the video.

**New: camera bubble (your face in the corner, like streamers)**
- 📷 Camera shows your webcam in a round, always-on-top bubble with a white ring. It's mirrored like a selfie. Drag it anywhere; the position is remembered. Because it's a real window on the screen, it's recorded as part of the video.
- The webcam is read through FFmpeg (DirectShow), so no new libraries are needed. The webcam process is always closed when you switch the camera off, close the bar, finish a recording or quit the app (with an exit guard too), so the camera light goes off.
- Clear messages for "no camera found", "camera busy in another app" and "Windows blocked the camera" (with the privacy setting to turn on).

**Tested:** 9 new self-tests (timer, reading FFmpeg's camera list in the new and old layouts, error messages, live camera frames through FFmpeg with a test picture, camera process closed), all passing. 22/22 checks on the real window (virtual screen, test picture as the camera): bar, toggles, camera frames, drag + remember, ⚙ menu, size change, countdown cancel (no stray recording afterwards), a **real recording with the camera bubble on screen: the bubble is in the saved MP4**, bar + camera closed after saving, broken camera message, ✕ closes the camera process. Not yet tested: the Windows .exe, a real webcam, and the round shape (Windows only; the test screen shows it square).

---

## v1.3.0 (2026-11-25)

**New: Support form**
- **💬 Support** button (where "safety checks on" was). The form has Subject (dropdown), your email, What happened, an optional screenshot (**📷 Capture this app** or **Attach image…**), and "Include app details" (version, Windows, tool versions, terminal log). Pictures are re-encoded as JPEG (max 2560 px), which also proves the file really is a picture.
- Messages go to a small free relay on Google Apps Script (`support-server/Code.gs`) that emails them to vteam732@gmail.com, with the screenshot attached and Reply-To set to the user. Setup: `support-server/SETUP.md`. The relay limits messages to 5 per hour per support ID and 40 per hour in total, and the app waits 60 seconds between sends.
- Until `SUPPORT_URL` is filled in, or if sending fails, the form says so and offers **Open email app**, **Copy message** and **Show screenshot** instead.

**New: Get Pro dialog**
- **⭐ Get Pro** button: Free vs Pro table, a Buy button (shows "Coming soon" until `BUY_URL` is set), and a licence-key box. Licence activation is switched on when Pro goes on sale. Until then the screen recorder stays free, and the dialog says so.

**New: support ID**
- Each PC gets a random ID like `7F3K-92QD` (saved in settings.json; no 0/O/1/I). It's shown next to TOOLS as `ID 7F3K-92QD · Free plan`. Click it to copy. It's sent with every support message.

**Changed**
- The header shows the version (`v1.3.0`) instead of the tagline "// best quality · one MP4".
- **TOOLS is now a dropdown.** The button shows a summary (`TOOLS ● 3 installed ▾`, or red `● 1 missing`). Click it for each tool's version, plus "🛡 Safety checks on".

**Tested:** 11 new self-tests (support ID format, email check, payload, JPEG re-encode, a non-picture file refused, sending to a local fake relay that redirects like Apps Script, offline message), all passing. 26/26 checks on the real window (customtkinter 6.0.0, virtual screen): header, TOOLS panel, copying the ID, Get Pro, Support validation, capture and attach, send with screenshot and details, 60-second wait, email fallback, offline. The relay script passed 15/15 checks with mocked Google services. Not yet tested: the Windows .exe build, and the live Google relay (needs your deployment).

---

## v1.2.2 (2026-11-25)

**Fixed**
- **Screen recordings had no computer sound** ("Couldn't record computer sound: Error 0x100000001"). The audio thread started Windows COM *before* loading the `soundcard` library. soundcard starts COM itself when it loads, and it treats Windows' "already started" answer (`S_FALSE`) as an error, so the library failed to load and the app recorded video only. Now the first audio thread lets soundcard start COM, later threads start it themselves, and a lock stops the computer-sound and mic threads from colliding.
- If sound can't be recorded, the result now shows a clear amber **"⚠ Saved without computer sound: …"** instead of only a line in the terminal.

**Tested:** a regression test with a fake soundcard that follows the real library's COM rules: the old order fails with exactly `Error 0x100000001`, and the fixed code records two recordings in a row with computer sound + mic (MP4 has sound, −7.5 dB, no warnings). Also: 33/33 self-tests, sync within ±13 ms, 11/11 recorder window tests (now through the real library-loading path), the no-sound warning, the forced-failure path.

---

## v1.2.1 (2026-11-25)

**Fixed**
- **"Recording failed: … cannot be applied to input url desktop"** on FFmpeg 9.1. The recorder passed `-thread_queue_size` to the screen input. Newer FFmpeg made that option output-only, so both capture methods failed to start. Removed it.
- The one-time "what does this PC support" check now runs the **exact same command** as a real recording, so a future FFmpeg change is caught by the check (with automatic fallback) instead of when you press Start. Checks saved by v1.2.0 are redone automatically.
- Recorder errors now show a short plain-English message; FFmpeg's full output is in **Show details**.

**Tested:** 33/33 self-tests (including new guards against output-only options on the screen input), sync test within ±10 ms, 11/11 recorder window tests, the forced-failure path, 31/31 download tests.

---

## v1.2.0 (2026-11-25)

**New: Screen recorder (full screen + sound)**
- **⏺ Record screen** button in the header, left of *How to use*.
- Recorder dialog: Computer sound (what you hear) and/or Microphone, 30/60 fps, Standard/High quality, show mouse pointer, minimise the app while recording. Choices are remembered.
- 3-second countdown, then a small floating **● REC 00:00 · ■ Stop** bar (draggable, always on top). The bar and the app are **excluded from the recording** (`SetWindowDisplayAffinity`, Windows 10 2004+).
- Saves `Screen Recording YYYY-MM-DD HH-MM-SS.mp4` to the SAVE TO folder, with the result card (Play video / Show in folder) and a preview frame.
- **How it works:** FFmpeg captures the screen with Windows Desktop Duplication (`ddagrab`, falling back to `gdigrab`) and encodes on the graphics card when possible (NVENC / Quick Sync / AMF, falling back to x264). The best combination is detected once and remembered. Sound is captured in Python with WASAPI loopback (`soundcard`) in its own thread. Everything is stamped with the system clock; on Stop, the sound is lined up with the first video frame (`adelay`/`atrim`), computer sound + mic are mixed, and the video is copied (not re-encoded) into an MP4. Audio dropouts are filled with silence and device clock drift is corrected, so long recordings stay in sync.
- Closing the app while recording stops and saves the recording first.
- New **Screen recorder** tab in the How-to-use guide.

**Fixed**
- **Link errors explain themselves.** A failed link check (like the gofile.io link) now shows yt-dlp's actual reason instead of just "Download failed", logs it to the terminal, and keeps the full log for *Show details*.
- **Folder/share links holding one file** (e.g. some file-host links) now download that file instead of being rejected as a playlist. The file name reported by the host is also checked against the dangerous-file list.

**Changed**
- Default window 1100×760 to fit the new header button.

**Tested:** 31/31 self-tests, 31/31 real-download tests, 11/11 recorder window tests (dialog → countdown → REC → stop → MP4 with picture + sound; close-while-recording saves first), 11/11 guide/install tests, a flash-and-beep sync test (3 runs, all within ±40 ms, including after a simulated 1-second audio dropout), and PyInstaller bundle launch with the audio library included.

---

## v1.1.0 (2026-11-25)

**New**
- **GitHub button** next to "Supported sites". It opens my GitHub repositories page (`GITHUB_URL` in the code). Optional `github.png` support for the official mark.
- **"How to use" guide** that opens with the app, with six tabs: *Quick start*, *Link types*, *Course videos (.m3u8)*, *Live & login*, *Quality*, *Safety & help*. It explains normal links vs. `.m3u8`/`.mpd`/manifest links, master vs. variant playlists, how to find a stream link with F12 → Network, recorded vs. live streams, browser logins and DRM limits. Untick "Show this guide when the app opens" to stop it; the **❔ How to use** button reopens it.

**Fixed**
- **"Install" prompt on every launch.** The old build always ran as Administrator, so Windows showed its "allow this app to make changes?" (UAC) prompt each time, which looked like an installer. `build.bat` now builds the normal version by default; `build.bat admin` brings Administrator mode back.
- **Repeated install question.** If you answer "No" to installing yt-dlp/FFmpeg, the app remembers it and stops asking at every launch (the yellow bar stays so you can install later). The question also waits until the guide is closed.
- **"Install Deno" everywhere.** It now appears only in the preview when you paste a YouTube link and Deno is missing.
- **Tool detection** now also checks Scoop, Chocolatey, pip `Scripts` folders, the Deno installer folder and `C:\ffmpeg\bin`, as well as the app's tools folder, PATH (refreshed from the registry) and WinGet.

**Changed**
- "Update downloader" moved to the TOOLS row; the header now shows *How to use · Supported sites · GitHub*.
- FFmpeg version shown short and readable (e.g. `7.1.1` instead of a long build string).
- The preview card grows to fit warnings and buttons.

**Tested:** 24/24 self-tests, 31/31 real-download tests, 11/11 guide/GitHub/install-logic tests, window screenshots of every state, and PyInstaller bundle launch.

---

## v1.0.0 (2026-11-25)

**The app**
- One-file Python app (customtkinter + Pillow) with a **white theme**, laid out like my "LCPDF to PDF" sample: SAVE TO and PASTE VIDEO LINK on the left, a PREVIEW card on the right, a TERMINAL log at the bottom.
- First launch asks where to save videos (default `Downloads\Videos`) and remembers it in `settings.json`. Clipboard links are pasted automatically.
- Quality options: Best, Up to 1080p, Up to 720p, Most compatible (H.264), Audio only (MP3).
- Never overwrites: `name (2)`, `name (3)` … Safe Windows file names. Generic HLS titles ("manifest") become `Video YYYY-MM-DD HH-MM`.
- One smooth progress bar (video + audio weighted by bitrate) with %, MB/s, time left and resolution.
- Result card with **Play video**, **Show in folder** and **Download another**; plain-English error card with **Show details**.

**Downloading**
- Works with every site yt-dlp supports, plus direct `.mp4`, `.m3u8` and `.mpd` links.
- **Variant → master fix:** for USP links like `…/manifest.ism/manifest-audio_…-video_….m3u8` it tries `manifest.m3u8`, `<name>.m3u8` and `.m3u8`, keeping the access token. Also handles Wowza `chunklist` → `playlist.m3u8`.
- **403 retry ladder:** passes the link's token on to sub-playlists and fragments (`generic:variant_query;fragment_query`), then tries browser impersonation. The original prompt had missed this.
- Resolution read with ffprobe when yt-dlp doesn't report it; warns and asks before downloading anything below 720p.
- `-N 16` parallel fragments, retries, a hidden temp folder, and Cancel that kills yt-dlp + FFmpeg and deletes partial files.
- Browser login (Firefox/Chrome/Edge/Brave cookies). Deno support for YouTube.

**Safety**
- Link checks (http/https only; blocks .exe/.zip/scripts and other dangerous types, `@` phishing links; warns on punycode and bare IPs).
- yt-dlp locked down (`--ignore-config`, `--no-plugin-dirs`, `--` before the URL, no shell).
- Sniffs direct links before downloading; verifies every finished file (signature + ffprobe); Microsoft Defender scan; Play opens media files only.

**Setup**
- Finds yt-dlp/FFmpeg/Deno; one-click install via winget, with a GitHub download fallback. "Update downloader" button.
- `build.bat`: finds/installs Python → venv → packages → self-test → PyInstaller one-file `.exe` → installs to `%LOCALAPPDATA%\Programs\VideoDownloader` → Desktop + Start menu shortcuts.

**Bugs caught by testing before release**
- 403 on signed links (token not passed to sub-playlists). Fixed with the retry ladder.
- The `.exe` would have crashed on launch (Pillow's Tk bridge was missing from the bundle). Fixed with hidden imports.
- A preview-picture crash after clearing a thumbnail. Fixed with a placeholder image.
