import { App } from "@modelcontextprotocol/ext-apps";

// ── Muni Metro stops with geographic coordinates ─────────────────
const STOPS: Record<string, { name: string; lat: number; lng: number; code: string }> = {
  // Market St subway (shared)
  EMBR: { name: "Embarcadero", lat: 37.7929, lng: -122.3969, code: "15731" },
  MONT: { name: "Montgomery", lat: 37.7894, lng: -122.4013, code: "15726" },
  POWL: { name: "Powell", lat: 37.7849, lng: -122.4079, code: "15727" },
  CIVC: { name: "Civic Center", lat: 37.7796, lng: -122.4138, code: "15728" },
  VNES: { name: "Van Ness", lat: 37.7752, lng: -122.4194, code: "15729" },
  CHUR: { name: "Church", lat: 37.7672, lng: -122.4291, code: "15730" },
  CAST: { name: "Castro", lat: 37.7625, lng: -122.4351, code: "15731" },

  // J Church
  JDOL: { name: "Dolores & 18th", lat: 37.7616, lng: -122.4258, code: "13832" },
  J24: { name: "24th St & Church", lat: 37.7517, lng: -122.4277, code: "13835" },
  J30: { name: "30th St & Dolores", lat: 37.7421, lng: -122.4249, code: "13839" },
  JGLN: { name: "Glen Park (J)", lat: 37.7326, lng: -122.4341, code: "13843" },
  JBAL: { name: "Balboa Park (J)", lat: 37.7218, lng: -122.4474, code: "13847" },

  // K Ingleside
  KWST: { name: "West Portal", lat: 37.7410, lng: -122.4635, code: "15733" },
  KSJE: { name: "St Francis Circle", lat: 37.7346, lng: -122.4629, code: "14507" },
  KOCE: { name: "Ocean & Geneva", lat: 37.7232, lng: -122.4559, code: "14513" },
  KBAL: { name: "Balboa Park (K)", lat: 37.7218, lng: -122.4474, code: "14517" },

  // L Taraval
  LWST: { name: "West Portal (L)", lat: 37.7410, lng: -122.4635, code: "15733" },
  LTAR: { name: "Taraval & 19th", lat: 37.7435, lng: -122.4757, code: "14863" },
  L32: { name: "Taraval & 32nd", lat: 37.7423, lng: -122.4889, code: "14870" },
  L46: { name: "Taraval & 46th", lat: 37.7410, lng: -122.5041, code: "14878" },
  LZOO: { name: "SF Zoo", lat: 37.7377, lng: -122.5067, code: "14880" },

  // M Ocean View
  MWST: { name: "West Portal (M)", lat: 37.7410, lng: -122.4635, code: "15733" },
  MSJE: { name: "St Francis Circle (M)", lat: 37.7346, lng: -122.4629, code: "14507" },
  MBRH: { name: "Broad & Holloway", lat: 37.7217, lng: -122.4584, code: "15413" },
  MRND: { name: "Randolph & Bright", lat: 37.7163, lng: -122.4619, code: "15419" },
  MSGU: { name: "San Jose & Geneva", lat: 37.7109, lng: -122.4482, code: "15424" },
  MBAL: { name: "Balboa Park (M)", lat: 37.7218, lng: -122.4474, code: "14517" },

  // N Judah
  NDUB: { name: "Duboce & Church", lat: 37.7694, lng: -122.4297, code: "15734" },
  NCOL: { name: "Cole & Carl", lat: 37.7662, lng: -122.4509, code: "13232" },
  NIRV: { name: "Irving & 9th", lat: 37.7641, lng: -122.4664, code: "13236" },
  N19: { name: "Judah & 19th", lat: 37.7626, lng: -122.4787, code: "13240" },
  N28: { name: "Judah & 28th", lat: 37.7609, lng: -122.4895, code: "13244" },
  NOCE: { name: "Ocean Beach", lat: 37.7607, lng: -122.5091, code: "13249" },

  // T Third
  T4KN: { name: "4th & King", lat: 37.7760, lng: -122.3942, code: "17166" },
  TUCA: { name: "UCSF/Chase Ctr", lat: 37.7706, lng: -122.3869, code: "17350" },
  T3RD: { name: "3rd & Carroll", lat: 37.7315, lng: -122.3949, code: "17171" },
  TBVP: { name: "Bayview Park", lat: 37.7282, lng: -122.3942, code: "17174" },
  TVIS: { name: "Visitacion Valley", lat: 37.7131, lng: -122.4022, code: "17179" },
  TSUN: { name: "Sunnydale", lat: 37.7088, lng: -122.4053, code: "17181" },
};

