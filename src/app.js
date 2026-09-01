let currentTrackId = "track_1";
let currentFigureId = "figure_1";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const trackImage = new Image();
const figureImage = new Image();
trackImage.src = assetPath("Tracks", currentTrackId);
figureImage.src = assetPath("Figures", currentFigureId);

const ui = {
  playModeButton: document.getElementById("playModeButton"),
  editModeButton: document.getElementById("editModeButton"),
  proModeButton: document.getElementById("proModeButton"),
  trackLabel: document.getElementById("trackLabel"),
  trackInput: document.getElementById("trackInput"),
  figureInput: document.getElementById("figureInput"),
  createNewButton: document.getElementById("createNewButton"),
  loadTrackButton: document.getElementById("loadTrackButton"),
  loadFigureButton: document.getElementById("loadFigureButton"),
  openBundleLabel: document.getElementById("openBundleLabel"),
  trackFileInput: document.getElementById("trackFileInput"),
  figureFileInput: document.getElementById("figureFileInput"),
  loadMusicButton: document.getElementById("loadMusicButton"),
  musicFileInput: document.getElementById("musicFileInput"),
  musicPlayPauseButton: document.getElementById("musicPlayPauseButton"),
  musicStopButton: document.getElementById("musicStopButton"),
  musicVolume: document.getElementById("musicVolume"),
  musicStatus: document.getElementById("musicStatus"),
  backgroundMusic: document.getElementById("backgroundMusic"),
  objectiveType: document.getElementById("objectiveType"),
  targetPoints: document.getElementById("targetPoints"),
  targetPointsField: document.getElementById("targetPointsField"),
  resetButton: document.getElementById("resetButton"),
  saveButton: document.getElementById("saveButton"),
  loadBundleInput: document.getElementById("loadBundleInput"),
  scoreText: document.getElementById("scoreText"),
  modeText: document.getElementById("modeText"),
  tileText: document.getElementById("tileText"),
  trackProgressText: document.getElementById("trackProgressText"),
  playHelp: document.getElementById("playHelp"),
  editorTools: document.getElementById("editorTools"),
  proEditorTools: document.getElementById("proEditorTools"),
  trackSelect: document.getElementById("trackSelect"),
  addTrackButton: document.getElementById("addTrackButton"),
  walkTool: document.getElementById("walkTool"),
  blockTool: document.getElementById("blockTool"),
  itemTool: document.getElementById("itemTool"),
  crystalTool: document.getElementById("crystalTool"),
  monsterTool: document.getElementById("monsterTool"),
  portalTool: document.getElementById("portalTool"),
  clueTool: document.getElementById("clueTool"),
  lockTool: document.getElementById("lockTool"),
  mathAreaTool: document.getElementById("mathAreaTool"),
  mathEquationTool: document.getElementById("mathEquationTool"),
  startTool: document.getElementById("startTool"),
  itemOperation: document.getElementById("itemOperation"),
  itemValue: document.getElementById("itemValue"),
  itemValueLabel: document.getElementById("itemValueLabel"),
  itemValueField: document.getElementById("itemValueField"),
  itemOperationField: document.getElementById("itemOperationField"),
  monsterValueField: document.getElementById("monsterValueField"),
  monsterSpeedField: document.getElementById("monsterSpeedField"),
  monsterValue: document.getElementById("monsterValue"),
  monsterSpeed: document.getElementById("monsterSpeed"),
  codeToolValues: document.getElementById("codeToolValues"),
  clueText: document.getElementById("clueText"),
  clueImageInput: document.getElementById("clueImageInput"),
  clearClueImageButton: document.getElementById("clearClueImageButton"),
  lockCode: document.getElementById("lockCode"),
  gridCols: document.getElementById("gridCols"),
  gridRows: document.getElementById("gridRows"),
  applyGridButton: document.getElementById("applyGridButton"),
  showGrid: document.getElementById("showGrid"),
  gridColor: document.getElementById("gridColor"),
  gridOpacity: document.getElementById("gridOpacity"),
  gridOpacityValue: document.getElementById("gridOpacityValue"),
  walkableColor: document.getElementById("walkableColor"),
  walkableOpacity: document.getElementById("walkableOpacity"),
  walkableOpacityValue: document.getElementById("walkableOpacityValue"),
  saveDialog: document.getElementById("saveDialog"),
  saveFilename: document.getElementById("saveFilename"),
  saveDialogCancel: document.getElementById("saveDialogCancel"),
  saveDialogConfirm: document.getElementById("saveDialogConfirm"),
  onlinePanel: document.getElementById("onlinePanel"),
  onlineClass: document.getElementById("onlineClass"),
  onlineStudent: document.getElementById("onlineStudent"),
  onlineBackground: document.getElementById("onlineBackground"),
  onlineServerTrack: document.getElementById("onlineServerTrack"),
  onlineServerFigure: document.getElementById("onlineServerFigure"),
  onlineApplyTrackButton: document.getElementById("onlineApplyTrackButton"),
  onlineApplyFigureButton: document.getElementById("onlineApplyFigureButton"),
  onlineLoadButton: document.getElementById("onlineLoadButton"),
  onlineSaveButton: document.getElementById("onlineSaveButton"),
  onlineRefreshButton: document.getElementById("onlineRefreshButton"),
  onlineStatus: document.getElementById("onlineStatus"),
  clueDialog: document.getElementById("clueDialog"),
  clueDialogImage: document.getElementById("clueDialogImage"),
  clueDialogText: document.getElementById("clueDialogText"),
  clueDialogClose: document.getElementById("clueDialogClose"),
  clueEditDialog: document.getElementById("clueEditDialog"),
  clueEditDialogImage: document.getElementById("clueEditDialogImage"),
  clueEditText: document.getElementById("clueEditText"),
  clueEditImageInput: document.getElementById("clueEditImageInput"),
  clearClueEditImageButton: document.getElementById("clearClueEditImageButton"),
  clueEditDialogCancel: document.getElementById("clueEditDialogCancel"),
  clueEditDialogSave: document.getElementById("clueEditDialogSave"),
  lockDialog: document.getElementById("lockDialog"),
  lockAnswer: document.getElementById("lockAnswer"),
  lockError: document.getElementById("lockError"),
  lockDialogCancel: document.getElementById("lockDialogCancel"),
  lockDialogConfirm: document.getElementById("lockDialogConfirm"),
  lockEditDialog: document.getElementById("lockEditDialog"),
  lockEditCode: document.getElementById("lockEditCode"),
  lockEditError: document.getElementById("lockEditError"),
  lockEditDialogCancel: document.getElementById("lockEditDialogCancel"),
  lockEditDialogSave: document.getElementById("lockEditDialogSave"),
  mathToolValues: document.getElementById("mathToolValues"),
  mathAnswer: document.getElementById("mathAnswer"),
  mathEquationDialog: document.getElementById("mathEquationDialog"),
  mathEquationText: document.getElementById("mathEquationText"),
  mathEquationWidth: document.getElementById("mathEquationWidth"),
  mathEquationError: document.getElementById("mathEquationError"),
  mathEquationDialogCancel: document.getElementById("mathEquationDialogCancel"),
  mathEquationDialogSave: document.getElementById("mathEquationDialogSave"),
  mathZoneEditDialog: document.getElementById("mathZoneEditDialog"),
  mathZoneEditLabel: document.getElementById("mathZoneEditLabel"),
  mathZoneEditAnswer: document.getElementById("mathZoneEditAnswer"),
  mathZoneEditCancel: document.getElementById("mathZoneEditCancel"),
  mathZoneEditDelete: document.getElementById("mathZoneEditDelete"),
  mathZoneEditAddEquation: document.getElementById("mathZoneEditAddEquation"),
  mathZoneEditSave: document.getElementById("mathZoneEditSave"),
  proFrameSelect: document.getElementById("proFrameSelect"),
  proAddFrameButton: document.getElementById("proAddFrameButton"),
  proFrameFileInput: document.getElementById("proFrameFileInput"),
  proFrameDuration: document.getElementById("proFrameDuration"),
  proDeleteFrameButton: document.getElementById("proDeleteFrameButton"),
  proWalkTool: document.getElementById("proWalkTool"),
  proLosingTool: document.getElementById("proLosingTool"),
  proBlockTool: document.getElementById("proBlockTool"),
  proCopyTargets: document.getElementById("proCopyTargets"),
  proCopyWalkableButton: document.getElementById("proCopyWalkableButton"),
};

const GAME_STORAGE_KEY = "drawing-game:session";
const onlineQuery = new URLSearchParams(window.location.search);
const ONLINE_MODE = window.location.protocol !== "file:" && (
  onlineQuery.get("online") === "1"
  || window.location.pathname === "/online"
  || window.location.pathname.endsWith("/online/")
  || window.location.hostname === "localhost"
  || window.location.hostname === "127.0.0.1"
);
const PUBLIC_TUTORIAL_MODE = onlineQuery.get("tutorial") === "1" || onlineQuery.get("demo") === "1" || (
  window.location.hostname === "augustolrik.github.io"
  && /^\/tegnespil\/?$/i.test(window.location.pathname)
);
const ONLINE_API_BASE = String(onlineQuery.get("api") || "").trim().replace(/\/+$/, "");
let onlineState = { classes: [], backgrounds: [], tracks: [], figures: [] };
const GRID_LIMITS = Object.freeze({ min: 1, max: 128 });
const DEFAULT_GRID = Object.freeze({ cols: 15, rows: 15 });
// The built-in track is an old 32x42 example. Keep its fallback intact so
// older sessions/configs do not unexpectedly change when they are reopened.
const LEGACY_SEED_GRID = Object.freeze({ cols: 32, rows: 42 });
const DEFAULT_GRID_STYLE = Object.freeze({ color: "#e53935", opacity: 0.35 });
const DEFAULT_WALKABLE_STYLE = Object.freeze({ color: "#0c7c7c", opacity: 0.22 });

let mode = "play";
let editTool = "walk";
let proEditTool = "walk";
let proEditScope = "frame";
let activeProFrameIndex = 0;
let proAnimationFrameId = null;
let proAnimationLastTime = 0;
const proFrameImageCache = new Map();
let config = null;
let state = null;
let selectedTrackFileUrl = null;
let selectedFigureFileUrl = null;
let game = null;
let advancingTrack = false;
let backgroundMusicUrl = null;
let backgroundMusicFileName = "";
let backgroundMusicStatusOverride = "";

ui.loadTrackButton.textContent = "Indlaes bane";
ui.loadTrackButton.title = "Vaelg et banefoto fra din computer";
ui.loadFigureButton.textContent = "Indlaes figur";
ui.loadFigureButton.title = "Vaelg et figur-billede fra din computer";
let pendingClueImageData = null;
let activeLock = null;
let activeClueEdit = null;
let editClueImageData = null;
let activeLockEdit = null;
let activeMathEquation = null;
let pendingMathEquationCell = null;
let activeMathZoneId = null;
let editorPointerId = null;
let editorPointerStart = null;
let editorPointerStartCell = null;
let mathZonePreview = null;
let editorPointerDragged = false;
let suppressEditorClick = false;

function createTrackEntry(trackId, label, figureId = "figure_1", seed = false) {
  return {
    id: trackId,
    label,
    figureId,
    config: buildDefaultConfig(trackId, figureId),
    trackImageData: seed ? null : blankImageDataUrl(),
    figureImageData: seed ? null : blankImageDataUrl(),
  };
}

function createDefaultGame() {
  return {
    version: 2,
    id: "default",
    name: "Spil",
    tracks: [createTrackEntry("track_1", "Bane 1", "figure_1", true)],
    currentTrackIndex: 0,
  };
}

function normalizeGame(nextGame) {
  if (nextGame.tracks && nextGame.tracks.length) {
    return {
      version: 2,
      id: nextGame.id || "default",
      name: nextGame.name || "Spil",
      tracks: nextGame.tracks.map((track, index) => {
        const trackId = track.id || `track_${index + 1}`;
        const figureId = track.figureId || "figure_1";
        return {
          id: trackId,
          label: track.label || `Bane ${index + 1}`,
          figureId,
          config: normalizeConfig(track.config || buildDefaultConfig(trackId, figureId), trackId, figureId),
          trackImageData: track.trackImageData || null,
          figureImageData: track.figureImageData || null,
        };
      }),
      currentTrackIndex: Math.max(0, Math.min(nextGame.currentTrackIndex || 0, nextGame.tracks.length - 1)),
    };
  }
  return createDefaultGame();
}

function migrateBundleToGame(bundle) {
  if (bundle.tracks) return normalizeGame(bundle);
  const trackId = bundle.config?.id || "track_1";
  const figureId = (bundle.config?.figureImage || "").split("/").pop()?.replace(/\.[a-z0-9]+$/i, "") || "figure_1";
  return normalizeGame({
    version: 2,
    id: safeFileId(trackId),
    name: safeFileId(trackId),
    tracks: [{
      id: trackId,
      label: "Bane 1",
      figureId,
      config: bundle.config,
      trackImageData: bundle.trackImageData || null,
      figureImageData: bundle.figureImageData || null,
    }],
    currentTrackIndex: 0,
  });
}

function saveGameToStorage() {
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(game));
  } catch (error) {
    if (error?.name !== "QuotaExceededError") throw error;
    // Bundles with several embedded images can be larger than localStorage.
    // Keep the loaded game playable in memory without replacing the prior session.
  }
}

function storageKey(trackId = currentTrackId) {
  return `drawing-game:${trackId}`;
}

function assetPath(folder, assetId) {
  const trimmed = assetId.trim();
  if (folder === "Tracks" && safeFileId(trimmed) === "track_1") return "assets/default-track.svg";
  if (folder === "Figures" && safeFileId(trimmed) === "figure_1") return "assets/default-figure.svg";
  const filename = /\.[a-z0-9]+$/i.test(trimmed) ? trimmed : `${trimmed}.JPEG`;
  return `${folder}/${filename}`;
}

function safeFileId(assetId) {
  return assetId
    .trim()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9_-]+/gi, "_")
    .replace(/^_+|_+$/g, "") || "track";
}

function isSeedTrack(trackId) {
  return safeFileId(trackId) === "track_1";
}

function blankImageDataUrl() {
  const c = document.createElement("canvas");
  c.width = c.height = 8;
  const cx = c.getContext("2d");
  cx.fillStyle = "#ffffff";
  cx.fillRect(0, 0, 8, 8);
  return c.toDataURL("image/jpeg");
}

