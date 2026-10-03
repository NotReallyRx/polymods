import { PolyMod } from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.3/PolyTypes.js";

const POLY_TEXT_EDITOR_STYLE = `
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

  background: #111;
  color: #eee;

  border: 1px solid #444;
  border-radius: 8px;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.65);

  z-index: 2147483646;

  resize: both;
  overflow: hidden;

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

.poly-text-editor-hidden {
  display: none !important;
}

.poly-text-editor-titlebar {
  height: 42px;
  min-height: 42px;

  display: flex;
  align-items: center;

  padding: 0 10px;

  background: #181818;
  border-bottom: 1px solid #333;

  cursor: move;

  user-select: none;
}

.poly-text-editor-title {
  font-size: 14px;
  font-weight: 600;

  flex: 1;

  padding-left: 4px;
}

.poly-text-editor-actions {
  display: flex;
  gap: 6px;
}

.poly-text-editor-button {
  border: 1px solid #444;
  background: #242424;
  color: #eee;

  border-radius: 5px;

  padding: 5px 10px;

  font-size: 12px;

  cursor: pointer;
}

.poly-text-editor-button:hover {
  background: #333;
}

.poly-text-editor-button:active {
  background: #444;
}

.poly-text-editor-tabs {
  height: 34px;
  min-height: 34px;

  display: flex;

  background: #151515;
  border-bottom: 1px solid #333;
}

.poly-text-editor-tab {
  border: none;
  border-right: 1px solid #292929;

  background: transparent;
  color: #aaa;

  padding: 0 14px;

  cursor: pointer;

  font-size: 12px;
}

.poly-text-editor-tab:hover {
  background: #222;
  color: #eee;
}

.poly-text-editor-tab-active {
  background: #252525;
  color: #fff;
}

.poly-text-editor-content {
  flex: 1;

  min-height: 0;

  display: flex;

  background: #0d0d0d;
}

.poly-text-editor-edit-area {
  width: 50%;
  height: 100%;

  display: flex;

  border-right: 1px solid #333;
}

.poly-text-editor-textarea {
  flex: 1;

  width: 100%;
  height: 100%;

  box-sizing: border-box;

  resize: none;

  border: none;
  outline: none;

  background: #0d0d0d;
  color: #eee;

  padding: 14px;

  font-family:
    "JetBrains Mono",
    "Fira Code",
    Consolas,
    monospace;

  font-size: 13px;
  line-height: 1.55;

  tab-size: 2;

  pointer-events: auto !important;
  user-select: text !important;
  -webkit-user-select: text !important;

  cursor: text !important;

  opacity: 1 !important;
}

.poly-text-editor-preview {
  width: 50%;
  height: 100%;

  box-sizing: border-box;

  overflow: auto;

  padding: 20px;

  background: #111;
  color: #ddd;

  line-height: 1.6;
}

.poly-text-editor-preview h1,
.poly-text-editor-preview h2,
.poly-text-editor-preview h3,
.poly-text-editor-preview h4,
.poly-text-editor-preview h5,
.poly-text-editor-preview h6 {
  color: #fff;
}

.poly-text-editor-preview code {
  padding: 2px 5px;

  background: #222;

  border-radius: 4px;

  font-family: monospace;
}

.poly-text-editor-preview pre {
  padding: 12px;

  overflow-x: auto;

  background: #181818;

  border: 1px solid #333;
  border-radius: 6px;
}

.poly-text-editor-preview pre code {
  padding: 0;

  background: transparent;
}

.poly-text-editor-preview blockquote {
  margin-left: 0;

  padding-left: 12px;

  border-left: 3px solid #555;

  color: #aaa;
}

.poly-text-editor-preview img {
  max-width: 100%;
}

.poly-text-editor-preview table {
  border-collapse: collapse;

  width: 100%;
}

.poly-text-editor-preview th,
.poly-text-editor-preview td {
  border: 1px solid #444;

  padding: 6px 10px;

  text-align: left;
}

.poly-text-editor-preview a {
  color: #6ea8fe;
}

.poly-text-editor-statusbar {
  height: 26px;
  min-height: 26px;

  display: flex;
  align-items: center;

  padding: 0 10px;

  background: #181818;

  border-top: 1px solid #333;

  color: #888;

  font-size: 11px;
}
`;

