
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDomains, type Domain } from '@/mock/domains';
import { Card } from '@/components/ui/card';
import { DomainListItem } from './components/DomainListItem';
import { AddDomainDialog } from './components/AddDomainDialog';
import { toast } from '@/components/ui/use-toast';
import { Globe } from 'lucide-react';
import { DomainControls } from './components/DomainControls';

const Domains = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Domain['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const filteredDomains = useMemo(() => {
    let filtered = [...mockDomains];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(domain =>
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(domain => domain.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      } else {
        return a.domain.localeCompare(b.domain);
      }
    });

    return filtered;
  }, [mockDomains, searchQuery, statusFilter, sortBy]);

  const handleAddDomain = (domain: Domain) => {
    // TODO: Implement domain addition with backend
    toast({
      title: "Domain added",
      description: "The domain has been added successfully.",
    });
    navigate(`/home/settings/email/domains/${domain.id}`);
  };

  const handleVerify = (id: string) => {
    // TODO: Implement domain verification with backend
    toast({
      title: "Verification initiated",
      description: "Domain verification process has started.",
    });
  };

  const handleDelete = (id: string) => {
    // TODO: Implement domain deletion with backend
    toast({
      title: "Domain deleted",
      description: "The domain has been removed successfully.",
    });
  };

  const handleNavigate = (id: string) => {
    navigate(`/home/settings/email/domains/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Domains</h2>
          <p className="text-muted-foreground">
            Manage your email domains and DNS settings
          </p>
        </div>
        <AddDomainDialog onAddDomain={handleAddDomain} />
      </div>

      <DomainControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Card className="p-6">
        {filteredDomains.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No domains found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all' 
                ? "Try adjusting your filters" 
                : "Add your first domain to start sending emails"}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <AddDomainDialog
                className="mt-4"
                variant="outline"
                onAddDomain={handleAddDomain}
              />
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredDomains.map((domain) => (
              <DomainListItem 
                key={domain.id} 
                domain={domain}
                onVerify={handleVerify}
                onDelete={handleDelete}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Domains;
