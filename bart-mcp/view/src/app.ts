import { App } from "@modelcontextprotocol/ext-apps";

// ── Geographic data ──────────────────────────────────────────────
const STATIONS: Record<string, { name: string; lat: number; lng: number }> = {
  RICH: { name: "Richmond", lat: 37.9369, lng: -122.3535 },
  DELN: { name: "El Cerrito del Norte", lat: 37.9256, lng: -122.317 },
  PLZA: { name: "El Cerrito Plaza", lat: 37.9029, lng: -122.2993 },
  NBRK: { name: "North Berkeley", lat: 37.8739, lng: -122.283 },
  DBRK: { name: "Downtown Berkeley", lat: 37.87, lng: -122.2681 },
  ASHB: { name: "Ashby", lat: 37.8531, lng: -122.27 },
  MCAR: { name: "MacArthur", lat: 37.8284, lng: -122.2671 },
  "19TH": { name: "19th St Oakland", lat: 37.8084, lng: -122.269 },
  "12TH": { name: "12th St Oakland", lat: 37.8032, lng: -122.2714 },
  WOAK: { name: "West Oakland", lat: 37.8048, lng: -122.2946 },
  LAKE: { name: "Lake Merritt", lat: 37.7975, lng: -122.2653 },
  EMBR: { name: "Embarcadero", lat: 37.7929, lng: -122.3969 },
  MONT: { name: "Montgomery St", lat: 37.7894, lng: -122.4013 },
  POWL: { name: "Powell St", lat: 37.7849, lng: -122.4079 },
  CIVC: { name: "Civic Center", lat: 37.7796, lng: -122.4138 },
  "16TH": { name: "16th St Mission", lat: 37.7652, lng: -122.4196 },
  "24TH": { name: "24th St Mission", lat: 37.7523, lng: -122.4188 },
  GLEN: { name: "Glen Park", lat: 37.733, lng: -122.434 },
  BALB: { name: "Balboa Park", lat: 37.722, lng: -122.4474 },
  DALY: { name: "Daly City", lat: 37.7062, lng: -122.4692 },
  COLM: { name: "Colma", lat: 37.6846, lng: -122.4666 },
  SSAN: { name: "South San Francisco", lat: 37.664, lng: -122.4441 },
  SBRN: { name: "San Bruno", lat: 37.6377, lng: -122.4165 },
  SFIA: { name: "SFO Airport", lat: 37.6161, lng: -122.3922 },
  MLBR: { name: "Millbrae", lat: 37.5999, lng: -122.3866 },
  FTVL: { name: "Fruitvale", lat: 37.7746, lng: -122.2243 },
  COLS: { name: "Coliseum", lat: 37.7538, lng: -122.1969 },
  SANL: { name: "San Leandro", lat: 37.7226, lng: -122.1608 },
  BAYF: { name: "Bay Fair", lat: 37.6968, lng: -122.1265 },
  CAST: { name: "Castro Valley", lat: 37.6907, lng: -122.0759 },
  WDUB: { name: "West Dublin", lat: 37.6997, lng: -121.9283 },
  DUBL: { name: "Dublin/Pleasanton", lat: 37.7017, lng: -121.8992 },
  HAYW: { name: "Hayward", lat: 37.67, lng: -122.087 },
  SHAY: { name: "South Hayward", lat: 37.6348, lng: -122.0575 },
  UCTY: { name: "Union City", lat: 37.591, lng: -122.0171 },
  FRMT: { name: "Fremont", lat: 37.5574, lng: -121.9764 },
  WARM: { name: "Warm Springs", lat: 37.5025, lng: -121.9396 },
  MILP: { name: "Milpitas", lat: 37.4103, lng: -121.8911 },
  BERY: { name: "Berryessa", lat: 37.3685, lng: -121.8749 },
  ANTC: { name: "Antioch", lat: 37.9957, lng: -121.7833 },
  PCTR: { name: "Pittsburg Center", lat: 38.0169, lng: -121.8896 },
  PITT: { name: "Pittsburg/Bay Point", lat: 38.0189, lng: -121.9455 },
  NCON: { name: "North Concord", lat: 38.003, lng: -122.0245 },
  CONC: { name: "Concord", lat: 37.9739, lng: -122.0298 },
  PHIL: { name: "Pleasant Hill", lat: 37.9285, lng: -122.0569 },
  WCRK: { name: "Walnut Creek", lat: 37.9056, lng: -122.0678 },
  LAFY: { name: "Lafayette", lat: 37.8934, lng: -122.1246 },
  ORIN: { name: "Orinda", lat: 37.8784, lng: -122.1837 },
  ROCK: { name: "Rockridge", lat: 37.8441, lng: -122.2516 },
};

