import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.4.3/mod.ts";
// TweetNaCl is a cryptography library that we use to verify requests
// from Discord.
import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";

import mapOptions from "./utils/mapOptions.ts";
import connectRedis from "./utils/connectRedis.ts";
import {
  handle as handleXE,
  handleDefault as handleXEDefault,
  XEOptions,
  XEDefaultOptions,
} from "./commands/xe.ts";
import { handle as handleJisho, JishoOptions } from "./commands/jisho.ts";
import { handle as handleTime, TimeOptions } from "./commands/time.ts";

// Globals
const redis = await connectRedis();

// The main logic of the Discord Slash Command is defined in this function.
const home = async (request: Request) => {
  // validateRequest() ensures that a request is of POST method and
  // has the following headers.
  const { error } = await validateRequest(request, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  // verifySignature() verifies if the request is coming from Discord.
  // When the request's signature is not valid, we return a 401 and this is
  // important as Discord sends invalid requests to test our verification.
  const { valid, body } = await verifySignature(request);
  if (!valid) {
    return json(
      { error: "Invalid request" },
      {
        status: 401,
      }
    );
  }

  const { type = 0, data = { options: [] }, member } = JSON.parse(body); // Type this later
  // Discord performs Ping interactions to test our application.
  // Type 1 in a request implies a Ping interaction.
  if (type === 1) {
    return json({
      type: 1, // Type 1 in a response is a Pong interaction response type.
    });
  }

  // Type 2 in a request is an ApplicationCommand interaction.
  // It implies that a user has issued a command.
  try {
    if (type === 2) {
      // Check for command used
      const command = data.name;
      switch (command) {
        case "xe": {
          // Do the xe command
          const options = mapOptions(data.options);

          console.log("options", options);
          console.log("member", member);

          if (data.options?.set_defaults) {
            // Set the default options
            const result = await handleXEDefault(
              options as XEDefaultOptions,
              member.user.id,
              redis
            );

            console.log(result);

            const embed = {
              type: "rich",
              title: "Exchange Rate",
              description: result,
              color: 0xfdc835,
            };

            return json({
              type: 4,
              data: {
                embeds: [embed],
              },
            });
          }

          const result = await handleXE(
            options as XEOptions,
            member.user.id,
            redis
          );
          // Convert the response to a embed object
          const embed = {
            type: "rich",
            title: "Exchange Rate",
            description: result,
            color: 0xfdc835,
          };

          return json({
            type: 4,
            data: {
              embeds: [embed],
            },
          });
        }
        case "jisho": {
          // Do the jisho command
          const options = mapOptions(data.options) as JishoOptions;
          const result = await handleJisho(options);

          // Convert the response to a embed object
          const embed = {
            type: "rich",
            description: result,
            color: 0x00fa9a,
          };

          return json({
            type: 4,
            data: {
              embeds: [embed],
            },
          });
        }
        case "time": {
          // Do the time command
          const options = mapOptions(data.options) as TimeOptions;
          const result = await handleTime(options);

          // Convert the response to a embed object
          const embed = {
            type: "rich",
            title: "Time to local",
            description: result,
            color: 0x04eded,
          };

          return json({
            type: 4,
            data: {
              embeds: [embed],
            },
          });
        }
        case "hello": {
          const { value } = data.options.find(
            (option: { name: string }) => option.name === "name"
          );
          return json({
            type: 4,
            data: {
              content: `Hello, ${value}!`,
            },
          });
        }
        default: {
          // Return a default response
          return json({
            type: 4,
            data: {
              content:
                "This is not a real slash command, how did you get here?",
            },
          });
        }
      }
    }
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

  // We will return a bad request error as a valid Discord request
  // shouldn't reach here.
  return json({ error: "bad request" }, { status: 400 });
};

/** Verify whether the request is coming from Discord. */
async function verifySignature(
  request: Request
): Promise<{ valid: boolean; body: string }> {
  const PUBLIC_KEY = Deno.env.get("DISCORD_PUBLIC_KEY")!;
  // Discord sends these headers with every request.
  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;
  const body = await request.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(PUBLIC_KEY)
  );

  return { valid, body };
}

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)));
}

// For all requests to "/" endpoint, we want to invoke home() handler.
serve({
  "/": home,
});
