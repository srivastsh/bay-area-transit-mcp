import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";

interface Env { BART_API_KEY: string; }
const BART_BASE = "https://api.bart.gov/api/";

async function bartFetch(apiKey: string, ep: string, params: Record<string, string>): Promise<unknown> {
  const url = new URL(ep, BART_BASE);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("json", "y");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`BART API ${r.status}: ${r.statusText}`);
  return r.json();
}

function ok(text: string) { return { content: [{ type: "text" as const, text }] }; }
function fail(err: unknown) { return { content: [{ type: "text" as const, text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true }; }

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Accept,Authorization,Mcp-Session-Id,x-api-key-bart",
};

function createServer(apiKey: string): McpServer {
  const server = new McpServer({ name: "bart-mcp-server", version: "1.0.0" });

  server.registerTool("bart_stations", {
    title: "List BART Stations",
    description: "List all BART stations with abbreviation codes and locations. Use this to look up station codes needed by other tools.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async () => {
    try {
      const d: any = await bartFetch(apiKey, "stn.aspx", { cmd: "stns" });
      const s = d?.root?.stations?.station;
      if (!s?.length) return ok("No stations found.");
      return ok(`# BART Stations (${s.length})\n\n${s.map((x: any) => `${x.name} (${x.abbr}) — ${x.city}, ${x.state} | ${x.address}`).join("\n")}`);
    } catch (e) { return fail(e); }
  });

  server.registerTool("bart_departures", {
    title: "BART Real-Time Departures",
    description: "Get real-time departures from a BART station.\n\nArgs:\n  - station: 4-letter abbreviation (e.g. EMBR, 24TH)\n  - direction: Optional 'n' or 's'",
    inputSchema: { station: z.string().min(1).describe("Station code (e.g. EMBR, 24TH)"), direction: z.enum(["n", "s"]).optional().describe("Direction filter") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ station, direction }) => {
    try {
      const p: Record<string, string> = { cmd: "etd", orig: station.toUpperCase() };
      if (direction) p.dir = direction;
      const d: any = await bartFetch(apiKey, "etd.aspx", p);
      const etds = d?.root?.station?.[0]?.etd;
      if (!etds?.length) return ok(`No departures for ${station.toUpperCase()}.`);
      const l = [`# Departures from ${d.root.station[0].name}\n`];
      for (const e of etds) { l.push(`## ${e.destination}`); for (const est of e.estimate || []) l.push(`  - ${est.minutes === "Leaving" ? "Now" : `${est.minutes} min`} | ${est.length}-car ${est.color} | Plat ${est.platform}`); l.push(""); }
      return ok(l.join("\n"));
    } catch (e) { return fail(e); }
  });

  server.registerTool("bart_trip", {
    title: "Plan BART Trip",
    description: "Plan a trip between two BART stations. Returns schedule, fares, and transfer info.",
    inputSchema: { origin: z.string().min(1).describe("Origin station code"), destination: z.string().min(1).describe("Destination station code"), time: z.string().optional().describe("Departure time e.g. '5:30pm'"), date: z.string().optional().describe("Date MM/DD/YYYY") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ origin, destination, time, date }) => {
    try {
      const p: Record<string, string> = { cmd: "depart", orig: origin.toUpperCase(), dest: destination.toUpperCase() };
      if (time) p.time = time; if (date) p.date = date;
      const d: any = await bartFetch(apiKey, "sched.aspx", p);
      const trips = d?.root?.schedule?.request?.trip;
      if (!trips?.length) return ok("No trips found.");
      const l = [`# ${origin.toUpperCase()} → ${destination.toUpperCase()}\n`];
      for (let i = 0; i < trips.length; i++) { const t = trips[i]; l.push(`## Option ${i + 1}: ${t["@origTimeMin"]} → ${t["@destTimeMin"]} (${t["@tripTime"]} min, $${t["@fare"]})`); const legs = Array.isArray(t.leg) ? t.leg : [t.leg]; if (legs.length > 1) for (const g of legs) l.push(`  ${g["@origin"]}→${g["@destination"]} (${g["@line"]})`); l.push(""); }
      return ok(l.join("\n"));
    } catch (e) { return fail(e); }
  });

  server.registerTool("bart_advisories", {
    title: "BART Advisories",
    description: "Get current BART service advisories, delays, and elevator/escalator status.",
    inputSchema: {},
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async () => {
    try {
      const d: any = await bartFetch(apiKey, "bsa.aspx", { cmd: "bsa" });
      const a = d?.root?.bsa;
      if (!a?.length) return ok("No advisories.");
      return ok("# BART Advisories\n\n" + a.map((x: any) => `- **${x.type || "Advisory"}**: ${x.description?.["#cdata-section"] || x.description || "N/A"}`).join("\n"));
    } catch (e) { return fail(e); }
  });

  server.registerTool("bart_fare", {
    title: "BART Fare",
    description: "Get fare between two BART stations.",
    inputSchema: { origin: z.string().min(1).describe("Origin station code"), destination: z.string().min(1).describe("Destination station code") },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  }, async ({ origin, destination }) => {
    try {
      const d: any = await bartFetch(apiKey, "sched.aspx", { cmd: "fare", orig: origin.toUpperCase(), dest: destination.toUpperCase() });
      const f = d?.root?.fares?.fare;
      if (f) { if (Array.isArray(f)) return ok(`# Fare: ${origin.toUpperCase()}→${destination.toUpperCase()}\n\n${f.map((x: any) => `- **${x["@name"]}**: $${x["@amount"]}`).join("\n")}`); return ok(`Fare: $${f["@amount"] || JSON.stringify(f)}`); }
      const fb: any = await bartFetch(apiKey, "sched.aspx", { cmd: "depart", orig: origin.toUpperCase(), dest: destination.toUpperCase() });
      const t = fb?.root?.schedule?.request?.trip?.[0];
      if (t) return ok(`# Fare: ${origin.toUpperCase()}→${destination.toUpperCase()}\n\nClipper/Cash: $${t["@fare"]}`);
      return ok("Could not get fare.");
    } catch (e) { return fail(e); }
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

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // Discovery endpoint
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(JSON.stringify({
        name: "bart-mcp-server", version: "1.0.0",
        description: "BART real-time transit data via MCP",
        mcp_endpoint: "/mcp",
        tools: ["bart_stations", "bart_departures", "bart_trip", "bart_advisories", "bart_fare"],
      }, null, 2), { headers: { "Content-Type": "application/json", ...CORS } });
    }

    if (url.pathname !== "/mcp") {
      return new Response(JSON.stringify({ error: "Not found. Use /mcp" }), { status: 404, headers: { "Content-Type": "application/json", ...CORS } });
    }

    // MCP endpoint — create fresh server + transport per request (stateless)
    try {
      const apiKey = request.headers.get("x-api-key-bart") || env.BART_API_KEY;
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