async function fileToDataUrl(file) {
  if ("createImageBitmap" in window) {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const imageCanvas = document.createElement("canvas");
      imageCanvas.width = bitmap.width;
      imageCanvas.height = bitmap.height;
      const imageCtx = imageCanvas.getContext("2d");
      imageCtx.drawImage(bitmap, 0, 0);
      bitmap.close();
      return imageCanvas.toDataURL("image/jpeg", 0.92);
    } catch {
      // Fall back to FileReader below when the browser cannot decode the image this way.
    }
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function revokeBlobUrl(url) {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
}

function updateBackgroundMusicUi() {
  const hasMusic = Boolean(backgroundMusicUrl);
  ui.musicPlayPauseButton.disabled = !hasMusic;
  ui.musicStopButton.disabled = !hasMusic;
  ui.musicVolume.disabled = !hasMusic;
  ui.musicPlayPauseButton.textContent = ui.backgroundMusic.paused ? "Afspil" : "Pause";

  if (backgroundMusicStatusOverride) {
    ui.musicStatus.textContent = backgroundMusicStatusOverride;
  } else if (!hasMusic) {
    ui.musicStatus.textContent = "Ingen musik valgt";
  } else if (ui.backgroundMusic.error) {
    ui.musicStatus.textContent = "MP3 kunne ikke afspilles";
  } else {
    ui.musicStatus.textContent = ui.backgroundMusic.paused ? "På pause" : "Afspiller";
  }
  ui.musicStatus.title = backgroundMusicFileName || ui.musicStatus.textContent;
}

function setBackgroundMusicStatus(statusMessage = "") {
  backgroundMusicStatusOverride = statusMessage;
  updateBackgroundMusicUi();
}

function releaseBackgroundMusic() {
  const oldUrl = backgroundMusicUrl;
  backgroundMusicUrl = null;
  backgroundMusicFileName = "";
  backgroundMusicStatusOverride = "";
  ui.backgroundMusic.pause();
  ui.backgroundMusic.removeAttribute("src");
  ui.backgroundMusic.load();
  revokeBlobUrl(oldUrl);
  updateBackgroundMusicUi();
}

async function playBackgroundMusic() {
  if (!backgroundMusicUrl) return;
  try {
    await ui.backgroundMusic.play();
    backgroundMusicStatusOverride = "";
    updateBackgroundMusicUi();
  } catch (error) {
    if (error?.name === "NotAllowedError") {
      setBackgroundMusicStatus("Tryk Afspil for at starte musikken");
    } else {
      setBackgroundMusicStatus("MP3 kunne ikke afspilles");
    }
  }
}

function stopBackgroundMusic() {
  if (!backgroundMusicUrl) return;
  backgroundMusicStatusOverride = "Stoppet";
  ui.backgroundMusic.pause();
  ui.backgroundMusic.currentTime = 0;
  updateBackgroundMusicUi();
}

async function handleMusicFileSelected(event) {
  const [file] = event.target.files || [];
  event.target.value = "";
  if (!file) return;
  const isMp3 = /\.mp3$/i.test(String(file.name || ""));
  if (!isMp3) {
    alert("Vælg en MP3-fil.");
    return;
  }

  const nextUrl = URL.createObjectURL(file);
  const oldUrl = backgroundMusicUrl;
  backgroundMusicUrl = nextUrl;
  backgroundMusicFileName = file.name;
  backgroundMusicStatusOverride = "";
  ui.backgroundMusic.pause();
  ui.backgroundMusic.src = nextUrl;
  ui.backgroundMusic.volume = Number(ui.musicVolume.value || 0.5);
  ui.backgroundMusic.load();
  revokeBlobUrl(oldUrl);
  setBackgroundMusicStatus("Indlæser musik…");
  await playBackgroundMusic();
}

function clampGridDimension(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(GRID_LIMITS.min, Math.min(GRID_LIMITS.max, Math.round(parsed)));
}

function validColor(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? String(value) : fallback;
}

function clampOpacity(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(0.05, Math.min(1, parsed));
}

function buildDefaultConfig(trackId = currentTrackId, figureId = currentFigureId) {
  const defaultGrid = isSeedTrack(trackId) ? LEGACY_SEED_GRID : DEFAULT_GRID;
  const cfg = {
    version: 1,
    id: trackId,
    trackImage: assetPath("Tracks", trackId),
    figureImage: assetPath("Figures", figureId),
    grid: { ...defaultGrid, ...DEFAULT_GRID_STYLE },
    walkableStyle: { ...DEFAULT_WALKABLE_STYLE },
    objective: { type: "collectExact", target: 15 },
    monsterSpeed: 1,
    start: isSeedTrack(trackId) ? { col: 4, row: 9 } : { col: 7, row: 7 },
    walkable: [],
    crystals: [],
    monsters: [],
    portals: [],
    clues: [],
    locks: [],
    mathZone: null,
    items: isSeedTrack(trackId) ? [
      { id: "coin_3", col: 21, row: 7, value: 3 },
      { id: "coin_20", col: 25, row: 16, value: 20 },
      { id: "star_5", col: 16, row: 21, value: 5 },
      { id: "moon_2", col: 11, row: 28, value: 2 },
      { id: "coin_1", col: 22, row: 28, value: 1 },
      { id: "dragon_minus_7", col: 23, row: 27, value: -7 },
      { id: "coin_7", col: 18, row: 36, value: 7 },
      { id: "goal_minus_8", col: 30, row: 5, value: -8 }
    ] : [],
  };

  if (!isSeedTrack(trackId)) {
    cfg.walkable = [key(cfg.start.col, cfg.start.row)];
    return cfg;
  }

  const walk = new Set();
  const addRect = (c1, r1, c2, r2) => {
    for (let row = r1; row <= r2; row += 1) {
      for (let col = c1; col <= c2; col += 1) {
        walk.add(key(col, row));
      }
    }
  };

  addRect(3, 7, 9, 11);
  addRect(8, 7, 18, 10);
  addRect(18, 5, 28, 10);
  addRect(28, 3, 31, 7);
  addRect(19, 9, 24, 13);
  addRect(23, 13, 26, 24);
  addRect(25, 16, 30, 20);
  addRect(21, 24, 28, 30);
  addRect(15, 24, 22, 28);
  addRect(13, 18, 19, 25);
  addRect(9, 18, 14, 30);
  addRect(6, 28, 13, 34);
  addRect(18, 28, 21, 34);
  addRect(13, 31, 19, 37);
  addRect(18, 34, 23, 39);
  addRect(5, 12, 8, 34);

  cfg.walkable = Array.from(walk).sort();
  return cfg;
}

function key(col, row) {
  return `${col},${row}`;
}

function parseKey(cellKey) {
  const [col, row] = cellKey.split(",").map(Number);
  return { col, row };
}

async function loadConfig() {
  const stored = localStorage.getItem(storageKey());
  if (stored) {
    try {
      return normalizeConfig(JSON.parse(stored));
    } catch {
      localStorage.removeItem(storageKey());
    }
  }
  try {
    const response = await fetch(`Configs/${safeFileId(currentTrackId)}.json`, { cache: "no-store" });
    if (response.ok) {
      return normalizeConfig(await response.json());
    }
  } catch {
    // Opening the HTML directly can block JSON fetches; the built-in seed keeps it playable.
  }
  return normalizeConfig(buildDefaultConfig());
}

function calculateExpression(expression) {
  const input = String(expression || "")
    .replace(/,/g, ".")
    .replace(/\s*=\s*$/, "");
  let index = 0;
  const skipWhitespace = () => {
    while (/\s/.test(input[index] || "")) index += 1;
  };
  const parseExpression = () => {
    let value = parseTerm();
    while (true) {
      skipWhitespace();
      const operator = input[index];
      if (operator !== "+" && operator !== "-") break;
      index += 1;
      const next = parseTerm();
      value = operator === "+" ? value + next : value - next;
    }
    return value;
  };
  const parseTerm = () => {
    let value = parseFactor();
    while (true) {
      skipWhitespace();
      const operator = input[index];
      if (!["*", "/", "×", "÷", "x", "X", "·", ":"].includes(operator)) break;
      index += 1;
      const next = parseFactor();
      value = operator === "/" || operator === "÷" || operator === ":" ? value / next : value * next;
    }
    return value;
  };
  const parseFactor = () => {
    skipWhitespace();
    if (input[index] === "+" || input[index] === "-") {
      const negative = input[index] === "-";
      index += 1;
      const value = parseFactor();
      return negative ? -value : value;
    }
    if (input[index] === "(") {
      index += 1;
      const value = parseExpression();
      skipWhitespace();
      if (input[index] !== ")") return Number.NaN;
      index += 1;
      return value;
    }
    const match = input.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
    if (!match) return Number.NaN;
    index += match[0].length;
    return Number(match[0]);
  };

  const result = parseExpression();
  skipWhitespace();
  return index === input.length && Number.isFinite(result) ? result : null;
}

function normalizeMathZone(source, grid) {
  const raw = source.mathZone && typeof source.mathZone === "object"
    ? source.mathZone
    : source.mathArea && typeof source.mathArea === "object"
      ? source.mathArea
      : null;
  if (!raw) return null;

  const col = Math.max(0, Math.min(grid.cols - 1, Math.round(Number(raw.col ?? raw.x) || 0)));
  const row = Math.max(0, Math.min(grid.rows - 1, Math.round(Number(raw.row ?? raw.y) || 0)));
  const width = Math.max(1, Math.min(grid.cols - col, Math.round(Number(raw.width ?? raw.cols) || 1)));
  const height = Math.max(1, Math.min(grid.rows - row, Math.round(Number(raw.height ?? raw.rows) || 1)));
  const answerValue = Number(raw.correctAnswer ?? raw.answer ?? source.mathAnswer);
  const correctAnswer = Number.isFinite(answerValue) ? answerValue : 0;
  const rawEquations = Array.isArray(raw.equations)
    ? raw.equations
    : Array.isArray(source.mathEquations)
      ? source.mathEquations
      : [];
  const equations = rawEquations.map((equation, index) => {
    const text = String(equation.text ?? equation.expression ?? equation.equation ?? "").trim();
    const parsedResult = Number(equation.result ?? equation.answer);
    const result = Number.isFinite(parsedResult) ? parsedResult : calculateExpression(text);
    const equationCol = Number(equation.col ?? equation.x);
    const equationRow = Number(equation.row ?? equation.y);
    return {
      id: equation.id || `math_equation_${index + 1}`,
      col: Math.round(Number.isFinite(equationCol) ? equationCol : col),
      row: Math.round(Number.isFinite(equationRow) ? equationRow : row),
      width: Math.max(1, Math.min(width, Math.round(Number(equation.width ?? equation.size) || 1))),
      text,
      result,
    };
  }).filter((equation) => (
    equation.text
    && Number.isFinite(equation.result)
    && equation.col >= col
    && equation.row >= row
    && equation.col + equation.width <= col + width
    && equation.row < row + height
  ));

  return {
    id: String(raw.id || "math_zone_1"),
    col,
    row,
    width,
    height,
    correctAnswer,
    equations,
  };
}

function normalizeMathZones(source, grid) {
  const rawZones = Array.isArray(source.mathZones)
    ? source.mathZones
    : source.mathZone && typeof source.mathZone === "object"
      ? [source.mathZone]
      : source.mathArea && typeof source.mathArea === "object"
        ? [source.mathArea]
        : [];
  const seenIds = new Set();
  const seenEquationIds = new Set();
  return rawZones.map((rawZone, index) => {
    const zone = normalizeMathZone({
      mathZone: rawZone,
      mathEquations: rawZones.length === 1 ? source.mathEquations : [],
      mathAnswer: source.mathAnswer,
    }, grid);
    if (!zone) return null;
    const baseId = String(rawZone.id || `math_zone_${index + 1}`);
    let id = baseId;
    let suffix = 2;
    while (seenIds.has(id)) id = `${baseId}_${suffix++}`;
    seenIds.add(id);
    zone.id = id;
    zone.equations = zone.equations.map((equation, equationIndex) => {
      const baseEquationId = String(equation.id || `${id}_equation_${equationIndex + 1}`);
      let equationId = baseEquationId;
      let equationSuffix = 2;
      while (seenEquationIds.has(equationId)) equationId = `${baseEquationId}_${equationSuffix++}`;
      seenEquationIds.add(equationId);
      return { ...equation, id: equationId };
    });
    return zone;
  }).filter(Boolean);
}

function normalizeProCells(cells, grid) {
  const normalized = new Set();
  for (const value of Array.isArray(cells) ? cells : []) {
    const parsed = typeof value === "string"
      ? parseKey(value)
      : { col: Number(value?.col), row: Number(value?.row) };
    if (!Number.isInteger(parsed.col) || !Number.isInteger(parsed.row)) continue;
    if (parsed.col < 0 || parsed.row < 0 || parsed.col >= grid.cols || parsed.row >= grid.rows) continue;
    normalized.add(key(parsed.col, parsed.row));
  }
  return Array.from(normalized).sort();
}

function normalizePro(source, grid) {
  const raw = source.pro && typeof source.pro === "object" ? source.pro : null;
  if (!raw) return null;
  const frameDurationMs = Math.max(80, Math.min(10000, Math.round(Number(raw.frameDurationMs) || 500)));
  const seenIds = new Set();
  const frames = (Array.isArray(raw.frames) ? raw.frames : []).map((frame, index) => {
    const baseId = String(frame?.id || `frame_${index + 1}`).trim() || `frame_${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (seenIds.has(id)) id = `${baseId}_${suffix++}`;
    seenIds.add(id);
    return {
      id,
      imageData: typeof frame?.imageData === "string" ? frame.imageData : null,
      imagePath: typeof frame?.imagePath === "string" ? frame.imagePath : "",
      durationMs: Math.max(80, Math.min(10000, Math.round(Number(frame?.durationMs) || frameDurationMs))),
      walkable: normalizeProCells(frame?.walkable, grid),
      losing: normalizeProCells(frame?.losing, grid),
    };
  });
  return {
    version: 1,
    enabled: raw.enabled !== false && frames.length > 0,
    frameDurationMs,
    frames,
  };
}

function normalizeConfig(nextConfig, trackId = currentTrackId, figureId = currentFigureId) {
  const source = nextConfig && typeof nextConfig === "object" ? nextConfig : {};
  const fallback = buildDefaultConfig(trackId, figureId);
  const sourceGrid = source.grid && typeof source.grid === "object" ? source.grid : {};
  const sourceWalkableStyle = source.walkableStyle && typeof source.walkableStyle === "object"
    ? source.walkableStyle
    : source.walkableAppearance && typeof source.walkableAppearance === "object"
      ? source.walkableAppearance
      : {};
  const walkableColor = validColor(
    sourceWalkableStyle.color ?? source.walkableColor,
    fallback.walkableStyle.color
  );
  const walkableOpacity = clampOpacity(
    sourceWalkableStyle.opacity ?? source.walkableOpacity,
    fallback.walkableStyle.opacity
  );
  const normalizedClues = (source.clues || fallback.clues || []).map((clue, index) => ({
    id: clue.id || `clue_${index + 1}`,
    col: Number(clue.col),
    row: Number(clue.row),
    text: String(clue.text || ""),
    imageData: clue.imageData || null,
  }));
  const clueCells = new Set(normalizedClues.map((clue) => key(clue.col, clue.row)));
  const normalizedLocks = (source.locks || fallback.locks || [])
    .map((lock, index) => ({
      id: lock.id || `lock_${index + 1}`,
      col: Number(lock.col),
      row: Number(lock.row),
      code: String(lock.code || ""),
    }))
    .filter((lock) => lock.code.trim() && !clueCells.has(key(lock.col, lock.row)));
  const normalizedGrid = {
    cols: clampGridDimension(sourceGrid.cols, fallback.grid.cols),
    rows: clampGridDimension(sourceGrid.rows, fallback.grid.rows),
  };
  const normalizedMathZones = normalizeMathZones(source, normalizedGrid);

  const normalized = {
    ...fallback,
    ...source,
    grid: {
      ...fallback.grid,
      cols: clampGridDimension(sourceGrid.cols, fallback.grid.cols),
      rows: clampGridDimension(sourceGrid.rows, fallback.grid.rows),
      color: validColor(sourceGrid.color, fallback.grid.color),
      opacity: clampOpacity(sourceGrid.opacity, fallback.grid.opacity),
    },
    walkableStyle: {
      ...fallback.walkableStyle,
      color: walkableColor,
      opacity: walkableOpacity,
    },
    objective: { ...fallback.objective, ...(source.objective || {}) },
    monsterSpeed: Math.max(1, Math.min(10, Number(source.monsterSpeed || fallback.monsterSpeed || 1))),
    start: { ...fallback.start, ...(source.start || {}) },
    walkable: Array.from(new Set(source.walkable || fallback.walkable)),
    items: (source.items || fallback.items).map((item, index) => ({
      id: item.id || `item_${index + 1}`,
      col: Number(item.col),
      row: Number(item.row),
      operation: ["add", "multiply", "divide"].includes(item.operation) ? item.operation : "add",
      value: Number(item.value),
    })),
    crystals: (source.crystals || fallback.crystals || []).map((crystal, index) => ({
      id: crystal.id || `crystal_${index + 1}`,
      col: Number(crystal.col),
      row: Number(crystal.row),
      value: Math.max(1, Number(crystal.value || 1)),
    })),
    monsters: (source.monsters || fallback.monsters || []).map((monster, index) => ({
      id: monster.id || `monster_${index + 1}`,
      col: Number(monster.col),
      row: Number(monster.row),
      value: Math.max(1, Number(monster.value || 1)),
    })),
    portals: (source.portals || fallback.portals || []).map((portal, index) => ({
      id: portal.id || `portal_${index + 1}`,
      col: Number(portal.col),
      row: Number(portal.row),
    })),
    clues: normalizedClues,
    locks: normalizedLocks,
    mathZones: normalizedMathZones,
    // Keep the first area as a compatibility alias for older integrations.
    mathZone: normalizedMathZones[0] || null,
    pro: normalizePro(source, {
      cols: clampGridDimension(sourceGrid.cols, fallback.grid.cols),
      rows: clampGridDimension(sourceGrid.rows, fallback.grid.rows),
    }),
  };

  for (const zone of normalized.mathZones) {
    for (const equation of zone.equations) {
      for (let offset = 0; offset < equation.width; offset += 1) {
        normalized.walkable.push(key(equation.col + offset, equation.row));
      }
    }
  }
  normalized.walkable = Array.from(new Set(normalized.walkable));
  return normalized;
}

function newGameState() {
  return {
    player: { ...config.start },
    frameIndex: 0,
    score: 0,
    collected: [],
    crystals: [],
    collectedCrystals: [],
    monsters: config.monsters.map((monster) => ({ ...monster })),
    defeatedMonsters: [],
    dead: false,
    message: "",
    trackCompleted: false,
    mathStatus: "idle",
    mathZoneStatuses: Object.fromEntries(mathZones().map((zone) => [zone.id, "idle"])),
    hiddenMathEquations: [],
  };
}

function activeTrack() {
  return game.tracks[game.currentTrackIndex];
}

function createProFrame(id, { imageData = null, imagePath = "", walkable = [], losing = [] } = {}) {
  const durationMs = Math.max(80, Math.min(10000, Math.round(Number(config?.pro?.frameDurationMs) || 500)));
  return {
    id: id || `frame_${Date.now()}`,
    imageData,
    imagePath,
    durationMs,
    walkable: normalizeProCells(walkable, config.grid),
    losing: normalizeProCells(losing, config.grid),
  };
}

function ensureProConfig() {
  if (!config) return null;
  if (!config.pro || typeof config.pro !== "object") {
    config.pro = { version: 1, enabled: true, frameDurationMs: 500, frames: [] };
  }
  config.pro.version = 1;
  config.pro.enabled = true;
  config.pro.frameDurationMs = Math.max(80, Math.min(10000, Math.round(Number(config.pro.frameDurationMs) || 500)));
  if (!Array.isArray(config.pro.frames)) config.pro.frames = [];
  if (!config.pro.frames.length) {
    const track = activeTrack();
    const imageData = track?.trackImageData
      || (typeof config.trackImage === "string" && config.trackImage.startsWith("data:") ? config.trackImage : null);
    const imagePath = imageData ? "" : String(config.trackImage || "");
    config.pro.frames.push(createProFrame("frame_1", {
      imageData,
      imagePath,
      walkable: config.walkable,
    }));
  }
  activeProFrameIndex = Math.max(0, Math.min(activeProFrameIndex, config.pro.frames.length - 1));
  return config.pro;
}

function isProConfigured() {
  return Boolean(config?.pro?.enabled && Array.isArray(config.pro.frames) && config.pro.frames.length);
}

function activeProFrame() {
  if (!isProConfigured()) return null;
  const index = mode === "pro" ? activeProFrameIndex : (state?.frameIndex || 0);
  return config.pro.frames[Math.max(0, Math.min(index, config.pro.frames.length - 1))] || null;
}

function proFrameImage(frame) {
  if (!frame) return null;
  const source = frame.imageData || frame.imagePath;
  if (!source) return null;
  const cacheKey = `${currentTrackId}:${frame.id}:${source}`;
  if (proFrameImageCache.has(cacheKey)) return proFrameImageCache.get(cacheKey);
  const image = new Image();
  image.onload = () => draw();
  image.src = source;
  proFrameImageCache.set(cacheKey, image);
  return image;
}

function proWalkableCells() {
  return (mode === "play" || mode === "pro") ? activeProFrame()?.walkable || null : null;
}

function proLosingCells() {
  return (mode === "play" || mode === "pro") ? activeProFrame()?.losing || null : null;
}

function isProPlayback() {
  return mode === "play" && isProConfigured();
}

function stopProAnimation() {
  if (proAnimationFrameId !== null) cancelAnimationFrame(proAnimationFrameId);
  proAnimationFrameId = null;
  proAnimationLastTime = 0;
}

function loseOnProCell(message = "Du trådte på et taber-felt. Du tabte.") {
  if (!state || state.dead || state.trackCompleted) return;
  state.dead = true;
  state.message = message;
  draw();
}

function checkProLosingCell() {
  if (!isProPlayback() || !state?.player) return;
  if (proLosingCells()?.includes(key(state.player.col, state.player.row))) {
    loseOnProCell();
  }
}

function startProAnimation() {
  stopProAnimation();
  if (!isProPlayback()) return;
  const tick = (now) => {
    if (!isProPlayback() || state.dead || state.trackCompleted) {
      proAnimationFrameId = null;
      return;
    }
    const frame = activeProFrame();
    const duration = Math.max(80, Number(frame?.durationMs || config.pro.frameDurationMs || 500));
    if (!proAnimationLastTime) proAnimationLastTime = now;
    if (now - proAnimationLastTime >= duration) {
      state.frameIndex = (state.frameIndex + 1) % config.pro.frames.length;
      proAnimationLastTime = now;
      checkProLosingCell();
      draw();
    }
    proAnimationFrameId = requestAnimationFrame(tick);
  };
  proAnimationFrameId = requestAnimationFrame(tick);
}

function syncProEditorUi() {
  if (!ui.proFrameSelect || !ui.proCopyTargets || !config) return;
  const frames = config.pro?.frames || [];
  ui.proFrameSelect.innerHTML = "";
  ui.proCopyTargets.innerHTML = "";
  frames.forEach((frame, index) => {
    const label = `Ramme ${index + 1}${frame.imagePath ? ` · ${frame.imagePath}` : ""}`;
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = label;
    ui.proFrameSelect.appendChild(option);
    if (index !== activeProFrameIndex) {
      const target = option.cloneNode(true);
      ui.proCopyTargets.appendChild(target);
    }
  });
  if (frames.length) {
    activeProFrameIndex = Math.max(0, Math.min(activeProFrameIndex, frames.length - 1));
    ui.proFrameSelect.value = String(activeProFrameIndex);
    ui.proFrameDuration.value = String(frames[activeProFrameIndex].durationMs || config.pro?.frameDurationMs || 500);
  } else {
    ui.proFrameDuration.value = String(config.pro?.frameDurationMs || 500);
  }
  ui.proDeleteFrameButton.disabled = frames.length <= 1;
  ui.proCopyWalkableButton.disabled = frames.length <= 1;
}

function persistActiveConfig() {
  if (!game?.tracks?.length || !config) return;
  activeTrack().config = JSON.parse(JSON.stringify(config));
  saveGameToStorage();
}

function syncTrackSelect() {
  ui.trackSelect.innerHTML = "";
  game.tracks.forEach((track, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = track.label || `Bane ${index + 1}`;
    ui.trackSelect.appendChild(option);
  });
  ui.trackSelect.value = String(game.currentTrackIndex);
}

function syncTrackProgress() {
  ui.trackProgressText.textContent = `${game.currentTrackIndex + 1} / ${game.tracks.length}`;
}

async function captureImageData(image, existingData) {
  // Same-origin teacher-server images are intentionally kept as references.
  // Trying to rasterize a remote image can taint the canvas, and storing the
  // API URL lets every student reopen the same class background later.
  if (existingData && !String(existingData).startsWith("data:")) return existingData;
  await waitForImage(image);
  if (!image.naturalWidth) return existingData || null;
  if (image.src.startsWith("data:")) return image.src;
  return imageToDataUrl(image);
}

async function commitActiveTrack() {
  if (!game?.tracks.length) return;
  const track = activeTrack();
  config.id = currentTrackId;
  const trackImageSource = selectedTrackFileUrl || track.trackImageData || assetPath("Tracks", currentTrackId);
  const figureImageSource = selectedFigureFileUrl || track.figureImageData || assetPath("Figures", currentFigureId);
  config.trackImage = trackImageSource;
  config.figureImage = figureImageSource;
  config.objective.type = ui.objectiveType.value;
  config.objective.target = Number(ui.targetPoints.value || 0);
  config.monsterSpeed = Math.max(1, Math.min(10, Number(ui.monsterSpeed.value || 1)));
  if (isMathObjective()) {
    const answer = Number(ui.mathAnswer.value);
    const selectedZone = mathZoneById(activeMathZoneId) || mathZones()[0];
    if (selectedZone && Number.isFinite(answer)) selectedZone.correctAnswer = answer;
    syncMathZoneAlias();
  }
  config.walkable = Array.from(new Set(config.walkable)).sort();
  if (config.pro?.frames) {
    config.pro.frames = config.pro.frames.map((frame) => ({
      ...frame,
      walkable: normalizeProCells(frame.walkable, config.grid),
      losing: normalizeProCells(frame.losing, config.grid),
      durationMs: Math.max(80, Math.min(10000, Math.round(Number(frame.durationMs) || config.pro.frameDurationMs || 500))),
    }));
  }
  delete config.lock;

  track.id = currentTrackId;
  track.label = track.label || `Bane ${game.currentTrackIndex + 1}`;
  track.figureId = currentFigureId;
  track.config = JSON.parse(JSON.stringify(config));
  track.trackImageData = await captureImageData(trackImage, track.trackImageData);
  track.figureImageData = await captureImageData(figureImage, track.figureImageData);
  saveGameToStorage();
}

function applyTrackImages(track) {
  revokeBlobUrl(selectedTrackFileUrl);
  revokeBlobUrl(selectedFigureFileUrl);
  selectedTrackFileUrl = null;
  selectedFigureFileUrl = null;

  if (track.trackImageData) {
    selectedTrackFileUrl = track.trackImageData;
    trackImage.src = track.trackImageData;
  } else {
    trackImage.src = assetPath("Tracks", track.id);
  }

  if (track.figureImageData) {
    selectedFigureFileUrl = track.figureImageData;
    figureImage.src = track.figureImageData;
  } else {
    figureImage.src = assetPath("Figures", track.figureId);
  }
}

async function activateTrack(index, { resetPlay = true } = {}) {
  if (index < 0 || index >= game.tracks.length) return false;
  if (mode === "editor" || mode === "pro") await commitActiveTrack();
  stopProAnimation();
  activeProFrameIndex = 0;

  game.currentTrackIndex = index;
  const track = activeTrack();
  currentTrackId = track.id;
  currentFigureId = track.figureId;
  config = normalizeConfig(track.config, track.id, track.figureId);
  applyTrackImages(track);
  ui.clueDialog.hidden = true;
  closeClueEditDialog();
  closeLockDialog();
  closeLockEditDialog();
  closeMathEquationDialog();
  closeMathZoneEditDialog();
  pendingClueImageData = null;
  ui.clueImageInput.value = "";

  if (resetPlay) state = newGameState();
  syncUiFromConfig();
  await Promise.all([waitForImage(trackImage), waitForImage(figureImage)]);
  resizeCanvas();
  saveGameToStorage();
  if (mode === "play") startProAnimation();
  return true;
}

async function addTrack() {
  await commitActiveTrack();
  const trackNumber = game.tracks.length + 1;
  const trackId = `track_${trackNumber}_${Date.now()}`;
  game.tracks.push(createTrackEntry(trackId, `Bane ${trackNumber}`, currentFigureId, false));
  await activateTrack(game.tracks.length - 1);
  setTool("walk");
}

async function goToNextTrack() {
  if (advancingTrack) return;
  const nextIndex = game.currentTrackIndex + 1;
  if (nextIndex >= game.tracks.length) {
    state.message = "Alle baner gennemført!";
    draw();
    return;
  }
  advancingTrack = true;
  state.message = "Bane gennemført! Næste bane...";
  draw();
  window.setTimeout(async () => {
    await activateTrack(nextIndex);
    advancingTrack = false;
    if (mode === "play") setMode("play");
  }, 1200);
}

function syncAccessState() {
  ui.playHelp.hidden = mode !== "play";
  ui.editorTools.hidden = mode !== "editor" && mode !== "pro";
  ui.proEditorTools.hidden = mode !== "pro";
  document.body.classList.toggle("play-mode", mode === "play");
  document.body.classList.toggle("pro-mode", mode === "pro");
  const assetLoadDisabled = mode === "play";
  ui.loadTrackButton.disabled = assetLoadDisabled;
  ui.loadFigureButton.disabled = assetLoadDisabled;
  ui.trackFileInput.disabled = assetLoadDisabled;
  ui.figureFileInput.disabled = assetLoadDisabled;
  ui.trackInput.disabled = assetLoadDisabled;
  ui.figureInput.disabled = assetLoadDisabled;
  ui.modeText.textContent = mode === "play" ? "Spil" : mode === "pro" ? "PRO-editor" : "Redaktør";
  syncObjectiveTools();
  syncProEditorUi();
}

function isMonsterObjective() {
  return ui.objectiveType.value === "monsterModulo"
    || ui.objectiveType.value === "pointsAndMonsters"
    || ui.objectiveType.value === "pointsMonstersPortals";
}

function isPortalObjective() {
  return ui.objectiveType.value === "pointsMonstersPortals";
}

function isCodeObjective() {
  return ui.objectiveType.value === "codeLocks";
}

function isMathObjective() {
  return ui.objectiveType.value === "mathZone";
}

function isToolAllowed(tool) {
  const monsterMode = isMonsterObjective();
  const codeMode = isCodeObjective();
  const mathMode = isMathObjective();
  if (tool === "item") return !codeMode && !mathMode && ui.objectiveType.value !== "monsterModulo";
  if (tool === "crystal" || tool === "monster") return monsterMode;
  if (tool === "portal") return isPortalObjective();
  if (tool === "clue" || tool === "lock") return codeMode;
  if (tool === "mathArea" || tool === "mathEquation") return mathMode;
  return true;
}

function syncObjectiveTools() {
  const monsterMode = isMonsterObjective();
  const codeMode = isCodeObjective();
  const mathMode = isMathObjective();
  const pureMonsterMode = ui.objectiveType.value === "monsterModulo";

  ui.itemTool.hidden = codeMode || pureMonsterMode || mathMode;
  ui.crystalTool.hidden = !monsterMode || mathMode;
  ui.monsterTool.hidden = !monsterMode || mathMode;
  ui.portalTool.hidden = !isPortalObjective() || mathMode;
  ui.clueTool.hidden = !codeMode;
  ui.lockTool.hidden = !codeMode;
  ui.mathAreaTool.hidden = !mathMode;
  ui.mathEquationTool.hidden = !mathMode;
  // PRO has its own frame-path Gå/Taber/Blok tools. Keep the shared removal
  // action available for common objects, but label it distinctly.
  ui.walkTool.hidden = mode === "pro";
  ui.blockTool.hidden = false;
  ui.blockTool.textContent = mode === "pro" ? "Fjern indhold" : "Blok";

  ui.itemValueField.hidden = codeMode || mathMode;
  ui.itemOperationField.hidden = monsterMode || codeMode || mathMode;
  ui.monsterValueField.hidden = !monsterMode || mathMode;
  ui.monsterSpeedField.hidden = !monsterMode || mathMode;
  ui.codeToolValues.hidden = !codeMode;
  ui.mathToolValues.hidden = !mathMode;
  ui.targetPointsField.hidden = codeMode || pureMonsterMode || mathMode;

  ui.itemValueLabel.textContent = monsterMode ? "Krystalværdi" : "Genstandsværdi";
  ui.itemValue.min = monsterMode ? "1" : "-99";

  if (!isToolAllowed(editTool)) {
    if (mode === "pro" && proEditScope === "frame") setProTool("walk");
    else setTool(mode === "pro" ? "start" : "walk");
  }
}

function clampCell(cell, grid = config.grid) {
  return {
    col: Math.max(0, Math.min(grid.cols - 1, cell.col)),
    row: Math.max(0, Math.min(grid.rows - 1, cell.row)),
  };
}

function scaleCell(cell, oldGrid, newGrid) {
  const col = Number(cell?.col);
  const row = Number(cell?.row);
  if (!Number.isFinite(col) || !Number.isFinite(row)) {
    return { col: 0, row: 0 };
  }
  return clampCell({
    col: Math.floor(((col + 0.5) / oldGrid.cols) * newGrid.cols),
    row: Math.floor(((row + 0.5) / oldGrid.rows) * newGrid.rows),
  }, newGrid);
}

function applyGridScale() {
  if ((mode !== "editor" && mode !== "pro") || !config?.grid) return;
  const oldGrid = {
    cols: clampGridDimension(config.grid.cols, DEFAULT_GRID.cols),
    rows: clampGridDimension(config.grid.rows, DEFAULT_GRID.rows),
  };
  const newGrid = {
    ...config.grid,
    cols: clampGridDimension(ui.gridCols.value, oldGrid.cols),
    rows: clampGridDimension(ui.gridRows.value, oldGrid.rows),
  };

  // Show the actual accepted values when the browser input contains a blank,
  // decimal, or out-of-range value instead of silently leaving stale values.
  ui.gridCols.value = String(newGrid.cols);
  ui.gridRows.value = String(newGrid.rows);

  if (oldGrid.cols === newGrid.cols && oldGrid.rows === newGrid.rows) return;

  const scaledWalkable = new Set();
  for (const entry of config.walkable) {
    const parsed = parseKey(entry);
    if (!Number.isFinite(parsed.col) || !Number.isFinite(parsed.row)) continue;
    const cell = scaleCell(parsed, oldGrid, newGrid);
    scaledWalkable.add(key(cell.col, cell.row));
  }

  config.grid = newGrid;
  config.start = scaleCell(config.start, oldGrid, newGrid);
  config.walkable = Array.from(scaledWalkable).sort();
  config.items = config.items.map((item) => ({
    ...item,
    ...scaleCell(item, oldGrid, newGrid),
  }));
  config.crystals = config.crystals.map((crystal) => ({
    ...crystal,
    ...scaleCell(crystal, oldGrid, newGrid),
  }));
  config.monsters = config.monsters.map((monster) => ({
    ...monster,
    ...scaleCell(monster, oldGrid, newGrid),
  }));
  config.portals = config.portals.map((portal) => ({
    ...portal,
    ...scaleCell(portal, oldGrid, newGrid),
  }));
  config.clues = config.clues.map((clue) => ({
    ...clue,
    ...scaleCell(clue, oldGrid, newGrid),
  }));
  config.locks = config.locks.map((lock) => ({
    ...lock,
    ...scaleCell(lock, oldGrid, newGrid),
  }));
  for (const oldZone of mathZones()) {
    const zoneStart = scaleCell(oldZone, oldGrid, newGrid);
    const zoneEnd = scaleCell({
      col: oldZone.col + oldZone.width - 1,
      row: oldZone.row + oldZone.height - 1,
    }, oldGrid, newGrid);
    const scaledZoneWidth = Math.max(1, zoneEnd.col - zoneStart.col + 1);
    const scaledZoneHeight = Math.max(1, zoneEnd.row - zoneStart.row + 1);
    Object.assign(oldZone, {
      ...zoneStart,
      width: scaledZoneWidth,
      height: scaledZoneHeight,
      equations: oldZone.equations.map((equation) => {
        const cell = scaleCell(equation, oldGrid, newGrid);
        const width = Math.max(1, Math.min(equation.width, scaledZoneWidth));
        return {
          ...equation,
          ...cell,
          width,
          col: Math.min(cell.col, zoneStart.col + scaledZoneWidth - width),
          row: Math.min(cell.row, zoneStart.row + scaledZoneHeight - 1),
        };
      }),
    });
  }
  syncMathZoneAlias();
  if (config.pro?.frames) {
    for (const frame of config.pro.frames) {
      const scaleEntries = (entries) => {
        const scaled = new Set();
        for (const entry of entries || []) {
          const parsed = parseKey(entry);
          if (!Number.isFinite(parsed.col) || !Number.isFinite(parsed.row)) continue;
          const cell = scaleCell(parsed, oldGrid, newGrid);
          scaled.add(key(cell.col, cell.row));
        }
        return Array.from(scaled).sort();
      };
      frame.walkable = scaleEntries(frame.walkable);
      frame.losing = scaleEntries(frame.losing);
    }
  }

  const startKey = key(config.start.col, config.start.row);
  if (!config.walkable.includes(startKey)) config.walkable.push(startKey);
  state = newGameState();
  syncUiFromConfig();
  persistActiveConfig();
  draw();
}

function syncUiFromConfig() {
  ui.trackInput.value = currentTrackId;
  ui.figureInput.value = currentFigureId;
  const trackTitle = activeTrack().label || currentTrackId;
  ui.trackLabel.textContent = `${trackTitle} · ${game.tracks.length} baner`;
  ui.playHelp.textContent = `${trackTitle}. Brug piletasterne til at flytte. Når banen er gennemført, går spillet videre automatisk.`;
  ui.targetPoints.value = config.objective.target;
  ui.objectiveType.value = config.objective.type;
  const selectedMathZone = mathZoneById(activeMathZoneId) || mathZones()[0] || null;
  activeMathZoneId = selectedMathZone?.id || null;
  ui.mathAnswer.value = selectedMathZone?.correctAnswer ?? 10;
  ui.monsterSpeed.value = config.monsterSpeed || 1;
  ui.gridCols.value = config.grid.cols;
  ui.gridRows.value = config.grid.rows;
  ui.gridColor.value = config.grid.color;
  ui.gridOpacity.value = config.grid.opacity;
  ui.gridOpacityValue.textContent = `${Math.round(config.grid.opacity * 100)} %`;
  ui.walkableColor.value = config.walkableStyle.color;
  ui.walkableOpacity.value = config.walkableStyle.opacity;
  ui.walkableOpacityValue.textContent = `${Math.round(config.walkableStyle.opacity * 100)} %`;
  syncTrackSelect();
  syncTrackProgress();
  syncProEditorUi();
  syncAccessState();
}

function setMode(nextMode) {
  const previousMode = mode;
  if ((mode === "editor" || mode === "pro") && nextMode === "play") void commitActiveTrack();
  if (nextMode !== "editor") {
    closeClueEditDialog();
    closeLockEditDialog();
    closeMathEquationDialog();
    closeMathZoneEditDialog();
  }
  if (nextMode !== "play") stopProAnimation();
  mode = nextMode;
  const proCollapseSections = document.querySelectorAll(".pro-collapse-section");
  if (mode === "pro" && previousMode !== "pro") {
    for (const section of proCollapseSections) section.open = false;
  } else if (mode !== "pro") {
    for (const section of proCollapseSections) section.open = true;
  }
  mathZonePreview = null;
  ui.playModeButton.classList.toggle("active", mode === "play");
  ui.editModeButton.classList.toggle("active", mode === "editor");
  ui.proModeButton.classList.toggle("active", mode === "pro");
  if (mode === "pro") {
    ensureProConfig();
    persistActiveConfig();
    setProTool(proEditTool);
    syncProEditorUi();
  } else if (mode === "editor" && previousMode === "pro") {
    setTool("walk");
  }
  syncAccessState();
  draw();
  if (mode === "play") startProAnimation();
}

function setTool(nextTool) {
  if (!isToolAllowed(nextTool)) return;
  if (mode === "pro") {
    proEditScope = "global";
    for (const button of [ui.proWalkTool, ui.proLosingTool, ui.proBlockTool]) button.classList.remove("active");
  }
  editTool = nextTool;
  for (const button of [ui.walkTool, ui.blockTool, ui.itemTool, ui.crystalTool, ui.monsterTool, ui.portalTool, ui.clueTool, ui.lockTool, ui.mathAreaTool, ui.mathEquationTool, ui.startTool]) {
    button.classList.toggle("active", button.id === `${nextTool}Tool`);
  }
  const toolNames = { walk: "Gå", block: mode === "pro" ? "Fjern indhold" : "Blok", item: "Genstand", crystal: "Krystal", monster: "Monster", portal: "Portal", clue: "Spor", lock: "Lås", mathArea: "Regneområde", mathEquation: "Regnestykke", start: "Start" };
  ui.tileText.textContent = toolNames[nextTool] || nextTool;
}

function setProTool(nextTool) {
  if (!ui.proWalkTool) return;
  proEditScope = "frame";
  proEditTool = nextTool;
  for (const button of [ui.walkTool, ui.blockTool, ui.startTool, ui.itemTool, ui.crystalTool, ui.monsterTool, ui.portalTool, ui.clueTool, ui.lockTool, ui.mathAreaTool, ui.mathEquationTool]) {
    button.classList.remove("active");
  }
  for (const button of [ui.proWalkTool, ui.proLosingTool, ui.proBlockTool]) {
    button.classList.toggle("active", button.id === `pro${nextTool[0].toUpperCase()}${nextTool.slice(1)}Tool`);
  }
  const toolNames = { walk: "PRO Gå", losing: "PRO Taber", block: "PRO Blok" };
  ui.tileText.textContent = toolNames[nextTool] || nextTool;
}

function cellSize() {
  return {
    w: canvas.width / config.grid.cols,
    h: canvas.height / config.grid.rows,
  };
}

function isWalkable(col, row) {
  const cells = mode === "play" || mode === "pro" ? proWalkableCells() : null;
  return (cells || config.walkable).includes(key(col, row));
}

function isLosingCell(col, row) {
  return (proLosingCells() || []).includes(key(col, row));
}

function mathZones() {
  if (!config) return [];
  if (Array.isArray(config.mathZones)) return config.mathZones;
  return config.mathZone ? [config.mathZone] : [];
}

function syncMathZoneAlias() {
  config.mathZone = mathZones()[0] || null;
}

function mathZoneById(zoneId) {
  return mathZones().find((zone) => zone.id === zoneId) || null;
}

function itemAt(col, row) {
  return config.items.find((item) => item.col === col && item.row === row);
}

function crystalAt(col, row) {
  return config.crystals.find(
    (crystal) => crystal.col === col && crystal.row === row && !state.collectedCrystals.includes(crystal.id)
  );
}

function clueAt(col, row) {
  return config.clues.find((clue) => clue.col === col && clue.row === row);
}

function lockAt(col, row) {
  return config.locks.find((lock) => lock.col === col && lock.row === row);
}

function portalAt(col, row) {
  return config.portals.find((portal) => portal.col === col && portal.row === row);
}

function mathZoneAt(col, row) {
  return mathZones().find((zone) => (
    col >= zone.col && col < zone.col + zone.width
    && row >= zone.row && row < zone.row + zone.height
  )) || null;
}

function mathEquationLocationAt(col, row) {
  for (const zone of mathZones()) {
    const equation = zone.equations.find((entry) => (
      col >= entry.col
      && col < entry.col + entry.width
      && row === entry.row
    ));
    if (equation) return { zone, equation };
  }
  return null;
}

function mathEquationAt(col, row) {
  return mathEquationLocationAt(col, row)?.equation || null;
}

function portalPairFor(portal) {
  const index = config.portals.findIndex((entry) => entry.id === portal.id);
  if (index < 0) return null;
  const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
  return config.portals[pairIndex] || null;
}

function portalLabel(index) {
  return String.fromCharCode(65 + Math.floor(index / 2));
}

function collectedItemAt(col, row) {
  return config.items.find(
    (item) => item.col === col && item.row === row && state.collected.includes(item.id)
  );
}

function itemLabel(item) {
  if (item.operation === "multiply") return `×${item.value}`;
  if (item.operation === "divide") return `÷${item.value}`;
  return String(item.value);
}

function applyItemScore(score, item) {
  if (item.operation === "multiply") return score * item.value;
  if (item.operation === "divide") return item.value === 0 ? score : score / item.value;
  return score + item.value;
}

function formatScore(value) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(2)));
}

function livingMonsters() {
  return state.monsters.filter((monster) => !state.defeatedMonsters.includes(monster.id));
}

function isMonsterAt(col, row, exceptId = null) {
  return livingMonsters().some(
    (monster) => monster.id !== exceptId && monster.col === col && monster.row === row
  );
}

function resolveMonsterCollision() {
  const monster = livingMonsters().find(
    (nextMonster) => nextMonster.col === state.player.col && nextMonster.row === state.player.row
  );
  if (!monster) return;

  const crystalIndex = state.crystals.findIndex((crystalValue) => monster.value % crystalValue === 0);
  if (crystalIndex >= 0) {
    const [crystalValue] = state.crystals.splice(crystalIndex, 1);
    state.defeatedMonsters.push(monster.id);
    state.message = `Monster ${monster.value} besejret med krystal ${crystalValue}.`;
    return;
  }

  state.dead = true;
  state.message = `Monster ${monster.value} fangede dig.`;
}

function findNextMonsterStep(monster) {
  const start = key(monster.col, monster.row);
  const goal = key(state.player.col, state.player.row);
  if (start === goal) return { col: monster.col, row: monster.row };

  const queue = [{ col: monster.col, row: monster.row }];
  const cameFrom = new Map([[start, null]]);
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let index = 0; index < queue.length; index += 1) {
    const cell = queue[index];
    for (const [dx, dy] of directions) {
      const next = { col: cell.col + dx, row: cell.row + dy };
      const nextKey = key(next.col, next.row);
      if (cameFrom.has(nextKey) || !isWalkable(next.col, next.row) || isMonsterAt(next.col, next.row, monster.id)) {
        continue;
      }
      cameFrom.set(nextKey, key(cell.col, cell.row));
      if (nextKey === goal) {
        let stepKey = nextKey;
        let previousKey = cameFrom.get(stepKey);
        while (previousKey && previousKey !== start) {
          stepKey = previousKey;
          previousKey = cameFrom.get(stepKey);
        }
        return parseKey(stepKey);
      }
      queue.push(next);
    }
  }

  return { col: monster.col, row: monster.row };
}

function moveMonsters() {
  const speed = Math.max(1, Math.min(10, Number(config.monsterSpeed || 1)));
  for (let step = 0; step < speed && !state.dead; step += 1) {
    for (const monster of livingMonsters()) {
      const next = findNextMonsterStep(monster);
      if (!isMonsterAt(next.col, next.row, monster.id)) {
        monster.col = next.col;
        monster.row = next.row;
      }
      resolveMonsterCollision();
      if (state.dead) return;
    }
  }
}

function resolvePortalMove() {
  if (config.objective.type !== "pointsMonstersPortals") return false;
  const portal = portalAt(state.player.col, state.player.row);
  if (!portal) return false;
  const pair = portalPairFor(portal);
  if (!pair || !isWalkable(pair.col, pair.row)) {
    state.message = "Portalen mangler en makker.";
    return false;
  }
  state.player = { col: pair.col, row: pair.row };
  const portalIndex = config.portals.findIndex((entry) => entry.id === portal.id);
  state.message = `Portal ${portalLabel(portalIndex)}.`;
  return true;
}

function hasMonsterRules() {
  return config.objective.type === "monsterModulo"
    || config.objective.type === "pointsAndMonsters"
    || config.objective.type === "pointsMonstersPortals";
}

function checkMonsterWin() {
  if (!hasMonsterRules() || state.dead) return;
  const pointsComplete = config.objective.type !== "pointsAndMonsters"
    && config.objective.type !== "pointsMonstersPortals"
    || state.score === Number(config.objective.target);
  if (livingMonsters().length === 0 && pointsComplete) {
    state.message = game.currentTrackIndex < game.tracks.length - 1
      ? "Bane gennemført!"
      : "Alle baner gennemført!";
    if (!state.trackCompleted) {
      state.trackCompleted = true;
      goToNextTrack();
    }
  }
}

function showClueDialog(clue) {
  ui.clueDialogText.textContent = clue.text || "Intet spor skrevet.";
  ui.clueDialogImage.hidden = !clue.imageData;
  ui.clueDialogImage.src = clue.imageData || "";
  ui.clueDialog.hidden = false;
}

function updateClueEditImagePreview() {
  ui.clueEditDialogImage.hidden = !editClueImageData;
  ui.clueEditDialogImage.src = editClueImageData || "";
}

function showClueEditDialog(clue) {
  if ((mode !== "editor" && mode !== "pro") || !clue) return;
  activeClueEdit = clue;
  editClueImageData = clue.imageData || null;
  ui.clueEditText.value = clue.text || "";
  ui.clueEditImageInput.value = "";
  updateClueEditImagePreview();
  ui.clueEditDialog.hidden = false;
  ui.clueEditText.focus();
}

function closeClueEditDialog() {
  activeClueEdit = null;
  editClueImageData = null;
  ui.clueEditDialog.hidden = true;
  ui.clueEditImageInput.value = "";
  updateClueEditImagePreview();
}

function saveClueEdit() {
  if (!activeClueEdit) return;
  activeClueEdit.text = ui.clueEditText.value.trim();
  activeClueEdit.imageData = editClueImageData;
  persistActiveConfig();
  closeClueEditDialog();
  draw();
}

function showLockDialog(lock) {
  activeLock = lock;
  ui.lockAnswer.value = "";
  ui.lockError.hidden = true;
  ui.lockDialog.hidden = false;
  ui.lockAnswer.focus();
}

function closeLockDialog() {
  activeLock = null;
  ui.lockDialog.hidden = true;
  ui.lockError.hidden = true;
}

function showLockEditDialog(lock) {
  if ((mode !== "editor" && mode !== "pro") || !lock) return;
  activeLockEdit = lock;
  ui.lockEditCode.value = lock.code;
  ui.lockEditError.hidden = true;
  ui.lockEditDialog.hidden = false;
  ui.lockEditCode.focus();
  ui.lockEditCode.select();
}

function closeLockEditDialog() {
  activeLockEdit = null;
  ui.lockEditDialog.hidden = true;
  ui.lockEditError.hidden = true;
}

function saveLockEdit() {
  if (!activeLockEdit) return;
  if (!ui.lockEditCode.value.trim()) {
    ui.lockEditError.hidden = false;
    ui.lockEditCode.focus();
    return;
  }
  activeLockEdit.code = ui.lockEditCode.value;
  persistActiveConfig();
  closeLockEditDialog();
  draw();
}

function showMathZoneEditDialog(zone) {
  if ((mode !== "editor" && mode !== "pro") || !isMathObjective() || !zone) return;
  activeMathZoneId = zone.id;
  ui.mathZoneEditLabel.textContent = `Område ${zone.col + 1},${zone.row + 1} · ${zone.width} × ${zone.height} blokke`;
  ui.mathZoneEditAnswer.value = String(zone.correctAnswer ?? 0);
  ui.mathAnswer.value = String(zone.correctAnswer ?? 0);
  ui.mathZoneEditDialog.hidden = false;
  ui.mathZoneEditAnswer.focus();
  ui.mathZoneEditAnswer.select();
}

function closeMathZoneEditDialog() {
  ui.mathZoneEditDialog.hidden = true;
}

function saveMathZoneEdit() {
  const zone = mathZoneById(activeMathZoneId);
  const answer = Number(ui.mathZoneEditAnswer.value);
  if (!zone || !Number.isFinite(answer)) return false;
  zone.correctAnswer = answer;
  syncMathZoneAlias();
  ui.mathAnswer.value = String(answer);
  persistActiveConfig();
  closeMathZoneEditDialog();
  draw();
  return true;
}

function beginMathEquationForActiveZone() {
  if (!saveMathZoneEdit()) return;
  setTool("mathEquation");
  state.message = "Klik i det valgte regneområde for at tilføje et regnestykke.";
  draw();
}

function deleteMathZone() {
  if (!activeMathZoneId) return;
  config.mathZones = mathZones().filter((zone) => zone.id !== activeMathZoneId);
  syncMathZoneAlias();
  activeMathZoneId = config.mathZones[0]?.id || null;
  state = newGameState();
  persistActiveConfig();
  closeMathZoneEditDialog();
  draw();
}

function showMathEquationDialog(cell, equation = null, selectedZone = null) {
  if ((mode !== "editor" && mode !== "pro") || !isMathObjective()) return;
  const location = equation ? mathEquationLocationAt(equation.col, equation.row) : null;
  const zone = selectedZone || location?.zone || mathZoneAt(cell.col, cell.row);
  if (!zone) {
    state.message = "Tegn et regneområde først.";
    draw();
    return;
  }
  activeMathZoneId = zone.id;
  activeMathEquation = equation;
  pendingMathEquationCell = equation ? { col: equation.col, row: equation.row } : { ...cell };
  ui.mathEquationText.value = equation?.text || "";
  ui.mathEquationWidth.value = String(equation?.width || 1);
  ui.mathEquationError.hidden = true;
  ui.mathEquationDialog.hidden = false;
  ui.mathEquationText.focus();
  if (equation) ui.mathEquationText.select();
}

function closeMathEquationDialog() {
  activeMathEquation = null;
  pendingMathEquationCell = null;
  ui.mathEquationDialog.hidden = true;
  ui.mathEquationError.hidden = true;
}

function saveMathEquation() {
  const zone = mathZoneById(activeMathZoneId) || mathZoneAt(
    pendingMathEquationCell?.col,
    pendingMathEquationCell?.row
  );
  if (!zone || !pendingMathEquationCell) return;
  const text = ui.mathEquationText.value.trim();
  const result = calculateExpression(text);
  const width = Math.max(1, Math.min(zone.width, Math.round(Number(ui.mathEquationWidth.value) || 1)));
  const { col, row } = pendingMathEquationCell;
  const error = (message) => {
    ui.mathEquationError.textContent = message;
    ui.mathEquationError.hidden = false;
  };
  if (!text || !Number.isFinite(result)) {
    error("Skriv et regnestykke, der kan beregnes.");
    ui.mathEquationText.focus();
    return;
  }
  if (col < zone.col || row < zone.row || row >= zone.row + zone.height || col + width > zone.col + zone.width) {
    error("Regnestykket skal kunne være helt inde i området.");
    return;
  }
  const overlaps = zone.equations.some((equation) => (
    equation !== activeMathEquation
    && equation.row === row
    && col < equation.col + equation.width
    && col + width > equation.col
  ));
  if (overlaps) {
    error("Regnestykket overlapper et andet regnestykke.");
    return;
  }
  if (activeMathEquation) {
    Object.assign(activeMathEquation, { text, result, width, col, row });
  } else {
    zone.equations.push({
      id: `math_equation_${Date.now()}`,
      col,
      row,
      width,
      text,
      result,
    });
  }
  for (let offset = 0; offset < width; offset += 1) {
    const cellKey = key(col + offset, row);
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
  }
  persistActiveConfig();
  closeMathEquationDialog();
  draw();
}

function submitLockCode() {
  if (!activeLock) return;
  if (ui.lockAnswer.value === activeLock.code) {
    closeLockDialog();
    state.message = game.currentTrackIndex < game.tracks.length - 1
      ? "Lås åbnet! Næste bane..."
      : "Lås åbnet! Alle baner gennemført!";
    if (!state.trackCompleted) {
      state.trackCompleted = true;
      goToNextTrack();
    }
    draw();
    return;
  }
  ui.lockError.hidden = false;
  ui.lockAnswer.select();
}

function resolveMathMove() {
  const location = mathEquationLocationAt(state.player.col, state.player.row);
  if (!location) {
    state.message = "";
    return;
  }
  const { zone, equation } = location;
  const target = Number(zone.correctAnswer);
  if (Number.isFinite(target) && Math.abs(equation.result - target) < 1e-9) {
    state.mathZoneStatuses[zone.id] = "won";
    state.hiddenMathEquations = [
      ...new Set([
        ...state.hiddenMathEquations,
        ...zone.equations
      .filter((entry) => entry.id !== equation.id)
      .map((entry) => entry.id),
      ]),
    ];
    const allZonesComplete = mathZones().every((entry) => state.mathZoneStatuses[entry.id] === "won");
    state.mathStatus = allZonesComplete ? "won" : "idle";
    state.message = allZonesComplete
      ? game.currentTrackIndex < game.tracks.length - 1
        ? "Alle regneområder er løst! Næste bane."
        : "Alle regneområder er løst! Alle baner gennemført!"
      : "Rigtigt svar! Find det næste regneområde.";
    if (allZonesComplete && !state.trackCompleted) {
      state.trackCompleted = true;
      goToNextTrack();
    }
    return;
  }
  state.mathZoneStatuses[zone.id] = "lost";
  state.mathStatus = "lost";
  state.dead = true;
  state.message = "Forkert regnestykke. Du tabte.";
}

function movePlayer(dx, dy) {
  if (
    mode !== "play"
    || state.dead
    || state.trackCompleted
    || !ui.clueDialog.hidden
    || !ui.lockDialog.hidden
  ) return;
  const next = {
    col: state.player.col + dx,
    row: state.player.row + dy,
  };
  if (!isWalkable(next.col, next.row)) {
    state.message = "That square is blocked.";
    draw();
    return;
  }

  state.player = next;
  if (isProPlayback() && isLosingCell(next.col, next.row)) {
    loseOnProCell();
    return;
  }
  if (isMathObjective()) {
    resolveMathMove();
    draw();
    return;
  }
  const usedPortal = resolvePortalMove();
  if (config.objective.type === "codeLocks") {
    const clue = clueAt(next.col, next.row);
    const lock = lockAt(next.col, next.row);
    state.message = "";
    if (clue) showClueDialog(clue);
    if (lock) showLockDialog(lock);
    draw();
    return;
  }

  if (hasMonsterRules()) {
    if (config.objective.type === "pointsAndMonsters" || config.objective.type === "pointsMonstersPortals") {
      const item = itemAt(state.player.col, state.player.row);
      if (item && !state.collected.includes(item.id)) {
        state.collected.push(item.id);
        state.score = applyItemScore(state.score, item);
      }
    }
    const crystal = crystalAt(state.player.col, state.player.row);
    if (crystal) {
      state.collectedCrystals.push(crystal.id);
      state.crystals.push(crystal.value);
      state.message = `Krystal ${crystal.value} samlet.`;
    } else if (!usedPortal) {
      state.message = "";
    }
    resolveMonsterCollision();
    if (!state.dead) moveMonsters();
    checkMonsterWin();
    if (
      !state.dead
      && !state.trackCompleted
      && (config.objective.type === "pointsAndMonsters" || config.objective.type === "pointsMonstersPortals")
      && state.score > Number(config.objective.target)
    ) {
      state.message = "For mange point. Nulstil og prøv en anden rute.";
    }
    draw();
    return;
  }

  const item = itemAt(next.col, next.row);
  if (item && !state.collected.includes(item.id)) {
    state.collected.push(item.id);
    state.score = applyItemScore(state.score, item);
  }

  const target = config.objective.target;
  if (state.score === target) {
    state.message = game.currentTrackIndex < game.tracks.length - 1
      ? "Bane gennemført!"
      : "Alle baner gennemført!";
    if (!state.trackCompleted) {
      state.trackCompleted = true;
      goToNextTrack();
    }
  } else if (state.score > target) {
    state.message = "Too many points. Reset and try another route.";
  } else {
    state.message = "";
  }
  draw();
}

function canvasToCell(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  const size = cellSize();
  return {
    col: Math.floor(x / size.w),
    row: Math.floor(y / size.h),
  };
}

function setMathZoneFromDrag(start, end) {
  if (!isMathObjective()) return;
  const first = clampCell(start);
  const last = clampCell(end);
  const zone = {
    id: `math_zone_${Date.now()}`,
    col: Math.min(first.col, last.col),
    row: Math.min(first.row, last.row),
    width: Math.abs(last.col - first.col) + 1,
    height: Math.abs(last.row - first.row) + 1,
    correctAnswer: Number(ui.mathAnswer.value || 0),
    equations: [],
  };
  const overlaps = mathZones().some((other) => (
    zone.col < other.col + other.width
    && zone.col + zone.width > other.col
    && zone.row < other.row + other.height
    && zone.row + zone.height > other.row
  ));
  if (overlaps) {
    state.message = "Regneområder må ikke overlappe.";
    draw();
    return;
  }
  config.mathZones = [...mathZones(), zone];
  activeMathZoneId = zone.id;
  syncMathZoneAlias();
  for (let row = zone.row; row < zone.row + zone.height; row += 1) {
    for (let col = zone.col; col < zone.col + zone.width; col += 1) {
      const cellKey = key(col, row);
      if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
    }
  }
  state = newGameState();
  persistActiveConfig();
  draw();
}

function editCell(cell) {
  if (
    cell.col < 0 ||
    cell.row < 0 ||
    cell.col >= config.grid.cols ||
    cell.row >= config.grid.rows
  ) {
    return;
  }
  const cellKey = key(cell.col, cell.row);
  if (!isToolAllowed(editTool)) return;
  if (editTool === "walk") {
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
  }
  if (editTool === "block") {
    config.walkable = config.walkable.filter((entry) => entry !== cellKey);
    config.items = config.items.filter((item) => key(item.col, item.row) !== cellKey);
    config.crystals = config.crystals.filter((crystal) => key(crystal.col, crystal.row) !== cellKey);
    config.monsters = config.monsters.filter((monster) => key(monster.col, monster.row) !== cellKey);
    config.portals = config.portals.filter((portal) => key(portal.col, portal.row) !== cellKey);
    config.clues = config.clues.filter((clue) => key(clue.col, clue.row) !== cellKey);
    config.locks = config.locks.filter((lock) => key(lock.col, lock.row) !== cellKey);
    for (const zone of mathZones()) {
      zone.equations = zone.equations.filter((equation) => (
        equation.row !== cell.row
        || cell.col < equation.col
        || cell.col >= equation.col + equation.width
      ));
    }
    syncMathZoneAlias();
  }
  if (editTool === "start") {
    config.start = { ...cell };
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
    state = newGameState();
  }
  if (editTool === "item") {
    const operation = ui.itemOperation.value;
    let value = Number(ui.itemValue.value || 0);
    if (operation === "divide" && value === 0) {
      value = 1;
      ui.itemValue.value = "1";
    }
    config.items = config.items.filter((item) => key(item.col, item.row) !== cellKey);
    config.items.push({
      id: `item_${Date.now()}`,
      col: cell.col,
      row: cell.row,
      operation,
      value,
    });
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
  }
  if (editTool === "crystal") {
    const value = Math.max(1, Number(ui.itemValue.value || 1));
    config.crystals = config.crystals.filter((crystal) => key(crystal.col, crystal.row) !== cellKey);
    config.crystals.push({
      id: `crystal_${Date.now()}`,
      col: cell.col,
      row: cell.row,
      value,
    });
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
  }
  if (editTool === "monster") {
    const value = Math.max(1, Number(ui.monsterValue.value || 1));
    config.monsters = config.monsters.filter((monster) => key(monster.col, monster.row) !== cellKey);
    config.monsters.push({
      id: `monster_${Date.now()}`,
      col: cell.col,
      row: cell.row,
      value,
    });
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
    state = newGameState();
  }
  if (editTool === "portal") {
    config.portals = config.portals.filter((portal) => key(portal.col, portal.row) !== cellKey);
    config.portals.push({
      id: `portal_${Date.now()}`,
      col: cell.col,
      row: cell.row,
    });
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
    state = newGameState();
  }
  if (editTool === "clue") {
    config.locks = config.locks.filter((lock) => key(lock.col, lock.row) !== cellKey);
    config.clues = config.clues.filter((clue) => key(clue.col, clue.row) !== cellKey);
    config.clues.push({
      id: `clue_${Date.now()}`,
      col: cell.col,
      row: cell.row,
      text: ui.clueText.value.trim(),
      imageData: pendingClueImageData,
    });
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
  }
  if (editTool === "lock") {
    const code = ui.lockCode.value;
    if (!code.trim()) {
      state.message = "Skriv en kode til låsen først.";
      draw();
      return;
    }
    config.clues = config.clues.filter((clue) => key(clue.col, clue.row) !== cellKey);
    config.locks = config.locks.filter((lock) => key(lock.col, lock.row) !== cellKey);
    config.locks.push({
      id: `lock_${Date.now()}`,
      col: cell.col,
      row: cell.row,
      code,
    });
    if (!config.walkable.includes(cellKey)) config.walkable.push(cellKey);
  }
  if ((mode === "editor" || (mode === "pro" && proEditScope === "global")) && editTool === "mathArea") {
    const zone = mathZoneAt(cell.col, cell.row);
    if (zone) showMathZoneEditDialog(zone);
    else setMathZoneFromDrag(cell, cell);
    return;
  }
  if (editTool === "mathEquation") {
    const location = mathEquationLocationAt(cell.col, cell.row);
    showMathEquationDialog(cell, location?.equation, location?.zone);
    return;
  }
  draw();
}

function editProCell(cell) {
  if (mode !== "pro" || cell.col < 0 || cell.row < 0 || cell.col >= config.grid.cols || cell.row >= config.grid.rows) return;
  const pro = ensureProConfig();
  const frame = pro?.frames?.[activeProFrameIndex];
  if (!frame) return;
  const cellKey = key(cell.col, cell.row);
  if (proEditTool === "walk") {
    if (!frame.walkable.includes(cellKey)) frame.walkable.push(cellKey);
    frame.losing = frame.losing.filter((entry) => entry !== cellKey);
  } else if (proEditTool === "losing") {
    if (!frame.walkable.includes(cellKey)) frame.walkable.push(cellKey);
    if (!frame.losing.includes(cellKey)) frame.losing.push(cellKey);
  } else if (proEditTool === "block") {
    frame.walkable = frame.walkable.filter((entry) => entry !== cellKey);
    frame.losing = frame.losing.filter((entry) => entry !== cellKey);
  }
  frame.walkable.sort();
  frame.losing.sort();
  persistActiveConfig();
  draw();
}

function addProBlankFrame() {
  const pro = ensureProConfig();
  if (!pro) return;
  const current = pro.frames[activeProFrameIndex];
  const frame = createProFrame(`frame_${Date.now()}`, {
    walkable: current?.walkable || config.walkable,
  });
  pro.frames.push(frame);
  activeProFrameIndex = pro.frames.length - 1;
  syncProEditorUi();
  persistActiveConfig();
  draw();
}

async function addProImageFrames(event) {
  if (mode !== "pro") {
    event.target.value = "";
    return;
  }
  const files = Array.from(event.target.files || []);
  event.target.value = "";
  if (!files.length) return;
  const pro = ensureProConfig();
  const current = pro.frames[activeProFrameIndex];
  try {
    const images = await Promise.all(files.map(async (file) => ({
      name: file.name,
      data: await fileToDataUrl(file),
    })));
    for (const image of images) {
      pro.frames.push(createProFrame(`frame_${Date.now()}_${pro.frames.length + 1}`, {
        imageData: image.data,
        imagePath: image.name,
        walkable: current?.walkable || config.walkable,
      }));
    }
    activeProFrameIndex = pro.frames.length - 1;
    syncProEditorUi();
    persistActiveConfig();
    draw();
  } catch {
    alert("En eller flere billedrammer kunne ikke læses.");
  }
}

function deleteProFrame() {
  const pro = config?.pro;
  if (!pro?.frames || pro.frames.length <= 1) return;
  pro.frames.splice(activeProFrameIndex, 1);
  activeProFrameIndex = Math.max(0, Math.min(activeProFrameIndex, pro.frames.length - 1));
  syncProEditorUi();
  persistActiveConfig();
  draw();
}

function copyProWalkable() {
  const pro = ensureProConfig();
  const source = pro?.frames?.[activeProFrameIndex];
  if (!source) return;
  const selected = Array.from(ui.proCopyTargets.selectedOptions || []);
  if (!selected.length) {
    alert("Vælg mindst én anden ramme først.");
    return;
  }
  for (const option of selected) {
    const target = pro.frames[Number(option.value)];
    if (!target || target === source) continue;
    target.walkable = [...source.walkable];
  }
  persistActiveConfig();
  draw();
}

function handleEditorCanvasClick(cell) {
  if (mode !== "editor" && mode !== "pro") return;

  if (isMathObjective() && editTool === "mathEquation") {
    showMathEquationDialog(cell, mathEquationAt(cell.col, cell.row));
    return;
  }

  // Keep the block tool useful for removing an object. All other editor
  // clicks on an existing code object open its editor instead of replacing it
  // with the current tool values.
  if (editTool !== "block" && isCodeObjective()) {
    const lock = lockAt(cell.col, cell.row);
    const clue = clueAt(cell.col, cell.row);
    if (editTool === "clue" && clue) {
      showClueEditDialog(clue);
      return;
    }
    if (editTool === "lock" && lock) {
      showLockEditDialog(lock);
      return;
    }
    if (lock) {
      showLockEditDialog(lock);
      return;
    }
    if (clue) {
      showClueEditDialog(clue);
      return;
    }
  }

  editCell(cell);
}

function handleProEditorCanvasClick(cell) {
  if (mode !== "pro") return;
  editProCell(cell);
}

async function saveConfig() {
  await commitActiveTrack();
  if (mode === "play") state = newGameState();
  syncAccessState();
  draw();
}

function imageToDataUrl(image) {
  const imageCanvas = document.createElement("canvas");
  imageCanvas.width = image.naturalWidth;
  imageCanvas.height = image.naturalHeight;
  const imageCtx = imageCanvas.getContext("2d");
  imageCtx.drawImage(image, 0, 0);
  return imageCanvas.toDataURL("image/jpeg");
}

async function buildBundle() {
  await commitActiveTrack();
  return {
    version: 2,
    id: game.id,
    name: game.name,
    tracks: game.tracks.map((track) => ({
      id: track.id,
      label: track.label,
      figureId: track.figureId,
      config: { ...track.config, lock: undefined },
      trackImageData: track.trackImageData,
      figureImageData: track.figureImageData,
    })),
    currentTrackIndex: game.currentTrackIndex,
  };
}

function onlineApiUrl(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${ONLINE_API_BASE}${normalized}`;
}

async function onlineApi(pathname, options = {}) {
  const response = await fetch(onlineApiUrl(pathname), {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("json") ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === "string" ? payload : payload?.error;
    throw new Error(message || `Serveren svarede med ${response.status}.`);
  }
  return payload;
}

function setOnlineStatus(message, isError = false) {
  if (!ui.onlineStatus) return;
  ui.onlineStatus.textContent = message;
  ui.onlineStatus.classList.toggle("is-error", isError);
}

function onlineStudentId(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

function absolutizeOnlineSource(value) {
  if (typeof value !== "string" || !value || value.startsWith("data:") || /^https?:\/\//i.test(value)) return value;
  if (ONLINE_API_BASE && value.startsWith("/")) return `${ONLINE_API_BASE}${value}`;
  return value;
}

function rewriteOnlineBundleSources(bundle) {
  const copy = JSON.parse(JSON.stringify(bundle));
  if (!Array.isArray(copy.tracks)) return copy;
  copy.tracks.forEach((track) => {
    if (!track || typeof track !== "object") return;
    track.trackImageData = absolutizeOnlineSource(track.trackImageData);
    track.figureImageData = absolutizeOnlineSource(track.figureImageData);
    if (track.config && typeof track.config === "object") {
      track.config.trackImage = absolutizeOnlineSource(track.config.trackImage);
      track.config.figureImage = absolutizeOnlineSource(track.config.figureImage);
    }
  });
  return copy;
}

async function refreshOnlineClasses() {
  if (!ONLINE_MODE || !ui.onlineClass) return;
  const payload = await onlineApi("/api/classes");
  onlineState.classes = Array.isArray(payload.classes) ? payload.classes : [];
  const previous = ui.onlineClass.value;
  ui.onlineClass.innerHTML = "";
  if (!onlineState.classes.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Ingen klassemapper endnu";
    ui.onlineClass.appendChild(option);
  } else {
    onlineState.classes.forEach((entry) => {
      const option = document.createElement("option");
      option.value = entry.id;
      option.textContent = entry.name || entry.id;
      ui.onlineClass.appendChild(option);
    });
    ui.onlineClass.value = onlineState.classes.some((entry) => entry.id === previous)
      ? previous
      : onlineState.classes[0].id;
  }
  await refreshOnlineBackgrounds();
  await refreshOnlineLibrary();
}

async function refreshOnlineBackgrounds() {
  if (!ONLINE_MODE || !ui.onlineBackground) return;
  const classId = ui.onlineClass?.value || "";
  ui.onlineBackground.innerHTML = "";
  if (!classId) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Opret en klassemappe først";
    ui.onlineBackground.appendChild(option);
    ui.onlineBackground.disabled = true;
    onlineState.backgrounds = [];
    return;
  }
  const payload = await onlineApi(`/api/classes/${encodeURIComponent(classId)}/backgrounds`);
  onlineState.backgrounds = (Array.isArray(payload.backgrounds) ? payload.backgrounds : []).map((entry) => ({
    ...entry,
    url: onlineApiUrl(entry.url),
  }));
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = onlineState.backgrounds.length ? "Vælg baggrund…" : "Ingen baggrunde endnu";
  ui.onlineBackground.appendChild(placeholder);
  onlineState.backgrounds.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.displayName || entry.name;
    ui.onlineBackground.appendChild(option);
  });
  ui.onlineBackground.disabled = onlineState.backgrounds.length === 0;
}

function populateOnlineLibrarySelect(select, entries, emptyText) {
  if (!select) return;
  const previous = select.value;
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = entries.length ? emptyText : "Ingen filer endnu";
  select.appendChild(placeholder);
  entries.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = entry.name;
    select.appendChild(option);
  });
  select.value = entries.some((entry) => entry.id === previous) ? previous : "";
  select.disabled = entries.length === 0;
}

async function refreshOnlineLibrary() {
  if (!ONLINE_MODE) return;
  const classId = ui.onlineClass?.value || "";
  if (!classId) {
    onlineState.tracks = [];
    onlineState.figures = [];
    populateOnlineLibrarySelect(ui.onlineServerTrack, [], "Vælg bane…");
    populateOnlineLibrarySelect(ui.onlineServerFigure, [], "Vælg figur…");
    if (ui.onlineApplyTrackButton) ui.onlineApplyTrackButton.disabled = true;
    if (ui.onlineApplyFigureButton) ui.onlineApplyFigureButton.disabled = true;
    return;
  }
  const payload = await onlineApi(`/api/classes/${encodeURIComponent(classId)}/library`);
  onlineState.tracks = (Array.isArray(payload.tracks) ? payload.tracks : []).map((entry) => ({
    ...entry,
    url: onlineApiUrl(entry.url),
  }));
  onlineState.figures = (Array.isArray(payload.figures) ? payload.figures : []).map((entry) => ({
    ...entry,
    url: onlineApiUrl(entry.url),
  }));
  populateOnlineLibrarySelect(ui.onlineServerTrack, onlineState.tracks, "Vælg bane…");
  populateOnlineLibrarySelect(ui.onlineServerFigure, onlineState.figures, "Vælg figur…");
  if (ui.onlineApplyTrackButton) ui.onlineApplyTrackButton.disabled = onlineState.tracks.length === 0;
  if (ui.onlineApplyFigureButton) ui.onlineApplyFigureButton.disabled = onlineState.figures.length === 0;
}

async function applyOnlineLibraryAsset(kind) {
  if (!ONLINE_MODE || !game) return;
  const isTrack = kind === "track";
  const select = isTrack ? ui.onlineServerTrack : ui.onlineServerFigure;
  const entry = (isTrack ? onlineState.tracks : onlineState.figures)
    .find((candidate) => candidate.id === select?.value);
  if (!entry) {
    setOnlineStatus(`Vælg først en ${isTrack ? "bane" : "figur"} fra serveren.`, true);
    return;
  }
  try {
    if (mode === "play") setMode("editor");
    await commitActiveTrack();
    const track = activeTrack();
    const sourceId = onlineStudentId(`server_${safeFileId(entry.id)}`).slice(0, 48)
      || (isTrack ? "server_track" : "server_figure");
    if (isTrack) {
      currentTrackId = sourceId;
      track.id = currentTrackId;
      track.label = entry.name;
      selectedTrackFileUrl = entry.url;
      track.trackImageData = entry.url;
      config.id = currentTrackId;
      config.trackImage = entry.url;
      trackImage.src = entry.url;
      await waitForImage(trackImage);
      if (!trackImage.naturalWidth) throw new Error("Banebilledet kunne ikke indlæses.");
      resizeCanvas();
    } else {
      currentFigureId = sourceId;
      track.figureId = currentFigureId;
      selectedFigureFileUrl = entry.url;
      track.figureImageData = entry.url;
      config.figureImage = entry.url;
      figureImage.src = entry.url;
      await waitForImage(figureImage);
      if (!figureImage.naturalWidth) throw new Error("Figurbilledet kunne ikke indlæses.");
    }
    track.config = JSON.parse(JSON.stringify(config));
    state = newGameState();
    syncUiFromConfig();
    saveGameToStorage();
    draw();
    setOnlineStatus(`${isTrack ? "Bane" : "Figur"} valgt fra serveren: ${entry.name}`);
  } catch (error) {
    setOnlineStatus(error.message || "Materialet kunne ikke indlæses.", true);
  }
}

async function applyOnlineBackground() {
  if (!ONLINE_MODE || !game || !ui.onlineBackground?.value) return;
  const background = onlineState.backgrounds.find((entry) => entry.id === ui.onlineBackground.value);
  if (!background) return;
  const track = activeTrack();
  const backgroundId = onlineStudentId(`online_${safeFileId(background.id)}`).slice(0, 48) || "online_track";
  await commitActiveTrack();
  currentTrackId = backgroundId;
  track.id = currentTrackId;
  track.label = background.name;
  selectedTrackFileUrl = background.url;
  track.trackImageData = background.url;
  config.id = currentTrackId;
  config.trackImage = background.url;
  config.figureImage = selectedFigureFileUrl || track.figureImageData || assetPath("Figures", currentFigureId);
  track.config = JSON.parse(JSON.stringify(config));
  trackImage.src = background.url;
  state = newGameState();
  syncUiFromConfig();
  await waitForImage(trackImage);
  saveGameToStorage();
  resizeCanvas();
  draw();
  setOnlineStatus(`Baggrund valgt: ${background.name}`);
}

function onlineIdentity() {
  const classId = ui.onlineClass?.value || "";
  const studentId = onlineStudentId(ui.onlineStudent?.value);
  if (!classId) throw new Error("Vælg en klasse først.");
  if (!studentId) throw new Error("Skriv navn eller initialer først.");
  return { classId, studentId };
}

async function saveOnlineGame() {
  if (!ONLINE_MODE) return;
  try {
    const identity = onlineIdentity();
    ui.onlineSaveButton.disabled = true;
    setOnlineStatus("Gemmer spillet…");
    const bundle = await buildBundle();
    const result = await onlineApi(`/api/classes/${encodeURIComponent(identity.classId)}/games/${encodeURIComponent(identity.studentId)}`, {
      method: "PUT",
      body: JSON.stringify(bundle),
    });
    setOnlineStatus(`Gemt i ${identity.classId} som ${result.file || `${identity.studentId}.dgm`}.`);
  } catch (error) {
    setOnlineStatus(error.message || "Spillet kunne ikke gemmes.", true);
  } finally {
    ui.onlineSaveButton.disabled = false;
  }
}

async function loadOnlineGame() {
  if (!ONLINE_MODE) return;
  try {
    const identity = onlineIdentity();
    ui.onlineLoadButton.disabled = true;
    setOnlineStatus("Åbner gemt spil…");
    const bundle = rewriteOnlineBundleSources(await onlineApi(
      `/api/classes/${encodeURIComponent(identity.classId)}/games/${encodeURIComponent(identity.studentId)}`,
    ));
    game = migrateBundleToGame(bundle);
    advancingTrack = false;
    await activateTrack(game.currentTrackIndex);
    setTool("walk");
    setMode("play");
    setOnlineStatus(`Åbnede spillet for ${ui.onlineStudent.value.trim()}.`);
  } catch (error) {
    setOnlineStatus(error.message || "Spillet kunne ikke åbnes.", true);
  } finally {
    ui.onlineLoadButton.disabled = false;
  }
}

async function initOnline() {
  if (!ONLINE_MODE || !ui.onlinePanel) return;
  ui.onlinePanel.hidden = false;
  setOnlineStatus("Henter klasser…");
  try {
    await refreshOnlineClasses();
    setOnlineStatus("Klar. Vælg klasse og skriv navn eller initialer.");
  } catch (error) {
    setOnlineStatus(error.message || "Serveren kunne ikke kontaktes.", true);
  }
}

let pendingSaveBundle = null;

async function saveBundle() {
  await saveConfig();
  const bundle = await buildBundle();
  pendingSaveBundle = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
  ui.saveFilename.value = safeFileId(game.name || game.id);
  ui.saveDialog.hidden = false;
  ui.saveFilename.focus();
  ui.saveFilename.select();
}

function performSaveBundle(filename) {
  if (!filename || !pendingSaveBundle) return;

  const finalFilename = filename.trim() + ".dgm";

  // Simple direct download - works reliably in all browsers
  const link = document.createElement("a");
  link.href = URL.createObjectURL(pendingSaveBundle);
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 100);

  ui.saveDialog.hidden = true;
  pendingSaveBundle = null;

  state.message = `Gemt som ${finalFilename}`;
  draw();
}

