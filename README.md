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
