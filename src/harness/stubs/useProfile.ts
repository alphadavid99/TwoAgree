// Harness stub for ../hooks/useProfile — returns a filled-in demo profile so
// ProfileScreen renders with a name, bio and avatar for the design review.
import { MOCK_PROFILE } from "../mocks";

export function useProfile(_uid: string | undefined) {
  return {
    profile: MOCK_PROFILE,
    loading: false,
    saveProfile: async (_data: unknown) => {},
  };
}