const LINES: Record<string, { color: string; name: string; stations: string[] }> = {
  YELLOW: {
    color: "#eab308", name: "Antioch–SFO",
    stations: ["ANTC","PCTR","PITT","NCON","CONC","PHIL","WCRK","LAFY","ORIN","ROCK","MCAR","19TH","12TH","WOAK","EMBR","MONT","POWL","CIVC","16TH","24TH","GLEN","BALB","DALY","COLM","SSAN","SBRN","SFIA"],
  },
  RED: {
    color: "#ef4444", name: "Richmond–Millbrae",
    stations: ["RICH","DELN","PLZA","NBRK","DBRK","ASHB","MCAR","19TH","12TH","WOAK","EMBR","MONT","POWL","CIVC","16TH","24TH","GLEN","BALB","DALY","COLM","SSAN","SBRN","MLBR"],
  },
  GREEN: {
    color: "#22c55e", name: "Berryessa–Daly City",
    stations: ["BERY","MILP","WARM","FRMT","UCTY","SHAY","HAYW","BAYF","SANL","COLS","FTVL","LAKE","WOAK","EMBR","MONT","POWL","CIVC","16TH","24TH","GLEN","BALB","DALY"],
  },
  BLUE: {
    color: "#3b82f6", name: "Dublin–Daly City",
    stations: ["DUBL","WDUB","CAST","BAYF","SANL","COLS","FTVL","LAKE","WOAK","EMBR","MONT","POWL","CIVC","16TH","24TH","GLEN","BALB","DALY"],
  },
  ORANGE: {
    color: "#f97316", name: "Richmond–Berryessa",
    stations: ["RICH","DELN","PLZA","NBRK","DBRK","ASHB","MCAR","19TH","12TH","LAKE","FTVL","COLS","SANL","BAYF","HAYW","SHAY","UCTY","FRMT","WARM","MILP","BERY"],
  },
};

// Major stations that get labels on the map
const LABEL_STATIONS = new Set([
  "RICH","DBRK","MCAR","EMBR","MONT","POWL","CIVC","16TH","24TH","GLEN","BALB","DALY",
  "SFIA","MLBR","DUBL","FRMT","BERY","ANTC","PITT","CONC","WCRK","ROCK","WOAK","LAKE",
  "BAYF","COLS","FTVL","12TH","19TH","MILP","WARM",
]);

// ── Schematic map geometry ───────────────────────────────────────
const DIAGRAM_WIDTH = 1180;
const DIAGRAM_HEIGHT = 760;