const LINES: Record<string, { color: string; name: string; stops: string[] }> = {
  J: { color: "#f59e0b", name: "J Church", stops: ["EMBR","MONT","POWL","CIVC","VNES","CHUR","CAST","JDOL","J24","J30","JGLN","JBAL"] },
  K: { color: "#14b8a6", name: "K Ingleside", stops: ["EMBR","MONT","POWL","CIVC","VNES","CHUR","CAST","KWST","KSJE","KOCE","KBAL"] },
  L: { color: "#a78bfa", name: "L Taraval", stops: ["EMBR","MONT","POWL","CIVC","VNES","CHUR","CAST","LWST","LTAR","L32","L46","LZOO"] },
  M: { color: "#3b82f6", name: "M Ocean View", stops: ["EMBR","MONT","POWL","CIVC","VNES","CHUR","CAST","MWST","MSJE","MBRH","MRND","MSGU","MBAL"] },
  N: { color: "#60a5fa", name: "N Judah", stops: ["EMBR","MONT","POWL","CIVC","VNES","NDUB","NCOL","NIRV","N19","N28","NOCE"] },
  T: { color: "#ef4444", name: "T Third", stops: ["EMBR","MONT","POWL","CIVC","T4KN","TUCA","T3RD","TBVP","TVIS","TSUN"] },
};

const BUS_POINTS: Record<string, { x: number; y: number; name: string }> = {
  FERRY: { x: 120, y: 205, name: "Ferry Building" },
  VANNESS: { x: 460, y: 205, name: "Van Ness" },
  DIVIS: { x: 585, y: 205, name: "Divisadero" },
  PRESIDIO: { x: 705, y: 205, name: "Presidio" },
  PARKPRES: { x: 835, y: 205, name: "Park Presidio" },
  GEARYBEACH: { x: 975, y: 205, name: "Geary / Ocean Beach" },
  CALTRAIN: { x: 330, y: 335, name: "Caltrain" },
  CHINATOWN: { x: 330, y: 120, name: "Chinatown" },
  MARINA: { x: 545, y: 105, name: "Marina" },
  FILLMORE: { x: 545, y: 330, name: "Fillmore" },
  MISSION16: { x: 545, y: 420, name: "16th / Mission" },
  POTRERO: { x: 500, y: 520, name: "Potrero" },
  THIRD: { x: 420, y: 395, name: "Third St" },
  BAYVIEW: { x: 520, y: 535, name: "Bayview" },
  SUNNYDALE: { x: 640, y: 640, name: "Sunnydale" },
  MISSION24: { x: 650, y: 455, name: "24th / Mission" },
  EXCELSIOR: { x: 720, y: 560, name: "Excelsior" },
  DALYCITY: { x: 790, y: 635, name: "Daly City" },
  HAIGHT: { x: 620, y: 300, name: "Haight" },
  OCEANBEACH: { x: 970, y: 305, name: "Ocean Beach" },
  NINETEENTH: { x: 850, y: 260, name: "19th Ave" },
  STONESTOWN: { x: 850, y: 470, name: "Stonestown" },
  SFSU: { x: 850, y: 560, name: "SF State" },
  BAYSHORE: { x: 720, y: 635, name: "Bayshore" },
};

const BUS_LINES: Record<string, { color: string; name: string; stops: string[] }> = {
  "1": { color: "#475569", name: "California", stops: ["FERRY","VANNESS","DIVIS","PRESIDIO"] },
  "5R": { color: "#2563eb", name: "Fulton Rapid", stops: ["FERRY","VANNESS","HAIGHT","PARKPRES","OCEANBEACH"] },
  "14R": { color: "#dc2626", name: "Mission Rapid", stops: ["FERRY","CIVC","MISSION16","MISSION24","EXCELSIOR","DALYCITY"] },
  "22": { color: "#0f766e", name: "Fillmore", stops: ["MARINA","FILLMORE","MISSION16","POTRERO"] },
  "24": { color: "#7c3aed", name: "Divisadero", stops: ["DIVIS","HAIGHT","MISSION24","BAYSHORE"] },
  "28R": { color: "#0891b2", name: "19th Ave Rapid", stops: ["PARKPRES","NINETEENTH","STONESTOWN","SFSU","DALYCITY"] },
  "30": { color: "#9333ea", name: "Stockton", stops: ["MARINA","CHINATOWN","CALTRAIN"] },
  "38R": { color: "#ea580c", name: "Geary Rapid", stops: ["FERRY","VANNESS","DIVIS","PRESIDIO","PARKPRES","GEARYBEACH"] },
  "49": { color: "#16a34a", name: "Van Ness / Mission", stops: ["MARINA","VANNESS","CIVC","MISSION16","MISSION24","EXCELSIOR"] },
};

