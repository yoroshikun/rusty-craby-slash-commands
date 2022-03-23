import { connect } from "https://deno.land/x/redis@v0.25.4/mod.ts";

const REDIS_HOST = Deno.env.get("REDIS_HOST") || "localhost";
const REDIS_PASSWORD = Deno.env.get("REDIS_PASSWORD") || "";

const connectRedis = async () =>
  await connect({
    hostname: REDIS_HOST,
    password: REDIS_PASSWORD,
    port: 11788,
  });

export default connectRedis;
