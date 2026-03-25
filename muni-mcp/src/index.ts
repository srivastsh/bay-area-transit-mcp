import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

interface Env { API_511_KEY?: string; }
const API_511_BASE = "https://api.511.org/transit/";
const MUNI_OPERATOR = "SF";

async function fetch511(apiKey: string, endpoint: string, params: Record<string, string> = {}): Promise<unknown> {
  const url = new URL(endpoint, API_511_BASE);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error(`511 API ${resp.status}: ${resp.statusText}`);
  let text = await resp.text();
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return JSON.parse(text);
}

function ok(text: string) { return { content: [{ type: "text" as const, text }] }; }
function fail(err: unknown) { return { content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true }; }

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Accept,Authorization,Mcp-Session-Id,x-api-key-511",
};

function createServer(apiKey: string): McpServer {
  const server = new McpServer({ name: "muni-mcp-server", version: "1.0.0" });

  server.registerTool("transit_operators", {
    title: "List 511 Transit Operators", description: "List all transit operators available in the 511 API (BART, Muni, Caltrain, AC Transit, etc.).",
    inputSchema: {}, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async () => {
    try {
      const data: any = await fetch511(apiKey, "operators");
      if (!Array.isArray(data) || !data.length) return ok("No operators found.");
      const lines: string[] = [`# 511 Transit Operators (${data.length})\n`];
      for (const op of data) lines.push(`- **${op.Name}** (${op.Id}) — ${op.Website || "no website"}`);
      return ok(lines.join("\n"));
    } catch (err) { return fail(err); }
  });

  server.registerTool("muni_routes", {
    title: "List Muni Routes", description: "List all SF Muni routes (bus, rail, cable car).\n\nArgs:\n  - operator_id: Optional operator ID (default 'SF' for Muni)",
    inputSchema: { operator_id: z.string().default(MUNI_OPERATOR).describe("Operator ID (default SF)") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ operator_id }) => {
    try {
      const data: any = await fetch511(apiKey, "routes", { operator_id });
      if (!Array.isArray(data) || !data.length) return ok("No routes found.");
      const lines: string[] = [`# Muni Routes (${data.length})\n`];
      for (const r of data) lines.push(`- **${r.Id}**: ${r.Name}`);
      return ok(lines.join("\n"));
    } catch (err) { return fail(err); }
  });

  server.registerTool("muni_departures", {
    title: "Muni Real-Time Departures", description: "Get real-time departure predictions for a Muni stop.\n\nArgs:\n  - stop_code: The 5-digit stop code\n  - operator_id: Optional (default 'SF')",
    inputSchema: { stop_code: z.string().min(1).describe("Muni stop code (e.g. '15731')"), operator_id: z.string().default(MUNI_OPERATOR).describe("Operator ID (default SF)") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ stop_code, operator_id }) => {
    try {
      const data: any = await fetch511(apiKey, "StopMonitoring", { agency: operator_id, stopCode: stop_code });
      const deliveries = data?.ServiceDelivery?.StopMonitoringDelivery?.MonitoredStopVisit || data?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit;
      if (!deliveries?.length) return ok(`No departures found for stop ${stop_code}.`);
      const lines: string[] = [`# Departures from Stop ${stop_code}\n`];
      for (const visit of deliveries) {
        const j = visit.MonitoredVehicleJourney; if (!j) continue;
        const call = j.MonitoredCall; const ea = call?.ExpectedArrivalTime || call?.ExpectedDepartureTime;
        let eta = "unknown";
        if (ea) { const m = Math.max(0, Math.round((new Date(ea).getTime() - Date.now()) / 60000)); eta = m === 0 ? "Arriving" : `${m} min`; }
        lines.push(`- **${j.PublishedLineName || j.LineRef}** → ${j.DestinationName || j.DestinationRef} — ${eta}`);
      }
      return ok(lines.join("\n"));
    } catch (err) { return fail(err); }
  });

  server.registerTool("muni_line", {
    title: "Muni Line Details", description: "Get details for a specific Muni line including stops.\n\nArgs:\n  - line_id: Route/line ID (e.g. 'N', '14', '38R')\n  - operator_id: Optional (default 'SF')",
    inputSchema: { line_id: z.string().min(1).describe("Muni line/route ID"), operator_id: z.string().default(MUNI_OPERATOR).describe("Operator ID (default SF)") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ line_id, operator_id }) => {
    try {
      const data: any = await fetch511(apiKey, "stops", { operator_id, line_id });
      if (!data?.Contents?.dataObjects?.ScheduledStopPoint?.length) {
        const stops = data?.Stops || data?.stops || data;
        if (Array.isArray(stops) && stops.length) { const lines = [`# Line ${line_id} Stops (${stops.length})\n`]; for (const s of stops) lines.push(`- ${s.Name||s.name} (${s.Id||s.id||s.StopId})`); return ok(lines.join("\n")); }
        return ok(`No info found for line ${line_id}.`);
      }
      const stops = data.Contents.dataObjects.ScheduledStopPoint;
      const lines = [`# Line ${line_id} — ${stops.length} stops\n`];
      for (const s of stops) lines.push(`- **${s.Name}** (stop ${s.id||s.Id||""}) — ${s.Url||""}`);
      return ok(lines.join("\n"));
    } catch (err) { return fail(err); }
  });

  server.registerTool("muni_alerts", {
    title: "Muni Service Alerts", description: "Get current Muni service alerts, detours, and disruptions.\n\nArgs:\n  - operator_id: Optional (default 'SF')",
    inputSchema: { operator_id: z.string().default(MUNI_OPERATOR).describe("Operator ID (default SF)") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ operator_id }) => {
    try {
      const data: any = await fetch511(apiKey, "servicealerts", { agency: operator_id });
      const alerts = data?.Entities || data?.ServiceDelivery?.SituationExchangeDelivery?.Situations?.PtSituationElement || [];
      if (!alerts.length) return ok("No current Muni service alerts.");
      const lines: string[] = ["# Muni Service Alerts\n"];
      for (const a of alerts) {
        if (a.Alert) { const h = a.Alert.HeaderText?.Translations?.[0]?.Text || a.Alert.HeaderText?.Translation?.[0]?.Text || "Alert"; const d = a.Alert.DescriptionText?.Translations?.[0]?.Text || a.Alert.DescriptionText?.Translation?.[0]?.Text || ""; lines.push(`## ${h}`); if (d) lines.push(d); lines.push(""); }
        else if (a.Summary || a.Description) { lines.push(`## ${a.Summary||"Alert"}`); if (a.Description) lines.push(a.Description); lines.push(""); }
      }
      return ok(lines.join("\n"));
    } catch (err) { return fail(err); }
  });

  server.registerTool("muni_vehicles", {
    title: "Muni Vehicle Positions", description: "Get real-time GPS positions of Muni vehicles.\n\nArgs:\n  - operator_id: Optional (default 'SF')",
    inputSchema: { operator_id: z.string().default(MUNI_OPERATOR).describe("Operator ID (default SF)") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ operator_id }) => {
    try {
      const data: any = await fetch511(apiKey, "VehicleMonitoring", { agency: operator_id });
      const acts = data?.Siri?.ServiceDelivery?.VehicleMonitoringDelivery?.VehicleActivity || data?.ServiceDelivery?.VehicleMonitoringDelivery?.VehicleActivity || data?.ServiceDelivery?.VehicleMonitoringDelivery?.[0]?.VehicleActivity || [];
      if (!acts.length) return ok("No vehicle positions available.");
      const lines = [`# Muni Vehicles (${acts.length})\n`]; const lim = Math.min(acts.length, 50);
      for (let i = 0; i < lim; i++) { const v = acts[i].MonitoredVehicleJourney; if (!v) continue; lines.push(`- **${v.PublishedLineName||v.LineRef||"?"}** → ${v.DestinationName||v.DestinationRef||"?"} | ${v.VehicleLocation?.Latitude||"?"}, ${v.VehicleLocation?.Longitude||"?"}`); }
      if (acts.length > lim) lines.push(`\n_...and ${acts.length-lim} more_`);
      return ok(lines.join("\n"));
    } catch (err) { return fail(err); }
  });

  server.registerTool("muni_schedule", {
    title: "Muni Timetable", description: "Get the timetable/schedule for a specific Muni line.\n\nArgs:\n  - line_id: Route/line ID (e.g. 'N', '14', '38R')\n  - operator_id: Optional (default 'SF')",
    inputSchema: { line_id: z.string().min(1).describe("Muni line/route ID"), operator_id: z.string().default(MUNI_OPERATOR).describe("Operator ID (default SF)") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ line_id, operator_id }) => {
    try {
      const data: any = await fetch511(apiKey, "timetable", { operator_id, line_id });
      if (!data) return ok(`No schedule found for line ${line_id}.`);
      const journeys = data?.Content?.TimetableFrame?.VehicleJourneys?.ServiceJourney || data?.ContentFrame?.vehicleJourneys || data?.journeys || [];
      if (Array.isArray(journeys) && journeys.length) {
        const lines = [`# Schedule for Line ${line_id} (${journeys.length} trips)\n`]; const lim = Math.min(journeys.length, 20);
        for (let i = 0; i < lim; i++) { const j = journeys[i]; const dep = j.calls?.Call?.[0]?.Departure?.Time || j.DepartureTime || "?"; lines.push(`- Trip ${i+1}: departs ${dep}`); }
        if (journeys.length > lim) lines.push(`\n_...and ${journeys.length-lim} more trips_`);
        return ok(lines.join("\n"));
      }
      return ok(`# Schedule for Line ${line_id}\n\n${JSON.stringify(data, null, 2).slice(0, 3000)}`);
    } catch (err) { return fail(err); }
  });

  return server;
}

function addCors(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(JSON.stringify({
        name: "muni-mcp-server", version: "1.0.0",
        description: "SF Muni real-time transit data via MCP",
        mcp_endpoint: "/mcp",
        auth: "Pass your 511.org API key via the x-api-key-511 header. Get a free key at https://511.org/open-data/token",
        tools: ["transit_operators", "muni_routes", "muni_departures", "muni_line", "muni_alerts", "muni_vehicles", "muni_schedule"],
      }, null, 2), { headers: { "Content-Type": "application/json", ...CORS } });
    }
    if (url.pathname !== "/mcp") return new Response(JSON.stringify({ error: "Not found. MCP endpoint is at /mcp" }), { status: 404, headers: { "Content-Type": "application/json", ...CORS } });
    if (request.method !== "POST") return new Response(JSON.stringify({ error: "Use POST" }), { status: 405, headers: { "Content-Type": "application/json", ...CORS } });

    const apiKey = request.headers.get("x-api-key-511") || env.API_511_KEY || null;
    if (!apiKey) return new Response(JSON.stringify({ error: "No 511 API key. Set x-api-key-511 header. Free key at https://511.org/open-data/token" }), { status: 401, headers: { "Content-Type": "application/json", ...CORS } });

    try {
      const server = createServer(apiKey);
      const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      await server.connect(transport);
      const response = await transport.handleRequest(request);
      return addCors(response);
    } catch (err: any) {
      return new Response(JSON.stringify({ error: String(err), stack: err?.stack }), { status: 500, headers: { "Content-Type": "application/json", ...CORS } });
    }
  },
};
