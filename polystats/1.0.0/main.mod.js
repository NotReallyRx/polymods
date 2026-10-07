let tRespawn = 0;
let tTime = 0;
let currentTrackId;
let currentTrackName;
let attemptsDiv;
let timeDiv;

const officialIds = [
  "5803f9e963625804e3de3246d043dc7dde847aa32e991f7f7326b0453f1fa038",
  "7eac4fee1111152cfba4d3737410264ca0f22c7f5a2211e79f0099589b8b48c0",
  "148826aa16ffaa23dbc453b32cff05e025ddbce1773fc7733cc13d218926515a",
  "93c7363dfea7fb09ca1d23b72cad5df43a30841d41c8ff25fb544c85bb03c7ae",
  "7603aaeffa1989a649dfaa8e1804bed4481b49df233e377687d0669899566e52",
  "c117823cf6788e3247b9ee63a0c091c07352bbe352c650a7790dc6718148c2fa",
  "e4bcaca3a583bb0eb62a700a69d14e89c852f0c5bf740fca76e0519ebdfc9ab1",
  "7239b17057127936907a805b0caa5d8c6f6c97eca9bdabf1a5312dce479629b7",
  "99864b635d1891d22e17eb9267527a07a92c49c0f02893729fa2ded90e3ca0f9",
  "a5341fe706097cff2a3812a3fc0d87399254557328351ae8e5c882700fc1a196",
  "7d134c939df80c676a258266201beedd3b93572d5603f3ff4339ff8679803715",
  "2fe4bd46b0075cc25fc770ce50adbb68447cf493c999635bb272d231811dd264",
  "c20b4ee3cd517ca6cae7e43f047548757287fbd08ba81b97892a3ef520159a34",
  "88647ea04145fbbbb19b55f1590e038fb0378acb2571110f02cb545cc46b0d57",
  "2806030c503abb41a1a26fa9a570888be14296172bb273798ef0ad87a108a2ec",
  "4697ea67b18c3f49b30a3d8884602115536650bc5435c88e3732e64d21a72d33",
  "e5d084e06db4ab71196fea44efeceb23c8561266a78669c324a38f92581fe2db"
];

