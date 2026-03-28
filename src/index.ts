export interface AccuTimeOptions {
  pingCount?: number;
}

interface SyncResult {
  rtt: number;
  offset: number;
}

export class AccuTime {
  public readonly domain: string;
  public readonly fallbackUrl: string;
  public offset: number;
  public readonly PING_COUNT: number;
  private syncPromise: Promise<number> | null = null;

  constructor(options: AccuTimeOptions = {}) {
    this.domain = 'time-api.binimum.org';
    this.fallbackUrl = 'https://use.ntpjs.org/v1/time.json';
    this.offset = 0;
    this.PING_COUNT = options.pingCount || 10;
  }

  /**
   * Initiates the synchronization process.
   * @returns A promise that resolves to the calculated offset in milliseconds.
   */
  public async sync(): Promise<number> {
    // Prevent concurrent syncs if one is already running on this instance
    if (this.syncPromise) return this.syncPromise;

    this.syncPromise = (async () => {
      try {
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
          this.offset = await this.syncWebSocket();
        } else {
          throw new Error("WebSocket not supported.");
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`accutime: WS failed (${msg}). Falling back to HTTP...`);
        this.offset = await this.syncHttp();
      }
      return this.offset;
    })();

    return this.syncPromise;
  }

  private syncWebSocket(): Promise<number> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`wss://${this.domain}`);
      let pingsDone = 0;
      const results: SyncResult[] = [];
      let currentT0: number;

      ws.onopen = () => ping();

      const ping = () => {
        if (pingsDone >= this.PING_COUNT) {
          ws.close();
          resolve(this.calculateFinalOffset(results));
          return;
        }
        currentT0 = Date.now();
        ws.send("ping");
      };

      ws.onmessage = (event: MessageEvent) => {
        const t3 = Date.now();
        const t1 = parseInt(event.data, 10);
        results.push(this.calculateMetrics(currentT0, t1, t3));
        pingsDone++;
        setTimeout(ping, 50);
      };

      ws.onerror = () => reject(new Error("WebSocket connection failed"));
    });
  }

  private async syncHttp(): Promise<number> {
    const results: SyncResult[] = [];

    for (let i = 0; i < this.PING_COUNT; i++) {
      const t0 = Date.now();
      try {
        const response = await fetch(this.fallbackUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json() as { now: number };
        const t3 = Date.now();
        const t1 = Math.round(data.now * 1000);

        results.push(this.calculateMetrics(t0, t1, t3));
      } catch (error) {
        // Silently ignore individual dropped pings
      }

      await new Promise(res => setTimeout(res, 100));
    }

    if (results.length === 0) {
      console.warn("accutime: Both WS and HTTP sync failed entirely. Defaulting to local time.");
      return 0;
    }
    return this.calculateFinalOffset(results);
  }

  private calculateMetrics(t0: number, t1: number, t3: number): SyncResult {
    const rtt = t3 - t0;
    const latency = rtt / 2;
    const estimatedServerTime = t1 + latency;
    const offset = estimatedServerTime - t3;
    return { rtt, offset };
  }

  private calculateFinalOffset(results: SyncResult[]): number {
    results.sort((a, b) => a.rtt - b.rtt);
    const bestResults = results.slice(0, Math.ceil(results.length / 2));
    const totalOffset = bestResults.reduce((sum, res) => sum + res.offset, 0);
    return Math.round(totalOffset / bestResults.length);
  }

  /**
   * Returns the current highly-accurate synchronized timestamp in milliseconds.
   */
  public getTime(): number {
    return Date.now() + this.offset;
  }
}

// Default export for cleaner imports
export default AccuTime;