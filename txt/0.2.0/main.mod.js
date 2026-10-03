import {
  PolyMod
} from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.3/PolyTypes.js";


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

  box-shadow:
    0 14px 45px rgba(0, 0, 0, .55);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  resize: both;
}


.poly-text-editor-window[hidden] {
  display: none;
}


.poly-text-editor-window,
.poly-text-editor-window * {
  box-sizing: border-box;
}


/* ---------------------------------------------------------
   TITLE BAR
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   TABS
   --------------------------------------------------------- */

.poly-text-editor-tabs {
  display: flex;

  height: 32px;
  flex: 0 0 32px;

  background: #1d1d1d;

  border-bottom: 1px solid #333;
}


.poly-text-editor-tab {
  border: 0;

  border-right: 1px solid #303030;

  background: #1d1d1d;
  color: #aaa;

  padding: 0 14px;

  cursor: pointer;
}


.poly-text-editor-tab.active {
  background: #181818;
  color: #fff;

  box-shadow:
    inset 0 -2px #aaa;
}


/* ---------------------------------------------------------
   MAIN AREA
   --------------------------------------------------------- */

.poly-text-editor-main {
  min-height: 0;

  flex: 1;

  display: flex;

  background: #181818;
}


/* ---------------------------------------------------------
   MARKDOWN EDITOR
   --------------------------------------------------------- */

.poly-text-editor-text {
  flex: 1;

  width: 100%;

  resize: none;

  border: 0;
  outline: 0;

  padding: 12px;

  background: #181818;
  color: #ddd;

  caret-color: #fff;

  font:
    13px/1.5
    Consolas,
    "Courier New",
    monospace;

  tab-size: 2;

  white-space: pre-wrap;

  overflow: auto;

  pointer-events: auto !important;

  user-select: text !important;
  -webkit-user-select: text !important;

  cursor: text !important;

  opacity: 1 !important;
}


/* ---------------------------------------------------------
   MARKDOWN PREVIEW
   --------------------------------------------------------- */

.poly-text-editor-preview {
  flex: 1;

  width: 100%;

  padding: 18px;

  overflow: auto;

  background: #181818;
  color: #ddd;

  font:
    14px/1.6
    system-ui,
    sans-serif;
}


.poly-text-editor-preview h1,
.poly-text-editor-preview h2,
.poly-text-editor-preview h3,
.poly-text-editor-preview h4,
.poly-text-editor-preview h5,
.poly-text-editor-preview h6 {
  color: #eee;

  margin-top: 1em;
}


.poly-text-editor-preview h1 {
  border-bottom: 1px solid #333;

  padding-bottom: 8px;
}


.poly-text-editor-preview code {
  background: #252525;

  border-radius: 4px;

  padding: 2px 5px;

  font-family:
    Consolas,
    "Courier New",
    monospace;
}


.poly-text-editor-preview pre {
  background: #101010;

  border: 1px solid #333;

  border-radius: 6px;

  padding: 12px;

  overflow-x: auto;
}


.poly-text-editor-preview pre code {
  background: transparent;

  padding: 0;
}


.poly-text-editor-preview blockquote {
  margin-left: 0;

  padding-left: 12px;

  border-left: 3px solid #555;

  color: #aaa;
}


.poly-text-editor-preview a {
  color: #7da7ff;
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


/* ---------------------------------------------------------
   STATUS BAR
   --------------------------------------------------------- */

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

  font:
    11px
    system-ui,
    sans-serif;
}
`;


class TextNotesEditorMod extends PolyMod {

  constructor(...args) {
    super(...args);

    this.editor = null;

    this.textarea = null;

    this.preview = null;

    this.pos = null;

    this.chars = null;

    this.state = null;

    this.drag = null;

    this.markedLoaded = false;


    /* -------------------------------------------------------
       PML INITIALIZATION
       ------------------------------------------------------- */

    this.init = (pml) => {

      pml.registerBindCategory(
        "Text Notes Editor"
      );


      pml.registerKeybind(
        "Toggle Text Notes Editor",
        "textnoteseditortoggle",
        "keydown",
        "F9",
        null,
        () => this.toggle()
      );

    };


    /* -------------------------------------------------------
       AFTER PML INITIALIZATION
       ------------------------------------------------------- */

    this.postInit = () => {

      this.create();

    };

  }


  /* =========================================================
     CREATE EDITOR
     ========================================================= */

  create() {

    if (this.editor) {
      return;
    }


    /* -------------------------------------------------------
       STYLE
       ------------------------------------------------------- */

    const style =
      document.createElement("style");

    style.id =
      "poly-text-editor-style";

    style.textContent =
      TEXT_EDITOR_STYLE;

    document.head.appendChild(
      style
    );


    /* -------------------------------------------------------
       WINDOW
       ------------------------------------------------------- */

    const win =
      document.createElement("div");

    win.className =
      "poly-text-editor-window";

    win.hidden = true;


    /* -------------------------------------------------------
       TITLE BAR
       ------------------------------------------------------- */

    const titlebar =
      document.createElement("div");

    titlebar.className =
      "poly-text-editor-titlebar";


    const title =
      document.createElement("div");

    title.className =
      "poly-text-editor-title";

    title.textContent =
      "Game Notes";


    const newBtn =
      this.button("New");


    const saveBtn =
      this.button("Save");


    const closeBtn =
      this.button("×");

    closeBtn.className +=
      " poly-text-editor-close";


    titlebar.append(
      title,
      newBtn,
      saveBtn,
      closeBtn
    );


    /* -------------------------------------------------------
       TABS
       ------------------------------------------------------- */

    const tabs =
      document.createElement("div");

    tabs.className =
      "poly-text-editor-tabs";


    const editTab =
      document.createElement("button");

    editTab.className =
      "poly-text-editor-tab active";

    editTab.textContent =
      "Markdown";


    const previewTab =
      document.createElement("button");

    previewTab.className =
      "poly-text-editor-tab";

    previewTab.textContent =
      "Preview";


    tabs.append(
      editTab,
      previewTab
    );


    /* -------------------------------------------------------
       MAIN
       ------------------------------------------------------- */

    const main =
      document.createElement("div");

    main.className =
      "poly-text-editor-main";


    /* -------------------------------------------------------
       TEXTAREA
       ------------------------------------------------------- */

    const textarea =
      document.createElement("textarea");

    textarea.className =
      "poly-text-editor-text";

    textarea.spellcheck = false;

    textarea.wrap = "off";

    textarea.readOnly = false;

    textarea.disabled = false;


    textarea.placeholder =
`# Game Notes

