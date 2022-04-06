import { Redis } from "https://deno.land/x/redis@v0.25.4/mod.ts";

const API_KEY = Deno.env.get("CURR_CONV_TOKEN");

export interface XEOptions {
  [key: string]: string | boolean | undefined;
  set_defaults?: boolean;
  amount?: string;
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
  try {
    const conversionKey = `${from}_${to}`;
    const url = `https://free.currconv.com/api/v7/convert?q=${conversionKey}&compact=ultra&apiKey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return data[conversionKey];
  } catch (error) {
    console.error(error);
    throw new Error(
      "Looks like the exchange rate API is down. Try again later."
    );
  }
};

const setDefaults = async (
  options: XEOptions,
  userId: string,
  redis: Redis
): Promise<string> => {
  const { from, to } = options;
  await setUserDefaultCurrencyCodes(userId, { from, to }, redis);

  // So help me
  let response = "";
  from && (response += `Default from currency set to ${from}.\n`);
  to && (response += `Default to currency set to ${to}.\n`);

  return response || "No options specified.";
};

const getXE = async (
  options: XEOptions,
  userId: string,
  redis: Redis
): Promise<string> => {
  let amount = 1;
  let { from, to } = await getUserDefaultCurrencyCodes(userId, redis);

  // Ugly simple overwrite
  if (options?.amount !== undefined) {
    if (!isNaN(Number(options.amount))) {
      amount = Number(options.amount);
    }
  }

  if (options?.to !== undefined) {
    to = options.to;
  }

  if (options?.from !== undefined) {
    from = options.from;
  }

  const exchangeRate = await getExchangeRate(from, to);

  const convertedAmount = (amount * exchangeRate).toFixed(4);

  return `${amount} ${from} --> ${convertedAmount} ${to}`;
};

const handle = async (options: XEOptions, userId: string, redis: Redis) => {
  if (options?.set_defaults) {
    return await setDefaults(options, userId, redis);
  }

  return await getXE(options, userId, redis);
};

export { handle };
