# QuickHub - GitHub Repository Package

This zip contains everything you need to publish QuickHub on GitHub.

## 📦 What's Included

### Extension Files
- `manifest.json` - Extension configuration
- `newtab.html` - New tab page
- `script.js` - JavaScript functionality
- `styles.css` - Styling
- `icon16.png`, `icon48.png`, `icon128.png` - Extension icons
- `icon.svg` - Source icon file

### Documentation
- `README.md` - Main documentation (installation, features, usage)
- `LICENSE` - MIT License (remember to add your name!)
- `PRIVACY.md` - Privacy policy
- `CONTRIBUTING.md` - Contribution guidelines
- `CHROME_WEB_STORE_LISTING.md` - Text for Chrome Web Store submission
- `.gitignore` - Git ignore rules

## 🚀 How to Use

### Option 1: Upload via GitHub Web Interface (Easiest)

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `quickhub-extension`
   - Description: "A beautiful browser extension for organizing links in customizable groups on your new tab page"
   - Select **Public**
   - Don't check any boxes (we have all files)
   - Click "Create repository"

2. **Upload files:**
   - On the new repo page, click "uploading an existing file"
   - Extract this zip and drag ALL files from the `quickhub-repo` folder
   - Scroll down and click "Commit changes"

3. **Done!** Your repository is live at:
   `https://github.com/mdasberg/quickhub-extension`

### Option 2: Using Git Command Line

```bash
# Extract the zip
unzip quickhub-github-repo.zip
cd quickhub-repo

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: QuickHub v1.0.0"

# Add remote (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/quickhub-extension.git

# Push
git branch -M main
git push -u origin main
```

## ✏️ Before Publishing

**Replace these placeholders in the files:**

1. **LICENSE** (line 3):
   - Change `[Your Name]` to your actual name

2. **README.md** (bottom section):
   - Change `[Your Name]` to your actual name

3. **PRIVACY.md**:
   - Change `[Your GitHub Repository URL]` to your actual repo URL
   - Optionally add your email

4. **CHROME_WEB_STORE_LISTING.md**:
   - Change `[YOUR-USERNAME]` in URLs
   - Add your support email

You can edit these directly on GitHub after uploading:
1. Click on the file
2. Click the pencil icon (Edit)
3. Make changes
4. Click "Commit changes"

## 📊 After Publishing

1. **Add repository topics:**
   - Click the gear icon next to "About"
   - Add: `browser-extension`, `new-tab`, `productivity`, `brave-browser`, `chrome-extension`

2. **Create a release:**
   - Click "Releases" → "Create a new release"
   - Tag: `v1.0.0`
   - Title: "QuickHub v1.0.0 - Initial Release"
   - Upload the extension zip file

3. **Share your work:**
   - Post on Reddit (r/Brave, r/chrome)
   - Share on social media
   - Tell friends!

## 🌟 Next Steps

- Submit to Chrome Web Store (see CHROME_WEB_STORE_LISTING.md)
- Monitor issues and feedback
- Plan future updates

## Need Help?

Refer to the main GITHUB_SETUP_GUIDE.md for detailed instructions.

---

Good luck with your launch! 🚀