Write your notes here.

## Example

- Quest
- Location
- Item
- NPC

**Important**

*Something useful*

\`code\`

> A quote

[Link](https://example.com)
`;


    textarea.value =
      localStorage.getItem(
        "gameNotes"
      ) || "";


    /* -------------------------------------------------------
       PREVIEW
       ------------------------------------------------------- */

    const preview =
      document.createElement("div");

    preview.className =
      "poly-text-editor-preview";

    preview.hidden = true;


    /* -------------------------------------------------------
       STATUS
       ------------------------------------------------------- */

    const status =
      document.createElement("div");

    status.className =
      "poly-text-editor-status";


    const pos =
      document.createElement("span");


    const chars =
      document.createElement("span");


    const state =
      document.createElement("span");

    state.textContent =
      "Ready";


    status.append(
      pos,
      chars,
      state
    );


    /* -------------------------------------------------------
       ASSEMBLE
       ------------------------------------------------------- */

    main.append(
      textarea,
      preview
    );


    win.append(
      titlebar,
      tabs,
      main,
      status
    );


    document.body.appendChild(
      win
    );


    /* -------------------------------------------------------
       STORE REFERENCES
       ------------------------------------------------------- */

    this.editor = win;

    this.textarea = textarea;

    this.preview = preview;

    this.pos = pos;

    this.chars = chars;

    this.state = state;


    /* =======================================================
       UPDATE
       ======================================================= */

    const update = () => {

      this.updateStatus();

      this.state.textContent =
        "Modified";

    };


    textarea.addEventListener(
      "input",
      update
    );


    textarea.addEventListener(
      "click",
      () => this.updateStatus()
    );


    textarea.addEventListener(
      "keyup",
      () => this.updateStatus()
    );


    textarea.addEventListener(
      "scroll",
      () => this.updateStatus()
    );


    /* =======================================================
       TAB KEY
       ======================================================= */

    textarea.addEventListener(
      "keydown",
      (e) => {

        if (e.key === "Tab") {

          e.preventDefault();


          const start =
            textarea.selectionStart;


          const end =
            textarea.selectionEnd;


          textarea.setRangeText(
            "  ",
            start,
            end,
            "end"
          );


          update();

        }


        /* ---------------------------------------------------
           CTRL+S / CMD+S
           --------------------------------------------------- */

        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "s"
        ) {

          e.preventDefault();

          this.save();

        }

      }
    );


    /* =======================================================
       NEW
       ======================================================= */

    newBtn.onclick = () => {

      textarea.readOnly = false;

      textarea.disabled = false;


      textarea.value = "";


      localStorage.setItem(
        "gameNotes",
        ""
      );


      this.state.textContent =
        "New notes";


      this.updateStatus();


      textarea.focus();

    };


    /* =======================================================
       SAVE
       ======================================================= */

    saveBtn.onclick = () => {

      this.save();

    };


    /* =======================================================
       CLOSE
       ======================================================= */

    closeBtn.onclick = () => {

      this.hide();

    };


    /* =======================================================
       EDIT TAB
       ======================================================= */

    editTab.onclick = () => {

      editTab.classList.add(
        "active"
      );

      previewTab.classList.remove(
        "active"
      );


      textarea.hidden = false;

      preview.hidden = true;


      textarea.readOnly = false;

      textarea.disabled = false;


      textarea.focus();


      this.state.textContent =
        "Editing";

    };


    /* =======================================================
       PREVIEW TAB
       ======================================================= */

    previewTab.onclick = async () => {

      editTab.classList.remove(
        "active"
      );

      previewTab.classList.add(
        "active"
      );


      textarea.hidden = true;

      preview.hidden = false;


      this.state.textContent =
        "Rendering preview";


      await this.renderMarkdown();


      this.state.textContent =
        "Preview";

    };


    /* =======================================================
       DRAGGING
       ======================================================= */

    this.makeDraggable(
      titlebar,
      win
    );


    /* =======================================================
       INITIAL STATUS
       ======================================================= */

    this.updateStatus();

  }


  /* =========================================================
     BUTTON
     ========================================================= */

  button(text) {

    const button =
      document.createElement(
        "button"
      );


    button.className =
      "poly-text-editor-button";


    button.textContent =
      text;


    return button;

  }


  /* =========================================================
     DRAGGING
     ========================================================= */

  makeDraggable(
    handle,
    element
  ) {

    handle.addEventListener(
      "mousedown",
      (e) => {

        if (
          e.target.closest(
            "button"
          )
        ) {
          return;
        }


        const rect =
          element.getBoundingClientRect();


        this.drag = {

          x: e.clientX,

          y: e.clientY,

          left: rect.left,

          top: rect.top

        };


        const move =
          (ev) => {

            if (!this.drag) {
              return;
            }


            element.style.left =
              `${Math.max(
                0,
                this.drag.left +
                ev.clientX -
                this.drag.x
              )}px`;


            element.style.top =
              `${Math.max(
                0,
                this.drag.top +
                ev.clientY -
                this.drag.y
              )}px`;

          };


        const up =
          () => {

            this.drag = null;


            document.removeEventListener(
              "mousemove",
              move
            );


            document.removeEventListener(
              "mouseup",
              up
            );

          };


        document.addEventListener(
          "mousemove",
          move
        );


        document.addEventListener(
          "mouseup",
          up
        );

      }
    );

  }


  /* =========================================================
     STATUS
     ========================================================= */

  updateStatus() {

    if (!this.textarea) {
      return;
    }


    const before =
      this.textarea.value.slice(
        0,
        this.textarea.selectionStart
      );


    const line =
      before.split("\n").length;


    const lastNewline =
      before.lastIndexOf("\n");


    const column =
      before.length -
      lastNewline;


    this.pos.textContent =
      `Ln ${line}, Col ${column}`;


    this.chars.textContent =
      `${this.textarea.value.length} characters`;

  }


  /* =========================================================
     SAVE
     ========================================================= */

  save() {

    if (!this.textarea) {
      return;
    }


    this.textarea.readOnly =
      false;

    this.textarea.disabled =
      false;


    const notes =
      this.textarea.value;


    localStorage.setItem(
      "gameNotes",
      notes
    );


    this.state.textContent =
      "Saved";


    this.textarea.focus();

  }


  /* =========================================================
     MARKED.JS
     ========================================================= */

  loadMarked() {

    if (
      this.markedLoaded ||
      window.marked
    ) {

      this.markedLoaded = true;

      return Promise.resolve(
        true
      );

    }


    return new Promise(
      (resolve) => {

        const existing =
          document.getElementById(
            "poly-text-editor-marked"
          );


        if (existing) {

          existing.addEventListener(
            "load",
            () => {

              this.markedLoaded =
                true;

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
          document.createElement(
            "script"
          );


        script.id =
          "poly-text-editor-marked";


        script.src =
          "https://cdn.jsdelivr.net/npm/marked/marked.min.js";


        script.onload =
          () => {

            this.markedLoaded =
              true;

            resolve(true);

          };


        script.onerror =
          () => {

            resolve(false);

          };


        document.head.appendChild(
          script
        );

      }
    );

  }


  /* =========================================================
     MARKDOWN PREVIEW
     ========================================================= */

  async renderMarkdown() {

    if (!this.preview) {
      return;
    }


    const loaded =
      await this.loadMarked();


    if (
      !loaded ||
      !window.marked
    ) {

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
     * Make Markdown links open
     * outside the game page.
     */

    this.preview
      .querySelectorAll("a")
      .forEach(
        (link) => {

          link.target =
            "_blank";

          link.rel =
            "noopener noreferrer";

        }
      );

  }


  /* =========================================================
     SHOW
     ========================================================= */

  show() {

    if (!this.editor) {

      this.create();

    }


    this.textarea.readOnly =
      false;

    this.textarea.disabled =
      false;


    this.editor.hidden =
      false;


    this.updateStatus();


    this.textarea.focus();

  }


  /* =========================================================
     HIDE
     ========================================================= */

  hide() {

    if (this.editor) {

      this.editor.hidden =
        true;

    }

  }


  /* =========================================================
     TOGGLE
     ========================================================= */

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


/* =========================================================
   POLYMOD EXPORT

   This matches the structure of your working CSS editor.
   ========================================================= */

const polyMod =
  new TextNotesEditorMod();


export {
  polyMod
};