const STATION_POINTS: Record<string, { x: number; y: number }> = {
  RICH: { x: 95, y: 95 },
  DELN: { x: 145, y: 130 },
  PLZA: { x: 195, y: 165 },
  NBRK: { x: 245, y: 200 },
  DBRK: { x: 295, y: 235 },
  ASHB: { x: 345, y: 270 },
  MCAR: { x: 395, y: 305 },
  "19TH": { x: 445, y: 340 },
  "12TH": { x: 495, y: 375 },
  WOAK: { x: 560, y: 410 },
  EMBR: { x: 635, y: 445 },
  MONT: { x: 690, y: 475 },
  POWL: { x: 745, y: 505 },
  CIVC: { x: 800, y: 535 },
  "16TH": { x: 855, y: 565 },
  "24TH": { x: 910, y: 595 },
  GLEN: { x: 965, y: 625 },
  BALB: { x: 1020, y: 655 },
  DALY: { x: 1075, y: 685 },
  COLM: { x: 1115, y: 650 },
  SSAN: { x: 1135, y: 600 },
  SBRN: { x: 1120, y: 545 },
  SFIA: { x: 1070, y: 510 },
  MLBR: { x: 1140, y: 690 },
  LAKE: { x: 545, y: 355 },
  FTVL: { x: 595, y: 385 },
  COLS: { x: 645, y: 415 },
  SANL: { x: 695, y: 445 },
  BAYF: { x: 745, y: 475 },
  CAST: { x: 805, y: 440 },
  WDUB: { x: 875, y: 405 },
  DUBL: { x: 945, y: 370 },
  HAYW: { x: 790, y: 520 },
  SHAY: { x: 835, y: 560 },
  UCTY: { x: 880, y: 600 },
  FRMT: { x: 925, y: 640 },
  WARM: { x: 970, y: 680 },
  MILP: { x: 1015, y: 720 },
  BERY: { x: 1060, y: 735 },
  ROCK: { x: 450, y: 260 },
  ORIN: { x: 515, y: 225 },
  LAFY: { x: 580, y: 190 },
  WCRK: { x: 645, y: 155 },
  PHIL: { x: 710, y: 120 },
  CONC: { x: 775, y: 95 },
  NCON: { x: 840, y: 90 },
  PITT: { x: 905, y: 105 },
  PCTR: { x: 970, y: 125 },
  ANTC: { x: 1035, y: 150 },
};

const LINE_OFFSETS: Record<string, { x: number; y: number }> = {
  YELLOW: { x: -9, y: -8 },
  RED: { x: -4, y: -3 },
  GREEN: { x: 2, y: 2 },
  BLUE: { x: 8, y: 7 },
  ORANGE: { x: 13, y: -2 },
};

function projectStations(width: number, height: number) {
  void width;
  void height;
  return STATION_POINTS;
}

// ── SVG helpers ──────────────────────────────────────────────────
const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

// ── State ────────────────────────────────────────────────────────
let selected: string[] = [];
let routeStations: Set<string> = new Set();
let stationEls: Map<string, SVGCircleElement> = new Map();
let labelEls: Map<string, SVGTextElement> = new Map();
let lineEls: Map<string, SVGPolylineElement> = new Map();
let highlightEl: SVGPolylineElement | null = null;
let coords: Record<string, { x: number; y: number }> = {};
let svgRoot: SVGSVGElement;
let linesGroup: SVGGElement;
let stationsGroup: SVGGElement;
let labelsGroup: SVGGElement;
let tooltipEl: HTMLDivElement | null = null;
let zoomLevel = 1;
let panX = 0, panY = 0;
let viewGroup: SVGGElement;
let pulseEls: SVGElement[] = [];
let glowEl: SVGPolylineElement | null = null;
let activeLine: string | null = null;

