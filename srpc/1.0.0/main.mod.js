import {
  PolyMod,
  SettingType,
} from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.3/PolyTypes.js";

export class SpotifyConnector {
  constructor(userId, onTrackChange) {
    this.currentTrackId = null;
    this.hasActiveTrack = false;
    this.pollInterval = null;
    this.isListening = false;
    this.onTrackChange = onTrackChange || null;
    this.workerUrl = `https://pmlspotifylanyardapi.rxk.workers.dev/status/${encodeURIComponent(userId)}`;
  }

  async startListening() {
    const fetchTrack = async () => {
      if (!this.isListening) return;

      try {
        const response = await fetch(this.workerUrl);
        if (!response.ok) return;

        const data = await response.json();
        if (!this.isListening) return;

        if (!data.active) {
          this.currentTrackId = null;
          this.hasActiveTrack = false;
          return;
        }

        const trackChanged =
          !this.hasActiveTrack || data.track_id !== this.currentTrackId;

        this.currentTrackId = data.track_id;
        this.hasActiveTrack = true;

        this.onTrackChange?.({
          name: data.name,
          artist: data.author,
          albumArt: data.image,
          trackId: data.track_id,
          progress: data.progress,
          duration: data.duration,
          trackChanged,
        });
      } catch (error) {
        console.error("Worker polling error:", error);
      }
    };

    if (this.pollInterval) return;

    this.isListening = true;
    this.pollInterval = setInterval(fetchTrack, 1000);
    await fetchTrack();
  }

  stopListening() {
    this.isListening = false;

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}

export class SpotifyRPCPopup {
  constructor() {
    this.popupElement = null;
    this.titleElement = null;
    this.artistElement = null;
    this.artElement = null;
    this.progressFillElement = null;
    this.currentTimeElement = null;
    this.durationElement = null;
    this.popupTimeout = null;
    this.progressInterval = null;
    this.popupId = "spotify-rpc-popup";
    this.pinned = false;
    this.trackData = null;
    this.stickToCorner = false;
    this.baseOpacity = 1;
    this.isHoveringPopup = false;
    this.onMouseMove = null;
  }

