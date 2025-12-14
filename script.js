// State management
let groups = [];
let currentGroupId = null;
let currentLinkIndex = null;
let editingGroupId = null;

// DOM elements
const groupsContainer = document.getElementById('groupsContainer');
const addGroupBtn = document.getElementById('addGroupBtn');
const groupModal = document.getElementById('groupModal');
const linkModal = document.getElementById('linkModal');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const closeLinkModal = document.getElementById('closeLinkModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const cancelBtn = document.getElementById('cancelBtn');
const cancelLinkBtn = document.getElementById('cancelLinkBtn');
const saveGroupBtn = document.getElementById('saveGroupBtn');
const saveLinkBtn = document.getElementById('saveLinkBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const groupNameInput = document.getElementById('groupNameInput');
const linkTitleInput = document.getElementById('linkTitleInput');
const linkUrlInput = document.getElementById('linkUrlInput');
const modalTitle = document.getElementById('modalTitle');
const searchInput = document.getElementById('searchInput');
const sitesVisitedStat = document.getElementById('sitesVisited');
const linksManagedStat = document.getElementById('linksManaged');
const groupsCountStat = document.getElementById('groupsCount');
const settingsBtn = document.getElementById('settingsBtn');
const backgroundInput = document.getElementById('backgroundInput');
const uploadBackgroundBtn = document.getElementById('uploadBackgroundBtn');
const removeBackgroundBtn = document.getElementById('removeBackgroundBtn');
const backgroundPreview = document.getElementById('backgroundPreview');
const autoBackgroundToggle = document.getElementById('autoBackgroundToggle');
const manualBackgroundSection = document.getElementById('manualBackgroundSection');
const autoBackgroundControls = document.getElementById('autoBackgroundControls');
const autoBackgroundPreview = document.getElementById('autoBackgroundPreview');
const refreshBackgroundBtn = document.getElementById('refreshBackgroundBtn');
const syncToggle = document.getElementById('syncToggle');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importInput = document.getElementById('importInput');

// Drag and drop state
let draggedElement = null;
let draggedIndex = null;
let draggedLinkElement = null;
let draggedLinkIndex = null;
let draggedGroupIndex = null;

// Storage abstraction
let useSync = false;
const storage = {
  get: (keys) => {
    const storageArea = useSync ? chrome.storage.sync : chrome.storage.local;
    return new Promise((resolve) => storageArea.get(keys, resolve));
  },
  set: (items) => {
    const storageArea = useSync ? chrome.storage.sync : chrome.storage.local;
    return new Promise((resolve) => storageArea.set(items, resolve));
  },
  remove: (keys) => {
    const storageArea = useSync ? chrome.storage.sync : chrome.storage.local;
    return new Promise((resolve) => storageArea.remove(keys, resolve));
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSyncSetting();
  loadGroups();
  attachEventListeners();
  updateStats();
  loadTodayVisits();
  loadBackgroundImage();
});

// Event listeners
function attachEventListeners() {
  addGroupBtn.addEventListener('click', () => openGroupModal());
  closeModal.addEventListener('click', closeGroupModal);
  closeLinkModal.addEventListener('click', closeLinkModalFn);
  closeSettingsModal.addEventListener('click', closeSettingsModalFn);
  cancelBtn.addEventListener('click', closeGroupModal);
  cancelLinkBtn.addEventListener('click', closeLinkModalFn);
  saveGroupBtn.addEventListener('click', saveGroup);
  saveLinkBtn.addEventListener('click', saveLink);
  closeSettingsBtn.addEventListener('click', closeSettingsModalFn);
  settingsBtn.addEventListener('click', openSettingsModal);
  uploadBackgroundBtn.addEventListener('click', () => backgroundInput.click());
  backgroundInput.addEventListener('change', handleBackgroundUpload);
  removeBackgroundBtn.addEventListener('click', removeBackground);
  autoBackgroundToggle.addEventListener('change', handleAutoBackgroundToggle);
  refreshBackgroundBtn.addEventListener('click', refreshBackground);
  syncToggle.addEventListener('change', handleSyncToggle);
  exportBtn.addEventListener('click', exportData);
  importBtn.addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', importData);
  
  // Search functionality
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        // Use default search engine (Google)
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }
    }
  });
  
  // Close modals on background click
  groupModal.addEventListener('click', (e) => {
    if (e.target === groupModal) closeGroupModal();
  });
  linkModal.addEventListener('click', (e) => {
    if (e.target === linkModal) closeLinkModalFn();
  });
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModalFn();
  });
  
  // Enter key handlers
  groupNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveGroup();
  });
  linkUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveLink();
  });
}

