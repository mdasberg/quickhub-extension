# GitHub Actions - Automated Release Summary

I've added automated release creation to your QuickHub repository! 🎉

## 📦 What's Included

### New Files Added:
1. **`.github/workflows/release.yml`** - The automation workflow
2. **`.github/RELEASE_GUIDE.md`** - Complete guide for using it

### Updated:
- **`README.md`** - Added note about automated releases

## 🚀 How It Works

### Simple Version:
```bash
# When you want to release version 1.1.0:
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# GitHub automatically:
# ✅ Creates the release
# ✅ Packages the extension into a zip
# ✅ Uploads the zip file
# ✅ Generates release notes from your commits
```

### What the Action Does:

1. **Triggers** - When you push a tag starting with `v` (like v1.0.0)
2. **Packages** - Creates a clean zip with only extension files:
   - manifest.json
   - newtab.html
   - script.js
   - styles.css
   - All icon files
3. **Releases** - Creates a GitHub release with:
   - Version number from tag
   - Automatic release notes from commits
   - Downloadable zip file
   - Installation instructions

## 🎯 Quick Start

### Your First Automated Release:

```bash
# 1. Make sure everything is committed
git add .
git commit -m "Ready for first release"
git push origin main

# 2. Create and push the v1.0.0 tag
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# 3. Watch it work!
# Go to GitHub → Actions tab to see it run
# Go to Releases to see your new release
```

## 📝 Version Numbering

Follow [Semantic Versioning](https://semver.org/):

- **v1.0.0** → **v1.0.1** - Bug fixes (patch)
- **v1.0.0** → **v1.1.0** - New features (minor)
- **v1.0.0** → **v2.0.0** - Breaking changes (major)

## 🔍 Monitoring Releases

### Where to Look:

1. **Actions Tab** - Watch the workflow run in real-time
2. **Releases Section** - See all your releases
3. **Notifications** - GitHub emails you when done

### Action Progress:
```
✓ Checkout code
✓ Get version from tag
✓ Create extension package
✓ Generate release notes
✓ Create Release
✓ Upload artifact
```

## ✨ Benefits

### Before (Manual):
1. Manually create zip file
2. Navigate to Releases
3. Create new release
4. Upload zip
5. Write release notes
6. Publish

### After (Automated):
1. Push a tag
2. Done! ✅

### Advantages:
- ⚡ **Faster** - One command instead of 6 steps
- ✅ **Consistent** - Same package every time
- 📝 **Documented** - Auto-generated release notes
- 🎯 **Professional** - No human errors
- 🔄 **Reproducible** - Anyone can release

## 🛠️ Customization

The workflow is in `.github/workflows/release.yml` and can be customized:

### Add More Files:
```yaml
cp README.md quickhub-extension/
cp LICENSE quickhub-extension/
```

### Change Release Notes Format:
Edit the `Generate release notes` step

### Run Tests Before Release:
Add a testing step before packaging

### Different Trigger:
Change from tags to branches or manual triggers

## 📋 Pre-Release Checklist

Before tagging a new version:

1. ✅ Update version in `manifest.json` to match tag
2. ✅ Test extension thoroughly
3. ✅ Update README with new features
4. ✅ Commit all changes
5. ✅ Push to main branch
6. ✅ Create and push tag
7. ✅ Verify release created successfully

## 🐛 Troubleshooting

### Action Not Running?
- Check you pushed the tag: `git push origin v1.0.0`
- Verify tag starts with `v`
- Look in Actions tab for errors

### Wrong Version Number?
- Delete tag locally: `git tag -d v1.0.0`
- Delete tag remotely: `git push origin :refs/tags/v1.0.0`
- Create correct tag and push again

### Files Missing from Zip?
- Check the workflow file
- Verify the `Create extension package` step
- Look at uploaded artifact to debug

## 📚 Full Documentation

See **`.github/RELEASE_GUIDE.md`** for complete details including:
- Different ways to create releases
- Commit message best practices
- Troubleshooting guide
- Examples and tips

## 🎓 Example Workflow

### Scenario: You fixed a bug

```bash
# 1. Fix the bug
# 2. Update manifest.json version to 1.0.1
# 3. Commit
git add .
git commit -m "Fix: Drag and drop issue on Firefox"

# 4. Push to main
git push origin main

# 5. Create release
git tag -a v1.0.1 -m "Bug fix release"
git push origin v1.0.1

# 6. Done! Check GitHub Releases in a minute
```

## 🌟 Pro Tips

1. **Write good commit messages** - They become your release notes
2. **Version numbers in manifest.json** - Keep them in sync with tags
3. **Test before tagging** - Tags mark important points
4. **Use pre-releases** - Tag as `v1.0.0-beta` for testing
5. **Delete bad tags quickly** - If you make a mistake

## 🎉 Summary

You now have professional, automated releases with:
- One-command deployment
- Automatic packaging
- Auto-generated release notes
- Downloadable zip files
- Professional appearance

Just push a tag and GitHub does the rest! 🚀

---

**Need help?** Check `.github/RELEASE_GUIDE.md` or open an issue!
