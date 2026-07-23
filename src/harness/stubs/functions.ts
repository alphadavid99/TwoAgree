// Harness stub for ../lib/functions. Each callable resolves with canned data so
// button actions (invite, join, path generation) don't reach a real backend.
export const exportMyData = async () => ({ data: {} });
export const deleteMyAccount = async () => ({ data: { ok: true } });
export const joinByCode = async (d: { code: string }) => ({
  data: { code: d?.code ?? "DEMO42" },
});
export const createInvite = async () => ({ data: { token: "demo-invite-token" } });
export const redeemInvite = async () => ({ data: { code: "DEMO42" } });
export const generatePath = async () => ({ data: { ok: true } });
