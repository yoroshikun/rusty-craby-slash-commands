const API_KEY = Deno.env.get("CURR_CONV_TOKEN");

export interface XEOptions {
  [key: string]: string | undefined;
  amount: string;
  from?: string;
  to?: string;
}

const getExchangeRate = async (from: string, to: string) => {
  const conversionKey = `${from}_${to}`;
  const url = `https://free.currconv.com/api/v7/convert?q=${conversionKey}&compact=ultra&apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[conversionKey];
};

const handle = async (options: XEOptions) => {
  let amount = 1;
  let from = "AUD";
  let to = "JPY";

  if (!options.amount) {
    // Falsy value (0, false, null, undefined)
    return {
      type: 4,
      data: {
        content: "You must specify an amount to convert.",
      },
    };
  } // This should never be called due to how slash commands work

  // Ugly simple overwrite
  if (options.amount !== undefined) {
    if (!isNaN(amount)) {
      amount = Number(options.amount);
    }
  }

  if (options.to !== undefined) {
    to = options.to;
  }

  if (options.from !== undefined) {
    from = options.from;
  }

  // Get the exchange rate
  const exchangeRate = await getExchangeRate(from, to);

  // Calculate the converted amount
  const convertedAmount = (amount * exchangeRate).toFixed(4);

  return `${amount} ${from} --> ${convertedAmount} ${to}`;
};

export { handle };
