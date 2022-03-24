export interface DiscordInteractionData {
  type: number;
  token: string;
  member: {
    user: {
      id: string;
      username: string;
      avatar: string;
      discriminator: string;
      public_flags: number;
    };
    roles: string[];
    premium_since: string | null;
    permissions: string;
    pending: boolean;
    nick: string | null;
    mute: boolean;
    joined_at: string;
    is_pending: boolean;
    deaf: boolean;
  };
  id: string;
  guild_id: string;
  data: {
    options: { name: string; value: string }[];
    name: string;
    id: string;
  };
  channel_id: string;
}

export interface DiscordEmbed {
  type: string;
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline: boolean }[];
  timestamp?: string;
  footer?: { text: string; icon_url: string; proxy_icon_url: string };
  image?: { url: string; proxy_url: string; height: number; width: number };
  thumbnail?: { url: string; proxy_url: string; height: number; width: number };
  author?: {
    name: string;
    url: string;
    icon_url: string;
    proxy_icon_url: string;
  };
  url?: string;
}

export interface DiscordComponent {
  type: number;
  components: DiscordComponent[];
  style: number;
  label?: string;
  url?: string;
  disabled?: boolean;
  custom_id?: string;
  placeholder?: string;
  options?: {
    label: string;
    value: string;
    description: string;
    default: boolean;
  }[];
  min_values?: number;
  max_values?: number;
}

export interface DiscordMessage {
  type: number;
  data: {
    content?: string;
    tts?: boolean;
    embeds?: DiscordEmbed[];
    components?: DiscordComponent[];
  };
}
