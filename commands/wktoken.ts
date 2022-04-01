import { Redis } from "https://deno.land/x/redis@v0.25.4/mod.ts";

export interface WKTokenOptions {
  [key: string]: string | undefined;
  token?: string;
  option?: "show" | "set" | "delete";
}

// Verifies the token by fetching the user's data from the API
const verifyToken = async (token?: string) => {
  if (!token) {
    return {
      error: "No token provided",
    };
  }

  try {
    const response = await fetch("https://api.wanikani.com/v2/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Wanikani-Revision": "20170710",
      },
    });

    if (response.status !== 200) {
      throw new Error("Invalid token");
    }

    return true;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

const saveWKToken = async (token: string, userId: string, redis: Redis) => {
  const wkTokenKey = `${userId}:wk_token`;
  await redis.set(wkTokenKey, token);
};

const deleteWKToken = async (userId: string, redis: Redis) => {
  const wkTokenKey = `${userId}:wk_token`;
  await redis.del(wkTokenKey);
};

const getWKToken = async (userId: string, redis: Redis) => {
  const wkTokenKey = `${userId}:wk_token`;
  const token = await redis.get(wkTokenKey);
  if (!token) {
    return "No token found, you should add one!";
  }
  return token;
};

const handle = async (
  options: WKTokenOptions,
  userId: string,
  redis: Redis
) => {
  switch (options?.option || (options?.token ? "set" : "show")) {
    case "show":
      return getWKToken(userId, redis);
    case "set": {
      const isValid = await verifyToken(options?.token);
      if (isValid && options?.token) {
        await saveWKToken(options?.token, userId, redis);
      }
      return "Token Set!";
    }
    case "delete":
      await deleteWKToken(userId, redis);
      return "Token Deleted!";
  }
};

export { handle };
