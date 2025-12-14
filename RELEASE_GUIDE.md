# GitHub Actions Release Guide

This repository includes an automated release workflow that creates releases when you push version tags.

## 🚀 How It Works

The GitHub Action automatically:
1. ✅ Detects when you push a version tag (like `v1.0.0`)
2. ✅ Packages the extension files into a zip
3. ✅ Creates a GitHub release
4. ✅ Uploads the zip file to the release
5. ✅ Generates release notes from your commits

## 📝 Creating a Release

### Method 1: Command Line (Recommended)

```bash
# Make sure all your changes are committed
git add .
git commit -m "Add new feature"

# Create and push a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# That's it! The GitHub Action will automatically create the release
```

### Method 2: GitHub Web Interface

1. Go to your repository on GitHub
2. Click on "Releases" in the right sidebar
3. Click "Draft a new release"
4. Click "Choose a tag"
5. Type your version (e.g., `v1.0.1`) and click "Create new tag"
6. The GitHub Action will run automatically
7. Or manually fill in release details and publish

## 📊 Version Numbering

Use [Semantic Versioning](https://semver.org/):

- `v1.0.0` - Major release (breaking changes)
- `v1.1.0` - Minor release (new features)
- `v1.0.1` - Patch release (bug fixes)

### Examples:

```bash
# First release
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# Added new features
git tag -a v1.1.0 -m "Add background shuffle feature"
git push origin v1.1.0

# Bug fixes
git tag -a v1.1.1 -m "Fix drag and drop issue"
git push origin v1.1.1
```

## 🔍 Monitoring the Release Process

1. **Watch the action run:**
   - Go to the "Actions" tab in your repository
   - Click on the running workflow
   - Watch the progress in real-time

2. **Check the release:**
   - Go to "Releases" section
   - Your new release should appear with:
     - Version number
     - Release notes (generated from commits)
     - Downloadable zip file

## 📦 What Gets Packaged

The workflow packages these files into the zip:
- `manifest.json`
- `newtab.html`
- `script.js`
- `styles.css`
- `icon16.png`, `icon48.png`, `icon128.png`
- `icon.svg`

**Note:** Documentation files (README, LICENSE, etc.) are NOT included in the release zip. They stay in the repository for reference.

## ✏️ Customizing Release Notes

The workflow generates release notes from your commit messages. To get better release notes:

### Good Commit Messages:
```bash
git commit -m "Add: Background refresh button"
git commit -m "Fix: Drag and drop on Firefox"
git commit -m "Improve: Performance of link rendering"
```

### Release Notes Will Look Like:
```
## What's New in v1.1.0

- Add: Background refresh button
- Fix: Drag and drop on Firefox
- Improve: Performance of link rendering
```

## 🐛 Troubleshooting

### Action doesn't run?
- Make sure you pushed the tag: `git push origin v1.0.0`
- Check the "Actions" tab for error messages
- Verify the tag starts with `v` (required)

### Permission denied?
- The workflow needs `contents: write` permission (already configured)
- Check your repository settings → Actions → General → Workflow permissions

### Wrong files in the zip?
- Edit `.github/workflows/release.yml`
- Modify the "Create extension package" step
- Add or remove files as needed

## 🔄 Updating the Workflow

The workflow file is at: `.github/workflows/release.yml`

You can modify it to:
- Change what files are included
- Customize release notes format
- Add additional steps (like running tests)
- Change the trigger conditions

## 📋 Pre-release Checklist

Before creating a release:

1. ✅ Update version in `manifest.json`
2. ✅ Test the extension thoroughly
3. ✅ Update README if needed
4. ✅ Commit all changes
5. ✅ Create and push the tag
6. ✅ Wait for GitHub Action to complete
7. ✅ Verify the release on GitHub
8. ✅ Test the downloaded zip file

## 🎯 Quick Reference

```bash
# Create a new release (all in one go)
git add .
git commit -m "Your changes"
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0

# Delete a tag (if you made a mistake)
git tag -d v1.1.0                    # Delete locally
git push origin :refs/tags/v1.1.0   # Delete remotely

# List all tags
git tag -l

# See details of a tag
git show v1.0.0
```

## 🌟 Benefits of Automated Releases

- ⚡ **Faster** - No manual zip creation
- ✅ **Consistent** - Same process every time
- 📝 **Documented** - Automatic release notes
- 🔄 **Reproducible** - Anyone can create releases
- 🎯 **Professional** - Looks polished to users

## 💡 Tips

1. **Test before tagging** - Tags are permanent markers
2. **Use descriptive commit messages** - They become your release notes
3. **Follow semver** - Makes version tracking clear
4. **Tag after merging** - Not on feature branches
5. **Keep README updated** - Users see it first

---

Now you can create professional releases with a single command! 🚀
