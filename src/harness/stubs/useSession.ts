// Harness stub for ../hooks/useSession.
import { MOCK_SESSION } from "../mocks";

export function useSession(_code: string | null, _uid: string | undefined) {
  return {
    session: MOCK_SESSION,
    role: "host" as const,
    loading: false,
    denied: false,
  };
}
