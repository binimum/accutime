// const accutime = require('../dist/accutime.js');

import AccuTime from "../dist/index.mjs";

const accutime = new AccuTime();

await accutime.sync();
console.log(accutime.getTime());
