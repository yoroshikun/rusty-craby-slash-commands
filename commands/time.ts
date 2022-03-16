import { datetime } from "https://deno.land/x/ptera/mod.ts";

export interface TimeOptions {
  [key: string]: string | undefined;
  year?: string;
  month?: string;
  day?: string;
  hour?: string;
  minute?: string;
  offset_positive?: string;
  offset_negative?: string;
}

const handle = (options: TimeOptions) => {
  const today = datetime();

  if (options.offsetNegative && options.offsetPositive) {
    throw new Error("You can't use both positive and negative offsets.");
  }

  // Merge options with defaults
  options.year = options.year || today.format("YYYY");
  options.month = options.month || today.format("MM");
  options.day = options.day || today.format("dd");
  options.hour = options.hour || today.format("HH");
  options.minute = options.minute || today.format("mm");
  options.offset =
    options.offset_positive || options.offset_negative || "+00:00";

  const dt = datetime(
    `${options.year}-${options.month}-${options.day}T${options.hour}:${options.minute}:00.000${options.offset}`
  ).toUTC();

  return `The time in your timezone should be: <t:${dt.format("X")}>`;
};

export { handle };
