
import { useMemo } from 'react';
import type { EmailChannel } from '@/types/emailChannel';

export function useChannelSort(
  channels: EmailChannel[],
  searchQuery: string,
  sortBy: 'name' | 'date' | 'status',
  sortOrder: 'asc' | 'desc'
) {
  return useMemo(() => {
    const filtered = channels.filter(channel =>
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = Number(a.isActive) - Number(b.isActive);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [channels, searchQuery, sortBy, sortOrder]);
}
