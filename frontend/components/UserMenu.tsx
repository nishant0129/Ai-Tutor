"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
          Log in
        </Link>
        <Link href="/register" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.username}</div>
      <button
        onClick={logout}
        className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
      >
        Logout
      </button>
    </div>
  );
}