  createPopup() {
    const existing = document.getElementById(this.popupId);
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = this.popupId;

    popup.innerHTML = `
            <img class="sr-album-art" src="" alt="Album art" />
            <div class="sr-info">
                <div id="sr-title"></div>
                <div id="sr-artist"></div>
                <div class="sr-progress">
                    <div class="sr-progress-track">
                        <div class="sr-progress-fill"></div>
                    </div>
                    <div class="sr-times">
                        <span class="sr-current-time">0:00</span>
                        <span class="sr-duration">0:00</span>
                    </div>
                </div>
            </div>
        `;

    const style = document.createElement("style");

    style.textContent = `
            :root {
                --sr-width: 230px;
                --sr-border: #28346a;
                --sr-inner: #192042;
                --sr-green: #868eb5;
                --sr-enter-speed: 0.45s;
                --sr-exit-speed: 0.35s;
            }

            #${this.popupId} {
                position: fixed;
                right: 15px;
                top: 15px;
                left: auto;
                bottom: auto;
                color: #fff;
                font-family: Arial, sans-serif;
                width: min(var(--sr-width), calc(100vw - 30px));
                min-height: 55px;
                padding: 8px 14px;
                display: none;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;
                gap: 12px;
                overflow: hidden;
                z-index: 99999;
                background: var(--sr-border);
                opacity: var(--sr-opacity, 1);
                pointer-events: none;
                transition: opacity 0.15s ease;
                transform: skewX(-8deg);
                transform-origin: top right;
                isolation: isolate;
            }

            #${this.popupId}:hover,
            #${this.popupId}:focus-within {
                opacity: 0.5;
            }

            #${this.popupId}.sr-stick-corner {
    top: 0;
    right: 0;
    transform-origin: top right;
    clip-path: polygon(
        3% 0,
        100% 0,
        100% 100%,
        0 100%
    );
}

#${this.popupId}.sr-stick-corner::before {
    clip-path: polygon(
        3% 0,
        100% 0,
        100% 100%,
        0 100%
    );
}

#${this.popupId}.sr-stick-corner .sr-album-art {
    transform: skewX(-4.5deg);
    
}

            #${this.popupId}::before {
                content: "";
                position: absolute;
                inset: 6px;
                background: var(--sr-inner);
                z-index: -1;
            }

            #${this.popupId}.sr-pinned {
                min-height: 76px;
                padding-top: 10px;
                padding-bottom: 10px;
            }

            #${this.popupId}.sr-show {
                display: flex;
                animation:
                    srFadeIn
                    var(--sr-enter-speed)
                    ease
                    forwards;
            }

            #${this.popupId}.sr-hide-fade {
                animation:
                    srFadeOut
                    var(--sr-exit-speed)
                    ease
                    forwards;
            }

            #${this.popupId}.sr-pinned.sr-show {
                animation: none;
                opacity: var(--sr-opacity, 1);
            }

            #${this.popupId} > * {
                position: relative;
                z-index: 1;
            }

            .sr-album-art {
                width: 50px;
                height: 50px;
                border-radius: 2px;
                object-fit: cover;
                flex-shrink: 0;
            }

            .sr-album-art.sr-hidden {
                display: none;
            }

            .sr-info {
                display: flex;
                flex-direction: column;
                gap: 5px;
                flex: 1;
                min-width: 0;
            }

            #sr-title {
                font-size: 15px;
                font-weight: bold;
                line-height: 19px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            #sr-artist {
                font-size: 12px;
                opacity: 0.75;
                line-height: 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .sr-progress {
                display: none;
                flex-direction: column;
                width: 100%;
                min-width: 0;
                gap: 4px;
            }

            #${this.popupId}.sr-pinned .sr-progress {
                display: flex;
            }

            .sr-progress-track {
                width: 100%;
                min-width: 0;
                height: 4px;
                background: rgba(255, 255, 255, 0.18);
                overflow: hidden;
            }

            .sr-progress-fill {
                width: 0%;
                height: 100%;
                background: var(--sr-green);
                transition: width 0.4s linear;
            }

            .sr-times {
                display: flex;
                justify-content: space-between;
                color: rgba(255, 255, 255, 0.68);
                font-size: 10px;
                line-height: 12px;
                font-variant-numeric: tabular-nums;
            }

            @keyframes srFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: var(--sr-opacity, 1);
                }
            }

            @keyframes srFadeOut {
                from {
                    opacity: var(--sr-opacity, 1);
                }
                to {
                    opacity: 0;
                }
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(popup);

    this.popupElement = popup;
    this.titleElement = popup.querySelector("#sr-title");
    this.artistElement = popup.querySelector("#sr-artist");
    this.artElement = popup.querySelector(".sr-album-art");
    this.progressFillElement = popup.querySelector(".sr-progress-fill");
    this.currentTimeElement = popup.querySelector(".sr-current-time");
    this.durationElement = popup.querySelector(".sr-duration");

    this.onMouseMove = (event) => {
      if (!this.popupElement || this.popupElement.style.display === "none") {
        if (this.isHoveringPopup) {
          this.isHoveringPopup = false;
          this.popupElement && this.updatePopupOpacity();
        }
        return;
      }

      const rect = this.popupElement.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (inside !== this.isHoveringPopup) {
        this.isHoveringPopup = inside;
        this.updatePopupOpacity();
      }
    };

    document.addEventListener("mousemove", this.onMouseMove);
  }

  updatePopupOpacity() {
    if (!this.popupElement) return;

    const targetOpacity = this.isHoveringPopup ? 0.5 : this.baseOpacity;
    this.popupElement.style.opacity = String(targetOpacity);
  }

  showPopup(data, options = {}) {
    if (!this.popupElement) {
      this.createPopup();
    }

    const {
      opacity = 1,
      showCover = true,
      size = 0.5,
      pinned = false,
      stickToCorner = false,
    } = options;

    const numericOpacity = Number(opacity);
    const validOpacity = Number.isFinite(numericOpacity)
      ? Math.max(0, Math.min(1, numericOpacity))
      : 1;

    const numericSize = Number(size);
    const validSize =
      (Number.isFinite(numericSize)
        ? Math.max(0, Math.min(1, numericSize))
        : 0.5) * 2;

    const wasVisible =
      this.popupElement.classList.contains("sr-show") &&
      this.popupElement.style.display !== "none";

    const wasPinned = this.pinned;

    this.trackData = data;

    if (this.titleElement) {
      this.titleElement.textContent = data.title || "Unknown track";
    }

    if (this.artistElement) {
      this.artistElement.textContent = data.artist || "Unknown artist";
    }

    if (this.artElement) {
      if (data.artworkUrl) {
        this.artElement.src = data.artworkUrl;
      } else {
        this.artElement.removeAttribute("src");
      }

      this.artElement.classList.toggle("sr-hidden", !showCover);
    }

    this.baseOpacity = validOpacity;
    this.popupElement.style.setProperty(
      "--sr-opacity",
      validOpacity.toString(),
    );
    this.updatePopupOpacity();

    this.stickToCorner = Boolean(stickToCorner);
    this.popupElement.classList.toggle("sr-stick-corner", this.stickToCorner);

    this.popupElement.style.transform = this.stickToCorner
      ? `scale(${validSize})`
      : `skewX(-8deg) scale(${validSize})`;

    this.pinned = Boolean(pinned);
    this.popupElement.classList.toggle("sr-pinned", this.pinned);

    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
      this.popupTimeout = null;
    }

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    this.popupElement.style.display = "flex";

    if (this.pinned && wasVisible && wasPinned) {
      this.popupElement.classList.remove("sr-hide-fade");
      this.popupElement.classList.add("sr-show");
    } else {
      this.popupElement.classList.remove("sr-hide-fade");
      this.popupElement.classList.remove("sr-show");

      requestAnimationFrame(() => {
        if (this.popupElement) {
          this.popupElement.classList.add("sr-show");
        }
      });
    }

    this.updateProgress(data.progress, data.duration);
    this.scheduleHide();
  }

  updateProgress(progress, duration) {
    if (!this.progressFillElement) return;

    const numericProgress = Number(progress);
    const safeProgress = Number.isFinite(numericProgress)
      ? Math.max(0, Math.min(1, numericProgress))
      : 0;

    const numericDuration = Number(duration);
    const safeDuration =
      Number.isFinite(numericDuration) && numericDuration > 0
        ? numericDuration
        : 0;

    const elapsed = safeProgress * safeDuration;

    this.progressFillElement.style.width = `${safeProgress * 100}%`;

    if (this.currentTimeElement) {
      this.currentTimeElement.textContent =
        safeDuration > 0
          ? this.formatTime(elapsed)
          : `${Math.round(safeProgress * 100)}%`;
    }

    if (this.durationElement) {
      this.durationElement.textContent =
        safeDuration > 0 ? this.formatTime(safeDuration) : "";
    }
  }

  formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);

    return `${Math.floor(totalSeconds / 60)}:${String(
      totalSeconds % 60,
    ).padStart(2, "0")}`;
  }

  setStickToCorner(enabled) {
    this.stickToCorner = Boolean(enabled);
    if (!this.popupElement) return;

    this.popupElement.classList.toggle("sr-stick-corner", this.stickToCorner);

    const scale =
      this.popupElement.style.transform.match(/scale\(([^)]+)\)/)?.[1] || "1";

    this.popupElement.style.transform = this.stickToCorner
      ? `scale(${scale})`
      : `skewX(-8deg) scale(${scale})`;
  }

  setPinned(pinned) {
    const nextPinned = Boolean(pinned);

    if (this.pinned === nextPinned) return;

    this.pinned = nextPinned;

    if (!this.popupElement) return;

    this.popupElement.classList.toggle("sr-pinned", this.pinned);

    if (this.pinned) {
      this.popupElement.classList.remove("sr-hide-fade");

      if (this.trackData) {
        this.popupElement.style.display = "flex";
        this.popupElement.classList.add("sr-show");
      }
    }

    this.scheduleHide();
  }

  scheduleHide() {
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
      this.popupTimeout = null;
    }

    if (
      this.pinned ||
      !this.popupElement ||
      this.popupElement.style.display === "none"
    ) {
      return;
    }

    this.popupTimeout = setTimeout(() => {
      if (!this.popupElement || this.pinned) return;

      this.popupElement.classList.remove("sr-show");
      this.popupElement.classList.add("sr-hide-fade");

      setTimeout(() => {
        if (
          !this.popupElement ||
          this.pinned ||
          !this.popupElement.classList.contains("sr-hide-fade")
        ) {
          return;
        }

        this.popupElement.style.display = "none";
        this.popupElement.className = "";
      }, 400);
    }, 5000);
  }

  destroy() {
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
      this.popupTimeout = null;
    }

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    if (this.onMouseMove) {
      document.removeEventListener("mousemove", this.onMouseMove);
      this.onMouseMove = null;
    }

    this.popupElement?.remove();
    this.popupElement = null;
  }
}

async function validateSpotifyUserId(userId) {
  if (!/^\d{17,20}$/.test(userId)) {
    return {
      valid: false,
      message: "Enter a valid 17-20 digit Discord user ID.",
    };
  }

  try {
    const response = await fetch(
      `https://pmlspotifylanyardapi.rxk.workers.dev/status/${encodeURIComponent(userId)}`,
    );

