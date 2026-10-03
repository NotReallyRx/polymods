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
  box-shadow: 0 14px 45px rgba(0, 0, 0, .55);
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  resize: both;
}

.poly-text-editor-window[hidden] {
  display: none;
}

.poly-text-editor-window,
.poly-text-editor-window * {
  box-sizing: border-box;
}

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

.poly-text-editor-rendered {
  display: none;
  flex: 1;
  width: 100%;
  padding: 18px;
  overflow: auto;
  background: #181818;
  color: #ddd;
  font: 14px/1.6 system-ui, sans-serif;
}

.poly-text-editor-rendered.visible {
  display: block;
}

.poly-text-editor-rendered h1,
.poly-text-editor-rendered h2,
.poly-text-editor-rendered h3,
.poly-text-editor-rendered h4,
.poly-text-editor-rendered h5,
.poly-text-editor-rendered h6 {
  color: #eee;
  margin-top: 1em;
}

.poly-text-editor-rendered h1 {
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}

.poly-text-editor-rendered code {
  background: #252525;
  border-radius: 4px;
  padding: 2px 5px;
  font-family: Consolas, "Courier New", monospace;
}

.poly-text-editor-rendered pre {
  background: #101010;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
}

.poly-text-editor-rendered pre code {
  background: transparent;
  padding: 0;
}

.poly-text-editor-rendered blockquote {
  margin-left: 0;
  padding-left: 12px;
  border-left: 3px solid #555;
  color: #aaa;
}

.poly-text-editor-rendered a {
  color: #7da7ff;
}

.poly-text-editor-rendered img {
  max-width: 100%;
}

.poly-text-editor-rendered table {
  border-collapse: collapse;
  width: 100%;
}

