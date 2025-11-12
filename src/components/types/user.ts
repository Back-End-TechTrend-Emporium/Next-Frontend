// src/types/user.ts
export type Role = "shopper" | "employee" | "admin";

export type UserLike = {
  id: string;
  name: string;
  email?: string;
  role?: Role;
  avatarUrl?: string;
};
