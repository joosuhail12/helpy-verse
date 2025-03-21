
import { useState } from 'react';
import { subDays } from 'date-fns';
import type { Teammate } from '@/types/teammate';

export const useTeammateFilters = (teammates: Teammate[]) => {
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

  const filteredTeammates = teammates.filter(teammate => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      teammate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teammate.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all_roles' || teammate.role === roleFilter;
    const matchesStatus = statusFilter === 'all_statuses' || teammate.status === statusFilter;

    if (roleFilter === 'recent') {
      const recentDate = subDays(new Date(), 7);
      return new Date(teammate.createdAt) >= recentDate;
    }
    console.log(teammate.role, roleFilter, matchesRole, matchesStatus, matchesSearch);
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