const BUS_ROUTE_INDEX = [
  { id: "1", name: "California" }, { id: "2", name: "Sutter / Clement" }, { id: "5", name: "Fulton" }, { id: "5R", name: "Fulton Rapid" },
  { id: "6", name: "Haight / Parnassus" }, { id: "7", name: "Haight / Noriega" }, { id: "8", name: "Bayshore" }, { id: "9", name: "San Bruno" },
  { id: "9R", name: "San Bruno Rapid" }, { id: "12", name: "Folsom / Pacific" }, { id: "14", name: "Mission" }, { id: "14R", name: "Mission Rapid" },
  { id: "15", name: "Bayview Hunters Point Express" }, { id: "18", name: "46th Avenue" }, { id: "19", name: "Polk" }, { id: "21", name: "Hayes" },
  { id: "22", name: "Fillmore" }, { id: "23", name: "Monterey" }, { id: "24", name: "Divisadero" }, { id: "25", name: "Treasure Island" },
  { id: "27", name: "Bryant" }, { id: "28", name: "19th Avenue" }, { id: "28R", name: "19th Avenue Rapid" }, { id: "29", name: "Sunset" },
  { id: "30", name: "Stockton" }, { id: "31", name: "Balboa" }, { id: "33", name: "Ashbury / 18th" }, { id: "35", name: "Eureka" },
  { id: "36", name: "Teresita" }, { id: "37", name: "Corbett" }, { id: "38", name: "Geary" }, { id: "38R", name: "Geary Rapid" },
  { id: "39", name: "Coit" }, { id: "43", name: "Masonic" }, { id: "44", name: "O'Shaughnessy" }, { id: "45", name: "Union / Stockton" },
  { id: "48", name: "Quintara / 24th Street" }, { id: "49", name: "Van Ness / Mission" }, { id: "52", name: "Excelsior" }, { id: "54", name: "Felton" },
  { id: "55", name: "Dogpatch" }, { id: "56", name: "Rutland" }, { id: "57", name: "Parkmerced" }, { id: "58", name: "Lake Merced" },
  { id: "66", name: "Quintara" }, { id: "67", name: "Bernal Heights" },
];

// Major stops that get labels
const LABEL_STOPS = new Set([
  "EMBR","MONT","POWL","CIVC","VNES","CHUR","CAST","JBAL","KWST","KBAL",
  "LZOO","NOCE","MBAL","NDUB","T4KN","TSUN","TUCA","JGLN","J24","NIRV","LTAR","L46",
]);

// ── Schematic map geometry ───────────────────────────────────────
const DIAGRAM_WIDTH = 1040;
const DIAGRAM_HEIGHT = 700;
const SVG_NS = "http://www.w3.org/2000/svg";

const STOP_POINTS: Record<string, { x: number; y: number }> = {
  EMBR: { x: 120, y: 245 },
  MONT: { x: 205, y: 245 },
  POWL: { x: 290, y: 245 },
  CIVC: { x: 375, y: 245 },
  VNES: { x: 460, y: 245 },
  CHUR: { x: 545, y: 245 },
  CAST: { x: 630, y: 245 },
  JDOL: { x: 620, y: 315 },
  J24: { x: 650, y: 385 },
  J30: { x: 680, y: 455 },
  JGLN: { x: 720, y: 525 },
  JBAL: { x: 760, y: 595 },
  KWST: { x: 700, y: 310 },
  KSJE: { x: 750, y: 375 },
  KOCE: { x: 800, y: 485 },
  KBAL: { x: 760, y: 595 },
  LWST: { x: 700, y: 310 },
  LTAR: { x: 775, y: 320 },
  L32: { x: 850, y: 330 },
  L46: { x: 925, y: 345 },
  LZOO: { x: 965, y: 390 },
  MWST: { x: 700, y: 310 },
  MSJE: { x: 750, y: 375 },
  MBRH: { x: 805, y: 440 },
  MRND: { x: 850, y: 505 },
  MSGU: { x: 805, y: 565 },
  MBAL: { x: 760, y: 595 },
  NDUB: { x: 560, y: 185 },
  NCOL: { x: 650, y: 160 },
  NIRV: { x: 735, y: 150 },
  N19: { x: 820, y: 150 },
  N28: { x: 905, y: 160 },
  NOCE: { x: 970, y: 190 },
  T4KN: { x: 375, y: 325 },
  TUCA: { x: 420, y: 395 },
  T3RD: { x: 470, y: 470 },
  TBVP: { x: 520, y: 535 },
  TVIS: { x: 575, y: 595 },
  TSUN: { x: 640, y: 640 },
};

const LINE_OFFSETS: Record<string, { x: number; y: number }> = {
  J: { x: -10, y: -7 },
  K: { x: -5, y: -3 },
  L: { x: 0, y: 0 },
  M: { x: 5, y: 3 },
  N: { x: 10, y: -7 },
  T: { x: 0, y: 8 },
};

