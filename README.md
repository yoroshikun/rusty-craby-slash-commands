## Rusty Craby Slash Commands

Discord slash commands written in deno for the rustycraby discord bot. Hosted serverlessly on deno deploy.

### Commands

- `xe`: Currency exchange
- `xe <amount> <~from> <~to>`, For example `xe 1 AUD JPY` is equivalent to `xe 1` with defaults
- `jisho`: Search jisho.org
- `jisho <word>`: Search jisho.org for a word

### Useful curl

Base xe command

```bash
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"xe","description":"Convert from one currency to the next","options":[{"name":"amount","description":"The amount of currency to convert","type":3,"required":true},{"name":"from","description":"The currency to convert from (Default AUD)","type":3,"required":false,"choices":[{"name":"USD","value":"USD"},{"name":"EUR","value":"EUR"},{"name":"JPY","value":"JPY"},{"name":"BGN","value":"BGN"},{"name":"BTC","value":"BTC"},{"name":"CZK","value":"CZK"},{"name":"DKK","value":"DKK"},{"name":"GBP","value":"GBP"},{"name":"SEK","value":"SEK"},{"name":"CHF","value":"CHF"},{"name":"AUD","value":"AUD"},{"name":"BRL","value":"BRL"},{"name":"CAD","value":"CAD"},{"name":"CNY","value":"CNY"},{"name":"HKD","value":"HKD"},{"name":"INR","value":"INR"},{"name":"KRW","value":"KRW"},{"name":"MXN","value":"MXN"},{"name":"MYR","value":"MYR"},{"name":"NZD","value":"NZD"},{"name":"PHP","value":"PHP"},{"name":"SGD","value":"SGD"}]},{"name":"to","description":"The currency to convert to (Default JPY)","type":3,"required":false,"choices":[{"name":"USD","value":"USD"},{"name":"EUR","value":"EUR"},{"name":"JPY","value":"JPY"},{"name":"BGN","value":"BGN"},{"name":"BTC","value":"BTC"},{"name":"CZK","value":"CZK"},{"name":"DKK","value":"DKK"},{"name":"GBP","value":"GBP"},{"name":"SEK","value":"SEK"},{"name":"CHF","value":"CHF"},{"name":"AUD","value":"AUD"},{"name":"BRL","value":"BRL"},{"name":"CAD","value":"CAD"},{"name":"CNY","value":"CNY"},{"name":"HKD","value":"HKD"},{"name":"INR","value":"INR"},{"name":"KRW","value":"KRW"},{"name":"MXN","value":"MXN"},{"name":"MYR","value":"MYR"},{"name":"NZD","value":"NZD"},{"name":"PHP","value":"PHP"},{"name":"SGD","value":"SGD"}]}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```

Base Jisho command

```bash
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"jisho","description":"Search Jisho for a word","options":[{"name":"word","description":"The word that will be searched","type":3,"required":true}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```
