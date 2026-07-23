// Harness stub for "firebase/database". Screens that call get/onValue directly
// (PathScreen, Onboarding) get an inert, immediately-empty snapshot so they
// render their "no data" state instead of hanging on a real connection.
const emptySnap = {
  exists: () => false,
  val: () => null,
  child: () => emptySnap,
  forEach: () => false,
  key: null,
  numChildren: () => 0,
};

export const ref = (..._args: unknown[]) => ({ __ref: true });
export const get = async (..._args: unknown[]) => emptySnap;
export const onValue = (
  _ref: unknown,
  cb: (snap: typeof emptySnap) => void,
) => {
  // Fire once with an empty snapshot, then hand back an unsubscribe fn.
  cb(emptySnap);
  return () => {};
};
export const set = async (..._args: unknown[]) => {};
export const update = async (..._args: unknown[]) => {};
export const remove = async (..._args: unknown[]) => {};
export const push = (..._args: unknown[]) => ({ __ref: true, key: "stub" });
export const child = (..._args: unknown[]) => ({ __ref: true });
export const serverTimestamp = () => 0;
export const getDatabase = (..._args: unknown[]) => ({ __stub: true });
export const connectDatabaseEmulator = (..._args: unknown[]) => {};
export const onDisconnect = (..._args: unknown[]) => ({
  set: async () => {},
  remove: async () => {},
  cancel: async () => {},
});
