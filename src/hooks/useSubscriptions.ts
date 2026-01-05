import { useState, useCallback } from 'react';
import { subscriptionService, Subscription } from '../services/subscription.service';
import { MetaPagination } from '@/services/api';

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<MetaPagination | null>(null);

  const fetchSubscriptions = useCallback(async (pageNum: number = 1, perPage: number = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subscriptionService.getAll(pageNum, perPage);
      setSubscriptions(response.data);
      setPage(pageNum);
      setPaginationMeta(response.meta);
    } catch (err: any) {
      console.error('Failed to fetch subscriptions:', err);
      setError(err.response?.data?.message || 'Falha ao carregar subscrições');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoreSubscriptions = useCallback(
    async (perPage: number = 20) => {
      if (!paginationMeta || !paginationMeta.hasNext || loadingMore) {
        return;
      }

      setLoadingMore(true);
      setError(null);
      try {
        const nextPage = page + 1;
        const response = await subscriptionService.getAll(nextPage, perPage);
        setSubscriptions((prev) => [...prev, ...response.data]);
        setPage(nextPage);
        setPaginationMeta(response.meta);
      } catch (err: any) {
        console.error('Failed to fetch more subscriptions:', err);
        setError(err.response?.data?.message || 'Falha ao carregar mais subscrições');
      } finally {
        setLoadingMore(false);
      }
    },
    [paginationMeta, page, loadingMore]
  );

  return {
    subscriptions,
    loading,
    loadingMore,
    error,
    page,
    paginationMeta,
    fetchSubscriptions,
    fetchMoreSubscriptions,
  };
}
