import { Redis } from "https://deno.land/x/redis@v0.25.4/mod.ts";

interface CacheData {
  last_update: number;
  level_progressions: LevelProgressions;
  summary: Summary;
  user: User;
}

export interface LevelProgressions {
  id: number;
  object: string;
  url: string;
  data_updated_at: string;
  data: LevelProgressionsData[];
}

export interface LevelProgressionsData {
  created_at: string;
  level: number;
  unlocked_at: string;
  started_at: string;
  passed_at: null;
  completed_at: null;
  abandoned_at: null;
}

export interface Summary {
  object: string;
  url: string;
  data_updated_at: string;
  data: SummaryData;
}

export interface SummaryData {
  lessons: SummaryItems;
  next_reviews_at: string;
  reviews: SummaryItems;
}

export interface SummaryItems {
  available_at: number;
  subject_ids: number[];
}

export interface User {
  object: string;
  url: string;
  data_updated_at: string;
  data: UserData;
}

export interface UserData {
  id: string;
  username: string;
  level: number;
  profile_url: string;
  started_at: string;
  current_vacation_started_at: null;
  subscription: UserSubscription;
  preferences: UserPreferences;
}

export interface UserPreferences {
  default_voice_actor_id: number;
  lessons_autoplay_audio: boolean;
  lessons_batch_size: number;
  lessons_presentation_order: string;
  reviews_autoplay_audio: boolean;
  reviews_display_srs_indicator: boolean;
}

export interface UserSubscription {
  active: boolean;
  type: string;
  max_level_granted: number;
  period_ends_at: string;
}

export interface WKOptions {
  [key: string]: string | undefined;
  type: "level" | "summary" | "user" | "dev";
}

const baseURL = "https://api.wanikani.com/v2/";

const fetchApi = async (type: string, userToken: string) => {
  const url = `${baseURL}${type}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Wanikani-Revision": "20170710",
    },
  });

  return await response.json();
};

// Refetches the data from the API and updates the cache
const updateUserData = async (
  userId: string,
  redis: Redis
): Promise<CacheData> => {
  const userToken = await redis.get(`${userId}:user_token`);

  if (!userToken) {
    throw new Error("No user token found");
  }

  const userData = await fetchApi("user", userToken as string);
  const levelData = await fetchApi("level_progression", userToken as string);
  const summaryData = await fetchApi("summary", userToken as string);

  const cacheData: CacheData = {
    last_update: Date.now(),
    level_progressions: levelData,
    summary: summaryData,
    user: userData,
  };

  await redis.set(`${userId}:wk_data`, JSON.stringify(cacheData)); // TODO: encrypt
  return cacheData;
};

// Gets data from the cached API, if data is not cached or last updated is 1 hour ago,
// then fetch the data from the API and cache it.
const getUserData = async (userId: string, redis: Redis) => {
  const userKey = `${userId}:wk_data`;

  const userData = await redis.get(userKey);

  if (userData) {
    const cacheData: CacheData = JSON.parse(userData);
    const lastUpdate = cacheData.last_update;
    const now = new Date().getTime();

    if (now - lastUpdate < 3600000) {
      return cacheData;
    }
  }

  // Fetch data from the API
  const newData = await updateUserData(userId, redis);
  return newData;
};

const handle = async (options: WKOptions, userId: string, redis: Redis) => {
  const { type } = options;
  const data = await getUserData(userId, redis);

  // TODO: proper responses
  switch (type) {
    case "level": {
      return `You are currently level ${data.user.data.level}`;
    }
    case "summary": {
      return data.summary.data.reviews.subject_ids.join(", ");
    }
    case "user": {
      return data.user.data.username;
    }
    case "dev": {
      return JSON.stringify(data);
    }
  }
};

export { handle };