.poly-text-editor-rendered th,
.poly-text-editor-rendered td {
  border: 1px solid #444;
  padding: 6px 10px;
  text-align: left;
}

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
`;


class TextNotesEditorMod extends PolyMod {
  constructor(...args) {
    super(...args);

    this.editor = null;
    this.textarea = null;
    this.rendered = null;

    this.pos = null;
    this.chars = null;
    this.state = null;

    this.drag = null;
    this.markedLoaded = false;

    this.editingLine = null;
    this.renderTimer = null;

    this.init = (pml) => {
      pml.registerBindCategory("Text Notes Editor");

      pml.registerKeybind(
        "Toggle Text Notes Editor",
        "textnoteseditortoggle",
        "keydown",
        "F9",
        null,
        () => this.toggle()
      );
    };

    this.postInit = () => {
      this.create();
    };
  }


  create() {
    if (this.editor) return;

    const style = document.createElement("style");

    style.id = "poly-text-editor-style";
    style.textContent = TEXT_EDITOR_STYLE;

    document.head.appendChild(style);


    const win = document.createElement("div");

    win.className = "poly-text-editor-window";
    win.hidden = true;


    const titlebar = document.createElement("div");

    titlebar.className =
      "poly-text-editor-titlebar";


    const title = document.createElement("div");

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


    const main =
      document.createElement("div");

    main.className =
      "poly-text-editor-main";


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
      localStorage.getItem("gameNotes") || "";


    const rendered =
      document.createElement("div");

    rendered.className =
      "poly-text-editor-rendered";


    main.append(
      textarea,
      rendered
    );


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


    win.append(
      titlebar,
      main,
      status
    );

    document.body.appendChild(win);


    this.editor = win;
    this.textarea = textarea;
    this.rendered = rendered;

    this.pos = pos;
    this.chars = chars;
    this.state = state;


    textarea.addEventListener(
      "input",
      () => {
        this.updateStatus();

        this.state.textContent =
          "Modified";

        this.scheduleRender();
      }
    );


    textarea.addEventListener(
      "click",
      () => {
        this.updateStatus();
        this.checkEditingLine();
      }
    );


    textarea.addEventListener(
      "keyup",
      () => {
        this.updateStatus();
        this.checkEditingLine();
      }
    );


    textarea.addEventListener(
      "select",
      () => {
        this.updateStatus();
      }
    );


    textarea.addEventListener(
      "blur",
      () => {
        this.editingLine = null;
        this.renderMarkdown();
      }
    );


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

          this.updateStatus();
          this.checkEditingLine();
          this.scheduleRender();
        }


        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "s"
        ) {
          e.preventDefault();

          this.save();
        }
      }
    );


    newBtn.onclick = () => {

      textarea.readOnly = false;
      textarea.disabled = false;

      textarea.value = "";

      localStorage.setItem(
        "gameNotes",
        ""
      );

      this.editingLine = null;

      this.state.textContent =
        "New notes";

      this.updateStatus();
      this.renderMarkdown();

      textarea.focus();
    };


    saveBtn.onclick = () => {
      this.save();
    };


    closeBtn.onclick = () => {
      this.hide();
    };


    this.makeDraggable(
      titlebar,
      win
    );


    this.updateStatus();
    this.renderMarkdown();
  }


  button(text) {
    const button =
      document.createElement("button");

    button.className =
      "poly-text-editor-button";

    button.textContent =
      text;

    return button;
  }


  makeDraggable(handle, element) {

    handle.addEventListener(
      "mousedown",
      (e) => {

        if (
          e.target.closest("button")
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


        const move = (ev) => {

          if (!this.drag) return;


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


        const up = () => {

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


  updateStatus() {

    if (!this.textarea) return;


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


  checkEditingLine() {

    if (!this.textarea) return;


    const value =
      this.textarea.value;


    const cursor =
      this.textarea.selectionStart;


    const lineStart =
      value.lastIndexOf(
        "\n",
        cursor - 1
      ) + 1;


    const lineEndIndex =
      value.indexOf(
        "\n",
        cursor
      );


    const lineEnd =
      lineEndIndex === -1
        ? value.length
        : lineEndIndex;


    const currentLine =
      value.slice(
        lineStart,
        lineEnd
      );


    this.editingLine = {
      start: lineStart,
      end: lineEnd,
      text: currentLine
    };
  }


  scheduleRender() {

    clearTimeout(
      this.renderTimer
    );


    /*
     * Wait until the user has stopped
     * typing before rendering.
     */
    this.renderTimer =
      setTimeout(
        () => {
          this.renderMarkdown();
        },
        500
      );
  }


  async renderMarkdown() {

    if (!this.textarea || !this.rendered) {
      return;
    }


    const value =
      this.textarea.value;


    /*
     * Do not render the line the user
     * is currently editing.
     */
    let output = value;


    if (this.editingLine) {

      const before =
        value.slice(
          0,
          this.editingLine.start
        );


      const after =
        value.slice(
          this.editingLine.end
        );


      output =
        before +
        this.editingLine.text +
        after;
    }


    const loaded =
      await this.loadMarked();


    if (
      !loaded ||
      !window.marked
    ) {
      this.rendered.textContent =
        output;

      return;
    }


    this.rendered.innerHTML =
      window.marked.parse(
        output,
        {
          gfm: true,
          breaks: true
        }
      );


    this.rendered
      .querySelectorAll("a")
      .forEach((link) => {

        link.target =
          "_blank";

        link.rel =
          "noopener noreferrer";
      });
  }


  loadMarked() {

    if (
      this.markedLoaded ||
      window.marked
    ) {
      this.markedLoaded = true;

      return Promise.resolve(true);
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
          document.createElement(
            "script"
          );


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


        document.head.appendChild(
          script
        );
      }
    );
  }


  save() {

    if (!this.textarea) return;


    this.textarea.readOnly = false;
    this.textarea.disabled = false;


    localStorage.setItem(
      "gameNotes",
      this.textarea.value
    );


    this.state.textContent =
      "Saved";


    this.renderMarkdown();


    this.textarea.focus();
  }


  show() {

    if (!this.editor) {
      this.create();
    }


    this.textarea.readOnly = false;
    this.textarea.disabled = false;


    this.editor.hidden = false;


    this.updateStatus();
    this.checkEditingLine();


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


const polyMod =
  new TextNotesEditorMod();


export {
  polyMod
};