function labelPosition(id: string): { dx: number; dy: number; anchor: "start" | "middle" | "end" } {
  if (["RICH","DELN","PLZA","NBRK","DBRK","ASHB","ANTC","PCTR","PITT","NCON","CONC","PHIL","WCRK","LAFY","ORIN","ROCK"].includes(id)) {
    return { dx: 0, dy: -14, anchor: "middle" };
  }
  if (["SFIA","SBRN","SSAN","COLM","MLBR","DUBL","WDUB","CAST"].includes(id)) {
    return { dx: -12, dy: 4, anchor: "end" };
  }
  if (["BERY","MILP","WARM","FRMT","UCTY","SHAY","HAYW"].includes(id)) {
    return { dx: 12, dy: 4, anchor: "start" };
  }
  if (["EMBR","MONT","POWL","CIVC","16TH","24TH","GLEN","BALB","DALY"].includes(id)) {
    return { dx: -12, dy: 4, anchor: "end" };
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

function createSearchBox(placeholder: string, items: Array<{ id: string; name: string }>): HTMLDivElement {
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
      button.textContent = `${item.name} (${item.id})`;
      button.addEventListener("click", () => {
        input.value = "";
        list.classList.remove("open");
        selected = [item.id];
        routeStations.clear();
        clearHighlight();
        updateMarkers();
        showDepartures(item.id);
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
  stationEls.forEach((el, id) => {
    const focusedLine = activeLine ? LINES[activeLine] : undefined;
    const active = !focusedLine || focusedLine.stations.includes(id);
    el.setAttribute("opacity", active ? "1" : "0.28");
  });
  labelEls.forEach((el, id) => {
    const focusedLine = activeLine ? LINES[activeLine] : undefined;
    const active = !focusedLine || focusedLine.stations.includes(id);
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
  stationEls.clear();
  labelEls.clear();
  lineEls.clear();
  if (tooltipEl?.isConnected) tooltipEl.remove();
  coords = projectStations(w, h);

  svgRoot = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, role: "img", "aria-label": "Schematic BART route map" });
  svgRoot.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svgRoot.style.width = "100%";
  svgRoot.style.height = "100%";
  svgRoot.style.display = "block";

  svgRoot.appendChild(svgEl("rect", { x: 0, y: 0, width: w, height: h, fill: "#f7faf9" }));
  svgRoot.appendChild(svgEl("path", {
    d: "M568 0 C528 98 530 208 580 330 C617 420 612 496 570 595 C545 653 548 710 590 760 L1180 760 L1180 0 Z",
    fill: "#d9edf5",
  }));
  svgRoot.appendChild(svgEl("path", {
    d: "M0 0 L540 0 C502 110 506 226 558 338 C596 420 592 492 548 590 C514 665 520 723 562 760 L0 760 Z",
    fill: "#fffdf7",
  }));
  svgRoot.appendChild(svgEl("text", { x: 610, y: 370, fill: "#7aa6b7", "font-size": 18, "font-weight": 700, "letter-spacing": 1.5 }));
  svgRoot.lastChild!.textContent = "SAN FRANCISCO BAY";

  viewGroup = svgEl("g");
  linesGroup = svgEl("g");
  stationsGroup = svgEl("g");
  labelsGroup = svgEl("g");
  viewGroup.appendChild(linesGroup);
  viewGroup.appendChild(stationsGroup);
  viewGroup.appendChild(labelsGroup);
  svgRoot.appendChild(viewGroup);

  Object.entries(LINES).forEach(([name, line]) => {
    const points: string[] = [];
    for (let i = 0; i < line.stations.length; i++) {
      const sid = line.stations[i];
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
    const polyline = svgEl("polyline", {
      points: points.join(" "),
      fill: "none",
      stroke: line.color,
      "stroke-width": 8,
      "stroke-opacity": 0.96,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    });
    linesGroup.appendChild(casing);
    linesGroup.appendChild(polyline);
    lineEls.set(name, polyline);
  });

  // Draw station dots and labels
  Object.entries(STATIONS).forEach(([id, station]) => {
    const c = coords[id];
    if (!c) return;

    // Station dot
    const halo = svgEl("circle", {
      cx: c.x, cy: c.y, r: LABEL_STATIONS.has(id) ? 10 : 8,
      fill: "#ffffff",
      stroke: "rgba(15,23,42,0.12)",
      "stroke-width": 2,
    });
    const circle = svgEl("circle", {
      cx: c.x, cy: c.y, r: LABEL_STATIONS.has(id) ? 6.2 : 5.2,
      fill: "#ffffff",
      stroke: "#334155",
      "stroke-width": 1.6,
      tabindex: 0,
      "aria-label": `${station.name} station`,
    });
    circle.style.cursor = "pointer";
    circle.style.transition = "r 0.2s, fill 0.2s, stroke 0.2s";

    circle.addEventListener("mouseenter", (e) => showTooltip(station.name, e.clientX, e.clientY));
    circle.addEventListener("mouseleave", () => hideTooltip());
    circle.addEventListener("click", () => handleClick(id));
    circle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(id);
      }
    });

    stationsGroup.appendChild(halo);
    stationsGroup.appendChild(circle);
    stationEls.set(id, circle);

    // Station label for major stations
    if (LABEL_STATIONS.has(id)) {
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
      label.textContent = station.name;
      labelsGroup.appendChild(label);
      labelEls.set(id, label);
    }
  });

  container.innerHTML = "";
  container.appendChild(svgRoot);
  container.appendChild(createSearchBox("Find a BART station", Object.entries(STATIONS).map(([id, s]) => ({ id, name: s.name }))));
  container.appendChild(createHint("Click one station for departures. Click a second station to plan a trip."));

  // Add zoom controls
  const zoomDiv = document.createElement("div");
  zoomDiv.className = "zoom-controls";
  zoomDiv.innerHTML = `<button class="zoom-btn" id="zoom-in" title="Zoom in">+</button><button class="zoom-btn" id="zoom-out" title="Zoom out">-</button><button class="zoom-btn" id="zoom-reset" title="Reset view">1x</button>`;
  container.appendChild(zoomDiv);

  document.getElementById("zoom-in")!.addEventListener("click", () => { zoomLevel = Math.min(zoomLevel * 1.3, 4); applyZoom(w, h); });
  document.getElementById("zoom-out")!.addEventListener("click", () => { zoomLevel = Math.max(zoomLevel / 1.3, 0.5); applyZoom(w, h); });
  document.getElementById("zoom-reset")!.addEventListener("click", () => { zoomLevel = 1; panX = 0; panY = 0; applyZoom(w, h); });

  // Add menu button (toggle legend)
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

  // Add legend
  const legendDiv = document.createElement("div");
  legendDiv.id = "legend";
  legendDiv.className = "legend";
  legendDiv.innerHTML = Object.entries(LINES).map(([key, l]) =>
    `<button class="legend-item" data-line="${key}"><span class="legend-line" style="background:${l.color}"></span>${l.name}</button>`
  ).join("");
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
  svgRoot.addEventListener("mousedown", (e) => {
    if ((e.target as Element).tagName === "circle") return;
    dragging = true; startX = e.clientX - panX; startY = e.clientY - panY;
    svgRoot.style.cursor = "grabbing";
  });
  svgRoot.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    panX = e.clientX - startX; panY = e.clientY - startY;
    applyZoom(w, h);
  });
  svgRoot.addEventListener("mouseup", () => { dragging = false; svgRoot.style.cursor = "default"; });
  svgRoot.addEventListener("mouseleave", () => { dragging = false; svgRoot.style.cursor = "default"; });

  // Scroll zoom
  svgRoot.addEventListener("wheel", (e) => {
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
  // Hide hint on first interaction
  const hint = document.getElementById("hint");
  if (hint) hint.style.opacity = "0";

  if (selected.includes(id)) {
    selected = [];
    routeStations.clear();
    clearHighlight();
    hidePanel();
    return;
  }
  if (selected.length === 0) {
    selected = [id];
    updateMarkers();
    await showDepartures(id);
  } else if (selected.length === 1) {
    selected.push(id);
    updateMarkers();
    await showTrip(selected[0], id);
  } else {
    selected = [id];
    routeStations.clear();
    clearHighlight();
    updateMarkers();
    await showDepartures(id);
  }
}

function updateMarkers() {
  stationEls.forEach((el, id) => {
    const isOrigin = selected.length > 0 && selected[0] === id;
    const isDest = selected.length > 1 && selected[1] === id;
    if (isOrigin) {
      el.setAttribute("r", "7");
      el.setAttribute("fill", "#3b82f6");
      el.setAttribute("stroke", "#60a5fa");
      el.setAttribute("stroke-width", "2.5");
    } else if (isDest) {
      el.setAttribute("r", "7");
      el.setAttribute("fill", "#22c55e");
      el.setAttribute("stroke", "#4ade80");
      el.setAttribute("stroke-width", "2.5");
    } else if (routeStations.has(id)) {
      el.setAttribute("r", "4.5");
      el.setAttribute("fill", "#3b82f6");
      el.setAttribute("stroke", "#60a5fa");
      el.setAttribute("stroke-width", "1.5");
    } else {
      el.setAttribute("r", "4");
      el.setAttribute("fill", "#e4e4e7");
      el.setAttribute("stroke", "#71717a");
      el.setAttribute("stroke-width", "1.2");
    }
  });
  // Labels
  labelEls.forEach((el, id) => {
    if (selected.includes(id) || routeStations.has(id)) {
      el.setAttribute("fill", "#e4e4e7");
      el.setAttribute("font-weight", "600");
    } else {
      el.setAttribute("fill", "#71717a");
      el.setAttribute("font-weight", "500");
    }
  });
}

function clearHighlight() {
  if (highlightEl) { highlightEl.remove(); highlightEl = null; }
  if (glowEl) { glowEl.remove(); glowEl = null; }
  pulseEls.forEach(el => el.remove());
  pulseEls = [];
  lineEls.forEach((el) => {
    el.setAttribute("stroke-opacity", "0.96");
    el.setAttribute("stroke-width", "8");
  });
  const legend = document.getElementById("legend");
  if (legend) legend.style.display = "flex";
  updateMarkers();
}

function highlightRoute(origin: string, dest: string) {
  clearHighlight();
  routeStations.clear();
  const path = findRoute(origin, dest);
  if (path.length < 2) return;
  routeStations = new Set(path);

  const points = path
    .map((id) => coords[id] ? `${coords[id].x},${coords[id].y}` : null)
    .filter(Boolean)
    .join(" ");

  highlightEl = svgEl("polyline", {
    points,
    fill: "none",
    stroke: "#3b82f6",
    "stroke-width": 4.5,
    "stroke-opacity": 0.9,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  });

  // Glow effect
  glowEl = svgEl("polyline", {
    points,
    fill: "none",
    stroke: "#3b82f6",
    "stroke-width": 10,
    "stroke-opacity": 0.15,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  });

  linesGroup.appendChild(glowEl);
  linesGroup.appendChild(highlightEl);

  // Add pulsing rings for origin and dest
  const addPulseRing = (stationId: string, color: string) => {
    const c = coords[stationId];
    if (!c) return;
    const ring = svgEl("circle", { cx: c.x, cy: c.y, r: 10, fill: "none", stroke: color, "stroke-width": 2, opacity: 0 });
    const anim = document.createElementNS(SVG_NS, "animate");
    anim.setAttribute("attributeName", "r");
    anim.setAttribute("values", "7;18");
    anim.setAttribute("dur", "1.5s");
    anim.setAttribute("repeatCount", "indefinite");
    ring.appendChild(anim);
    const animOpacity = document.createElementNS(SVG_NS, "animate");
    animOpacity.setAttribute("attributeName", "opacity");
    animOpacity.setAttribute("values", "0.6;0");
    animOpacity.setAttribute("dur", "1.5s");
    animOpacity.setAttribute("repeatCount", "indefinite");
    ring.appendChild(animOpacity);
    stationsGroup.appendChild(ring);
    pulseEls.push(ring);
  };
  if (selected.length >= 1) addPulseRing(selected[0], "#3b82f6");
  if (selected.length >= 2) addPulseRing(selected[1], "#22c55e");

  // Dim other lines
  lineEls.forEach((el) => { el.setAttribute("stroke-opacity", "0.12"); });

  // Hide legend
  const legend = document.getElementById("legend");
  if (legend) legend.style.display = "none";

  updateMarkers();
}

// ── BFS pathfinding ──────────────────────────────────────────────
function findRoute(start: string, end: string): string[] {
  const graph = new Map<string, string[]>();
  Object.values(LINES).forEach((line) => {
    line.stations.forEach((s, i) => {
      if (!graph.has(s)) graph.set(s, []);
      if (i > 0) {
        const prev = line.stations[i - 1];
        if (!graph.get(s)!.includes(prev)) graph.get(s)!.push(prev);
      }
      if (i < line.stations.length - 1) {
        const next = line.stations[i + 1];
        if (!graph.get(s)!.includes(next)) graph.get(s)!.push(next);
      }
    });
  });

  const queue = [start];
  const visited = new Set([start]);
  const parent = new Map<string, string>();

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur === end) {
      const path: string[] = [];
      let n: string | undefined = end;
      while (n) { path.unshift(n); n = parent.get(n); }
      return path;
    }
    for (const nb of graph.get(cur) || []) {
      if (!visited.has(nb)) {
        visited.add(nb);
        parent.set(nb, cur);
        queue.push(nb);
      }
    }
  }
  return [];
}