function projectStops(width: number, height: number) {
  void width;
  void height;
  return STOP_POINTS;
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

// ── State ────────────────────────────────────────────────────────
let selectedStop: string | null = null;
let stopEls = new Map<string, SVGCircleElement>();
let labelEls = new Map<string, SVGTextElement>();
let lineEls = new Map<string, SVGPolylineElement>();
let busLineEls = new Map<string, SVGPolylineElement>();
let coords: Record<string, { x: number; y: number }> = {};
let tooltipEl: HTMLDivElement | null = null;
let zoomLevel = 1;
let panX = 0, panY = 0;
let viewGroup: SVGGElement;
let activeLine: string | null = null;

function labelPosition(id: string): { dx: number; dy: number; anchor: "start" | "middle" | "end" } {
  if (["EMBR","MONT","POWL","CIVC","VNES","CHUR","CAST","NDUB","NCOL","NIRV","N19","N28","NOCE"].includes(id)) {
    return { dx: 0, dy: -14, anchor: "middle" };
  }
  if (["T4KN","TUCA","T3RD","TBVP","TVIS","TSUN"].includes(id)) {
    return { dx: -12, dy: 4, anchor: "end" };
  }
  if (["LZOO","L46","L32","LTAR","KWST","LWST","MWST"].includes(id)) {
    return { dx: 12, dy: 4, anchor: "start" };
  }
  return { dx: 12, dy: 4, anchor: "start" };
}

function createHint(text: string): HTMLDivElement {
  const hint = document.createElement("div");
  hint.id = "hint";
  hint.className = "hint";
  hint.textContent = text;
  return hint;
}

function createSearchBox(placeholder: string, items: Array<{ id: string; name: string; kind: "stop" | "route" }>): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.className = "map-search";
  const input = document.createElement("input");
  input.type = "search";
  input.placeholder = placeholder;
  input.setAttribute("aria-label", placeholder);
  const list = document.createElement("div");
  list.className = "search-results";
  wrapper.appendChild(input);
  wrapper.appendChild(list);

  const renderMatches = () => {
    const query = input.value.trim().toLowerCase();
    list.innerHTML = "";
    if (!query) {
      list.classList.remove("open");
      return;
    }
    const matches = items
      .filter((item) => item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query))
      .slice(0, 6);
    for (const item of matches) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = item.kind === "route" ? `Route ${item.id} - ${item.name}` : `${item.name} (${item.id})`;
      button.addEventListener("click", () => {
        input.value = "";
        list.classList.remove("open");
        if (item.kind === "route") {
          selectedStop = null;
          resetMarkers();
          focusLine(item.id);
          showRouteDetails(item.id, item.name);
        } else {
          selectedStop = item.id;
          highlightStop(item.id);
          fetchDepartures(item.id);
        }
      });
      list.appendChild(button);
    }
    list.classList.toggle("open", matches.length > 0);
  };

  input.addEventListener("input", renderMatches);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const first = list.querySelector<HTMLButtonElement>("button");
      first?.click();
    }
    if (event.key === "Escape") {
      input.value = "";
      list.classList.remove("open");
    }
  });
  return wrapper;
}

function focusLine(lineName: string) {
  activeLine = activeLine === lineName ? null : lineName;
  lineEls.forEach((el, key) => {
    const active = !activeLine || key === activeLine;
    el.setAttribute("stroke-opacity", active ? "0.98" : "0.16");
    el.setAttribute("stroke-width", active ? "9" : "4");
  });
  busLineEls.forEach((el, key) => {
    const active = !activeLine || key === activeLine;
    el.setAttribute("stroke-opacity", active ? "0.88" : "0.12");
    el.setAttribute("stroke-width", active ? "7" : "3");
  });
  stopEls.forEach((el, id) => {
    const focusedLine = activeLine ? LINES[activeLine] : undefined;
    const active = !focusedLine || focusedLine.stops.includes(id) || Boolean(activeLine && BUS_LINES[activeLine]);
    el.setAttribute("opacity", active ? "1" : "0.28");
  });
  labelEls.forEach((el, id) => {
    const focusedLine = activeLine ? LINES[activeLine] : undefined;
    const active = !focusedLine || focusedLine.stops.includes(id) || Boolean(activeLine && BUS_LINES[activeLine]);
    el.setAttribute("opacity", active ? "1" : "0.28");
  });
  document.querySelectorAll<HTMLButtonElement>(".legend-item").forEach((button) => {
    button.classList.toggle("active", Boolean(activeLine && button.dataset.line === activeLine));
  });
}

