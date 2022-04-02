const makeWkCommand = async () => {
  const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
  const CLIENT_ID = Deno.env.get("CLIENT_ID");

  try {
    const res = await fetch(
      `https://discord.com/api/v8/applications/${CLIENT_ID}/commands`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "wk",
          description: "Some WaniKani Account Commands",
          options: [
            {
              name: "type",
              description: "The type of command to run",
              type: 3,
              required: true,
              choices: [
                {
                  name: "summary",
                  value: "summary",
                },
                {
                  name: "level",
                  value: "level",
                },
                {
                  name: "user",
                  value: "user",
                },
                {
                  name: "dev",
                  value: "dev",
                },
                {
                  name: "refresh",
                  value: "refresh",
                },
              ],
            },
          ],
        }),
      }
    );

    console.log(await res.text());
  } catch (error) {
    console.error(error);
  }
};

await makeWkCommand();