    const data = await response.json();

    if (!response.ok || typeof data.active !== "boolean") {
      return {
        valid: false,
        message:
          data.error || "That user ID could not be verified by the worker.",
      };
    }

    return { valid: true };
  } catch (error) {
    console.error("Spotify user ID validation failed:", error);

    return {
      valid: false,
      message:
        "Could not reach the Spotify status worker. Check your connection and try again.",
    };
  }
}

function promptForSpotifyUserId(initialValue = "", initialError = "") {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "sr-userid-overlay";

    overlay.innerHTML = `
            <form class="sr-userid-dialog">
                <h2>Connect Spotify status</h2>
                <p>Enter the Discord user ID linked to your Spotify status.</p>
                <input
                    class="sr-userid-input"
                    type="text"
                    inputmode="numeric"
                    autocomplete="off"
                    placeholder="Discord user ID"
                    required
                >
                <p class="sr-userid-error" role="alert"></p>
                <button class="sr-userid-submit" type="submit">
                    Verify and continue
                </button>
            </form>
        `;

    const style = document.createElement("style");

    style.textContent = `
        .sr-userid-overlay {
            position: fixed;
            inset: 0;
            z-index: 100000;
            display: grid;
            place-items: center;
            padding: 20px;
            background: rgba(0, 0, 0, 0.72);
            font-family: Arial, sans-serif;
        }

        .sr-userid-dialog {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: min(360px, 100%);
            padding: 24px;
            color: #fff;
            background: #28346a;
            border: 2px solid #28346a;
            position: relative;
            box-sizing: border-box;
            transform: skewX(-8deg);
            isolation: isolate;
        }

        .sr-userid-dialog::before {
            content: "";
            position: absolute;
            inset: 6px;
            background: #192042;
            z-index: -1;
        }

        .sr-userid-dialog h2,
        .sr-userid-dialog p,
        .sr-userid-dialog input,
        .sr-userid-dialog button {
            position: relative;
            transform: skewX(8deg);
        }

        .sr-userid-dialog h2,
        .sr-userid-dialog p {
            margin: 0;
        }

        .sr-userid-dialog h2 {
            font-size: 19px;
        }

        .sr-userid-dialog p {
            color: rgba(255, 255, 255, 0.75);
            font-size: 13px;
            line-height: 1.4;
        }

        .sr-userid-dialog input[type="text"] {
            margin: 0;
            padding: 4px 8px;
            width: 100%;
            box-sizing: border-box;
            clip-path: polygon(
                0 0,
                100% 0,
                calc(100% - 8px) 100%,
                0 100%
            );
            font-size: 24px;
            font-weight: bold;
            text-indent: 6px;
            color: var(--text-color);
            background-color: var(--surface-tertiary-color);
            border: none;
            pointer-events: auto;
        }

        .sr-userid-dialog input[type="text"]::placeholder {
            color: var(--text-color);
            opacity: 0.25;
        }

        .sr-userid-dialog input[type="text"]:focus-visible {
            outline: none;
        }

        .sr-userid-dialog .sr-userid-error {
            min-height: 18px;
            color: #ff8585;
        }

        .sr-userid-dialog button {
            padding: 11px 14px;
            color: #07160c;
            background: #868eb5;
            border: 0;
            font-weight: 700;
            cursor: pointer;
        }

        .sr-userid-dialog button:disabled {
            opacity: 0.6;
            cursor: wait;
        }
        `;

    const form = overlay.querySelector("form");
    const input = overlay.querySelector("input");
    const error = overlay.querySelector(".sr-userid-error");
    const button = overlay.querySelector("button");

    input.value = initialValue;
    error.textContent = initialError;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const userId = input.value.trim();

      button.disabled = true;
      button.textContent = "Verifying...";
      error.textContent = "";

      const result = await validateSpotifyUserId(userId);

      if (!result.valid) {
        error.textContent = result.message;
        button.disabled = false;
        button.textContent = "Verify and continue";
        return;
      }

      window.localStorage.setItem("spotifyuserid", userId);

      style.remove();
      overlay.remove();
      resolve(userId);
    });

    document.head.appendChild(style);
    document.body.appendChild(overlay);
    input.focus();
  });
}

