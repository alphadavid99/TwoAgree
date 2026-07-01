/**
 * Cloud Functions for Aligned.
 *
 * Region is pinned to europe-west1 to match the RTDB and project region.
 * Phase 0: this file only carries a trivial healthcheck so the Functions
 * codebase builds and the emulator/deploy pipeline is proven. The real
 * callables (createInvite / redeemInvite / deleteMyAccount / exportMyData)
 * land in Phase 3.
 */
import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

setGlobalOptions({ region: "europe-west1" });

export const healthcheck = onRequest((_req, res) => {
  logger.info("healthcheck ping");
  res.json({ ok: true, service: "aligned-functions", region: "europe-west1" });
});