// ── Render ───────────────────────────────────────────────────────
function render() {
  const container = document.getElementById("map")!;
  const w = DIAGRAM_WIDTH;
  const h = DIAGRAM_HEIGHT;
  stopEls.clear();
  labelEls.clear();
  lineEls.clear();
  busLineEls.clear();
  if (tooltipEl?.isConnected) tooltipEl.remove();
  coords = projectStops(w, h);

  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": "Schematic Muni Metro route map" });
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.width = "100%";
  svg.style.height = "100%";
  svg.style.display = "block";

  svg.appendChild(svgEl("rect", { x: 0, y: 0, width: w, height: h, fill: "#f7faf9" }));
  svg.appendChild(svgEl("path", {
    d: "M0 0 H1040 V185 C940 170 830 176 720 208 C617 238 529 232 430 206 C276 166 130 178 0 235 Z",
    fill: "#d9edf5",
  }));
  svg.appendChild(svgEl("path", {
    d: "M0 235 C130 178 276 166 430 206 C529 232 617 238 720 208 C830 176 940 170 1040 185 V700 H0 Z",
    fill: "#fffdf7",
  }));
  const ocean = svgEl("text", { x: 55, y: 135, fill: "#7aa6b7", "font-size": 17, "font-weight": 700, "letter-spacing": 1.4 });
  ocean.textContent = "BAY / WATERFRONT";
  svg.appendChild(ocean);

  viewGroup = svgEl("g");
  const busG = svgEl("g");
  const linesG = svgEl("g");
  const stationsG = svgEl("g");
  const labelsG = svgEl("g");
  viewGroup.appendChild(busG);
  viewGroup.appendChild(linesG);
  viewGroup.appendChild(stationsG);
  viewGroup.appendChild(labelsG);
  svg.appendChild(viewGroup);

  Object.entries(BUS_LINES).forEach(([key, line]) => {
    const points = line.stops
      .map((id) => BUS_POINTS[id] || coords[id])
      .filter((point): point is { x: number; y: number } => Boolean(point))
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
    const casing = svgEl("polyline", {
      points,
      fill: "none",
      stroke: "#ffffff",
      "stroke-width": 11,
      "stroke-opacity": 0.82,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });
    const poly = svgEl("polyline", {
      points,
      fill: "none",
      stroke: line.color,
      "stroke-width": 5,
      "stroke-opacity": 0.68,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-dasharray": "10 7",
    });
    busG.appendChild(casing);
    busG.appendChild(poly);
    busLineEls.set(key, poly);

    const midPoint = (BUS_POINTS[line.stops[Math.floor(line.stops.length / 2)]] || coords[line.stops[Math.floor(line.stops.length / 2)]]);
    if (midPoint) {
      const badge = svgEl("text", {
        x: midPoint.x + 10,
        y: midPoint.y - 8,
        fill: line.color,
        stroke: "#fffdf7",
        "stroke-width": 3,
        "paint-order": "stroke",
        "font-size": 15,
        "font-weight": 800,
        "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      });
      badge.textContent = key;
      busG.appendChild(badge);
    }
  });

  // Draw lines with slight offset for shared segments
  Object.entries(LINES).forEach(([name, line]) => {
    const points: string[] = [];
    for (let i = 0; i < line.stops.length; i++) {
      const sid = line.stops[i];
      const c = coords[sid];
      if (!c) continue;
      const { x: ox, y: oy } = LINE_OFFSETS[name] || { x: 0, y: 0 };
      points.push(`${c.x + ox},${c.y + oy}`);
    }

    const casing = svgEl("polyline", {
      points: points.join(" "),
      fill: "none",
      stroke: "#ffffff",
      "stroke-width": 15,
      "stroke-opacity": 0.92,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });
    const poly = svgEl("polyline", {
      points: points.join(" "), fill: "none",
      stroke: line.color, "stroke-width": 8, "stroke-opacity": 0.96,
      "stroke-linecap": "round", "stroke-linejoin": "round",
    });
    linesG.appendChild(casing);
    linesG.appendChild(poly);
    lineEls.set(name, poly);
  });

  // Draw stop dots and labels
  const drawn = new Map<string, SVGCircleElement>();
  Object.entries(STOPS).forEach(([id, stop]) => {
    const c = coords[id];
    if (!c) return;
    const posKey = `${Math.round(c.x)},${Math.round(c.y)}`;
    const existing = drawn.get(posKey);
    if (existing) {
      stopEls.set(id, existing);
      return;
    }

    const halo = svgEl("circle", {
      cx: c.x, cy: c.y, r: LABEL_STOPS.has(id) ? 10 : 8,
      fill: "#ffffff",
      stroke: "rgba(15,23,42,0.12)",
      "stroke-width": 2,
    });
    const circle = svgEl("circle", {
      cx: c.x, cy: c.y, r: LABEL_STOPS.has(id) ? 6.2 : 5.2,
      fill: "#ffffff", stroke: "#334155", "stroke-width": 1.6,
      tabindex: 0,
      "aria-label": `${stop.name} stop`,
    });
    circle.style.cursor = "pointer";
    circle.style.transition = "r 0.2s, fill 0.2s";
    circle.addEventListener("mouseenter", (e) => showTooltip(stop.name, e.clientX, e.clientY));
    circle.addEventListener("mouseleave", () => hideTooltip());
    circle.addEventListener("click", () => handleClick(id));
    circle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(id);
      }
    });
    stationsG.appendChild(halo);
    stationsG.appendChild(circle);
    stopEls.set(id, circle);
    drawn.set(posKey, circle);

    // Label for major stops
    if (LABEL_STOPS.has(id)) {
      const labelPos = labelPosition(id);
      const label = svgEl("text", {
        x: c.x + labelPos.dx, y: c.y + labelPos.dy,
        fill: "#263241",
        stroke: "#fffdf7",
        "stroke-width": 3,
        "paint-order": "stroke",
        "font-size": 15,
        "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        "font-weight": "650",
        "text-anchor": labelPos.anchor,
        "pointer-events": "none",
      });
      label.textContent = stop.name;
      labelsG.appendChild(label);
      labelEls.set(id, label);
    }
  });

  container.innerHTML = "";
  container.appendChild(svg);
  container.appendChild(createSearchBox("Find a stop or bus route", [
    ...Object.entries(STOPS).map(([id, s]) => ({ id, name: s.name, kind: "stop" as const })),
    ...BUS_ROUTE_INDEX.map((route) => ({ ...route, kind: "route" as const })),
  ]));
  container.appendChild(createHint("Search bus routes, click rail stops for departures, or use chips to isolate routes."));

  // Zoom controls
  const zoomDiv = document.createElement("div");
  zoomDiv.className = "zoom-controls";
  zoomDiv.innerHTML = `<button class="zoom-btn" id="zoom-in" title="Zoom in">+</button><button class="zoom-btn" id="zoom-out" title="Zoom out">-</button><button class="zoom-btn" id="zoom-reset" title="Reset view">1x</button>`;
  container.appendChild(zoomDiv);

  document.getElementById("zoom-in")!.addEventListener("click", () => { zoomLevel = Math.min(zoomLevel * 1.3, 4); applyZoom(w, h); });
  document.getElementById("zoom-out")!.addEventListener("click", () => { zoomLevel = Math.max(zoomLevel / 1.3, 0.5); applyZoom(w, h); });
  document.getElementById("zoom-reset")!.addEventListener("click", () => { zoomLevel = 1; panX = 0; panY = 0; applyZoom(w, h); });

  // Menu button (toggle legend)
  const menuBtn = document.createElement("button");
  menuBtn.className = "menu-btn";
  menuBtn.textContent = "Lines";
  menuBtn.title = "Toggle legend";
  container.appendChild(menuBtn);
  menuBtn.addEventListener("click", () => {
    const legend = document.getElementById("legend");
    if (legend) {
      legend.style.display = legend.style.display === "none" ? "flex" : "none";
    }
  });

  // Legend
  const legendDiv = document.createElement("div");
  legendDiv.id = "legend";
  legendDiv.className = "legend";
  legendDiv.innerHTML = [
    ...Object.entries(LINES).map(([key, l]) =>
      `<button class="legend-item" data-line="${key}"><span class="legend-line" style="background:${l.color}"></span>${key} ${l.name.replace(key + " ", "")}</button>`
    ),
    ...Object.entries(BUS_LINES).map(([key, l]) =>
      `<button class="legend-item bus" data-line="${key}"><span class="legend-line dashed" style="color:${l.color}"></span>${key} ${l.name}</button>`
    ),
  ].join("");
  container.appendChild(legendDiv);
  legendDiv.querySelectorAll<HTMLButtonElement>("[data-line]").forEach((button) => {
    button.addEventListener("click", () => focusLine(button.dataset.line || ""));
  });

  // Tooltip
  tooltipEl = document.createElement("div");
  tooltipEl.className = "tooltip";
  document.body.appendChild(tooltipEl);

  // Pan support
  let dragging = false, startX = 0, startY = 0;
  svg.addEventListener("mousedown", (e) => {
    if ((e.target as Element).tagName === "circle") return;
    dragging = true; startX = e.clientX - panX; startY = e.clientY - panY;
    svg.style.cursor = "grabbing";
  });
  svg.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    panX = e.clientX - startX; panY = e.clientY - startY;
    applyZoom(w, h);
  });
  svg.addEventListener("mouseup", () => { dragging = false; svg.style.cursor = "default"; });
  svg.addEventListener("mouseleave", () => { dragging = false; svg.style.cursor = "default"; });

  // Scroll zoom
  svg.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomLevel = Math.max(0.5, Math.min(4, zoomLevel * factor));
    applyZoom(w, h);
  }, { passive: false });
}

