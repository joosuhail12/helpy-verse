
import { useState } from 'react';
import { subDays } from 'date-fns';
import type { Teammate } from '@/types/teammate';

export const useTeammateFilters = (teammates: Teammate[] = []) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all_roles');
  const [statusFilter, setStatusFilter] = useState('all_statuses');

  const handleQuickFilterClick = (filter: 'recent' | 'inactive') => {
    if (filter === 'recent') {
      setStatusFilter('all_statuses');
      setSearchQuery('');
      setRoleFilter('all_roles');
    } else if (filter === 'inactive') {
      setStatusFilter('inactive');
    }
  };

  // Ensure teammates is always an array, even if undefined is passed
  const teammatesArray = Array.isArray(teammates) ? teammates : [];

  const filteredTeammates = teammatesArray.filter(teammate => {
    // Skip filtering if teammate is invalid
    if (!teammate || typeof teammate !== 'object') return false;

    const teammateNameLower = (teammate.name || '').toLowerCase();
    const teammateEmailLower = (teammate.email || '').toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();

    const matchesSearch = searchQuery === '' || 
      teammateNameLower.includes(searchQueryLower) ||
      teammateEmailLower.includes(searchQueryLower);

    const matchesRole = roleFilter === 'all_roles' || teammate.role === roleFilter;
    const matchesStatus = statusFilter === 'all_statuses' || teammate.status === statusFilter;

    if (roleFilter === 'recent') {
      // Handle recent teammates
      if (!teammate.createdAt) return false;
      const recentDate = subDays(new Date(), 7);
      return new Date(teammate.createdAt) >= recentDate;
    }

    return matchesSearch && matchesRole && matchesStatus;
  });

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    handleQuickFilterClick,
    filteredTeammates
  };
};