function loadBundle(file) {
  const reader = new FileReader();
  reader.onload = async () => {
    const bundle = JSON.parse(reader.result);
    if (!bundle.tracks && !bundle.config) {
      alert("Ugyldigt bundlefil-format.");
      return;
    }

    game = migrateBundleToGame(bundle);
    advancingTrack = false;
    ui.loadBundleInput.value = "";
    await activateTrack(game.currentTrackIndex);
    setTool("walk");
    setMode("play");
  };
  reader.readAsText(file);
}

function setAssetSources() {
  // If the user selected files from the filesystem, prefer those object URLs.
  if (selectedTrackFileUrl) {
    trackImage.src = selectedTrackFileUrl;
  } else {
    trackImage.src = assetPath("Tracks", currentTrackId);
  }

  if (selectedFigureFileUrl) {
    figureImage.src = selectedFigureFileUrl;
  } else {
    figureImage.src = assetPath("Figures", currentFigureId);
  }
}

async function loadFromSelectedFiles({ reloadTrackConfig = true } = {}) {
  if (mode === "play") return;
  setAssetSources();
  await Promise.all([waitForImage(trackImage), waitForImage(figureImage)]);
  if (selectedTrackFileUrl && !trackImage.naturalWidth) {
    alert("Billedformatet kunne ikke vises som baggrund. Prøv JPG, PNG eller WebP.");
    selectedTrackFileUrl = null;
    setAssetSources();
    return;
  }
  if (selectedFigureFileUrl && !figureImage.naturalWidth) {
    alert("Figurbilledet kunne ikke vises. Prøv JPG, PNG eller WebP.");
    selectedFigureFileUrl = null;
    setAssetSources();
    return;
  }
  activeTrack().id = currentTrackId;
  activeTrack().figureId = currentFigureId;
  if (reloadTrackConfig) {
    config = normalizeConfig(await loadConfig(), currentTrackId, currentFigureId);
  }
  config.id = currentTrackId;
  config.trackImage = selectedTrackFileUrl || assetPath("Tracks", currentTrackId);
  config.figureImage = selectedFigureFileUrl || assetPath("Figures", currentFigureId);
  activeTrack().config = JSON.parse(JSON.stringify(config));
  activeTrack().trackImageData = selectedTrackFileUrl;
  activeTrack().figureImageData = selectedFigureFileUrl;
  if (reloadTrackConfig) state = newGameState();
  syncUiFromConfig();
  saveGameToStorage();
  setMode("editor");
  resizeCanvas();
}

