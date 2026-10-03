import { PolyMod } from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.3/PolyTypes.js";

const STYLE = `
.mod-editor-window {
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

  z-index: 2147483647;

  background: #181818;
  color: #ddd;

  border: 1px solid #3b3b3b;
  border-radius: 8px;

  box-shadow: 0 14px 45px rgba(0, 0, 0, .55);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;

  resize: both;
}

.mod-editor-window[hidden] {
  display: none;
}

.mod-editor-window,
.mod-editor-window * {
  box-sizing: border-box;
}

.mod-editor-titlebar {
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

.mod-editor-title {
  flex: 1;

  font-size: 13px;
  font-weight: 600;

  color: #eee;
}

.mod-editor-button {
  border: 0;
  border-radius: 4px;

  background: #303030;
  color: #ddd;

  padding: 6px 10px;

  cursor: pointer;
  font-size: 12px;
}

.mod-editor-button:hover {
  background: #3b3b3b;
}

.mod-editor-close:hover {
  background: #8b3030;
}

.mod-editor-tabs {
  display: flex;

  height: 32px;
  flex: 0 0 32px;

  background: #1d1d1d;
  border-bottom: 1px solid #333;
}

.mod-editor-tab {
  border: 0;
  border-right: 1px solid #303030;

  background: #1d1d1d;
  color: #aaa;

  padding: 0 14px;

  cursor: pointer;
}

.mod-editor-tab.active {
  background: #181818;
  color: #fff;

  box-shadow: inset 0 -2px #aaa;
}

.mod-editor-main {
  min-height: 0;
  flex: 1;

  display: flex;

  background: #181818;
}

.mod-editor-gutter {
  width: 48px;
  flex: 0 0 48px;

  padding: 10px 8px;

  overflow: hidden;

  text-align: right;

  color: #666;
  background: #151515;

  border-right: 1px solid #292929;

  font:
    13px/1.5
    Consolas,
    "Courier New",
    monospace;

  white-space: pre;

  user-select: none;
}

.mod-editor-text {
  flex: 1;
  width: 0;

  resize: none;

  border: 0;
  outline: 0;

  padding: 10px 12px;

  background: #181818;
  color: #ddd;

  caret-color: #fff;

  font:
    13px/1.5
    Consolas,
    "Courier New",
    monospace;

  tab-size: 2;

  white-space: pre;
  overflow: auto;

  pointer-events: auto !important;
  user-select: text !important;
  -webkit-user-select: text !important;

  cursor: text !important;

  opacity: 1 !important;
}

.mod-editor-status {
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

class TextEditorMod extends PolyMod {
  constructor(...args) {
    super(...args);

    this.editor = null;
    this.textarea = null;
    this.gutter = null;

    this.themeStyle = null;
    this.importStyle = null;

    this.drag = null;

    this.init = (pml) => {
      pml.registerBindCategory("Text Editor");

      pml.registerKeybind(
        "Toggle Text Editor",
        "texteditortoggle",
        "keydown",
        "F8",
        null,
        () => this.toggle()
      );
    };

    this.postInit = () => {
      this.create();
      this.applyTheme();
    };
  }

  /*
   * Extract @import rules so they stay completely untouched.
   *
   * Example:
   *
   * @import url("https://example.com/theme.css");
   *
   * body {
   *   color: red;
   * }
   */
  splitImports(css) {
    const imports = [];

    let output = "";

    let i = 0;
    let quote = null;
    let comment = false;

    while (i < css.length) {
      if (
        !comment &&
        css[i] === "/" &&
        css[i + 1] === "*"
      ) {
        comment = true;

        output += "/*";

        i += 2;

        while (
          i < css.length &&
          !(
            css[i] === "*" &&
            css[i + 1] === "/"
          )
        ) {
          output += css[i++];
        }

        if (i < css.length) {
          output += "*/";
          i += 2;
        }

        continue;
      }

      if (comment) {
        output += css[i++];
        continue;
      }

      if (quote) {
        output += css[i];

        if (
          css[i] === "\\" &&
          i + 1 < css.length
        ) {
          output += css[i + 1];
          i += 2;
          continue;
        }

        if (css[i] === quote) {
          quote = null;
        }

        i++;
        continue;
      }

      if (
        css[i] === '"' ||
        css[i] === "'"
      ) {
        quote = css[i];
        output += css[i++];
        continue;
      }

      if (
        css.slice(i, i + 7).toLowerCase() ===
        "@import"
      ) {
        const before =
          i === 0
            ? ""
            : css[i - 1];

        if (
          before &&
          /[a-z0-9_-]/i.test(before)
        ) {
          output += css[i++];
          continue;
        }

        let j = i;

        let localQuote = null;
        let parentheses = 0;

        while (j < css.length) {
          const ch = css[j];

          if (localQuote) {
            if (
              ch === "\\" &&
              j + 1 < css.length
            ) {
              j += 2;
              continue;
            }

            if (ch === localQuote) {
              localQuote = null;
            }

            j++;
            continue;
          }

          if (
            ch === '"' ||
            ch === "'"
          ) {
            localQuote = ch;
            j++;
            continue;
          }

          if (ch === "(") {
            parentheses++;
          }

          if (ch === ")") {
            parentheses--;
          }

          if (
            ch === ";" &&
            parentheses === 0
          ) {
            j++;

            imports.push(
              css.slice(i, j).trim()
            );

            i = j;

            break;
          }

          j++;
        }

        if (j >= css.length) {
          output += css.slice(i);
          break;
        }

        continue;
      }

      output += css[i++];
    }

    return {
      imports,
      css: output
    };
  }

  /*
   * Add !important to CSS declarations.
   *
   * This deliberately works character-by-character instead
   * of using a simple regex so things such as:
   *
   * background: url("data:image/svg+xml;...");
   *
   * don't get destroyed.
   */
  makeImportant(css) {
    let result = "";

    let buffer = "";

    let depth = 0;
    let parentheses = 0;

    let quote = null;
    let comment = false;

    const flushDeclaration = () => {
      const text = buffer;

      buffer = "";

      if (!text.trim()) {
        result += text;
        return;
      }

      const trimmed =
        text.trim();

      /*
       * Ignore at-rules and selectors.
       */
      if (
        trimmed.startsWith("@") ||
        !trimmed.includes(":")
      ) {
        result += text;
        return;
      }

      /*
       * Find the first colon outside strings.
       */
      let colon = -1;
      let localQuote = null;

      for (
        let i = 0;
        i < text.length;
        i++
      ) {
        const ch = text[i];

        if (localQuote) {
          if (
            ch === "\\" &&
            i + 1 < text.length
          ) {
            i++;
            continue;
          }

          if (ch === localQuote) {
            localQuote = null;
          }

          continue;
        }

        if (
          ch === '"' ||
          ch === "'"
        ) {
          localQuote = ch;
          continue;
        }

        if (ch === ":") {
          colon = i;
          break;
        }
      }

      if (colon === -1) {
        result += text;
        return;
      }

      const property =
        text.slice(0, colon).trim();

      const value =
        text.slice(colon + 1).trim();

      /*
       * A selector such as:
       *
       * a:hover
       *
       * isn't a declaration.
       */
      if (
        !property ||
        property.includes("{") ||
        property.startsWith("@")
      ) {
        result += text;
        return;
      }

      if (
        value.endsWith("!important")
      ) {
        result += text;
        return;
      }

      const leading =
        text.match(/^\s*/)?.[0] || "";

      result +=
        `${leading}${property}: ${value} !important`;
    };

    for (
      let i = 0;
      i < css.length;
      i++
    ) {
      const ch = css[i];
      const next = css[i + 1];

      if (comment) {
        buffer += ch;

        if (
          ch === "*" &&
          next === "/"
        ) {
          buffer += "/";
          i++;
          comment = false;
        }

        continue;
      }

      if (
        !quote &&
        ch === "/" &&
        next === "*"
      ) {
        buffer += "/*";
        i++;
        comment = true;
        continue;
      }

      if (quote) {
        buffer += ch;

        if (
          ch === "\\" &&
          i + 1 < css.length
        ) {
          buffer += css[i + 1];
          i++;
          continue;
        }

        if (ch === quote) {
          quote = null;
        }

        continue;
      }

      if (
        ch === '"' ||
        ch === "'"
      ) {
        quote = ch;
        buffer += ch;
        continue;
      }

      if (ch === "(") {
        parentheses++;
        buffer += ch;
        continue;
      }

      if (ch === ")") {
        parentheses--;
        buffer += ch;
        continue;
      }

      if (ch === "{") {
        depth++;

        result += buffer + "{";
        buffer = "";

        continue;
      }

      if (ch === "}") {
        flushDeclaration();

        depth = Math.max(
          0,
          depth - 1
        );

        result += "}";

        continue;
      }

      if (
        ch === ";" &&
        parentheses === 0 &&
        depth > 0
      ) {
        flushDeclaration();

        result += ";";

        continue;
      }

      buffer += ch;
    }

    if (buffer) {
      flushDeclaration();
    }

    return result;
  }

  applyTheme() {
    const css =
      localStorage.getItem("cssTheme") || "";

    const {
      imports,
      css: normalCSS
    } = this.splitImports(css);

    /*
     * Keep imports in their own style element.
     */
    if (!this.importStyle) {
      this.importStyle =
        document.createElement("style");

      this.importStyle.id =
        "poly-mod-css-imports";

      document.head.prepend(
        this.importStyle
      );
    }

    this.importStyle.textContent =
      imports.join("\n");

    /*
     * Everything else gets !important.
     */
    if (!this.themeStyle) {
      this.themeStyle =
        document.createElement("style");

      this.themeStyle.id =
        "poly-mod-css-theme";

      document.head.appendChild(
        this.themeStyle
      );
    }

    this.themeStyle.textContent =
      this.makeImportant(normalCSS);
  }

  create() {
    if (this.editor) {
      return;
    }

    const style =
      document.createElement("style");

    style.textContent = STYLE;

    document.head.appendChild(style);

    const win =
      document.createElement("div");

    win.className =
      "mod-editor-window";

    win.hidden = true;

    const titlebar =
      document.createElement("div");

    titlebar.className =
      "mod-editor-titlebar";

    const title =
      document.createElement("div");

    title.className =
      "mod-editor-title";

    title.textContent =
      "CSS Theme Editor";

    const newBtn =
      this.button("New");

    const saveBtn =
      this.button("Save");

    const closeBtn =
      this.button("×");

    closeBtn.className +=
      " mod-editor-close";

    titlebar.append(
      title,
      newBtn,
      saveBtn,
      closeBtn
    );

    const tabs =
      document.createElement("div");

    tabs.className =
      "mod-editor-tabs";

    const tab =
      document.createElement("button");

    tab.className =
      "mod-editor-tab active";

    tab.textContent =
      "cssTheme";

    tabs.appendChild(tab);

    const main =
      document.createElement("div");

    main.className =
      "mod-editor-main";

    const gutter =
      document.createElement("div");

    gutter.className =
      "mod-editor-gutter";

    const textarea =
      document.createElement("textarea");

    textarea.className =
      "mod-editor-text";

    textarea.spellcheck = false;
    textarea.wrap = "off";

    textarea.readOnly = false;
    textarea.disabled = false;

    textarea.value =
      localStorage.getItem(
        "cssTheme"
      ) || "";

    const status =
      document.createElement("div");

    status.className =
      "mod-editor-status";

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

    main.append(
      gutter,
      textarea
    );

    win.append(
      titlebar,
      tabs,
      main,
      status
    );

    document.body.appendChild(win);

    this.editor = win;
    this.textarea = textarea;
    this.gutter = gutter;

    this.pos = pos;
    this.chars = chars;
    this.state = state;

    const update = () => {
      this.updateGutter();
      this.updateStatus();

      this.state.textContent =
        "Modified";
    };

    textarea.addEventListener(
      "input",
      update
    );

    textarea.addEventListener(
      "scroll",
      () => {
        gutter.scrollTop =
          textarea.scrollTop;
      }
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
        "cssTheme",
        ""
      );

      this.applyTheme();

      this.state.textContent =
        "New theme";

      this.updateGutter();
      this.updateStatus();

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

    this.updateGutter();
    this.updateStatus();
  }

  button(text) {
    const button =
      document.createElement("button");

    button.className =
      "mod-editor-button";

    button.textContent =
      text;

    return button;
  }

  makeDraggable(
    handle,
    element
  ) {
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

  updateGutter() {
    if (!this.textarea) {
      return;
    }

    const lines =
      this.textarea.value
        .split("\n")
        .length;

    this.gutter.textContent =
      Array.from(
        {
          length: lines
        },
        (_, i) => i + 1
      ).join("\n");

    this.gutter.scrollTop =
      this.textarea.scrollTop;
  }

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

    const column =
      before.length -
      before.lastIndexOf("\n");

    this.pos.textContent =
      `Ln ${line}, Col ${column}`;

    this.chars.textContent =
      `${this.textarea.value.length} characters`;
  }

  save() {
    if (!this.textarea) {
      return;
    }

    this.textarea.readOnly = false;
    this.textarea.disabled = false;

    const css =
      this.textarea.value;

    localStorage.setItem(
      "cssTheme",
      css
    );

    this.applyTheme();

    this.state.textContent =
      "Saved & Applied";

    this.textarea.focus();
  }

  show() {
    if (!this.editor) {
      this.create();
    }

    this.textarea.readOnly = false;
    this.textarea.disabled = false;

    this.editor.hidden = false;

    this.updateGutter();
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

const polyMod =
  new TextEditorMod();

export {
  polyMod
};
