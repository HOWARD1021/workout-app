"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

interface SubscriptionState {
  isPro: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useSubscription(): SubscriptionState {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: customerState } = await authClient.customer.state();

      if ((customerState?.activeSubscriptions?.length ?? 0) > 0) {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
    } catch (err) {
      // User might not have a Polar customer yet (e.g. signed up before Polar integration)
      setIsPro(false);
      setError(err instanceof Error ? err.message : "Failed to fetch subscription state");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return { isPro, isLoading, error, refresh: fetchState };
}