async function handleTrackFileSelected(event) {
  if (mode === "play") {
    event.target.value = "";
    return;
  }
  const [file] = event.target.files || [];
  if (!file) return;
  revokeBlobUrl(selectedTrackFileUrl);
  try {
    selectedTrackFileUrl = await fileToDataUrl(file);
  } catch {
    alert("Baggrundsbilledet kunne ikke læses.");
    event.target.value = "";
    return;
  }
  currentTrackId = file.name;
  ui.trackInput.value = file.name;
  activeTrack().id = currentTrackId;
  await loadFromSelectedFiles({ reloadTrackConfig: true });
  event.target.value = "";
}

async function handleFigureFileSelected(event) {
  if (mode === "play") {
    event.target.value = "";
    return;
  }
  const [file] = event.target.files || [];
  revokeBlobUrl(selectedFigureFileUrl);
  selectedFigureFileUrl = null;
  if (file) {
    try {
      selectedFigureFileUrl = await fileToDataUrl(file);
    } catch {
      alert("Figurbilledet kunne ikke læses.");
      event.target.value = "";
      return;
    }
    currentFigureId = file.name;
    ui.figureInput.value = file.name;
    activeTrack().figureId = currentFigureId;
  }
  await loadFromSelectedFiles({ reloadTrackConfig: false });
  event.target.value = "";
}

