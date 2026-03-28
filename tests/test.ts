// Run in Bun

import { AccuTime } from "../src/index";

// Trick our package into thinking it's in a browser so it uses
// Bun's native WebSocket implementation instead of falling back to HTTP.
globalThis.window = globalThis as any;

async function runTest() {
  console.log("AccuTime consistency test\n");

  const offsets: number[] = [];
  const TOTAL_RUNS = 10;

  for (let i = 1; i <= TOTAL_RUNS; i++) {
    const accutime = new AccuTime({ pingCount: 10 });

    process.stdout.write(
      `Run ${i.toString().padStart(2, " ")}/${TOTAL_RUNS}: Syncing... `,
    );

    try {
      await accutime.sync();
      const offset = accutime.offset;
      offsets.push(offset);
      console.log(`Offset: ${offset > 0 ? "+" : ""}${offset}ms`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log(`Failed: ${msg}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (offsets.length === 0) {
    console.log("All runs failed.");
    return;
  }

  const min = Math.min(...offsets);
  const max = Math.max(...offsets);
  const avg = offsets.reduce((sum, val) => sum + val, 0) / offsets.length;
  const spread = max - min;

  console.log("\n");
  console.log(`Min Offset : ${min}ms`);
  console.log(`Max Offset : ${max}ms`);
  console.log(`Average    : ${avg.toFixed(2)}ms`);
  console.log(`Spread     : ${spread}ms`);
}

runTest();