class PolyTextEditor {
  constructor() {
    this.window = null;
    this.textarea = null;
    this.preview = null;
    this.status = null;

    this.currentTab = "edit";

    this.storageKey = "gameNotes";

    this.markedLoaded = false;

    this.dragging = false;

    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    this.injectStyle();
    this.createWindow();

    this.loadNotes();
    this.setupKeyboard();
  }

  injectStyle() {
    if (document.getElementById("poly-text-editor-style")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "poly-text-editor-style";
    style.textContent = POLY_TEXT_EDITOR_STYLE;

    document.head.appendChild(style);
  }

  createWindow() {
    if (document.getElementById("poly-text-editor-window")) {
      return;
    }

    this.window = document.createElement("div");

    this.window.id = "poly-text-editor-window";
    this.window.className = "poly-text-editor-window poly-text-editor-hidden";

    this.window.innerHTML = `
      <div class="poly-text-editor-titlebar">
        <div class="poly-text-editor-title">
          Game Notes
        </div>

        <div class="poly-text-editor-actions">
          <button
            id="poly-text-editor-new"
            class="poly-text-editor-button"
          >
            New
          </button>

          <button
            id="poly-text-editor-save"
            class="poly-text-editor-button"
          >
            Save
          </button>

          <button
            id="poly-text-editor-close"
            class="poly-text-editor-button"
          >
            ×
          </button>
        </div>
      </div>

      <div class="poly-text-editor-tabs">
        <button
          id="poly-text-editor-edit-tab"
          class="poly-text-editor-tab poly-text-editor-tab-active"
        >
          Markdown
        </button>

        <button
          id="poly-text-editor-preview-tab"
          class="poly-text-editor-tab"
        >
          Preview
        </button>
      </div>

      <div class="poly-text-editor-content">

        <div
          id="poly-text-editor-edit-area"
          class="poly-text-editor-edit-area"
        >
          <textarea
            id="poly-text-editor-textarea"
            class="poly-text-editor-textarea"
            spellcheck="false"
            placeholder="# Game Notes

Write your notes here...

## Example

- Item
- Quest
- Location
- Important information

**Bold text**
*Italic text*
` + "`code`" + `
"
          ></textarea>
        </div>

        <div
          id="poly-text-editor-preview"
          class="poly-text-editor-preview"
          style="display:none;"
        ></div>

      </div>

      <div
        id="poly-text-editor-statusbar"
        class="poly-text-editor-statusbar"
      >
        F9 — Toggle Notes
      </div>
    `;

    document.body.appendChild(this.window);

    this.textarea = document.getElementById(
      "poly-text-editor-textarea"
    );

    this.preview = document.getElementById(
      "poly-text-editor-preview"
    );

    this.status = document.getElementById(
      "poly-text-editor-statusbar"
    );

    document
      .getElementById("poly-text-editor-new")
      .addEventListener("click", () => {
        this.newNotes();
      });

    document
      .getElementById("poly-text-editor-save")
      .addEventListener("click", () => {
        this.saveNotes();
      });

    document
      .getElementById("poly-text-editor-close")
      .addEventListener("click", () => {
        this.hide();
      });

    document
      .getElementById("poly-text-editor-edit-tab")
      .addEventListener("click", () => {
        this.showEdit();
      });

    document
      .getElementById("poly-text-editor-preview-tab")
      .addEventListener("click", () => {
        this.showPreview();
      });

    this.setupDragging();

    this.textarea.addEventListener("input", () => {
      if (this.currentTab === "preview") {
        this.renderMarkdown();
      }

      this.updateStatus("Unsaved changes");
    });
  }

  setupKeyboard() {
    document.addEventListener("keydown", (event) => {
      /*
       * F9 ONLY controls the text editor.
       *
       * This does not use the CSS editor's F8 key.
       */
      if (event.key === "F9") {
        event.preventDefault();

        this.toggle();

        return;
      }

      /*
       * Save text notes with Ctrl+S / Cmd+S
       * only while the text editor is open.
       */
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "s"
      ) {
        if (!this.isVisible()) {
          return;
        }

        event.preventDefault();

        this.saveNotes();
      }
    });
  }