async function createNewGame() {
  const gameId = `new_game_${Date.now()}`;
  game = {
    version: 2,
    id: gameId,
    name: gameId,
    tracks: [createTrackEntry(`track_1_${Date.now()}`, "Bane 1", "figure_1", false)],
    currentTrackIndex: 0,
  };
  advancingTrack = false;
  ui.loadBundleInput.value = "";
  await activateTrack(0);
  setTool("walk");
  setMode("editor");
}

async function loadTrackFromInput() {
  if (mode === "play") return;
  await saveConfig();
  currentTrackId = ui.trackInput.value.trim() || currentTrackId;
  activeTrack().id = currentTrackId;
  selectedTrackFileUrl = null;
  setAssetSources();
  activeTrack().trackImageData = trackImage.src.startsWith("data:") || trackImage.src.startsWith("blob:")
    ? trackImage.src
    : null;
  config = normalizeConfig(await loadConfig(), currentTrackId, currentFigureId);
  activeTrack().config = JSON.parse(JSON.stringify(config));
  state = newGameState();
  syncUiFromConfig();
  saveGameToStorage();
  setMode("editor");
  await Promise.all([waitForImage(trackImage), waitForImage(figureImage)]);
  resizeCanvas();
}

async function loadFigureFromInput() {
  if (mode === "play") return;
  await saveConfig();
  currentFigureId = ui.figureInput.value.trim() || currentFigureId || "figure_1";
  activeTrack().figureId = currentFigureId;
  selectedFigureFileUrl = null;
  setAssetSources();
  await waitForImage(figureImage);
  if (!figureImage.naturalWidth) {
    alert("Figurbilledet kunne ikke vises. Tjek navnet eller vælg en billedfil.");
    return;
  }
  config.figureImage = assetPath("Figures", currentFigureId);
  activeTrack().config = JSON.parse(JSON.stringify(config));
  activeTrack().figureImageData = null;
  syncUiFromConfig();
  saveGameToStorage();
  setMode("editor");
  draw();
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const frame = (mode === "play" || mode === "pro") ? activeProFrame() : null;
  const frameImage = proFrameImage(frame);
  const image = frameImage?.complete && frameImage.naturalWidth ? frameImage : trackImage;
  if (image.complete && image.naturalWidth) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
}

