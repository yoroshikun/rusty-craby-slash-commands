const API_KEY = Deno.env.get("CURR_CONV_TOKEN");

const getExchangeRate = async (from: string, to: string) => {
  const conversionKey = `${from}_${to}`;
  const url = `https://free.currconv.com/api/v7/convert?q=${conversionKey}&compact=ultra&apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[conversionKey];
};

const handle = async (options: [{ name: string; value: string }]) => {
  let amount = 1;
  let from = "AUD";
  let to = "JPY";

  // Map the options to a key value pair
  const mappedOptions = options.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {} as { [key: string]: string; amount: string; to: string; from: string });

  if (!mappedOptions.amount) {
    // Falsy value (0, false, null, undefined)
    return {
      type: 4,
      data: {
        content: "You must specify an amount to convert.",
      },
    };
  } // This should never be called due to how slash commands work

  // Ugly simple overwrite
  if (mappedOptions.amount !== undefined) {
    if (!isNaN(amount)) {
      amount = Number(mappedOptions.amount);
    }
  }

  if (mappedOptions.to !== undefined) {
    to = mappedOptions.to;
  }

  if (mappedOptions.from !== undefined) {
    from = mappedOptions.from;
  }

  // Get the exchange rate
  const exchangeRate = await getExchangeRate(from, to);

  // Calculate the converted amount
  const convertedAmount = (amount * exchangeRate).toFixed(4);

  return `${amount} ${from} --> ${convertedAmount} ${to}`;
};

export { handle };