// Stats management
function updateStats() {
  const totalLinks = groups.reduce((sum, group) => sum + (group.links?.length || 0), 0);
  linksManagedStat.textContent = totalLinks;
  groupsCountStat.textContent = groups.length;
}

function loadTodayVisits() {
  const today = new Date().toDateString();
  chrome.storage.local.get(['dailyVisits'], (result) => {
    const dailyVisits = result.dailyVisits || {};
    sitesVisitedStat.textContent = dailyVisits[today] || 0;
  });
}

function incrementTodayVisits() {
  const today = new Date().toDateString();
  chrome.storage.local.get(['dailyVisits'], (result) => {
    const dailyVisits = result.dailyVisits || {};
    dailyVisits[today] = (dailyVisits[today] || 0) + 1;
    chrome.storage.local.set({ dailyVisits });
    sitesVisitedStat.textContent = dailyVisits[today];
  });
}

// Load groups from storage
async function loadGroups() {
  const result = await storage.get(['linkGroups']);
  groups = result.linkGroups || [];
  renderGroups();
}

// Save groups to storage
async function saveGroups() {
  await storage.set({ linkGroups: groups });
  renderGroups();
  updateStats();
}

// Render all groups
function renderGroups() {
  groupsContainer.innerHTML = '';
  
  if (groups.length === 0) {
    groupsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No groups yet. Click "New Group" to get started.</p>
      </div>
    `;
    return;
  }
  
  groups.forEach((group, index) => {
    const groupElement = createGroupElement(group, index);
    groupsContainer.appendChild(groupElement);
    
    // Stagger animation
    setTimeout(() => {
      groupElement.style.animationDelay = '0s';
    }, index * 50);
  });
}

// Create group element
function createGroupElement(group, groupIndex) {
  const groupDiv = document.createElement('div');
  groupDiv.className = 'group';
  groupDiv.setAttribute('data-group-id', groupIndex);
  groupDiv.setAttribute('draggable', 'true');
  groupDiv.style.animationDelay = `${groupIndex * 0.05}s`;
  
  groupDiv.innerHTML = `
    <div class="group-header">
      <div style="display: flex; align-items: center; flex: 1;">
        <svg class="drag-handle" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="13" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="7" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="13" cy="10" r="1.5" fill="currentColor"/>
          <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
          <circle cx="13" cy="15" r="1.5" fill="currentColor"/>
        </svg>
        <h2 class="group-title">${escapeHtml(group.name)}</h2>
      </div>
      <div class="group-actions">
        <button class="icon-btn btn-add-link-group" title="Add link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="icon-btn btn-edit-group" title="Edit group">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.334 2.00004C11.5091 1.82494 11.7169 1.68605 11.9457 1.59129C12.1745 1.49653 12.4197 1.44775 12.6673 1.44775C12.9149 1.44775 13.1601 1.49653 13.3889 1.59129C13.6177 1.68605 13.8256 1.82494 14.0007 2.00004C14.1758 2.17513 14.3147 2.383 14.4094 2.61178C14.5042 2.84055 14.553 3.08575 14.553 3.33337C14.553 3.58099 14.5042 3.82619 14.4094 4.05497C14.3147 4.28374 14.1758 4.49161 14.0007 4.66671L5.00065 13.6667L1.33398 14.6667L2.33398 11L11.334 2.00004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="icon-btn btn-delete-group" title="Delete group">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4H14M12.6667 4V13.3333C12.6667 14 12 14.6667 11.3333 14.6667H4.66667C4 14.6667 3.33333 14 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2 6 1.33333 6.66667 1.33333H9.33333C10 1.33333 10.6667 2 10.6667 2.66667V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
    <ul class="links-list">
      ${group.links && group.links.length > 0 
        ? group.links.map((link, linkIndex) => createLinkElement(link, linkIndex)).join('')
        : '<li class="empty-state">No links yet</li>'
      }
    </ul>
    <button class="btn-add-link">+ Add Link</button>
  `;
  
  // Add event listeners
  const addLinkBtn = groupDiv.querySelector('.btn-add-link');
  const addLinkGroupBtn = groupDiv.querySelector('.btn-add-link-group');
  const editGroupBtn = groupDiv.querySelector('.btn-edit-group');
  const deleteGroupBtn = groupDiv.querySelector('.btn-delete-group');
  
  addLinkBtn.addEventListener('click', () => openLinkModal(groupIndex));
  addLinkGroupBtn.addEventListener('click', () => openLinkModal(groupIndex));
  editGroupBtn.addEventListener('click', () => openGroupModal(groupIndex));
  deleteGroupBtn.addEventListener('click', () => deleteGroup(groupIndex));
  
  // Drag and drop handlers
  groupDiv.addEventListener('dragstart', handleDragStart);
  groupDiv.addEventListener('dragend', handleDragEnd);
  groupDiv.addEventListener('dragover', handleDragOver);
  groupDiv.addEventListener('drop', handleDrop);
  groupDiv.addEventListener('dragleave', handleDragLeave);
  
  // Add link click handlers
  const linkItems = groupDiv.querySelectorAll('.link-item');
  linkItems.forEach((item, linkIndex) => {
    const linkUrl = group.links[linkIndex].url;
    
    // Click handler for navigation
    item.addEventListener('click', (e) => {
      if (!e.target.closest('.icon-btn') && !e.target.closest('.link-drag-handle')) {
        incrementTodayVisits();
        window.location.href = linkUrl;
      }
    });
    
    // Delete button
    const deleteBtn = item.querySelector('.btn-delete-link');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteLink(groupIndex, linkIndex);
    });
    
    // Drag and drop for links
    item.addEventListener('dragstart', (e) => handleLinkDragStart(e, groupIndex, linkIndex));
    item.addEventListener('dragend', handleLinkDragEnd);
    item.addEventListener('dragover', handleLinkDragOver);
    item.addEventListener('drop', (e) => handleLinkDrop(e, groupIndex, linkIndex));
    item.addEventListener('dragleave', handleLinkDragLeave);
  });
  
  return groupDiv;
}

// Link drag and drop handlers
function handleLinkDragStart(e, groupIndex, linkIndex) {
  draggedLinkElement = e.currentTarget;
  draggedLinkIndex = linkIndex;
  draggedGroupIndex = groupIndex;
  
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
  
  // Stop event from bubbling to group
  e.stopPropagation();
}

function handleLinkDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  
  // Remove drag-over class from all links
  document.querySelectorAll('.link-item').forEach(link => {
    link.classList.remove('drag-over');
  });
  
  draggedLinkElement = null;
  draggedLinkIndex = null;
  draggedGroupIndex = null;
}

function handleLinkDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  e.dataTransfer.dropEffect = 'move';
  
  if (draggedLinkElement && this !== draggedLinkElement) {
    this.classList.add('drag-over');
  }
  
  // Stop event from bubbling to group
  e.stopPropagation();
  return false;
}

function handleLinkDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleLinkDrop(e, groupIndex, linkIndex) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (draggedLinkElement && draggedLinkElement !== e.currentTarget) {
    // Only allow reordering within the same group
    if (draggedGroupIndex === groupIndex) {
      // Reorder links array
      const movedLink = groups[groupIndex].links.splice(draggedLinkIndex, 1)[0];
      groups[groupIndex].links.splice(linkIndex, 0, movedLink);
      
      saveGroups();
    }
  }
  
  return false;
}

// Drag and drop handlers
function handleDragStart(e) {
  draggedElement = this;
  draggedIndex = parseInt(this.getAttribute('data-group-id'));
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
  this.classList.remove('dragging');
  
  // Remove drag-over class from all groups
  document.querySelectorAll('.group').forEach(group => {
    group.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  e.dataTransfer.dropEffect = 'move';
  
  if (this !== draggedElement) {
    this.classList.add('drag-over');
  }
  
  return false;
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  
  if (draggedElement !== this) {
    const dropIndex = parseInt(this.getAttribute('data-group-id'));
    
    // Reorder groups array
    const movedGroup = groups.splice(draggedIndex, 1)[0];
    groups.splice(dropIndex, 0, movedGroup);
    
    saveGroups();
  }
  
  return false;
}

// Create link element
function createLinkElement(link, linkIndex) {
  const favicon = getFavicon(link.url);
  return `
    <li class="link-item" data-link-index="${linkIndex}" draggable="true" style="animation-delay: ${linkIndex * 0.05}s">
      <svg class="link-drag-handle" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="5" cy="4" r="1" fill="currentColor"/>
        <circle cx="11" cy="4" r="1" fill="currentColor"/>
        <circle cx="5" cy="8" r="1" fill="currentColor"/>
        <circle cx="11" cy="8" r="1" fill="currentColor"/>
        <circle cx="5" cy="12" r="1" fill="currentColor"/>
        <circle cx="11" cy="12" r="1" fill="currentColor"/>
      </svg>
      <div class="link-favicon">
        <img src="${favicon}" alt="" width="16" height="16" onerror="this.style.display='none'">
      </div>
      <div class="link-content">
        <div class="link-title">${escapeHtml(link.title)}</div>
        <div class="link-url">${escapeHtml(getDomain(link.url))}</div>
      </div>
      <div class="link-actions">
        <button class="icon-btn btn-delete-link" title="Delete link">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </li>
  `;
}

// Modal functions
function openGroupModal(groupIndex = null) {
  editingGroupId = groupIndex;
  
  if (groupIndex !== null) {
    modalTitle.textContent = 'Edit Group';
    groupNameInput.value = groups[groupIndex].name;
  } else {
    modalTitle.textContent = 'New Group';
    groupNameInput.value = '';
  }
  
  groupModal.classList.add('active');
  groupNameInput.focus();
}

function closeGroupModal() {
  groupModal.classList.remove('active');
  groupNameInput.value = '';
  editingGroupId = null;
}

function openLinkModal(groupIndex) {
  currentGroupId = groupIndex;
  linkTitleInput.value = '';
  linkUrlInput.value = '';
  linkModal.classList.add('active');
  linkTitleInput.focus();
}

function closeLinkModalFn() {
  linkModal.classList.remove('active');
  linkTitleInput.value = '';
  linkUrlInput.value = '';
  currentGroupId = null;
}

function openSettingsModal() {
  settingsModal.classList.add('active');
  updateBackgroundPreview();
  updateSettingsUI();
}

function closeSettingsModalFn() {
  settingsModal.classList.remove('active');
}

// Sync management
async function loadSyncSetting() {
  const result = await chrome.storage.local.get(['useSync']);
  useSync = result.useSync || false;
}

async function handleSyncToggle() {
  useSync = syncToggle.checked;
  await chrome.storage.local.set({ useSync });
  
  if (useSync) {
    // Migrate data from local to sync
    const localData = await chrome.storage.local.get(['linkGroups']);
    if (localData.linkGroups) {
      await chrome.storage.sync.set({ linkGroups: localData.linkGroups });
    }
    alert('Sync enabled! Your links will now sync across all your Brave browsers.');
  } else {
    alert('Sync disabled. Your links will only be stored on this device.');
  }
  
  await loadGroups();
}

// Auto background management
async function handleAutoBackgroundToggle() {
  const autoEnabled = autoBackgroundToggle.checked;
  await chrome.storage.local.set({ autoBackground: autoEnabled });
  
  if (autoEnabled) {
    manualBackgroundSection.classList.add('disabled');
    autoBackgroundControls.style.display = 'block';
    await loadUnsplashBackground();
  } else {
    manualBackgroundSection.classList.remove('disabled');
    autoBackgroundControls.style.display = 'none';
    await loadBackgroundImage();
  }
}

async function refreshBackground() {
  // Show loading state
  refreshBackgroundBtn.disabled = true;
  refreshBackgroundBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 8px; animation: spin 1s linear infinite;">
      <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
    </svg>
    Loading...
  `;
  
  try {
    // Use a random seed instead of date to get a truly random image
    const randomSeed = Math.random().toString(36).substring(7) + Date.now();
    const imageUrl = `https://picsum.photos/seed/${randomSeed}/1920/1080`;
    
    // Fetch and convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      const today = new Date().toDateString();
      
      await chrome.storage.local.set({ 
        unsplashBackground: base64data,
        unsplashDate: today 
      });
      
      applyBackgroundImage(base64data);
      
      // Update preview
      autoBackgroundPreview.innerHTML = `<img src="${base64data}" alt="Background preview" />`;
      
      // Reset button
      refreshBackgroundBtn.disabled = false;
      refreshBackgroundBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 8px;">
          <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
        </svg>
        Get New Background
      `;
    };
    
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Failed to refresh background:', error);
    alert('Failed to load new background. Please try again.');
    
    // Reset button
    refreshBackgroundBtn.disabled = false;
    refreshBackgroundBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="margin-right: 8px;">
        <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z" fill="currentColor"/>
      </svg>
      Get New Background
    `;
  }
}

async function loadUnsplashBackground() {
  try {
    // Check if we already have a background for today
    const today = new Date().toDateString();
    const result = await chrome.storage.local.get(['unsplashBackground', 'unsplashDate']);
    
    if (result.unsplashDate === today && result.unsplashBackground) {
      applyBackgroundImage(result.unsplashBackground);
      return;
    }
    
    // Use Lorem Picsum for reliable, high-quality random images
    // Add a random seed based on date to get different image each day
    const seed = new Date().toISOString().split('T')[0];
    const imageUrl = `https://picsum.photos/seed/${seed}/1920/1080`;
    
    // Fetch and convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      await chrome.storage.local.set({ 
        unsplashBackground: base64data,
        unsplashDate: today 
      });
      applyBackgroundImage(base64data);
      updateBackgroundPreview();
    };
    
    reader.readAsDataURL(blob);
  } catch (error) {
    console.error('Failed to load background:', error);
    // Fallback to gradient background
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-background');
  }
}

