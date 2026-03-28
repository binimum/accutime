# accutime

Accurate time for the browser.

## Use me

### Browser

```js
<script src="https://cdn.jsdelivr.net/npm/accutime@latest/dist/accutime.min.js"></script>
```

### CommonJS

```shell
npm i accutime
```

```js
const accutime = require('accutime');
```
### ESM

```shell
npm i accutime
```

```js
import accutime from 'accutime';
```

## Usage

## ESM

```js
import AccuTime from "../dist/index.mjs";

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

## Testing

From testing, the WS implementation consistently gets within +/- 2ms off normal NTP which is pretty reasonable. Example below:

Reference:

```bash
sudo sntp time.cloudflare.com
+0.000962 +/- 0.016815 time.cloudflare.com
```
Accutime:

```
AccuTime consistency test

Run  1/10: Syncing... Offset: -2ms
Run  2/10: Syncing... Offset: -1ms
Run  3/10: Syncing... Offset: -1ms
Run  4/10: Syncing... Offset: 0ms
Run  5/10: Syncing... Offset: -2ms
Run  6/10: Syncing... Offset: -2ms
Run  7/10: Syncing... Offset: -2ms
Run  8/10: Syncing... Offset: -2ms
Run  9/10: Syncing... Offset: -2ms
Run 10/10: Syncing... Offset: -1ms

Min Offset : -2ms
Max Offset : 0ms
Average    : -1.50ms
Spread     : 2ms
```
