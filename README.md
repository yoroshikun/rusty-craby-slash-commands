## Rusty Craby Slash Commands

Discord slash commands written in deno for the rustycraby discord bot. Hosted serverlessly on deno deploy.

### Commands

- `xe`: Currency exchange
- `xe <amount> <~from> <~to>`, For example `xe 1 AUD JPY` is equivalent to `xe 1` with defaults
- `jisho`: Search jisho.org
- `jisho <word>`: Search jisho.org for a word
- `time`: Convert time to your local timezone
- `time <timezone>`: Convert time to a timezone

### Edit Commands

You can edit commands by running the make scripts in the scripts directory with deno.

```bash
deno run --allow-net --allow-env scripts/makeJishoCommand.ts
deno run --allow-net --allow-env scripts/makeTimeCommand.ts
deno run --allow-net --allow-env scripts/makeXeCommand.ts
```

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

Base Time command

```bash
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"time","description":"Return a local timestamp of the time given","options":[{"name":"year","description":"The year of the starting timestamp","type":3,"required":false},
{"name":"month","description":"The month of the starting timestamp","type":3,"required":false},{"name":"day","description":"The day of the starting timestamp","type":3,"required":false},{"name":"hour","description":"The hour of the starting timestamp","type":3,"required":false},{"name":"minute","description":"The minute of the starting timestamp","type":3,"required":false},{"name":"offset_positive","description":"The Positive UTC offset of the starting timestamp","type":3,"required":false,"choices":[{"name":"+00:00","value":"+00:00"},{"name":"+00:30","value":"+00:30"},{"name":"+01:00","value":"+01:00"},{"name":"+01:30","value":"+01:30"},{"name":"+02:00","value":"+02:00"},{"name":"+02:30","value":"+02:30"},{"name":"+03:00","value":"+03:00"},{"name":"+03:30","value":"+03:30"},{"name":"+04:00","value":"+04:00"},{"name":"+04:30","value":"+04:30"},{"name":"+05:00","value":"+05:00"},{"name":"+05:30","value":"+05:30"},{"name":"+06:00","value":"+06:00"},{"name":"+06:30","value":"+06:30"},{"name":"+07:00","value":"+07:00"},{"name":"+07:30","value":"+07:30"},{"name":"+08:00","value":"+08:00"},{"name":"+08:30","value":"+08:30"},{"name":"+09:00","value":"+09:00"},{"name":"+09:30","value":"+09:30"},{"name":"+10:00","value":"+10:00"},{"name":"+10:30","value":"+10:30"},{"name":"+11:00","value":"+11:00"},{"name":"+11:30","value":"+11:30"},{"name":"+12:00","value":"+12:00"}]},{"name":"offset_negative","description":"The Negative UTC offset of the starting timestamp","type":3,"required":false,"choices":[{"name":"-00:00","value":"-00:00"},{"name":"-00:30","value":"-00:30"},{"name":"-01:00","value":"-01:00"},{"name":"-01:30","value":"-01:30"},{"name":"-02:00","value":"-02:00"},{"name":"-02:30","value":"-02:30"},{"name":"-03:00","value":"-03:00"},{"name":"-03:30","value":"-03:30"},{"name":"-04:00","value":"-04:00"},{"name":"-04:30","value":"-04:30"},{"name":"-05:00","value":"-05:00"},{"name":"-05:30","value":"-05:30"},{"name":"-06:00","value":"-06:00"},{"name":"-06:30","value":"-06:30"},{"name":"-07:00","value":"-07:00"},{"name":"-07:30","value":"-07:30"},{"name":"-08:00","value":"-08:00"},{"name":"-08:30","value":"-08:30"},{"name":"-09:00","value":"-09:00"},{"name":"-09:30","value":"-09:30"},{"name":"-10:00","value":"-10:00"},{"name":"-10:30","value":"-10:30"},{"name":"-11:00","value":"-11:00"},{"name":"-11:30","value":"-11:30"},{"name":"-12:00","value":"-12:00"}]}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/commands"
```