// Export/Import functionality
async function exportData() {
  const data = await storage.get(['linkGroups']);
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    linkGroups: data.linkGroups || []
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `link-groups-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const importData = JSON.parse(e.target.result);
      
      if (!importData.linkGroups) {
        alert('Invalid backup file format');
        return;
      }
      
      const confirmMsg = `This will replace your current ${groups.length} groups with ${importData.linkGroups.length} groups from the backup. Continue?`;
      
      if (confirm(confirmMsg)) {
        groups = importData.linkGroups;
        await saveGroups();
        alert('Data imported successfully!');
      }
    } catch (error) {
      alert('Failed to import data. Please check the file format.');
      console.error('Import error:', error);
    }
  };
  
  reader.readAsText(file);
  importInput.value = ''; // Reset input
}

// Update settings UI
async function updateSettingsUI() {
  const result = await chrome.storage.local.get(['useSync', 'autoBackground', 'unsplashBackground']);
  syncToggle.checked = result.useSync || false;
  autoBackgroundToggle.checked = result.autoBackground || false;
  
  if (result.autoBackground) {
    manualBackgroundSection.classList.add('disabled');
    autoBackgroundControls.style.display = 'block';
    
    // Update auto background preview
    if (result.unsplashBackground) {
      autoBackgroundPreview.innerHTML = `<img src="${result.unsplashBackground}" alt="Background preview" />`;
    } else {
      autoBackgroundPreview.innerHTML = '<p class="empty-state">Loading background...</p>';
    }
  } else {
    manualBackgroundSection.classList.remove('disabled');
    autoBackgroundControls.style.display = 'none';
  }
}

// Background image management
function handleBackgroundUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image is too large. Please choose an image smaller than 5MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = async (e) => {
    const imageData = e.target.result;
    await chrome.storage.local.set({ backgroundImage: imageData });
    applyBackgroundImage(imageData);
    updateBackgroundPreview();
  };
  reader.readAsDataURL(file);
}

async function removeBackground() {
  if (confirm('Are you sure you want to remove the background image?')) {
    await chrome.storage.local.remove('backgroundImage');
    applyBackgroundImage(null);
    updateBackgroundPreview();
  }
}

async function loadBackgroundImage() {
  const result = await chrome.storage.local.get(['autoBackground', 'backgroundImage']);
  
  if (result.autoBackground) {
    await loadUnsplashBackground();
  } else if (result.backgroundImage) {
    applyBackgroundImage(result.backgroundImage);
  }
}

function applyBackgroundImage(imageData) {
  if (imageData) {
    document.body.style.backgroundImage = `url(${imageData})`;
    document.body.classList.add('has-background');
  } else {
    document.body.style.backgroundImage = '';
    document.body.classList.remove('has-background');
  }
}

async function updateBackgroundPreview() {
  const result = await chrome.storage.local.get(['backgroundImage', 'autoBackground']);
  
  if (result.autoBackground) {
    const unsplashResult = await chrome.storage.local.get(['unsplashBackground']);
    if (unsplashResult.unsplashBackground) {
      backgroundPreview.innerHTML = `<img src="${unsplashResult.unsplashBackground}" alt="Background preview" />`;
    } else {
      backgroundPreview.innerHTML = '<p class="empty-state">Auto background enabled</p>';
    }
  } else if (result.backgroundImage) {
    backgroundPreview.innerHTML = `<img src="${result.backgroundImage}" alt="Background preview" />`;
  } else {
    backgroundPreview.innerHTML = '<p class="empty-state">No background image set</p>';
  }
}

// CRUD operations
function saveGroup() {
  const name = groupNameInput.value.trim();
  
  if (!name) {
    alert('Please enter a group name');
    return;
  }
  
  if (editingGroupId !== null) {
    groups[editingGroupId].name = name;
  } else {
    groups.push({
      name: name,
      links: []
    });
  }
  
  saveGroups();
  closeGroupModal();
}

function deleteGroup(groupIndex) {
  if (confirm('Are you sure you want to delete this group?')) {
    groups.splice(groupIndex, 1);
    saveGroups();
  }
}

function saveLink() {
  const title = linkTitleInput.value.trim();
  let url = linkUrlInput.value.trim();
  
  if (!title || !url) {
    alert('Please enter both title and URL');
    return;
  }
  
  // Add https:// if no protocol specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    alert('Please enter a valid URL');
    return;
  }
  
  groups[currentGroupId].links.push({
    title: title,
    url: url
  });
  
  saveGroups();
  closeLinkModalFn();
}

function deleteLink(groupIndex, linkIndex) {
  if (confirm('Are you sure you want to delete this link?')) {
    groups[groupIndex].links.splice(linkIndex, 1);
    saveGroups();
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

function getFavicon(url) {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
  } catch (e) {
    return '';
  }
}