// ── MCP tool calls ───────────────────────────────────────────────
async function showDepartures(stationId: string) {
  showPanelLoading();
  try {
    const result = await app.callServerTool({
      name: "bart_departures",
      arguments: { station: stationId },
    });
    const text = (result as any).content?.[0]?.text || "";
    const deps = parseDepartures(text);
    renderDeparturesPanel(stationId, deps);
  } catch {
    showPanelError("Failed to fetch departures");
  }
}

async function showTrip(origin: string, dest: string) {
  showPanelLoading();
  try {
    const result = await app.callServerTool({
      name: "bart_trip",
      arguments: { origin, destination: dest },
    });
    const text = (result as any).content?.[0]?.text || "";
    const trip = parseTripData(text);
    highlightRoute(origin, dest);
    renderTripPanel(origin, dest, trip);
  } catch {
    showPanelError("Failed to fetch trip info");
  }
}

// ── Parsers ──────────────────────────────────────────────────────
function parseDepartures(text: string): Array<{ destination: string; times: string[] }> {
  const deps = new Map<string, string[]>();
  let curDest: string | null = null;
  for (const line of text.split("\n")) {
    const dm = line.match(/^## (.+)$/);
    if (dm) { curDest = dm[1].trim(); continue; }
    if (curDest) {
      const nowMatch = line.match(/Now|Leaving/i);
      const tm = line.match(/(\d+)\s+min/);
      if (nowMatch) {
        if (!deps.has(curDest)) deps.set(curDest, []);
        deps.get(curDest)!.push("Now");
      } else if (tm) {
        if (!deps.has(curDest)) deps.set(curDest, []);
        deps.get(curDest)!.push(`${tm[1]} min`);
      }
    }
  }
  return Array.from(deps.entries()).map(([destination, times]) => ({ destination, times }));
}

function parseTripData(text: string) {
  const timeMatch = text.match(/(\d+)\s+min/);
  const fareMatch = text.match(/\$[\d.]+/);
  // Count transfers: look for "transfer" keyword or multiple legs within an option
  const transferMatch = text.match(/(\d+)\s+transfer/i);
  const transfers = transferMatch ? transferMatch[1] : "0";
  // Extract departure times from option lines (e.g., "11:25 PM → 12:21 AM")
  const optionTimes: string[] = [];
  const optionLines = text.match(/^## Option \d+:\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/gm);
  if (optionLines) {
    for (const line of optionLines) {
      const m = line.match(/(\d{1,2}:\d{2}\s*(?:AM|PM))/);
      if (m && optionTimes.length < 3) optionTimes.push(m[1]);
    }
  }
  return {
    time: timeMatch ? `${timeMatch[1]}` : "—",
    fare: fareMatch ? fareMatch[0] : "—",
    transfers,
    nextDepartures: optionTimes,
  };
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

function stationLineInfo(id: string): { name: string; color: string }[] {
  return Object.entries(LINES)
    .filter(([, l]) => l.stations.includes(id))
    .map(([key, l]) => ({ name: key, color: l.color }));
}

function renderDeparturesPanel(stationId: string, deps: Array<{ destination: string; times: string[] }>) {
  const { panel, content } = getPanel();
  if (!panel || !content) return;
  const station = STATIONS[stationId];
  const lines = stationLineInfo(stationId);
  const primaryColor = lines[0]?.color || "#52525b";

  let html = `
    <div class="panel-header">
      <div class="panel-title">Station Departures</div>
      <button class="panel-close" onclick="window.clearSelection()">✕</button>
    </div>
    <div class="station-header">
      <div class="station-icon" style="background:${primaryColor}">${stationId.slice(0, 2)}</div>
      <div class="station-meta">
        <div class="s-name">${station.name}</div>
        <div class="line-tags">${lines.map(l => `<span class="line-tag" style="background:${l.color}">${l.name}</span>`).join("")}</div>
      </div>
    </div>`;

  if (deps.length > 0) {
    html += '<div class="dep-list">';
    deps.slice(0, 6).forEach((d) => {
      const badges = d.times.slice(0, 3).map((t) =>
        `<span class="time-badge${t === "Now" ? " now" : ""}">${t}</span>`
      ).join("");
      html += `<div class="dep-row"><span class="dep-dest">${d.destination}</span><div class="dep-times">${badges}</div></div>`;
    });
    html += "</div>";
  } else {
    html += '<div class="loading">No upcoming departures</div>';
  }

  content.innerHTML = html;
  panel.classList.add("open");
}

function renderTripPanel(origin: string, dest: string, trip: { time: string; fare: string; transfers: string; nextDepartures: string[] }) {
  const { panel, content } = getPanel();
  if (!panel || !content) return;
  const os = STATIONS[origin], ds = STATIONS[dest];

  let html = `
    <div class="panel-header">
      <div class="panel-title">Trip Details</div>
      <button class="panel-close" onclick="window.clearSelection()">✕</button>
    </div>
    <div class="trip-endpoints">
      <div class="trip-ep-row">
        <div class="trip-ep-dot" style="background:#3b82f6"></div>
        <span class="trip-ep-name">${os.name}</span>
        <span class="trip-ep-code">${origin}</span>
      </div>
      <div class="trip-ep-row">
        <div class="trip-ep-dot" style="background:#22c55e"></div>
        <span class="trip-ep-name">${ds.name}</span>
        <span class="trip-ep-code">${dest}</span>
      </div>
    </div>
    <div class="trip-summary">
      <div class="trip-summary-item">
        <div class="trip-summary-label">Travel Time</div>
        <div class="trip-summary-value">${trip.time} min</div>
      </div>
      <div class="trip-summary-item">
        <div class="trip-summary-label">Fare</div>
        <div class="trip-summary-value">${trip.fare}</div>
      </div>
      <div class="trip-summary-item">
        <div class="trip-summary-label">Transfers</div>
        <div class="trip-summary-value">${trip.transfers}</div>
      </div>`;

  if (trip.nextDepartures.length > 0) {
    html += `
      <div class="trip-summary-item">
        <div class="trip-summary-label">Next Departures</div>
        <div class="next-dep-badges">${trip.nextDepartures.map(t => `<span class="next-dep-badge">${t}</span>`).join("")}</div>
      </div>`;
  }

  html += `</div>`;

  content.innerHTML = html;
  panel.classList.add("open");
}

// ── Global clear ─────────────────────────────────────────────────
(window as any).clearSelection = () => {
  selected = [];
  activeLine = null;
  routeStations.clear();
  clearHighlight();
  document.querySelectorAll<HTMLButtonElement>(".legend-item").forEach((button) => button.classList.remove("active"));
  hidePanel();
};

// ── Initialize (matching official ext-apps map-server pattern) ───
const PREFERRED_INLINE_HEIGHT = 520;

const app = new App(
  { name: "BART Interactive Map", version: "1.0.0" },
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
