import { PolyMod } from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.3/PolyTypes.js";

const TEXT_EDITOR_STYLE = `
.poly-text-editor-window {
  position: fixed;
  left: 12%;
  top: 10%;
  width: 76vw;
  height: 78vh;
  min-width: 520px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2147483646;
  background: #181818;
  color: #ddd;
  border: 1px solid #3b3b3b;
  border-radius: 8px;
  box-shadow: 0 14px 45px rgba(0, 0, 0, .55);
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  resize: none;
}

.poly-text-editor-window[hidden] {
  display: none;
}

.poly-text-editor-window,
.poly-text-editor-window * {
  box-sizing: border-box;
}


/* Title bar */

.poly-text-editor-titlebar {
  height: 38px;
  flex: 0 0 38px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  background: #222;
  border-bottom: 1px solid #353535;
  user-select: none;
  cursor: move;
}

.poly-text-editor-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #eee;
}


/* Buttons */

.poly-text-editor-button {
  border: 0;
  border-radius: 4px;
  background: #303030;
  color: #ddd;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 12px;
}

.poly-text-editor-button:hover {
  background: #3b3b3b;
}

.poly-text-editor-close:hover {
  background: #8b3030;
}


/* Tabs */

.poly-text-editor-tabs {
  height: 36px;
  flex: 0 0 36px;
  display: flex;
  align-items: stretch;
  background: #1d1d1d;
  border-bottom: 1px solid #333;
  overflow: hidden;
}

.poly-text-editor-tab-list {
  min-width: 0;
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
}

.poly-text-editor-tab-list::-webkit-scrollbar {
  height: 4px;
}

.poly-text-editor-tab-list::-webkit-scrollbar-thumb {
  background: #444;
}

.poly-text-editor-tab {
  flex: 0 0 auto;
  min-width: 100px;
  max-width: 220px;
  height: 35px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 8px 0 12px;
  border: 0;
  border-right: 1px solid #303030;
  background: #1d1d1d;
  color: #aaa;
  cursor: pointer;
}

.poly-text-editor-tab:hover {
  background: #272727;
  color: #ddd;
}

.poly-text-editor-tab.active {
  background: #181818;
  color: #fff;
  box-shadow: inset 0 -2px #aaa;
}

.poly-text-editor-tab-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.poly-text-editor-tab-download,
.poly-text-editor-tab-delete {
  flex: 0 0 auto;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: #888;
  cursor: pointer;
  padding: 0;
  font-size: 13px;
}

.poly-text-editor-tab-download:hover {
  background: #333;
  color: #fff;
}

.poly-text-editor-tab-delete:hover {
  background: #8b3030;
  color: #fff;
}


/* Right-side tab controls */

.poly-text-editor-tab-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 0 5px;
  border-left: 1px solid #333;
  background: #1d1d1d;
}

.poly-text-editor-tab-action {
  width: 29px;
  height: 29px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #aaa;
  cursor: pointer;
  font-size: 16px;
}

.poly-text-editor-tab-action:hover {
  background: #333;
  color: #fff;
}


/* Note name */

.poly-text-editor-namebar {
  height: 34px;
  flex: 0 0 34px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: #202020;
  border-bottom: 1px solid #303030;
}

.poly-text-editor-name {
  width: 100%;
  height: 25px;
  border: 0;
  outline: 0;
  background: transparent !important;
  background-color: #202020 !important;
  color: #eee;
  font-size: 13px;
  font-weight: 600;
}


/* Editor */

.poly-text-editor-main {
  min-height: 0;
  flex: 1;
  display: flex;
  background: #181818;
}

.poly-text-editor-text {
  flex: 1;
  width: 100%;
  height: 100%;
  resize: none;
  border: 0;
  outline: 0;
  padding: 12px;
  background: #181818;
  color: #ddd;
  caret-color: #fff;
  font: 13px/1.5 Consolas, "Courier New", monospace;
  tab-size: 2;
  white-space: pre-wrap;
  overflow: auto;
  pointer-events: auto !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  cursor: text !important;
  opacity: 1 !important;
}


/* Status */

.poly-text-editor-status {
  height: 25px;
  flex: 0 0 25px;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 0 10px;
  background: #222;
  border-top: 1px solid #353535;
  color: #999;
  font: 11px system-ui, sans-serif;
}


/* Resize handles */

.poly-text-editor-resize {
  position: absolute;
  z-index: 20;
}

.poly-text-editor-resize-top,
.poly-text-editor-resize-bottom {
  left: 8px;
  right: 8px;
  height: 6px;
  cursor: ns-resize;
}

.poly-text-editor-resize-top {
  top: -3px;
}

.poly-text-editor-resize-bottom {
  bottom: -3px;
}

.poly-text-editor-resize-left,
.poly-text-editor-resize-right {
  top: 8px;
  bottom: 8px;
  width: 6px;
  cursor: ew-resize;
}

.poly-text-editor-resize-left {
  left: -3px;
}

.poly-text-editor-resize-right {
  right: -3px;
}


/* Resize corners */

.poly-text-editor-resize-top-left,
.poly-text-editor-resize-top-right,
.poly-text-editor-resize-bottom-left,
.poly-text-editor-resize-bottom-right {
  width: 12px;
  height: 12px;
  z-index: 21;
}

.poly-text-editor-resize-top-left {
  top: -3px;
  left: -3px;
  cursor: nwse-resize;
}

.poly-text-editor-resize-top-right {
  top: -3px;
  right: -3px;
  cursor: nesw-resize;
}

.poly-text-editor-resize-bottom-left {
  bottom: -3px;
  left: -3px;
  cursor: nesw-resize;
}

.poly-text-editor-resize-bottom-right {
  right: -3px;
  bottom: -3px;
  cursor: nwse-resize;
}


/* Delete modal */

.poly-text-editor-modal {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .65);
}

.poly-text-editor-modal[hidden] {
  display: none;
}

.poly-text-editor-modal-box {
  width: 420px;
  max-width: calc(100vw - 30px);
  padding: 20px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #202020;
  color: #ddd;
  box-shadow: 0 15px 50px rgba(0, 0, 0, .65);
}

.poly-text-editor-modal-title {
  margin-bottom: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.poly-text-editor-modal-text {
  margin-bottom: 18px;
  color: #aaa;
  font-size: 13px;
  line-height: 1.5;
}

.poly-text-editor-modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.poly-text-editor-modal-button {
  border: 0;
  border-radius: 4px;
  padding: 8px 12px;
  background: #303030;
  color: #ddd;
  cursor: pointer;
  font-size: 12px;
}

.poly-text-editor-modal-button:hover {
  background: #3d3d3d;
}

.poly-text-editor-modal-delete {
  background: #7d3030;
}

.poly-text-editor-modal-delete:hover {
  background: #963838;
}
`;

