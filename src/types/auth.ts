export type { User, UserRole } from "@/lib/types";
// Keep TokenResponse
export interface TokenResponse {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
}
