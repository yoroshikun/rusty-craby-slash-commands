## Rusty Craby Slash Commands

Discord slash commands written in deno for the rustycraby discord bot. Hosted serverlessly on deno deploy, extending redis for persistance of data.

### Commands

- `xe`: Currency exchange
- `xe <~set_defaults> <~amount> <~from> <~to>`, For example `xe 1 AUD JPY` is equivalent to `xe 1` with defaults
- `jisho`: Search jisho.org
- `jisho <word>`: Search jisho.org for a word
- `time`: Convert time to your local timezone
- `time <~year> <~month> <~day> <~hour> <~minute> <~offset_negative> <~offset_positive>`: Convert time to a timezone
- `wk <type>`: Interact with User WaniKani data
- `wktoken <~token> <~option>`: Manage your WaniKani token

### Edit Commands

You can edit commands by running the make scripts in the scripts directory with deno.
Facilitated with the deno tasks api.

```bash
deno task make-[command]
# example:
deno task make-xe
```
