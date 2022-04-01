// Call discord api to  add slash command for time
const makeWkTokenCommand = async () => {
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
          name: "wktoken",
          description: "Manage your WK Token",
          options: [
            {
              name: "token",
              description: "The token that will be used to access WaniKani",
              type: 3,
              required: false,
            },
            {
              name: "option",
              description: "The option that will be used to manage your token",
              type: 3,
              required: false,
              choices: [
                {
                  name: "show",
                  value: "show",
                },
                {
                  name: "set",
                  value: "set",
                },
                {
                  name: "delete",
                  value: "delete",
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

await makeWkTokenCommand();
