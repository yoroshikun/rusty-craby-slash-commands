export interface JishoData {
  meta: Meta;
  data: Datum[];
}

export interface Datum {
  slug: string;
  is_common: boolean;
  tags: string[];
  jlpt: string[];
  japanese: Japanese[];
  senses: Sense[];
  attribution: Attribution;
}

export interface Attribution {
  jmdict: boolean;
  jmnedict: boolean;
  dbpedia: boolean | string;
}

export interface Japanese {
  word?: string;
  reading: string;
}

export interface Sense {
  english_definitions: string[];
  parts_of_speech: string[];
  links: Link[];
  tags: string[];
  restrictions: string[];
  see_also: string[];
  // deno-lint-ignore no-explicit-any
  antonyms: any[];
  source: Source[];
  info: string[];
  // deno-lint-ignore no-explicit-any
  sentences?: any[];
}

export interface Link {
  text: string;
  url: string;
}

export interface Source {
  language: string;
  word: string;
}

export interface Meta {
  status: number;
}

export interface JishoOptions {
  [key: string]: string | undefined;
  word: string;
}

const getJisho = async (word: string): Promise<JishoData> => {
  const url = `https://jisho.org/api/v1/search/words?keyword=${word}`;
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const handle = async (options: JishoOptions) => {
  let word = "";

  if (!options.word) {
    // Falsy value (0, false, null, undefined)
    return {
      type: 4,
      data: {
        content: "You must specify a word to search.",
      },
    };
  } // This should never be called due to how slash commands work

  // Ugly simple overwrite
  if (options.word !== undefined) {
    word = options.word;
  }

  // Get jisho response
  const jisho = await getJisho(word);

  if (jisho.data.length > 0) {
    // Construct the embed description
    return `**English**: ${
      jisho.data[0].senses[0].english_definitions[0]
    }\n**Japanese**: ${
      jisho.data[0].japanese[0].word || "No Kana"
    }\n**Reading**: ${
      jisho.data[0].japanese[0].reading || "No Reading"
    }\n----------\n[📗](https://jisho.org/word/${
      jisho.data[0].slug
    }) | [🔍}](https://jisho.org/searc/${word})`;
  } else {
    throw new Error("No data found for word");
  }
};

export { handle };