function drawMathZone() {
  if (!isMathObjective()) return;
  const size = cellSize();
  for (const zone of mathZones()) {
    const x = zone.col * size.w;
    const y = zone.row * size.h;
    const width = zone.width * size.w;
    const height = zone.height * size.h;
    const status = state.mathZoneStatuses?.[zone.id]
      || (mathZones().length === 1 ? state.mathStatus : "idle");
    ctx.save();
    ctx.fillStyle = status === "won" ? "#38b36b" : status === "lost" ? "#df554c" : "#a85ad8";
    ctx.globalAlpha = status === "idle" ? 0.42 : 0.6;
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = status === "won" ? "#16834a" : status === "lost" ? "#b6263b" : "#71349b";
    ctx.lineWidth = Math.max(3, Math.min(size.w, size.h) * 0.08);
    ctx.strokeRect(x + ctx.lineWidth / 2, y + ctx.lineWidth / 2, width - ctx.lineWidth, height - ctx.lineWidth);
    const answerText = `Facit: ${formatScore(zone.correctAnswer)}`;
    const answerFontSize = Math.max(10, Math.min(20, size.h * 0.48, width / Math.max(5, answerText.length * 0.58)));
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 ${answerFontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(answerText, x + width / 2, y + Math.max(4, size.h * 0.12), Math.max(12, width - 12));
    ctx.restore();
  }

  if (mode === "editor" && editTool === "mathArea" && mathZonePreview) {
    const first = clampCell(mathZonePreview.start);
    const last = clampCell(mathZonePreview.end);
    const previewCol = Math.min(first.col, last.col);
    const previewRow = Math.min(first.row, last.row);
    const previewWidth = Math.abs(last.col - first.col) + 1;
    const previewHeight = Math.abs(last.row - first.row) + 1;
    const previewX = previewCol * size.w;
    const previewY = previewRow * size.h;
    const previewWidthPx = previewWidth * size.w;
    const previewHeightPx = previewHeight * size.h;
    ctx.save();
    ctx.fillStyle = "rgba(168, 90, 216, 0.2)";
    ctx.fillRect(previewX, previewY, previewWidthPx, previewHeightPx);
    ctx.strokeStyle = "#4e176c";
    ctx.lineWidth = Math.max(2, Math.min(size.w, size.h) * 0.05);
    ctx.setLineDash([Math.max(5, size.w * 0.18), Math.max(4, size.w * 0.12)]);
    ctx.strokeRect(
      previewX + ctx.lineWidth / 2,
      previewY + ctx.lineWidth / 2,
      previewWidthPx - ctx.lineWidth,
      previewHeightPx - ctx.lineWidth
    );
    ctx.restore();
  }
}

function drawMathEquations() {
  if (!isMathObjective()) return;
  const size = cellSize();
  const hidden = new Set(state.hiddenMathEquations || []);
  for (const zone of mathZones()) for (const equation of zone.equations) {
    if (hidden.has(equation.id)) continue;
    const x = equation.col * size.w;
    const y = equation.row * size.h;
    const width = equation.width * size.w;
    ctx.save();
    ctx.fillStyle = "#f0dcfa";
    ctx.strokeStyle = "#6a2c82";
    ctx.lineWidth = 3;
    ctx.fillRect(x + 2, y + 2, width - 4, size.h - 4);
    ctx.strokeRect(x + 2, y + 2, width - 4, size.h - 4);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const fontSize = Math.max(9, Math.min(22, size.h * 0.52, width / Math.max(4, equation.text.length * 0.58)));
    ctx.fillStyle = "#271232";
    ctx.font = `700 ${fontSize}px Arial`;
    ctx.fillText(equation.text, x + width / 2, y + size.h / 2, Math.max(8, width - 8));
    ctx.restore();
  }
}

function drawGrid() {
  const size = cellSize();
  const walkable = proWalkableCells() || config.walkable;
  const losing = (mode === "play" || mode === "pro") ? proLosingCells() || [] : [];
  ctx.save();
  ctx.fillStyle = config.walkableStyle.color;
  ctx.globalAlpha = config.walkableStyle.opacity;
  for (const entry of walkable) {
    const { col, row } = parseKey(entry);
    ctx.fillRect(col * size.w, row * size.h, size.w, size.h);
  }
  if (losing.length) {
    ctx.fillStyle = "#df554c";
    ctx.globalAlpha = 0.55;
    for (const entry of losing) {
      const { col, row } = parseKey(entry);
      ctx.fillRect(col * size.w, row * size.h, size.w, size.h);
    }
  }

  if ((mode === "editor" || mode === "pro") && ui.showGrid.checked) {
    ctx.strokeStyle = config.grid.color;
    ctx.globalAlpha = config.grid.opacity;
    ctx.lineWidth = 1;
    for (let col = 0; col <= config.grid.cols; col += 1) {
      const x = col * size.w;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let row = 0; row <= config.grid.rows; row += 1) {
      const y = row * size.h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawItems() {
  const size = cellSize();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 18px Arial";
  for (const item of config.items) {
    const collected = state.collected.includes(item.id);
    const cx = (item.col + 0.5) * size.w;
    const cy = (item.row + 0.5) * size.h;
    ctx.globalAlpha = collected ? 0.28 : 1;
    ctx.fillStyle = item.operation === "multiply" ? "#7cc36f" : item.operation === "divide" ? "#72b7e8" : item.value < 0 ? "#bd3d5a" : "#f3c63d";
    ctx.strokeStyle = item.operation === "multiply" ? "#3f7d36" : item.operation === "divide" ? "#2e6f9f" : item.value < 0 ? "#84273d" : "#8f6d00";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(size.w, size.h) * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#17212b";
    ctx.fillText(itemLabel(item), cx, cy + 1);
    ctx.globalAlpha = 1;
  }
}

function drawCrystals() {
  const size = cellSize();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 18px Arial";
  for (const crystal of config.crystals) {
    const collected = state.collectedCrystals.includes(crystal.id);
    const cx = (crystal.col + 0.5) * size.w;
    const cy = (crystal.row + 0.5) * size.h;
    ctx.save();
    ctx.globalAlpha = collected ? 0.25 : 1;
    ctx.fillStyle = "#8fd8ff";
    ctx.strokeStyle = "#246b92";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy - size.h * 0.4);
    ctx.lineTo(cx + size.w * 0.35, cy);
    ctx.lineTo(cx, cy + size.h * 0.4);
    ctx.lineTo(cx - size.w * 0.35, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#102433";
    ctx.fillText(String(crystal.value), cx, cy + 1);
    ctx.restore();
  }
}

function drawMonsters() {
  const size = cellSize();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 18px Arial";
  for (const monster of livingMonsters()) {
    const cx = (monster.col + 0.5) * size.w;
    const cy = (monster.row + 0.5) * size.h;
    ctx.save();
    ctx.fillStyle = "#d84f3f";
    ctx.strokeStyle = "#7a1f18";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(size.w, size.h) * 0.43, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(String(monster.value), cx, cy + 1);
    ctx.restore();
  }
}

function drawPortals() {
  if (config.objective.type !== "pointsMonstersPortals") return;
  const size = cellSize();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 18px Arial";
  config.portals.forEach((portal, index) => {
    const cx = (portal.col + 0.5) * size.w;
    const cy = (portal.row + 0.5) * size.h;
    const radius = Math.min(size.w, size.h) * 0.43;
    ctx.save();
    ctx.fillStyle = index % 2 === 0 ? "#6658d3" : "#32a6a0";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.75, radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(portalLabel(index), cx, cy + 1);
    ctx.restore();
  });
}

function drawCodeObjects() {
  if (config.objective.type !== "codeLocks") return;
  const size = cellSize();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 18px Arial";

  for (const clue of config.clues) {
    const cx = (clue.col + 0.5) * size.w;
    const cy = (clue.row + 0.5) * size.h;
    ctx.save();
    ctx.fillStyle = "#4aa9d8";
    ctx.strokeStyle = "#1d6388";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(size.w, size.h) * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("i", cx, cy + 1);
    ctx.restore();
  }

  for (const lock of config.locks) {
    const x = lock.col * size.w;
    const y = lock.row * size.h;
    const pad = Math.min(size.w, size.h) * 0.16;
    ctx.save();
    ctx.fillStyle = "#d65b50";
    ctx.strokeStyle = "#7d2721";
    ctx.lineWidth = 3;
    ctx.fillRect(x + pad, y + size.h * 0.4, size.w - pad * 2, size.h * 0.45);
    ctx.strokeRect(x + pad, y + size.h * 0.4, size.w - pad * 2, size.h * 0.45);
    ctx.beginPath();
    ctx.arc(x + size.w / 2, y + size.h * 0.4, size.w * 0.22, Math.PI, 0);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPlayer() {
  const size = cellSize();
  const x = state.player.col * size.w;
  const y = state.player.row * size.h;
  const pad = 2;
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(x + size.w / 2, y + size.h / 2, Math.min(size.w, size.h) * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.clip();
  if (figureImage.complete && figureImage.naturalWidth) {
    ctx.drawImage(figureImage, x + pad, y + pad, size.w - pad * 2, size.h - pad * 2);
  } else {
    ctx.fillStyle = "#0c7c7c";
    ctx.fillRect(x + pad, y + pad, size.w - pad * 2, size.h - pad * 2);
  }
  ctx.restore();
}

function drawStart() {
  const size = cellSize();
  ctx.save();
  ctx.strokeStyle = "#16834a";
  ctx.lineWidth = 4;
  ctx.strokeRect(
    config.start.col * size.w + 3,
    config.start.row * size.h + 3,
    size.w - 6,
    size.h - 6
  );
  ctx.restore();
}

function drawMessage() {
  if (!state.message) return;
  ctx.save();
  ctx.font = "700 20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const textWidth = Math.min(ctx.measureText(state.message).width + 36, canvas.width - 40);
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.strokeStyle = "#17212b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect((canvas.width - textWidth) / 2, 18, textWidth, 48, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#17212b";
  ctx.fillText(state.message, canvas.width / 2, 42, textWidth - 24);
  ctx.restore();
}

function updateHud() {
  const target = Number(ui.targetPoints.value || config.objective.target);
  const isMonsterLevel = hasMonsterRules();
  const isCombinedLevel = config.objective.type === "pointsAndMonsters"
    || config.objective.type === "pointsMonstersPortals";
  const isCodeLevel = config.objective.type === "codeLocks";
  const isMathLevel = isMathObjective();
  const isProLevel = isProConfigured();
  const configuredMathZones = mathZones();
  const completedMathZones = configuredMathZones.filter((zone) => state.mathZoneStatuses?.[zone.id] === "won").length;
  const mathLost = configuredMathZones.some((zone) => state.mathZoneStatuses?.[zone.id] === "lost");
  ui.scoreText.textContent = isCodeLevel
    ? `${config.clues.length} spor | ${config.locks.length} låse`
    : isMathLevel
      ? `${completedMathZones} / ${configuredMathZones.length} områder | ${configuredMathZones.reduce((sum, zone) => sum + zone.equations.length, 0)} regnestykker`
    : isCombinedLevel
    ? `${formatScore(state.score)} / ${target} | ${livingMonsters().length} monster | krystaller: ${state.crystals.join(", ") || "-"}`
    : isMonsterLevel
      ? `${livingMonsters().length} monster | krystaller: ${state.crystals.join(", ") || "-"}`
      : `${formatScore(state.score)} / ${target}`;
  const objectiveComplete = isCodeLevel
    ? state.trackCompleted
    : isMathLevel
      ? configuredMathZones.length > 0 && completedMathZones === configuredMathZones.length
    : isCombinedLevel
    ? state.score === target && livingMonsters().length === 0
    : isMonsterLevel
      ? livingMonsters().length === 0
      : state.score === target;
  document.body.classList.toggle("won", objectiveComplete);
  document.body.classList.toggle(
    "over",
    isCodeLevel
      ? false
      : isMathLevel
        ? mathLost || state.mathStatus === "lost" || state.dead
      : isMonsterLevel || isProLevel
        ? state.dead || (isCombinedLevel && state.score > target)
        : state.score > target
  );
  if ((isMonsterLevel || isMathLevel || isProLevel) && state.dead) {
    ui.tileText.textContent = "Død";
    return;
  }
  const item = itemAt(state.player.col, state.player.row);
  const collected = collectedItemAt(state.player.col, state.player.row);
  const crystal = crystalAt(state.player.col, state.player.row);
  const monster = livingMonsters().find((nextMonster) => nextMonster.col === state.player.col && nextMonster.row === state.player.row);
  const clue = clueAt(state.player.col, state.player.row);
  const lock = lockAt(state.player.col, state.player.row);
  const equation = mathEquationAt(state.player.col, state.player.row);
  if (isMathLevel && equation) {
    ui.tileText.textContent = `Regnestykke ${equation.text}`;
  } else if (isMathLevel && mathZoneAt(state.player.col, state.player.row)) {
    ui.tileText.textContent = "Regneområde";
  } else if (isCodeLevel && lock) {
    ui.tileText.textContent = "Lås";
  } else if (isCodeLevel && clue) {
    ui.tileText.textContent = "Spor";
  } else if (isMonsterLevel && monster) {
    ui.tileText.textContent = `Monster ${monster.value}`;
  } else if (isMonsterLevel && crystal) {
    ui.tileText.textContent = `Krystal ${crystal.value}`;
  } else if ((!isMonsterLevel || isCombinedLevel) && item && !collected) {
    ui.tileText.textContent = `Genstand ${itemLabel(item)}`;
  } else if (isWalkable(state.player.col, state.player.row)) {
    ui.tileText.textContent = "Gå";
  } else {
    ui.tileText.textContent = "Blok";
  }
}

function draw() {
  drawBackground();
  drawGrid();
  drawMathZone();
  drawMathEquations();
  if (
    config.objective.type === "collectExact"
    || config.objective.type === "pointsAndMonsters"
    || config.objective.type === "pointsMonstersPortals"
  ) {
    drawItems();
  }
  if (hasMonsterRules()) {
    drawPortals();
    drawCrystals();
    drawMonsters();
  }
  drawCodeObjects();
  drawStart();
  drawPlayer();
  drawMessage();
  updateHud();
}

function resizeCanvas() {
  const ratio = trackImage.naturalWidth && trackImage.naturalHeight
    ? trackImage.naturalWidth / trackImage.naturalHeight
    : 0.75;
  canvas.width = 900;
  canvas.height = Math.round(canvas.width / ratio);
  draw();
}

ui.playModeButton.addEventListener("click", () => setMode("play"));
ui.editModeButton.addEventListener("click", () => setMode("editor"));
ui.proModeButton.addEventListener("click", () => setMode("pro"));
ui.createNewButton.addEventListener("click", () => {
  if (confirm("Opret nyt spil? Alt i det nuværende spil bliver slettet.")) {
    createNewGame();
  }
});
ui.loadTrackButton.addEventListener("click", () => {
  if (mode === "play") return;
  ui.trackFileInput.click();
});
ui.loadFigureButton.addEventListener("click", () => {
  if (mode === "play") return;
  ui.figureFileInput.click();
});
ui.loadMusicButton.addEventListener("click", () => ui.musicFileInput.click());
ui.musicFileInput.addEventListener("change", handleMusicFileSelected);
ui.musicPlayPauseButton.addEventListener("click", () => {
  if (ui.backgroundMusic.paused) {
    void playBackgroundMusic();
  } else {
    ui.backgroundMusic.pause();
    updateBackgroundMusicUi();
  }
});
ui.musicStopButton.addEventListener("click", stopBackgroundMusic);
ui.musicVolume.addEventListener("input", () => {
  ui.backgroundMusic.volume = Number(ui.musicVolume.value);
});
["play", "pause", "ended", "error", "loadeddata"].forEach((eventName) => {
  ui.backgroundMusic.addEventListener(eventName, () => updateBackgroundMusicUi());
});
window.addEventListener("beforeunload", releaseBackgroundMusic);
ui.trackFileInput.addEventListener("change", handleTrackFileSelected);
ui.figureFileInput.addEventListener("change", handleFigureFileSelected);
ui.trackInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && mode !== "play") loadTrackFromInput();
});
ui.figureInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && mode !== "play") loadFigureFromInput();
});
ui.walkTool.addEventListener("click", () => setTool("walk"));
ui.blockTool.addEventListener("click", () => setTool("block"));
ui.itemTool.addEventListener("click", () => setTool("item"));
ui.crystalTool.addEventListener("click", () => setTool("crystal"));
ui.monsterTool.addEventListener("click", () => setTool("monster"));
ui.portalTool.addEventListener("click", () => setTool("portal"));
ui.clueTool.addEventListener("click", () => setTool("clue"));
ui.lockTool.addEventListener("click", () => setTool("lock"));
ui.mathAreaTool.addEventListener("click", () => setTool("mathArea"));
ui.mathEquationTool.addEventListener("click", () => setTool("mathEquation"));
ui.startTool.addEventListener("click", () => setTool("start"));
ui.applyGridButton.addEventListener("click", applyGridScale);
ui.trackSelect.addEventListener("change", async () => {
  const index = Number(ui.trackSelect.value);
  if (index === game.currentTrackIndex) return;
  await activateTrack(index);
  if (mode === "editor") setTool(editTool);
  if (mode === "pro") {
    ensureProConfig();
    setProTool(proEditTool);
    syncProEditorUi();
  }
});
ui.addTrackButton.addEventListener("click", () => addTrack());
ui.showGrid.addEventListener("change", draw);
ui.gridColor.addEventListener("input", () => {
  if (!config) return;
  config.grid.color = ui.gridColor.value;
  persistActiveConfig();
  draw();
});
ui.gridOpacity.addEventListener("input", () => {
  if (!config) return;
  config.grid.opacity = Math.max(0.05, Math.min(1, Number(ui.gridOpacity.value || 0.35)));
  ui.gridOpacityValue.textContent = `${Math.round(config.grid.opacity * 100)} %`;
  persistActiveConfig();
  draw();
});
ui.walkableColor.addEventListener("input", () => {
  if (!config) return;
  config.walkableStyle.color = ui.walkableColor.value;
  persistActiveConfig();
  draw();
});
ui.walkableOpacity.addEventListener("input", () => {
  if (!config) return;
  config.walkableStyle.opacity = Math.max(0.05, Math.min(1, Number(ui.walkableOpacity.value || 0.22)));
  ui.walkableOpacityValue.textContent = `${Math.round(config.walkableStyle.opacity * 100)} %`;
  persistActiveConfig();
  draw();
});
ui.resetButton.addEventListener("click", () => {
  ui.clueDialog.hidden = true;
  closeClueEditDialog();
  closeLockDialog();
  closeLockEditDialog();
  closeMathEquationDialog();
  closeMathZoneEditDialog();
  state = newGameState();
  draw();
});
ui.saveButton.addEventListener("click", saveBundle);
ui.saveDialogCancel.addEventListener("click", () => {
  ui.saveDialog.hidden = true;
});
ui.saveDialogConfirm.addEventListener("click", () => {
  const filename = ui.saveFilename.value.trim();
  performSaveBundle(filename);
});
ui.saveFilename.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const filename = ui.saveFilename.value.trim();
    performSaveBundle(filename);
  } else if (event.key === "Escape") {
    ui.saveDialog.hidden = true;
  }
});
ui.loadBundleInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (file) loadBundle(file);
});
ui.targetPoints.addEventListener("change", () => { void saveConfig(); });
ui.mathAnswer.addEventListener("change", () => {
  const zone = mathZoneById(activeMathZoneId) || mathZones()[0];
  const answer = Number(ui.mathAnswer.value);
  if (!zone || !Number.isFinite(answer)) return;
  zone.correctAnswer = answer;
  syncMathZoneAlias();
  persistActiveConfig();
  draw();
});
ui.objectiveType.addEventListener("change", () => {
  syncObjectiveTools();
  void saveConfig();
});
ui.monsterSpeed.addEventListener("change", () => { void saveConfig(); });
ui.clueImageInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  try {
    pendingClueImageData = await fileToDataUrl(file);
  } catch {
    pendingClueImageData = null;
    alert("Billedet kunne ikke læses.");
  }
});
ui.clueEditImageInput.addEventListener("change", async (event) => {
  const [file] = event.target.files || [];
  if (!file) return;
  try {
    editClueImageData = await fileToDataUrl(file);
    updateClueEditImagePreview();
  } catch {
    alert("Billedet kunne ikke læses.");
  } finally {
    event.target.value = "";
  }
});
ui.clearClueImageButton.addEventListener("click", () => {
  pendingClueImageData = null;
  ui.clueImageInput.value = "";
});
ui.clearClueEditImageButton.addEventListener("click", () => {
  editClueImageData = null;
  ui.clueEditImageInput.value = "";
  updateClueEditImagePreview();
});
ui.clueDialogClose.addEventListener("click", () => {
  ui.clueDialog.hidden = true;
});
ui.clueEditDialogCancel.addEventListener("click", closeClueEditDialog);
ui.clueEditDialogSave.addEventListener("click", saveClueEdit);
ui.clueEditText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeClueEditDialog();
});
ui.lockDialogCancel.addEventListener("click", closeLockDialog);
ui.lockDialogConfirm.addEventListener("click", submitLockCode);
ui.lockAnswer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") submitLockCode();
  if (event.key === "Escape") closeLockDialog();
});
ui.lockEditDialogCancel.addEventListener("click", closeLockEditDialog);
ui.lockEditDialogSave.addEventListener("click", saveLockEdit);
ui.lockEditCode.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveLockEdit();
  if (event.key === "Escape") closeLockEditDialog();
});
ui.mathEquationDialogCancel.addEventListener("click", closeMathEquationDialog);
ui.mathEquationDialogSave.addEventListener("click", saveMathEquation);
ui.mathEquationText.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMathEquation();
  if (event.key === "Escape") closeMathEquationDialog();
});
ui.mathEquationWidth.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMathEquation();
  if (event.key === "Escape") closeMathEquationDialog();
});
ui.mathZoneEditCancel.addEventListener("click", closeMathZoneEditDialog);
ui.mathZoneEditSave.addEventListener("click", saveMathZoneEdit);
ui.mathZoneEditDelete.addEventListener("click", deleteMathZone);
ui.mathZoneEditAddEquation.addEventListener("click", beginMathEquationForActiveZone);
ui.mathZoneEditAnswer.addEventListener("keydown", (event) => {
  if (event.key === "Enter") saveMathZoneEdit();
  if (event.key === "Escape") closeMathZoneEditDialog();
});
ui.proWalkTool.addEventListener("click", () => setProTool("walk"));
ui.proLosingTool.addEventListener("click", () => setProTool("losing"));
ui.proBlockTool.addEventListener("click", () => setProTool("block"));
ui.proFrameSelect.addEventListener("change", () => {
  if (mode !== "pro") return;
  activeProFrameIndex = Number(ui.proFrameSelect.value) || 0;
  syncProEditorUi();
  draw();
});
ui.proFrameDuration.addEventListener("change", () => {
  if (mode !== "pro") return;
  const frame = ensureProConfig()?.frames?.[activeProFrameIndex];
  if (!frame) return;
  frame.durationMs = Math.max(80, Math.min(10000, Math.round(Number(ui.proFrameDuration.value) || 500)));
  ui.proFrameDuration.value = String(frame.durationMs);
  persistActiveConfig();
});
ui.proAddFrameButton.addEventListener("click", addProBlankFrame);
ui.proDeleteFrameButton.addEventListener("click", deleteProFrame);
ui.proCopyWalkableButton.addEventListener("click", copyProWalkable);
ui.proFrameFileInput.addEventListener("change", addProImageFrames);