async function getSpotifyUserId() {
  const storageKey = "spotifyuserid";
  let userId = window.localStorage.getItem(storageKey);

  if (userId) {
    const result = await validateSpotifyUserId(userId);

    if (result.valid) {
      window.localStorage.setItem(storageKey, userId);
      return userId;
    }

    userId = await promptForSpotifyUserId(userId, result.message);
  } else {
    userId = await promptForSpotifyUserId();
  }

  return userId;
}

async function initPlaybackListener(pml) {
  const userId = await getSpotifyUserId();
  const popup = new SpotifyRPCPopup();

  let connector = null;
  let listening = false;

  const startListening = () => {
    connector = new SpotifyConnector(userId, (track) => {
      if (!track.trackChanged) {
        popup.updateProgress(track.progress, track.duration);
        return;
      }

      popup.showPopup(
        {
          title: track.name,
          artist: track.artist,
          artworkUrl: track.albumArt,
          progress: track.progress,
          duration: track.duration,
          trackId: track.trackId,
        },
        {
          opacity: parseFloat(pml.getSetting("spotifyrpcopacity")) ?? 1,
          size: parseFloat(pml.getSetting("spotifyrpcsize")) ?? 0.5,
          showCover: pml.getSetting("spotifyrpcshowcover") === "true",
          pinned: pml.getSetting("spotifyrpcpinned") === "true",
          stickToCorner: pml.getSetting("spotifyrpcstickcorner") === "true",
        },
      );
    });

    connector.startListening();
    listening = true;
  };

  const syncSettings = () => {
    popup.setPinned(pml.getSetting("spotifyrpcpinned") === "true");

    popup.setStickToCorner(pml.getSetting("spotifyrpcstickcorner") === "true");

    const shouldListen = pml.getSetting("spotifyrpcenabled") === "true";

    if (shouldListen === listening) return;

    if (shouldListen) {
      startListening();
    } else {
      connector?.stopListening();
      connector = null;
      listening = false;
    }
  };

  if (pml.getSetting("spotifyrpcpinned") === "true") {
    popup.setPinned(true);
  }

  syncSettings();
  setInterval(syncSettings, 500);
}

class spotifyRPCMod extends PolyMod {
  constructor() {
    super(...arguments);

    this.init = async (pml) => {
      this.pml = pml;

      pml.registerSettingCategory("Spotify RPC");

      pml.registerSetting(
        "Spotify listener",
        "spotifyrpcenabled",
        SettingType.BOOL,
        true,
      );

      pml.registerSetting(
        "Pinned notification",
        "spotifyrpcpinned",
        SettingType.BOOL,
        false,
      );

      pml.registerSetting(
        "Stick to top-right corner",
        "spotifyrpcstickcorner",
        SettingType.BOOL,
        false,
      );

      pml.registerSetting(
        "Show cover",
        "spotifyrpcshowcover",
        SettingType.BOOL,
        true,
      );

      pml.registerSetting(
        "Opacity",
        "spotifyrpcopacity",
        SettingType.SLIDER,
        1,
      );

      pml.registerSetting("Size", "spotifyrpcsize", SettingType.SLIDER, 0.5);
    };

    this.postInit = async () => {
      await initPlaybackListener(this.pml);
    };
  }
}

export const polyMod = new spotifyRPCMod();
