# Bay Area Transit MCP Servers

Two Cloudflare Workers providing MCP (Model Context Protocol) access to BART and SF Muni real-time transit data. Works with Claude, ChatGPT, Poke, Cursor, and any MCP-compatible client.

**You don't need to deploy anything.** Just point your MCP client at the hosted endpoints below.

## Live Endpoints

- **BART**: `https://bart-mcp.srivastsh.workers.dev/mcp` — no auth, just connect
- **Muni**: `https://muni-mcp.srivastsh.workers.dev/mcp` — pass your free 511.org API key via `x-api-key-511` header

These run on Cloudflare Workers' free tier (100k requests/day). Since the Muni server uses BYOK auth, each user's 511 rate limit is isolated to their own key.

## Quick Start

### BART (no auth required)

Just add the URL to your MCP client. No API key needed.

### Muni (BYOK)

1. Get a free 511.org API key at https://511.org/open-data/token
2. Pass it via the `x-api-key-511` header in your MCP config

---

## Client Configuration

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "bart": {
      "url": "https://bart-mcp.srivastsh.workers.dev/mcp"
    },
    "muni": {
      "url": "https://muni-mcp.srivastsh.workers.dev/mcp",
      "headers": {
        "x-api-key-511": "YOUR_511_API_KEY"
      }
    }
  }
}
```

### Poke

One-click setup: [BART recipe](https://poke.com/refer/vFEH7FR-kPn) | [Muni recipe](https://poke.com/r/rqHQjgDqSzT)

Or add manually as a remote MCP server:

- **URL**: `https://bart-mcp.srivastsh.workers.dev/mcp` or `https://muni-mcp.srivastsh.workers.dev/mcp`
- For Muni, set custom header `x-api-key-511` to your 511 key

### Cursor / Windsurf / stdio-only Clients

Use `mcp-remote` as a bridge:

```json
{
  "mcpServers": {
    "bart": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-remote", "https://bart-mcp.srivastsh.workers.dev/mcp"]
    },
    "muni": {
      "command": "npx",
      "args": [
        "-y", "@anthropic-ai/mcp-remote",
        "https://muni-mcp.srivastsh.workers.dev/mcp",
        "--header", "x-api-key-511:YOUR_511_API_KEY"
      ]
    }
  }
}
```

---

## Available Tools

### BART (5 tools)

| Tool | Description |
|------|-------------|
| `bart_stations` | List all BART stations with codes |
| `bart_departures` | Real-time departures from a station |
| `bart_trip` | Plan a trip between two stations |
| `bart_advisories` | Current service advisories |
| `bart_fare` | Fare lookup between two stations |

### Muni (7 tools)

| Tool | Description |
|------|-------------|
| `transit_operators` | List all 511 transit operators |
| `muni_routes` | List all Muni routes |
| `muni_departures` | Real-time departures from a stop |
| `muni_line` | Line details with stops |
| `muni_alerts` | Current service alerts |
| `muni_vehicles` | Real-time vehicle GPS positions |
| `muni_schedule` | Timetable for a line |

---

## Deploy Your Own

Most users don't need to deploy — just use the hosted endpoints above. But if you want your own instance:

### Prerequisites

- Node.js 18+
- Cloudflare account (free tier works)
- `wrangler` CLI: `npm install -g wrangler`

### BART Worker

```bash
cd bart-mcp
npm install
wrangler login
wrangler deploy
```

The public BART demo key (`MW9S-E7SL-26DU-VV8V`) is baked into `wrangler.toml`. No secrets needed.

### Muni Worker

```bash
cd muni-mcp
npm install
wrangler deploy
```

Optionally set a fallback 511 key (used when no header key is provided):

```bash
wrangler secret put API_511_KEY
```

---

## Architecture

- **Runtime**: Cloudflare Workers (V8 isolates)
- **Transport**: `WebStandardStreamableHTTPServerTransport` (stateless, one server per request)
- **Auth**: BYOK via request headers, optional env secret fallback
- **Validation**: Zod schemas for all tool inputs
- **CORS**: Enabled for all origins
- **API Sources**: api.bart.gov (BART), api.511.org (Muni/511)