if (ui.onlinePanel) {
  ui.onlineClass.addEventListener("change", () => {
    void Promise.all([refreshOnlineBackgrounds(), refreshOnlineLibrary()]).catch((error) => {
      setOnlineStatus(error.message || "Listerne kunne ikke opdateres.", true);
    });
  });
  ui.onlineBackground.addEventListener("change", () => { void applyOnlineBackground(); });
  ui.onlineApplyTrackButton.addEventListener("click", () => { void applyOnlineLibraryAsset("track"); });
  ui.onlineApplyFigureButton.addEventListener("click", () => { void applyOnlineLibraryAsset("figure"); });
  ui.onlineRefreshButton.addEventListener("click", () => {
    void Promise.all([refreshOnlineBackgrounds(), refreshOnlineLibrary()]).then(() => {
      setOnlineStatus("Listerne er opdateret.");
    }).catch((error) => {
      setOnlineStatus(error.message || "Listerne kunne ikke opdateres.", true);
    });
  });
  ui.onlineSaveButton.addEventListener("click", () => { void saveOnlineGame(); });
  ui.onlineLoadButton.addEventListener("click", () => { void loadOnlineGame(); });
}

canvas.addEventListener("pointerdown", (event) => {
  if ((mode !== "editor" && mode !== "pro") || event.button !== 0) return;
  editorPointerId = event.pointerId;
  editorPointerStart = { x: event.clientX, y: event.clientY };
  editorPointerStartCell = canvasToCell(event);
  if ((mode === "editor" || (mode === "pro" && proEditScope === "global")) && editTool === "mathArea") {
    mathZonePreview = {
      start: { ...editorPointerStartCell },
      end: { ...editorPointerStartCell },
    };
    draw();
  }
  editorPointerDragged = false;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if ((mode !== "editor" && mode !== "pro")
    || event.pointerId !== editorPointerId
    || !(event.buttons & 1)
  ) return;
  if (!editorPointerDragged && editorPointerStart) {
    const movedX = Math.abs(event.clientX - editorPointerStart.x);
    const movedY = Math.abs(event.clientY - editorPointerStart.y);
    editorPointerDragged = movedX > 4 || movedY > 4;
  }
  if (mode === "pro" && proEditScope === "frame") {
    editProCell(canvasToCell(event));
  } else if (editTool === "mathArea" && mathZonePreview) {
    mathZonePreview.end = { ...canvasToCell(event) };
    draw();
  } else if (editTool !== "mathEquation") {
    editCell(canvasToCell(event));
  }
});

