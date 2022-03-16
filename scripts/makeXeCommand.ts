// Call discord api to  add slash command for time
const makeXeCommand = async () => {
  const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
  const CLIENT_ID = Deno.env.get("CLIENT_ID");
  const CURRENCY_CODES = [
    "USD",
    "EUR",
    "JPY",
    "BGN",
    "BTC",
    "CZK",
    "DKK",
    "GBP",
    "SEK",
    "CHF",
    "AUD",
    "BRL",
    "CAD",
    "CNY",
    "HKD",
    "INR",
    "KRW",
    "MXN",
    "MYR",
    "NZD",
    "PHP",
    "SGD",
  ];
  const currencies = CURRENCY_CODES.map((currency) => ({
    name: currency,
    value: currency,
  }));

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
          name: "xe",
          description: "Convert from one currency to another",
          options: [
            {
              name: "amount",
              description: "The amount of the currency (Number)",
              type: 3,
              required: true,
            },
            {
              name: "from",
              description: "The currency to convert from (Default AUD)",
              type: 3,
              required: false,
              choices: currencies,
            },
            {
              name: "to",
              description: "The currency to convert to (Default JPY)",
              type: 3,
              required: false,
              choices: currencies,
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

await makeXeCommand();