const communityIds = [
  "64bf7efaed2a47dfb03a6b152e3aef637ac251b68a725a28352f3376ff1384d7",
  "520c4f511821ced30b99bceafbb02e6b7531e867126b0756e68d5e157691ef2f",
  "315c9e95c567cce4feca78f5ad6e8d08d0a22dac0d56061af567b43eea3d4fa8",
  "a8913b96daceb5b615fe45aad2bb104e04eb7db140242934657111e1d1f55b89",
  "66f43b2d2a17f3cee05a127040ca409795058510bd3d1ac7eee224512ec532f5",
  "fcbba504800751b0fb404a7cd1c9591befdf688ad5451ab2bc1f3651590cc5fc",
  "9ba44e8eafd0158e7e1f63e7d609db308c53f337b79e86bd0b630225451eef34",
  "b3889905b6df31cbe302e58e975988385607771605bf6e8e8e8e31b3d2dc8aa1",
  "3cd94552b12fb3a8ac45ca3a5e21a882b71b31c788989b396ab382afc69414ac",
  "3125a5f98c3b43cf1e2604e25e8504bffd714ea5843200fa8ddf0b4c58842f16",
  "a2137c20c03ad1848098b47f70417cc0b0bf169010c825dc6fb82f37066808a0",
  "d03b9f7c10c95f40eed389458be51bdf2437febd5673d028da134e59e503c10b",
  "f68a709a296a60f6e6f73a2da670f95aca424be0f2fda5d6b608ece71f339b7c",
  "a1f41dc9e884d5d4b1b6025158d70f0934dc4d892076e6c4b32dc3f3846b882e",
  "b430aad5e481caa4588e30f46352b876b62f1ba0cf7730a15efd026c91a8f32e",
  "95d8f7cbe11053dbdfaeeb2f3c3d8f53f0d45fb6abeb411a74949a4cf52f427f",
  "409f26b9faf55bd0ad748177bf85ebdcfc0ddd572190e7f464f38b4a60587b7e",
  "c1a2c5aef1029d7bbf946f08cd087dd25bad6e019a41694a48a0024c27627dc8",
  "cad05ca9fb4b1d15b35dc752c3df26d8de422639f65e1041c018b841f641a21a",
  "9e53d03f4efe86834c49ce202b528d769d9aa7a6e17732d0fc56440463956a1b",
  "b77ec520a40c4b38d3d7d653b747b1f8627c98709096568db22cd1bfec534ba6",
  "9f827673c4132828009237a03e12ead73eae87504b4708a79c6cc0858212262d",
  "9acd9aef650c4ccc41bb01f72ed44dfaa13f2e4404d2e3466f09cc1adcd9a9c0",
  "62d9989187e4508f7866e7b30aa187ddbee2595df21ff5988d7fec3589f9048d",
  "b36162623435dc90a54f57590d2baa9f2d67a51cb12c393531f4b6d5e5528ebf",
  "74ae56c0f278a19f3b69f3903198c7b9de09981133205856b53bf6bdf8db4211",
  "9f4597449906aa0c2baf9a4737406385c829533e64e9e972b25b4189f4593a54",
  "28b658c7d10eb8b5de6f465e034e87e40f70b37e4534d8c37d1f2af06b5a36d7",
  "470af92ed4c0a6f62028d7dea4dbc7765d1db16a3698d6a0c271be582a20a7c6",
  "a6b990137e404c9ef2cb4399c463acbed8ebfa3bb82ab5315027118604c4ec03",
  "35fe02bf18312713c05528f0b7b8fd15c83dac50bcdcbd373040a16e8bfcc138",
  "18b69f54f119cfb2867abded9a1574f0799a750ef94aa744d9ec8ef6b4d565ae",
  "5aafb733c264d51b09beedc7bd7eabb5e65bdded338980fcb14ae5ce36955572",
  "5ea46b3ae268a0196dcc59dabe88926400b56e29814658bfed06a284f837cefd",
  "ab8e1c13ddf394102be1cb04adcff8411127f1e7140a216d27a94fc19b7d0428",
  "86335d78d1a06d3dc81d80f84b8ac2e8f6359e9a206826e2c36f7d3f4351bea4",
  "a510bbd3341f2992a12db8a3780cb8943b6087538345d58d16602d6129742df0",
  "8cf99166f12cbb56a9df4e022a0e9b8c78973adb929dbf1e265ebb9f99f01163",
  "33d99aad2ad5cef45b1d3afb8735c5229cfd98ac7cc24916e0da7283f7a545ce",
  "5c00f2c90bcf8230183484225d1a417e45b0ad310379acfafd4c8f1dc7345dd7",
  "009fad7fcc215022c6b2dbb2b6de622f07cd88d4930b8e2b6a6b74c1f5de9e44",
  "1ad53694ee3e96aea27afa7b64d5c29d115de88a17b69cf3fe3f5609c52b040b",
  "2ed125037366052871fbb97da6e1bda49cfeb471f6b9c8fa799d520bdb3683e2",
  "f79b1d863d50f9e3b4489988698065c6d775ff3ec90bf91085bad05ad5ec8316",
  "27429a1d1bf05770851e3919af70f47c6cd7a269c67032b084fb4345f6c271ce",
  "f5c327cf09b90e4de8c3c1f9c910dbb7988cf15485d2e4beec3cc03aef408c5",
  "7451c2128cb96bc28195cf0ca0f83a46c3b55d78d434232d9de085dd1cf0ab36",
  "af6ef508e1f6e47a462a6998b950ef535d1e8a38fe67ead891bf5f2de1346f43",
  "089f2aebcfe4f24d8dda3a8a630172d2bd13793e78c5247adfaa760743a377e1",
  "5e40f730509204c77e9c610839ed43addddbe0f8aa007168447f7fde38583905",
  "191737cc4d1b74949e992d99371e5c7f5fc446a716af571c6e5449b23e9f4558",
  "39bd3fa6c3c769b298c219aee7561af35a6d856bfee14b46b0b48499e7a57ed5"
];

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0) {
    return `${h}h ${m}m played`;
  } else {
    return `${m}m played`;
  }
}

function getOfficialData() {
    const data = JSON.parse(localStorage.getItem(`polystats_official`));
    if (!data) {
        return;
    }
    const trackData = data[officialIds.indexOf(currentTrackId)]
    if (trackData) {
      return trackData
    } else {
        return;
    };
};

function saveOfficialData() {
    const data = JSON.parse(localStorage.getItem("polystats_official")) || {};

    data[officialIds.indexOf(currentTrackId)] = [tRespawn, tTime];

    localStorage.setItem("polystats_official", JSON.stringify(data));
}

function saveCommunityData() {
    const data = JSON.parse(localStorage.getItem("polystats_community")) || {};

    data[communityIds.indexOf(currentTrackId)] = [tRespawn, tTime];

    localStorage.setItem("polystats_community", JSON.stringify(data));
}

function saveCustomData() {
    const data = JSON.parse(localStorage.getItem(`polytrack_v5_prod_track_${currentTrackName}`)) || {};

    data.polyStats = [tRespawn, tTime];

    localStorage.setItem(`polytrack_v5_prod_track_${currentTrackName}`, JSON.stringify(data));
}

function getCommunityData() {
    const data = JSON.parse(localStorage.getItem(`polystats_community`));
    if (!data) {
        return;
    }
    const trackData = data[communityIds.indexOf(currentTrackId)]
    if (trackData) {
      return trackData
    } else {
        return;
    };
};

