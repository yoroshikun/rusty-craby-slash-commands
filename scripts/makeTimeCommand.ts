// Call discord api to  add slash command for time
const makeTimeCommand = async () => {
  const TIMES = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
  ];
  const positive = TIMES.map((time) => ({
    name: `+${time}`,
    value: `+${time}`,
  }));
  const negative = TIMES.map((time) => ({
    name: `-${time}`,
    value: `-${time}`,
  }));
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
          name: "time",
          description: "Return a local timestamp of the time given",
          options: [
            {
              name: "year",
              description: "The year of the starting timestamp",
              type: 3,
              required: false,
            },
            {
              name: "month",
              description: "The month of the starting timestamp",
              type: 3,
              required: false,
            },
            {
              name: "day",
              description: "The day of the starting timestamp",
              type: 3,
              required: false,
            },
            {
              name: "hour",
              description: "The hour of the starting timestamp",
              type: 3,
              required: false,
            },
            {
              name: "minute",
              description: "The minute of the starting timestamp",
              type: 3,
              required: false,
            },
            {
              name: "offset_positive",
              description: "The Positive UTC offset of the starting timestamp",
              type: 3,
              required: false,
              choices: positive,
            },
            {
              name: "offset_negative",
              description: "The Negative UTC offset of the starting timestamp",
              type: 3,
              required: false,
              choices: negative,
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

await makeTimeCommand();