function applyZoom(w: number, h: number) {
  const cx = w / 2, cy = h / 2;
  viewGroup.setAttribute("transform", `translate(${cx + panX},${cy + panY}) scale(${zoomLevel}) translate(${-cx},${-cy})`);
}

function showTooltip(text: string, x: number, y: number) {
  if (!tooltipEl) return;
  tooltipEl.textContent = text;
  tooltipEl.style.left = x + 12 + "px";
  tooltipEl.style.top = y - 32 + "px";
  tooltipEl.style.opacity = "1";
}
function hideTooltip() { if (tooltipEl) tooltipEl.style.opacity = "0"; }

// ── Interaction ──────────────────────────────────────────────────
async function handleClick(id: string) {
  const hint = document.getElementById("hint");
  if (hint) hint.style.opacity = "0";

  if (selectedStop === id) {
    selectedStop = null;
    resetMarkers();
    hidePanel();
    return;
  }
  selectedStop = id;
  highlightStop(id);
  await fetchDepartures(id);
}

function highlightStop(id: string) {
  resetMarkers();
  const el = stopEls.get(id);
  if (el) {
    el.setAttribute("r", "7");
    el.setAttribute("fill", "#3b82f6");
    el.setAttribute("stroke", "#60a5fa");
    el.setAttribute("stroke-width", "2.5");
  }
  // Update label
  labelEls.forEach((lbl, lid) => {
    if (lid === id) {
      lbl.setAttribute("fill", "#e4e4e7");
      lbl.setAttribute("font-weight", "600");
    }
  });
  // Highlight lines through this stop
  lineEls.forEach((poly, name) => {
    const line = LINES[name];
    if (line && line.stops.includes(id)) {
      poly.setAttribute("stroke-opacity", "0.85");
      poly.setAttribute("stroke-width", "9");
    } else {
      poly.setAttribute("stroke-opacity", "0.12");
    }
  });
  // Hide legend
  const legend = document.getElementById("legend");
  if (legend) legend.style.display = "none";
}