function loadData() {
    if (officialIds.includes(currentTrackId)) {
        const data = getOfficialData();
        if (!data) return [0, 0];
        return data;
    } else if (communityIds.includes(currentTrackId)) {
        const data = getCommunityData();
        if (!data) return [0, 0];
        return data;
    } else {
        const saved = localStorage.getItem(`polytrack_v5_prod_track_${currentTrackName}`);
        if (!saved) return [0, 0];
        try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.polyStats) return parsed.polyStats;
        } catch (e) {}
        return [0, 0];
    }
}

function saveData() {
    if (officialIds.includes(currentTrackId)) {
        saveOfficialData();
    } else if (communityIds.includes(currentTrackId)) {
        saveCommunityData();
    } else {
        saveCustomData();
    }
}

class Stopwatch {
    constructor() {
        this.interval = null;
        this.active = false;
    }

    start() {
        if (this.active) return;
        this.active = true;
        this.interval = setInterval(() => {
            tTime++;
            if (timeDiv) {
              timeDiv.textContent = formatTime(tTime);
            } else {
              this.stop();
            }
        }, 1000);
    }

    stop() {
        if (!this.active) return;
        this.active = false;
        clearInterval(this.interval);
    }
    clear() {
        tTime = 0;
    }
}

let timer = new Stopwatch();

import { PolyMod } from "https://cdn.polymodloader.com/cb/PolyTrackMods/PolyModLoader/0.6.0/PolyTypes.js";

class Polystatistics extends PolyMod {
    initPost() {
        this._createUI();
        this._setupTrackTracking();
    }

    _createUI() {
        const container = document.createElement("div");
        container.id = "polystats-container";
        container.style.position = "absolute";
        container.style.top = "10px";
        container.style.left = "10px";
        container.style.zIndex = "1000";
        container.style.pointerEvents = "none";
        container.style.fontFamily = "sans-serif";
        container.style.color = "#fff";
        container.style.textShadow = "1px 1px 2px rgba(0,0,0,0.8)";

        attemptsDiv = document.createElement("div");
        attemptsDiv.id = "polystats-attempts";
        attemptsDiv.textContent = "Attempts: 0";
        attemptsDiv.style.marginBottom = "4px";

        timeDiv = document.createElement("div");
        timeDiv.id = "polystats-time";
        timeDiv.textContent = formatTime(0);

        container.appendChild(attemptsDiv);
        container.appendChild(timeDiv);
        document.body.appendChild(container);
    }

    _setupTrackTracking() {
        this._updateTrackInfo();
        this._loadAndDisplay();
    }

    _updateTrackInfo() {
        if (typeof window !== "undefined" && window.Game) {
            try {
                const game = window.Game;
                if (game.track && game.track.id) {
                    currentTrackId = game.track.id;
                }
                if (game.track && game.track.name) {
                    currentTrackName = game.track.name;
                }
            } catch (e) {}
        }
    }

    _loadAndDisplay() {
        this._updateTrackInfo();
        const data = loadData();
        tRespawn = data[0] || 0;
        tTime = data[1] || 0;
        if (attemptsDiv) attemptsDiv.textContent = `Attempts: ${tRespawn}`;
        if (timeDiv) timeDiv.textContent = formatTime(tTime);
    }

    _saveCurrent() {
        this._updateTrackInfo();
        saveData();
    }
}

Polystatistics.prototype["Player.respawn"] = function () {
    tRespawn++;
    if (attemptsDiv) attemptsDiv.textContent = `Attempts: ${tRespawn}`;
    if (typeof timer !== "undefined") timer.clear();
};

Polystatistics.prototype["Game.update"] = function () {
    try {
        const game = window.Game;
        if (game && game.playing) {
            if (typeof timer !== "undefined" && !timer.active) {
                timer.start();
            }
        } else {
            if (typeof timer !== "undefined" && timer.active) {
                timer.stop();
                saveData();
            }
        }
    } catch (e) {}
};

Polystatistics.prototype.onTrackLoad = function () {
    if (typeof timer !== "undefined") {
        timer.stop();
        timer.clear();
    }
    this._saveCurrent();
    this._loadAndDisplay();
};

Polystatistics.prototype.onSceneChange = function () {
    if (typeof timer !== "undefined") {
        timer.stop();
    }
    this._saveCurrent();
};

Polystatistics.prototype.uninit = function () {
    if (typeof timer !== "undefined") {
        timer.stop();
    }
    this._saveCurrent();
    if (attemptsDiv && attemptsDiv.parentElement) attemptsDiv.parentElement.remove();
    attemptsDiv = null;
    timeDiv = null;
};

export let polyMod = new Polystatistics();
