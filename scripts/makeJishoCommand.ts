// Call discord api to  add slash command for time
const makeJishoCommand = async () => {
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
          name: "jisho",
          description: "Search Jisho for a word",
          options: [
            {
              name: "word",
              description: "The word that will be searched in jisho",
              type: 3,
              required: true,
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

await makeJishoCommand();