function resetMarkers() {
  stopEls.forEach((el) => {
    el.setAttribute("r", "4");
    el.setAttribute("fill", "#e4e4e7");
    el.setAttribute("stroke", "#71717a");
    el.setAttribute("stroke-width", "1.2");
  });
  labelEls.forEach((lbl) => {
    lbl.setAttribute("fill", "#71717a");
    lbl.setAttribute("font-weight", "500");
  });
  lineEls.forEach((poly) => {
    poly.setAttribute("stroke-opacity", "0.96");
    poly.setAttribute("stroke-width", "8");
  });
  busLineEls.forEach((poly) => {
    poly.setAttribute("stroke-opacity", "0.68");
    poly.setAttribute("stroke-width", "5");
  });
  // Show legend
  const legend = document.getElementById("legend");
  if (legend) legend.style.display = "flex";
}

// ── MCP tool calls ───────────────────────────────────────────────
async function fetchDepartures(stopId: string) {
  const stop = STOPS[stopId];
  if (!stop) return;
  showPanelLoading();
  try {
    const result = await app.callServerTool({
      name: "muni_departures",
      arguments: { stop_code: stop.code },
    });
    const text = (result as any).content?.[0]?.text || "";
    renderDeparturesPanel(stopId, text);
  } catch {
    showPanelError("Failed to fetch departures");
  }
}

async function showRouteDetails(routeId: string, routeName: string) {
  showPanelLoading();
  try {
    const result = await app.callServerTool({
      name: "muni_line",
      arguments: { line_id: routeId },
    });
    const text = (result as any).content?.[0]?.text || "";
    renderRoutePanel(routeId, routeName, text);
  } catch {
    renderRoutePanel(routeId, routeName, "Route details are available when this app is running inside an MCP host with a 511 API key.");
  }
}

