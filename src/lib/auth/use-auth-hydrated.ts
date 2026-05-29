"use client";

import { useSyncExternalStore } from "react";

import { useAuthStore } from "@/lib/stores/auth-store";

function subscribeToAuthHydration(onStoreChange: () => void) {
  return useAuthStore.persist.onFinishHydration(onStoreChange);
}

function getAuthHydrationSnapshot() {
  return useAuthStore.persist.hasHydrated();
}

function getServerAuthHydrationSnapshot() {
  return false;
}

export function useAuthHydrated() {
  return useSyncExternalStore(
    subscribeToAuthHydration,
    getAuthHydrationSnapshot,
    getServerAuthHydrationSnapshot,
  );
}