const STORAGE_KEY = "gameNotes";

class TextNotesEditorMod extends PolyMod {
  constructor(...args) {
    super(...args);

    this.editor = null;
    this.textarea = null;
    this.nameInput = null;

    this.tabList = null;
    this.pos = null;
    this.chars = null;
    this.state = null;

    this.modal = null;

    this.notes = [];
    this.currentNote = null;
    this.deleteIndex = null;

    this.drag = null;

    this.init = (pml) => {
      pml.registerBindCategory("Text Notes Editor");

      pml.registerKeybind(
        "Toggle Text Notes Editor",
        "textnoteseditortoggle",
        "keydown",
        "F9",
        null,
        () => this.toggle(),
      );
    };

    this.postInit = () => {
      this.create();
    };
  }

  create() {
    if (this.editor) {
      return;
    }

    const style = document.createElement("style");

    style.id = "poly-text-editor-style";

    style.textContent = TEXT_EDITOR_STYLE;

    document.head.appendChild(style);

    this.loadNotes();

    const win = document.createElement("div");

    win.className = "poly-text-editor-window";

    win.hidden = true;

    /*
     * Resize handles need to exist
     * inside the window.
     */

    this.addResizeHandles(win);

    /*
     * Title bar
     */

    const titlebar = document.createElement("div");

    titlebar.className = "poly-text-editor-titlebar";

    const title = document.createElement("div");

    title.className = "poly-text-editor-title";

    title.textContent = "Game Notes";

    const closeBtn = this.button("×");

    closeBtn.className += " poly-text-editor-close";

    titlebar.append(title, closeBtn);

    /*
     * Tabs
     */

    const tabs = document.createElement("div");

    tabs.className = "poly-text-editor-tabs";

    const tabList = document.createElement("div");

    tabList.className = "poly-text-editor-tab-list";

    const actions = document.createElement("div");

    actions.className = "poly-text-editor-tab-actions";

    const importBtn = document.createElement("button");

    importBtn.className = "poly-text-editor-tab-action";

    importBtn.textContent = "↥";

    importBtn.title = "Import notes";

    const newBtn = document.createElement("button");

    newBtn.className = "poly-text-editor-tab-action";

    newBtn.textContent = "+";

    newBtn.title = "New note";

    actions.append(importBtn, newBtn);

    tabs.append(tabList, actions);

    /*
     * Note name
     */

    const namebar = document.createElement("div");

    namebar.className = "poly-text-editor-namebar";

    const nameInput = document.createElement("input");

    nameInput.className = "poly-text-editor-name";

    nameInput.type = "text";

    nameInput.placeholder = "Note name";

    namebar.append(nameInput);

    /*
     * Main editor
     */

    const main = document.createElement("div");

    main.className = "poly-text-editor-main";

    const textarea = document.createElement("textarea");

    textarea.className = "poly-text-editor-text";

    textarea.spellcheck = false;

    textarea.wrap = "off";

    textarea.readOnly = false;

    textarea.disabled = false;

    textarea.placeholder = "Write your notes here...";

    main.append(textarea);

    /*
     * Status
     */

    const status = document.createElement("div");

    status.className = "poly-text-editor-status";

    const pos = document.createElement("span");

    const chars = document.createElement("span");

    const state = document.createElement("span");

    state.textContent = "Ready";

    status.append(pos, chars, state);

    win.append(titlebar, tabs, namebar, main, status);

    document.body.appendChild(win);

    this.editor = win;

    this.textarea = textarea;

    this.nameInput = nameInput;

    this.tabList = tabList;

    this.pos = pos;

    this.chars = chars;

    this.state = state;

    /*
     * Import file input
     */

    const fileInput = document.createElement("input");

    fileInput.type = "file";

    fileInput.accept = ".json,.txt";

    fileInput.style.display = "none";

    document.body.appendChild(fileInput);

    importBtn.onclick = () => {
      fileInput.click();
    };

    fileInput.onchange = () => {
      const file = fileInput.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);

          if (!data || !Array.isArray(data.notes)) {
            throw new Error("Invalid notes file");
          }

          for (const imported of data.notes) {
            if (!imported || typeof imported !== "object") {
              continue;
            }

            this.notes.push({
              id: this.newId(),

              name: String(imported.name || "Imported Note"),

              content: String(imported.content || ""),
            });
          }

          this.saveNotes();
          this.renderTabs();

          if (this.notes.length > 0) {
            this.selectNote(this.notes.length - 1);
          }

          this.state.textContent = "Imported";
        } catch {
          /*
           * Normal .txt files become
           * a new note.
           */

          const name = file.name.replace(/\.[^/.]+$/, "");

          this.notes.push({
            id: this.newId(),

            name: name || "Imported Note",

            content: String(reader.result),
          });

          this.saveNotes();
          this.renderTabs();

          this.selectNote(this.notes.length - 1);

          this.state.textContent = "Imported text file";
        }

