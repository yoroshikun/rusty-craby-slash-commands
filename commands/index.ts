import { Redis } from "https://deno.land/x/redis@v0.25.4/mod.ts";

import { handle as handleXE, XEOptions } from "./xe.ts";
import { handle as handleJisho, JishoOptions } from "./jisho.ts";
import { handle as handleTime, TimeOptions } from "./time.ts";
import { handle as handleWK, WKOptions } from "./wk.ts";
import { handle as handleWKToken, WKTokenOptions } from "./wktoken.ts";
import mapOptions from "../utils/mapOptions.ts";
import { DiscordInteractionData, DiscordEmbed } from "../utils/types.ts";

const handleCommand = async (
  data: DiscordInteractionData["data"],
  member: DiscordInteractionData["member"],
  guildId: string,
  redis: Redis
): Promise<DiscordEmbed> => {
  const command = data.name;
  const options = mapOptions(data.options);

  switch (command) {
    case "xe": {
      const ops = options as XEOptions;
      const result = await handleXE(ops, member.user.id, redis);

      return {
        type: "rich",
        title: "Exchange Rate",
        description: result,
        color: 0xfdc835,
      };
    }
    case "jisho": {
      const ops = options as JishoOptions;
      const result = await handleJisho(ops);

      return {
        type: "rich",
        description: result,
        color: 0x00fa9a,
      };
    }
    case "time": {
      const ops = options as TimeOptions;
      const result = await handleTime(ops);

      return {
        type: "rich",
        title: "Time to local",
        description: result,
        color: 0x04eded,
      };
    }
    case "wk": {
      const ops = options as WKOptions;
      const result = await handleWK(ops, member.user.id, redis);

      return {
        type: "rich",
        title: "WaniKani",
        description: result,
        color: 0x00fa9a,
      };
    }
    case "wktoken": {
      const ops = options as WKTokenOptions;
      const result = await handleWKToken(ops, member.user.id, guildId, redis);

      return {
        type: "rich",
        title: "WaniKani Token",
        description: result,
        color: 0x00fa9a,
      };
    }
    case "hello": {
      const ops = options as { name: string };
      return {
        type: "rich",
        description: `Hello, ${ops.name}!`,
        color: 0x00fa9a,
      };
    }
    default: {
      // Return a default response
      return {
        type: "rich",
        description: "This is not a real slash command, how did you get here?",
        color: 0x00fa9a,
      };
    }
  }
};

export default handleCommand;
