# productify_ext

# 🚀 Installing the Chrome Time Tracker Extension

Follow these steps to load and use the Chrome Time Tracker extension locally:

## 📁 Step 1: Prepare Your Extension Files

Ensure you have the following files in a single folder, for example: `chrome-time-tracker/`:

- `manifest.json`
- `background.js`
- `popup.html`
- `popup.js`
- `content.js` (optional or empty if unused)
- *(Icons are optional but can be added later if needed)*

> 💡 Make sure all JavaScript and HTML files are correctly written and your `manifest.json` is using `manifest_version: 3`.

## 🌐 Step 2: Open Chrome Extensions Page

1. Open Google Chrome.
2. Go to `chrome://extensions/` in your address bar.
3. Enable **Developer mode** by toggling the switch on the top-right corner.

## 📦 Step 3: Load the Unpacked Extension

1. Click the **"Load unpacked"** button.
2. Select the folder where your extension files are located (`chrome-time-tracker/`).

If everything is correct, your extension will now appear in the list and be active!

## 🧪 Step 4: Test the Extension

1. Visit any website (like google.com).
2. Click the extension icon (📌 pin it to the toolbar if needed).
3. You’ll see today’s time tracked per domain.
4. Navigate across tabs and pages — time should update live!
5. Time data is stored per day.

---

## 🛠️ Troubleshooting

- ❌ **Icon not found**: Remove `"icons"` section in `manifest.json` or provide valid `.png` files.
- ❌ **Not tracking time**: Make sure you're not visiting Chrome internal pages (`chrome://...`) or extensions.
- 🔁 **Time not updating**: Confirm content scripts and background scripts are loading. Check logs in the **Service Worker Console**.

