import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Weather Service",
  version: "1.0.0",
  transport: new StdioServerTransport(),
});

// Tool implementation
server.tool("get_weather", { location: z.string() }, async ({ location }) => ({
  content: [
    {
      type: "text",
      text: `The weather in ${location} is sunny with a high of 25°C.`,
    },
  ],
}));

// Resource implementation
server.resource(
  "weather",
  new ResourceTemplate("weather://{location}", { list: undefined }),
  async (uri, { location }) => ({
    contents: [
      {
        type: "text",
        text: `The weather in ${location} is sunny with a high of 25°C.`,
      },
    ],
  })
);

// Prompt implementation
server.prompt(
  "weather_prompt",
  {
    location: z.string(),
  },
  async ({ location }) => ({
    messages: [
      {
        role: "assistant",
        content: {
          type: "text",
          text: "You are a weather assistant. Provide the current weather for the specified location.",
        },
      },
      {
        role: "user",
        content: {
          type: "text",
          text: `What is the weather like in ${location}?`,
        },
      },
    ],
  })
);


// Run the server
const transport = new StdioServerTransport();
await server.connect(transport);
console.log("Weather service is running...");