/**
 * CURTAIN (R31) — a tiny broadcast that a full-screen transition cover
 * is UP. Producers (PageTransition's column wave, ProjectTransition's
 * volt wipe) cover/uncover; consumers poll per frame with zero GC.
 *
 * Why: on a tab swap the new view mounts UNDER the cover at t=0.8s —
 * the exact moment the falling-letters animation peaks. Everything
 * expensive that runs while the screen is hidden (the particle canvas
 * painting thousands of sprites nobody can see) competes with the
 * transition for the main thread and the compositor. Consumers use
 * isCovered() to keep SIMULATING (entrances stay on schedule) but
 * stop PAINTING until the curtain lifts.
 *
 * Depth-counted so overlapping/rapid transitions stay balanced; a
 * producer that kills its timeline mid-flight must uncover() for it
 * (see the rebalance in PageTransition/ProjectTransition).
 *
 * R32 — whenUncovered(): a promise resolved the moment the last cover
 * lifts (immediately if the screen is already clear). Views that mount
 * under a cover hold their hero entrance on it, so the works/career →
 * about choreography replays starting at the reveal — the same beat as
 * the first load. (A rapid re-click rebalances uncover→cover in one
 * synchronous block; waiters flushed by that transient play on a mount
 * that is about to be replaced anyway — harmless by construction.)
 */
let depth = 0;
type Waiter = () => void;
let waiters: Waiter[] = [];

export const curtain = {
  cover() {
    depth++;
  },
  uncover() {
    depth = Math.max(0, depth - 1);
    if (depth === 0 && waiters.length) {
      const ws = waiters;
      waiters = [];
      for (const w of ws) w();
    }
  },
  isCovered: () => depth > 0,
  whenUncovered(): Promise<void> {
    if (depth === 0) return Promise.resolve();
    return new Promise((res) => waiters.push(res));
  },
};
