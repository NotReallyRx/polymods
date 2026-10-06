import {
  PolyMod,
} from "https://cdn.polymodloader.com/pml/PolyModLoader/0.6.3/PolyTypes.js";

const PLAYTIME_STORAGE_KEY = "playtime";

function ensurePlaytimeStorage() {
  if (!window.localStorage.getItem(PLAYTIME_STORAGE_KEY)) {
    window.localStorage.setItem(PLAYTIME_STORAGE_KEY, "0");
  }
}

function getStoredPlaytime() {
  ensurePlaytimeStorage();

  const value = Number(
    window.localStorage.getItem(PLAYTIME_STORAGE_KEY),
  );

  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function savePlaytime(milliseconds) {
  window.localStorage.setItem(
    PLAYTIME_STORAGE_KEY,
    String(Math.max(0, Math.floor(milliseconds))),
  );
}

function formatPlaytime(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ");
}

class PlaytimeTracker {
  constructor() {
    ensurePlaytimeStorage();

    this.totalPlaytime = getStoredPlaytime();
    this.sessionStart = null;
    this.isTracking = false;
    this.interval = null;
  }

  getPlaytime() {
    if (!this.isTracking || this.sessionStart === null) {
      return this.totalPlaytime;
    }

    return (
      this.totalPlaytime +
      (Date.now() - this.sessionStart)
    );
  }

  start() {
    if (this.isTracking) return;

    this.isTracking = true;
    this.sessionStart = Date.now();

    this.interval = setInterval(() => {
      this.saveCurrentTime();
    }, 1000);
  }

  saveCurrentTime() {
    if (!this.isTracking || this.sessionStart === null) {
      return;
    }

    this.totalPlaytime += Date.now() - this.sessionStart;
    this.sessionStart = Date.now();

    savePlaytime(this.totalPlaytime);
  }

  stop() {
    if (!this.isTracking) return;

    this.saveCurrentTime();

    this.isTracking = false;
    this.sessionStart = null;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    savePlaytime(this.totalPlaytime);
  }

  reset() {
    this.totalPlaytime = 0;

    if (this.isTracking) {
      this.sessionStart = Date.now();
    }

    savePlaytime(0);
  }

  handleVisibilityChange = () => {
    if (document.hidden) {
      this.stop();
    } else {
      this.start();
    }
  };

  handleBeforeUnload = () => {
    this.stop();
  };

  destroy() {
    this.stop();

    document.removeEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
    );

    window.removeEventListener(
      "beforeunload",
      this.handleBeforeUnload,
    );
  }
}

class playtimeMod extends PolyMod {
  constructor() {
    super(...arguments);

    this.pml = null;
    this.tracker = null;

    this.init = async (pml) => {
      this.pml = pml;

      ensurePlaytimeStorage();

      pml.registerSettingCategory("Playtime");

      pml.addCustomClickableButtons(
        "Playtime",
        [
          {
            text: "View Playtime",
            callback: () => {
              const milliseconds = this.tracker.getPlaytime();
              const formatted = formatPlaytime(milliseconds);

              alert(`Playtime: ${formatted}`);
            },
          },
          {
            text: "Reset Playtime",
            callback: () => {
              const confirmed = confirm(
                "Are you sure you want to reset your playtime?",
              );

              if (!confirmed) return;

              this.tracker.reset();

              alert("Playtime has been reset.");
            },
          },
        ],
      );

      this.tracker = new PlaytimeTracker();

      this.tracker.start();

      document.addEventListener(
        "visibilitychange",
        this.tracker.handleVisibilityChange,
      );

      window.addEventListener(
        "beforeunload",
        this.tracker.handleBeforeUnload,
      );
    };

    this.postInit = async () => {};
  }
}

export const polyMod = new playtimeMod();


