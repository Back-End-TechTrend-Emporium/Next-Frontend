"use client";
import { useState } from "react";
import Link from "next/link";
import Icon from "../atoms/Icon";
import Avatar from "../atoms/Avatar";

export type Role = "shopper" | "employee" | "admin";
export type UserLike = { id: string; name: string; avatarUrl?: string; role?: Role };

export function UserDropdown({
  user,
  onLogout,
  onGoToPortal,
}: {
  user: UserLike;
  onLogout?: () => void;
  onGoToPortal?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isEmployee = user.role === "employee" || user.role === "admin";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm hover:bg-gray-100"
      >
        <Avatar src={user.avatarUrl} alt={user.name} />
        <span>{user.name}</span>
        <Icon name="chevron-down" />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-white shadow-lg z-50">
          {isEmployee && (
            <button onClick={onGoToPortal} className="block w-full text-left px-4 py-2 hover:bg-gray-50">
              Employee portal
            </button>
          )}
          <Link href="/favorites" className="block px-4 py-2 hover:bg-gray-50">Favorites</Link>
          <button onClick={onLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-50">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export function GuestDropdown({
  onSignIn,
  onSignUp,
}: {
  onSignIn?: () => void;
  onSignUp?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="user" width={24} height={24} />
      </button>

      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-white shadow-lg z-50">
          <button onClick={onSignIn} className="block w-full text-left px-4 py-2 hover:bg-gray-50">
            Sign in
          </button>
          <button onClick={onSignUp} className="block w-full text-left px-4 py-2 hover:bg-gray-50">
            Create account
          </button>
          <Link href="/forgot-password" className="block px-4 py-2 hover:bg-gray-50">
            Forgot password
          </Link>
        </div>
      )}
    </div>
  );
}