        fileInput.value = "";
      };

      reader.readAsText(file);
    };

    /*
     * New note
     */

    newBtn.onclick = () => {
      this.newNote();
    };

    /*
     * Close
     */

    closeBtn.onclick = () => {
      this.hide();
    };

    /*
     * Text changes
     */

    textarea.addEventListener("input", () => {
      if (this.currentNote === null) {
        return;
      }

      this.notes[this.currentNote].content = textarea.value;

      this.saveNotes();

      this.updateStatus();

      this.state.textContent = "Modified";
    });

    /*
     * Name changes
     */

    nameInput.addEventListener("input", () => {
      if (this.currentNote === null) {
        return;
      }

      const name = nameInput.value.trim();

      this.notes[this.currentNote].name = name || "Untitled";

      this.saveNotes();
      this.renderTabs();

      this.state.textContent = "Modified";
    });

    /*
     * Cursor/status updates
     */

    textarea.addEventListener("click", () => {
      this.updateStatus();
    });

    textarea.addEventListener("keyup", () => {
      this.updateStatus();
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const start = textarea.selectionStart;

        const end = textarea.selectionEnd;

        textarea.setRangeText("  ", start, end, "end");

        if (this.currentNote !== null) {
          this.notes[this.currentNote].content = textarea.value;

          this.saveNotes();
        }

        this.updateStatus();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();

        this.saveCurrent();
      }
    });

    /*
     * Dragging
     */

    this.makeDraggable(titlebar, win);

    /*
     * Delete confirmation
     */

    this.createDeleteModal();

    this.updateStatus();
    this.renderTabs();

    if (this.notes.length === 0) {
      this.newNote();
    } else {
      this.selectNote(0);
    }
  }

  loadNotes() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        this.notes = [];
        return;
      }

      const data = JSON.parse(saved);

      if (!Array.isArray(data)) {
        /*
         * Also support the old
         * single-note format if the
         * stored value is plain text.
         */

        this.notes = [
          {
            id: this.newId(),

            name: "Untitled",

            content: String(saved),
          },
        ];

        return;
      }

      this.notes = data.map((note) => ({
        id: note.id || this.newId(),

        name: String(note.name || "Untitled"),

        content: String(note.content || ""),
      }));
    } catch {
      this.notes = [];
    }
  }

  saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
  }

  newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  newNote() {
    this.notes.push({
      id: this.newId(),

      name: "Untitled",

      content: "",
    });

    this.saveNotes();

    this.renderTabs();

    this.selectNote(this.notes.length - 1);

    this.nameInput.focus();
    this.nameInput.select();
  }

  selectNote(index) {
    if (index < 0 || index >= this.notes.length) {
      return;
    }

    this.currentNote = index;

    const note = this.notes[index];

    this.nameInput.value = note.name;

    this.textarea.value = note.content;

    this.textarea.readOnly = false;

    this.textarea.disabled = false;

    this.renderTabs();
    this.updateStatus();

    this.state.textContent = "Ready";

    this.textarea.focus();
  }

  renderTabs() {
    if (!this.tabList) {
      return;
    }

    this.tabList.innerHTML = "";

    this.notes.forEach((note, index) => {
      const tab = document.createElement("div");

      tab.className = "poly-text-editor-tab";

      if (index === this.currentNote) {
        tab.classList.add("active");
      }

      const name = document.createElement("span");

      name.className = "poly-text-editor-tab-name";

      name.textContent = note.name || "Untitled";

      const download = document.createElement("button");

      download.className = "poly-text-editor-tab-download";

      download.textContent = "↓";

      download.title = "Download note";

      const remove = document.createElement("button");

      remove.className = "poly-text-editor-tab-delete";

      remove.textContent = "×";

      remove.title = "Delete note";

      tab.onclick = () => {
        this.selectNote(index);
      };

      download.onclick = (e) => {
        e.stopPropagation();

        this.downloadNote(index);
      };

      remove.onclick = (e) => {
        e.stopPropagation();

        if (e.shiftKey) {
          this.finishDelete(index);
          return;
        }

        this.confirmDelete(index);
      };

      tab.append(name, download, remove);

      this.tabList.appendChild(tab);
    });
  }

  downloadNote(index) {
    const note = this.notes[index];

    if (!note) {
      return;
    }

    const blob = new Blob([note.content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = this.safeFilename(note.name) + ".txt";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  safeFilename(name) {
    return (
      String(name || "Untitled")
        .replace(/[<>:"/\\\\|?*]/g, "_")
        .trim() || "Untitled"
    );
  }

  createDeleteModal() {
    const modal = document.createElement("div");

    modal.className = "poly-text-editor-modal";

    modal.hidden = true;

    const box = document.createElement("div");

    box.className = "poly-text-editor-modal-box";

    const title = document.createElement("div");

    title.className = "poly-text-editor-modal-title";

    title.textContent = "Delete note?";

    const text = document.createElement("div");

    text.className = "poly-text-editor-modal-text";

    text.textContent =
      "This will permanently delete this note. Would you like to download it first?";

    const buttons = document.createElement("div");

    buttons.className = "poly-text-editor-modal-buttons";

    const download = document.createElement("button");

    download.className = "poly-text-editor-modal-button";

    download.textContent = "Download & Delete";

    const continueBtn = document.createElement("button");

    continueBtn.className =
      "poly-text-editor-modal-button poly-text-editor-modal-delete";

    continueBtn.textContent = "Delete Without Downloading";

    const cancel = document.createElement("button");

    cancel.className = "poly-text-editor-modal-button";

    cancel.textContent = "Cancel";

    buttons.append(download, continueBtn, cancel);

    box.append(title, text, buttons);

    modal.appendChild(box);

    document.body.appendChild(modal);

    this.modal = modal;

    this.deleteDownloadButton = download;

    this.deleteContinueButton = continueBtn;

    this.deleteCancelButton = cancel;
  }

  confirmDelete(index) {
    if (!this.modal) {
      return;
    }

    this.deleteIndex = index;

    this.modal.hidden = false;

    this.deleteDownloadButton.onclick = () => {
      this.downloadNote(this.deleteIndex);

      this.finishDelete(this.deleteIndex);
    };

    this.deleteContinueButton.onclick = () => {
      this.finishDelete(this.deleteIndex);
    };

    this.deleteCancelButton.onclick = () => {
      this.modal.hidden = true;

      this.deleteIndex = null;
    };
  }

  finishDelete(index) {
    if (index === null || index === undefined) {
      return;
    }

    this.notes.splice(index, 1);

    this.modal.hidden = true;

    /*
     * Always keep one note.
     */

    if (this.notes.length === 0) {
      this.currentNote = null;

      this.saveNotes();

      this.newNote();

      return;
    }

    if (this.currentNote === index) {
      this.currentNote = Math.min(index, this.notes.length - 1);
    } else if (this.currentNote > index) {
      this.currentNote--;
    }

    this.saveNotes();

    this.renderTabs();

    this.selectNote(this.currentNote);

    this.state.textContent = "Deleted";

    this.deleteIndex = null;
  }

  saveCurrent() {
    if (this.currentNote === null) {
      return;
    }

    this.notes[this.currentNote].name =
      this.nameInput.value.trim() || "Untitled";

    this.notes[this.currentNote].content = this.textarea.value;

    this.saveNotes();

    this.renderTabs();

    this.state.textContent = "Saved";

    this.textarea.focus();
  }

  updateStatus() {
    if (!this.textarea) {
      return;
    }

    const before = this.textarea.value.slice(0, this.textarea.selectionStart);

    const line = before.split("\n").length;

    const lastNewline = before.lastIndexOf("\n");

    const column = before.length - lastNewline;

    this.pos.textContent = `Ln ${line}, Col ${column}`;

    this.chars.textContent = `${this.textarea.value.length} characters`;
  }

  addResizeHandles(element) {
    const directions = [
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
    ];

    directions.forEach((direction) => {
      const handle = document.createElement("div");

      handle.className = `poly-text-editor-resize poly-text-editor-resize-${direction}`;

      element.appendChild(handle);

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = element.getBoundingClientRect();

        const startX = e.clientX;

        const startY = e.clientY;

        const startLeft = rect.left;

        const startTop = rect.top;

        const startWidth = rect.width;

        const startHeight = rect.height;

        const minWidth = 520;

        const minHeight = 320;

        const move = (ev) => {
          const dx = ev.clientX - startX;

          const dy = ev.clientY - startY;

          let left = startLeft;

          let top = startTop;

          let width = startWidth;

          let height = startHeight;

          /*
           * Right
           */

          if (direction.includes("right")) {
            width = Math.max(minWidth, startWidth + dx);
          }

          /*
           * Left
           */

          if (direction.includes("left")) {
            width = Math.max(minWidth, startWidth - dx);

            if (width === minWidth) {
              left = startLeft + startWidth - minWidth;
            } else {
              left = startLeft + dx;
            }
          }

          /*
           * Bottom
           */

          if (direction.includes("bottom")) {
            height = Math.max(minHeight, startHeight + dy);
          }

          /*
           * Top
           */

          if (direction.includes("top")) {
            height = Math.max(minHeight, startHeight - dy);

            if (height === minHeight) {
              top = startTop + startHeight - minHeight;
            } else {
              top = startTop + dy;
            }
          }

          /*
           * Keep inside viewport.
           */

          if (left < 0) {
            width += left;
            left = 0;
          }

          if (top < 0) {
            height += top;
            top = 0;
          }

          width = Math.min(width, window.innerWidth - left);

          height = Math.min(height, window.innerHeight - top);

          width = Math.max(minWidth, width);

          height = Math.max(minHeight, height);

          element.style.left = `${left}px`;

          element.style.top = `${top}px`;

          element.style.width = `${width}px`;

          element.style.height = `${height}px`;
        };

        const up = () => {
          document.removeEventListener("mousemove", move);

          document.removeEventListener("mouseup", up);
        };

        document.addEventListener("mousemove", move);

        document.addEventListener("mouseup", up);
      });
    });
  }

  makeDraggable(handle, element) {
    handle.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) {
        return;
      }

      /*
       * Do not start dragging if
       * the mouse is on a resize
       * handle.
       */

      if (e.target.closest(".poly-text-editor-resize")) {
        return;
      }

      const rect = element.getBoundingClientRect();

      this.drag = {
        x: e.clientX,
        y: e.clientY,
        left: rect.left,
        top: rect.top,
      };

      const move = (ev) => {
        if (!this.drag) {
          return;
        }

        let left = this.drag.left + ev.clientX - this.drag.x;

        let top = this.drag.top + ev.clientY - this.drag.y;

        left = Math.max(
          0,
          Math.min(left, window.innerWidth - element.offsetWidth),
        );

        top = Math.max(
          0,
          Math.min(top, window.innerHeight - element.offsetHeight),
        );

        element.style.left = `${left}px`;

        element.style.top = `${top}px`;
      };

      const up = () => {
        this.drag = null;

        document.removeEventListener("mousemove", move);

        document.removeEventListener("mouseup", up);
      };

      document.addEventListener("mousemove", move);

      document.addEventListener("mouseup", up);
    });
  }

  show() {
    if (!this.editor) {
      this.create();
    }

    this.textarea.readOnly = false;

    this.textarea.disabled = false;

    this.editor.hidden = false;

    this.updateStatus();

    this.textarea.focus();
  }

  hide() {
    if (this.editor) {
      this.editor.hidden = true;
    }
  }

  toggle() {
    if (!this.editor) {
      this.create();
    }

    if (this.editor.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }
}

const polyMod = new TextNotesEditorMod();

export { polyMod };
