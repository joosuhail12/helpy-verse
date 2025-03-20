
import { useMemo } from 'react';
import type { EmailChannel } from '@/types/emailChannel';

export function useChannelSort(
  channels: EmailChannel[],
  searchQuery: string,
  sortBy: 'name' | 'date' | 'status',
  sortOrder: 'asc' | 'desc'
) {
  return useMemo(() => {
    let filtered = channels.filter(channel => 
      channel.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      channel.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.channelName.localeCompare(b.channelName);
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
