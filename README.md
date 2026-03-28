# accutime

Accurate time for the browser (but also works everywhere else). Uses WS for ultra precise time syncing but can fallback to plain HTTPS if needed.

## Usage

## ESM

```js
import AccuTime from "accutime";

const accutime = new AccuTime();

await accutime.sync(); // Run every time you want to sync
console.log(accutime.getTime()); // returns unix ms timestamp eg. 1774728087314
```

## Browser

```html
<script src="dist/index.global.js"></script>
<script type="text/javascript">
    const accutime = new AccuTime.default();

    document.addEventListener("DOMContentLoaded", function () {
        accutime.sync().then(() => {
          console.log("Synchronized time:", accutime.getTime());
        });
    });
</script>
```

## CommonJS

If you are on CommonJS you are most likely on Node - I would recommend using a client that supports the actual NTP protocol instead, like [`ntp-time`](https://www.npmjs.com/package/ntp-time).

```js
// To use WebSockets in NodeJS, you have to install `ws` first.
// Run this command: `npm install ws`
// And uncomment the following lines of code:
// const WebSocket = require('ws');
// global.WebSocket = WebSocket;
// global.window = global;

const AccuTime = require("accutime").default || require("accutime");
const accutime = new AccuTime();

(async () => {
  await accutime.sync(); // Run every time you want to sync
  console.log(accutime.getTime()); // returns unix ms timestamp eg. 1774728087314
})();
```

## Testing

From testing, the WS implementation consistently gets within +/- 2ms off normal NTP which is pretty reasonable given normal drift. Example below:

### Reference

```bash
sudo sntp time.cloudflare.com
+0.000962 +/- 0.016815 time.cloudflare.com
```
### Accutime on Bun

```
Run  1/10: Syncing... Offset: +1ms
Run  2/10: Syncing... Offset: +1ms
Run  3/10: Syncing... Offset: +1ms
Run  4/10: Syncing... Offset: +1ms
Run  5/10: Syncing... Offset: +1ms
Run  6/10: Syncing... Offset: +1ms
Run  7/10: Syncing... Offset: +1ms
Run  8/10: Syncing... Offset: +1ms
Run  9/10: Syncing... Offset: +1ms
Run 10/10: Syncing... Offset: +1ms

Min Offset : 1ms
Max Offset : 1ms
Average    : 1.00ms
Spread     : 0ms
```

### Accutime on Chromium

```
Run  1/10: Syncing... Offset: +1ms
Run  2/10: Syncing... Offset: +1ms
Run  3/10: Syncing... Offset: +1ms
Run  4/10: Syncing... Offset: +1ms
Run  5/10: Syncing... Offset: +1ms
Run  6/10: Syncing... Offset: +1ms
Run  7/10: Syncing... Offset: +1ms
Run  8/10: Syncing... Offset: +1ms
Run  9/10: Syncing... Offset: +1ms
Run 10/10: Syncing... Offset: +1ms

Min Offset : 1ms
Max Offset : 1ms
Average    : 1.00ms
Spread     : 0ms
```