canvas.addEventListener("pointerup", (event) => {
  if (event.pointerId !== editorPointerId) return;
  if ((mode === "editor" || (mode === "pro" && proEditScope === "global"))
    && editTool === "mathArea" && editorPointerStartCell) {
    const endCell = canvasToCell(event);
    const clickedZone = !editorPointerDragged
      ? mathZoneAt(editorPointerStartCell.col, editorPointerStartCell.row)
      : null;
    if (clickedZone) showMathZoneEditDialog(clickedZone);
    else setMathZoneFromDrag(editorPointerStartCell, endCell);
    mathZonePreview = null;
    draw();
    suppressEditorClick = true;
  } else if (editorPointerDragged) {
    suppressEditorClick = true;
  }
  editorPointerId = null;
  editorPointerStart = null;
  editorPointerStartCell = null;
  editorPointerDragged = false;
  if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", (event) => {
  if (event.pointerId !== editorPointerId) return;
  if ((mode === "editor" || (mode === "pro" && proEditScope === "global")) && editTool === "mathArea") {
    mathZonePreview = null;
    draw();
  }
  if (editorPointerDragged) suppressEditorClick = true;
  editorPointerId = null;
  editorPointerStart = null;
  editorPointerStartCell = null;
  editorPointerDragged = false;
});

canvas.addEventListener("click", (event) => {
  if (mode !== "editor" && mode !== "pro") return;
  if (suppressEditorClick) {
    suppressEditorClick = false;
    return;
  }
  if (mode === "pro" && proEditScope === "frame") handleProEditorCanvasClick(canvasToCell(event));
  else handleEditorCanvasClick(canvasToCell(event));
});

window.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
  if (event.key === "Escape" && !ui.clueDialog.hidden) {
    ui.clueDialog.hidden = true;
    return;
  }
  if (event.key === "Escape" && !ui.clueEditDialog.hidden) {
    closeClueEditDialog();
    return;
  }
  if (event.key === "Escape" && !ui.lockEditDialog.hidden) {
    closeLockEditDialog();
    return;
  }
  if (event.key === "Escape" && !ui.mathEquationDialog.hidden) {
    closeMathEquationDialog();
    return;
  }
  const moves = {
    ArrowUp: [0, -1],
    ArrowDown: [0, 1],
    ArrowLeft: [-1, 0],
    ArrowRight: [1, 0],
  };
  if (!moves[event.key]) return;
  event.preventDefault();
  movePlayer(...moves[event.key]);
});

function waitForImage(image) {
  if (image.complete) return Promise.resolve();
  return new Promise((resolve) => {
    image.onload = resolve;
    image.onerror = resolve;
  });
}

async function loadGame() {
  const stored = localStorage.getItem(GAME_STORAGE_KEY);
  if (stored) {
    try {
      return normalizeGame(JSON.parse(stored));
    } catch {
      localStorage.removeItem(GAME_STORAGE_KEY);
    }
  }

  const legacy = localStorage.getItem(storageKey("track_1"));
  if (legacy) {
    try {
      return normalizeGame({
        version: 2,
        id: "track_1",
        name: "Spil",
        tracks: [{
          id: "track_1",
          label: "Bane 1",
          figureId: "figure_1",
          config: JSON.parse(legacy),
        }],
        currentTrackIndex: 0,
      });
    } catch {
      localStorage.removeItem(storageKey("track_1"));
    }
  }

  if (PUBLIC_TUTORIAL_MODE) {
    try {
      const response = await fetch("Spil/Toturial.dgm", { cache: "no-store" });
      if (response.ok) return migrateBundleToGame(await response.json());
    } catch {
      // The normal empty game remains available if the tutorial is unavailable.
    }
  }

  return createDefaultGame();
}

async function start() {
  game = await loadGame();
  advancingTrack = false;
  await activateTrack(game.currentTrackIndex);
  setTool("walk");
  setMode("play");
}

start().then(() => initOnline()).catch((error) => {
  console.error(error);
  setOnlineStatus(error.message || "Spillet kunne ikke starte.", true);
});
