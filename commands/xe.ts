import { Redis } from "https://deno.land/x/redis@v0.25.4/mod.ts";

const API_KEY = Deno.env.get("CURR_CONV_TOKEN");

enum CURRENCY_CODE { // Todo: use this enum
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
}

export interface XEOptions {
  [key: string]: string | undefined;
  amount: string;
  from?: string;
  to?: string;
}

export interface XEDefaultOptions {
  [key: string]: string | undefined;
  from?: string;
  to?: string;
}

const getUserDefaultCurrencyCodes = async (
  userId: string,
  redis: Redis
): Promise<{ from: string; to: string }> => {
  const fromKey = `${userId}:currency_from`;
  const toKey = `${userId}:currency_to`;
  const fromCurrencyCode = await redis.get(fromKey);
  const toCurrencyCode = await redis.get(toKey);

  return {
    from: fromCurrencyCode || "AUD",
    to: toCurrencyCode || "JPY",
  };
};

const setUserDefaultCurrencyCodes = async (
  userId: string,
  { from, to }: { from?: string; to?: string },
  redis: Redis
) => {
  const fromKey = `${userId}:currency_from`;
  const toKey = `${userId}:currency_to`;

  from && (await redis.set(fromKey, from));
  to && (await redis.set(toKey, to));
};

const getExchangeRate = async (from: string, to: string) => {
  const conversionKey = `${from}_${to}`;
  const url = `https://free.currconv.com/api/v7/convert?q=${conversionKey}&compact=ultra&apiKey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[conversionKey];
};

const handleDefault = async (
  options: XEDefaultOptions,
  userId: string,
  redis: Redis
) => {
  const { from, to } = options;
  await setUserDefaultCurrencyCodes(userId, { from, to }, redis);

  // So help me
  let response = "";
  from && (response += `Default from currency set to ${from}.\n`);
  to && (response += `Default to currency set to ${to}.\n`);

  return response || "No options specified.";
};

const handle = async (options: XEOptions, userId: string, redis: Redis) => {
  let amount = 1;
  let { from, to } = await getUserDefaultCurrencyCodes(userId, redis);

  if (!options?.amount) {
    // Falsy value (0, false, null, undefined)
    return {
      type: 4,
      data: {
        content: "You must specify an amount to convert.",
      },
    };
  } // This should never be called due to how slash commands work

  // Ugly simple overwrite
  if (options?.amount !== undefined) {
    if (!isNaN(amount)) {
      amount = Number(options.amount);
    }
  }

  if (options?.to !== undefined) {
    to = options.to;
  }

  if (options?.from !== undefined) {
    from = options.from;
  }

  // Get the exchange rate
  const exchangeRate = await getExchangeRate(from, to);

  // Calculate the converted amount
  const convertedAmount = (amount * exchangeRate).toFixed(4);

  return `${amount} ${from} --> ${convertedAmount} ${to}`;
};

export { handle, handleDefault };
