import { json, serve } from "https://deno.land/x/sift@0.4.3/mod.ts";

import connectRedis from "./utils/connectRedis.ts";
import verifyDiscord from "./utils/verifyDiscord.ts";
import handleCommand from "./commands/index.ts";
import { DiscordInteractionData } from "./utils/types.ts";

// Globals
const redis = await connectRedis();

// The main logic of the Discord Slash Command is defined in this function.
const home = async (request: Request) => {
  const result = await verifyDiscord(request);

  if (typeof result === "object") {
    return json({ error: result.error }, { status: result.status });
  }

  const {
    type = 0,
    data,
    member,
    guild_id,
  } = JSON.parse(result) as DiscordInteractionData;

  // Discord performs Ping interactions to test our application.
  // Type 1 in a request implies a Ping interaction.
  if (type === 1) {
    return json({
      type: 1, // Type 1 in a response is a Pong interaction response type.
    });
  }

  // Type 2 in a request is an ApplicationCommand interaction.
  // It implies that a user has issued a command.
  if (type === 2) {
    try {
      const embed = await handleCommand(data, member, guild_id, redis);

      return json({
        type: 4,
        data: {
          embeds: [embed],
        },
      });
    } catch (error) {
      return json({
        type: 4,
        data: {
          embeds: [
            {
              type: "rich",
              title: "Internal Error",
              description: error.message,
              color: 0xfd3535,
            },
          ],
        },
      });
    }
  }

  // We will return a bad request error as a valid Discord request
  // shouldn't reach here.
  return json({ error: "bad request" }, { status: 400 });
};

// For all requests to "/" endpoint, we want to invoke home() handler.
serve({
  "/": home,
});