  setupDragging() {
    const titlebar = this.window.querySelector(
      ".poly-text-editor-titlebar"
    );

    titlebar.addEventListener("mousedown", (event) => {
      /*
       * Don't start dragging when clicking buttons.
       */
      if (
        event.target.closest(
          ".poly-text-editor-button"
        )
      ) {
        return;
      }

      this.dragging = true;

      const rect = this.window.getBoundingClientRect();

      this.dragOffsetX =
        event.clientX - rect.left;

      this.dragOffsetY =
        event.clientY - rect.top;

      event.preventDefault();
    });

    document.addEventListener("mousemove", (event) => {
      if (!this.dragging) {
        return;
      }

      this.window.style.left =
        `${event.clientX - this.dragOffsetX}px`;

      this.window.style.top =
        `${event.clientY - this.dragOffsetY}px`;
    });

    document.addEventListener("mouseup", () => {
      this.dragging = false;
    });
  }

  loadNotes() {
    const saved =
      localStorage.getItem(this.storageKey);

    if (saved !== null) {
      this.textarea.value = saved;
    }
  }

  saveNotes() {
    localStorage.setItem(
      this.storageKey,
      this.textarea.value
    );

    this.updateStatus(
      `Saved ${new Date().toLocaleTimeString()}`
    );

    this.renderMarkdown();
  }

  newNotes() {
    this.textarea.value = "";

    localStorage.removeItem(
      this.storageKey
    );

    this.renderMarkdown();

    this.updateStatus("New notes");
  }

  async loadMarkdown() {
    if (this.markedLoaded) {
      return true;
    }

    if (window.marked) {
      this.markedLoaded = true;
      return true;
    }

    return new Promise((resolve) => {
      const existing =
        document.getElementById(
          "poly-text-editor-marked"
        );

      if (existing) {
        existing.addEventListener(
          "load",
          () => {
            this.markedLoaded = true;
            resolve(true);
          }
        );

        existing.addEventListener(
          "error",
          () => {
            resolve(false);
          }
        );

        return;
      }

      const script =
        document.createElement("script");

      script.id =
        "poly-text-editor-marked";

      script.src =
        "https://cdn.jsdelivr.net/npm/marked/marked.min.js";

      script.onload = () => {
        this.markedLoaded = true;
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  async renderMarkdown() {
    if (!this.preview) {
      return;
    }

    const loaded =
      await this.loadMarkdown();

    if (!loaded || !window.marked) {
      this.preview.textContent =
        this.textarea.value;

      return;
    }

    this.preview.innerHTML =
      window.marked.parse(
        this.textarea.value,
        {
          gfm: true,
          breaks: true
        }
      );

    /*
     * Open Markdown links in a new tab.
     */
    this.preview
      .querySelectorAll("a")
      .forEach((link) => {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      });
  }

  showEdit() {
    this.currentTab = "edit";

    document.getElementById(
      "poly-text-editor-edit-area"
    ).style.display = "flex";

    this.preview.style.display = "none";

    document.getElementById(
      "poly-text-editor-edit-tab"
    ).classList.add(
      "poly-text-editor-tab-active"
    );

    document.getElementById(
      "poly-text-editor-preview-tab"
    ).classList.remove(
      "poly-text-editor-tab-active"
    );

    this.textarea.readOnly = false;
    this.textarea.disabled = false;

    this.updateStatus(
      "Editing Markdown"
    );
  }

  async showPreview() {
    this.currentTab = "preview";

    document.getElementById(
      "poly-text-editor-edit-area"
    ).style.display = "none";

    this.preview.style.display = "block";

    document.getElementById(
      "poly-text-editor-edit-tab"
    ).classList.remove(
      "poly-text-editor-tab-active"
    );

    document.getElementById(
      "poly-text-editor-preview-tab"
    ).classList.add(
      "poly-text-editor-tab-active"
    );

    await this.renderMarkdown();

    this.updateStatus(
      "Markdown Preview"
    );
  }

  updateStatus(text) {
    if (this.status) {
      this.status.textContent = text;
    }
  }

  isVisible() {
    return !this.window.classList.contains(
      "poly-text-editor-hidden"
    );
  }

  show() {
    this.window.classList.remove(
      "poly-text-editor-hidden"
    );

    this.textarea.readOnly = false;
    this.textarea.disabled = false;

    this.textarea.focus();

    this.updateStatus(
      "F9 — Toggle Notes"
    );
  }

  hide() {
    this.window.classList.add(
      "poly-text-editor-hidden"
    );
  }

  toggle() {
    if (this.isVisible()) {
      this.hide();
    } else {
      this.show();
    }
  }
}



if (!window.__polyTextEditor) {
  window.__polyTextEditor =
    new PolyTextEditor();
}