// ── Panel UI ─────────────────────────────────────────────────────
function getPanel() {
  return {
    panel: document.getElementById("panel") as HTMLElement,
    content: document.getElementById("panel-content") as HTMLElement,
  };
}
function showPanelLoading() {
  const { panel, content } = getPanel();
  if (!panel || !content) return;
  content.innerHTML = '<div class="loading">Loading...</div>';
  panel.classList.add("open");
}
function showPanelError(msg: string) {
  const { panel, content } = getPanel();
  if (!panel || !content) return;
  content.innerHTML = `<div class="error">${msg}</div>`;
  panel.classList.add("open");
}
function hidePanel() {
  const { panel } = getPanel();
  if (panel) panel.classList.remove("open");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stopLineInfo(id: string): { key: string; name: string; color: string }[] {
  return Object.entries(LINES)
    .filter(([, l]) => l.stops.includes(id))
    .map(([key, l]) => ({ key, name: l.name, color: l.color }));
}

function renderDeparturesPanel(stopId: string, rawText: string) {
  const { panel, content } = getPanel();
  if (!panel || !content) return;
  const stop = STOPS[stopId];
  const lines = stopLineInfo(stopId);
  const primaryColor = lines[0]?.color || "#52525b";

  // Parse departure lines
  const departures: Array<{ line: string; dest: string; eta: string; color: string }> = [];
  for (const line of rawText.split("\n")) {
    const m = line.match(/\*\*(.+?)\*\*\s*→\s*(.+?)\s*—\s*(.+)/);
    if (m) {
      const lineKey = m[1].trim();
      const lineInfo = LINES[lineKey];
      departures.push({
        line: lineKey,
        dest: m[2].trim(),
        eta: m[3].trim(),
        color: lineInfo?.color || "#52525b",
      });
    }
  }

  let html = `
    <div class="panel-header">
      <div class="panel-title">Stop Departures</div>
      <button class="panel-close" onclick="window.clearSelection()">✕</button>
    </div>
    <div class="station-header">
      <div class="station-icon" style="background:${primaryColor}">${lines[0]?.key || "?"}</div>
      <div class="station-meta">
        <div class="s-name">${stop.name}</div>
        <div class="line-tags">${lines.map(l => `<span class="line-tag" style="background:${l.color}">${l.key}</span>`).join("")}</div>
      </div>
    </div>`;

  if (departures.length > 0) {
    html += '<div class="dep-list">';
    departures.slice(0, 8).forEach((d) => {
      html += `<div class="dep-row">
        <span class="dep-dest"><span class="dep-line-badge" style="background:${d.color}">${escapeHtml(d.line)}</span>${escapeHtml(d.dest)}</span>
        <div class="dep-times"><span class="time-badge">${escapeHtml(d.eta)}</span></div>
      </div>`;
    });
    html += "</div>";
  } else {
    html += '<div class="loading">No upcoming departures</div>';
  }

  content.innerHTML = html;
  panel.classList.add("open");
}

function renderRoutePanel(routeId: string, routeName: string, rawText: string) {
  const { panel, content } = getPanel();
  if (!panel || !content) return;
  const line = BUS_LINES[routeId] || LINES[routeId];
  const color = line?.color || "#475569";
  const rows = rawText
    .split("\n")
    .filter((lineText) => lineText.trim().startsWith("- "))
    .slice(0, 12)
    .map((lineText) => lineText.replace(/^- /, "").replace(/\*\*/g, ""));

  let html = `
    <div class="panel-header">
      <div class="panel-title">Route Details</div>
      <button class="panel-close" onclick="window.clearSelection()">x</button>
    </div>
    <div class="station-header">
      <div class="station-icon" style="background:${color}">${escapeHtml(routeId)}</div>
      <div class="station-meta">
        <div class="s-name">${escapeHtml(routeName)}</div>
        <div class="s-code">${BUS_LINES[routeId] ? "Frequent bus corridor" : "Muni route"}</div>
      </div>
    </div>`;

  if (rows.length > 0) {
    html += '<div class="dep-list">';
    rows.forEach((row) => {
      html += `<div class="dep-row"><span class="dep-dest">${escapeHtml(row)}</span></div>`;
    });
    html += "</div>";
  } else {
    html += `<div class="loading">${escapeHtml(rawText || "No route details found.")}</div>`;
  }

  content.innerHTML = html;
  panel.classList.add("open");
}

// ── Global clear ─────────────────────────────────────────────────
(window as any).clearSelection = () => {
  selectedStop = null;
  activeLine = null;
  resetMarkers();
  document.querySelectorAll<HTMLButtonElement>(".legend-item").forEach((button) => button.classList.remove("active"));
  hidePanel();
};

// ── Initialize (matching official ext-apps map-server pattern) ───
const PREFERRED_INLINE_HEIGHT = 520;

const app = new App(
  { name: "Muni Interactive Map", version: "1.0.0" },
  {},
  { autoResize: false }
);

try {
  render();
} catch (e) {
  const map = document.getElementById("map");
  if (map) map.innerHTML = `<div style="padding:20px;color:#ef4444">Map render error: ${e}</div>`;
}

async function initialize() {
  try {
    await app.connect();

    const context = app.getHostContext();
    const displayMode = context?.displayMode ?? "inline";

    if (displayMode === "inline") {
      app.sendSizeChanged({ height: PREFERRED_INLINE_HEIGHT });
    }
  } catch (err) {
    console.warn("MCP host not available (standalone mode):", err);
  }
}

initialize();
