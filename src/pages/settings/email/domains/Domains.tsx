
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDomains, type Domain } from '@/mock/domains';
import { Card } from '@/components/ui/card';
import { DomainListItem } from './components/DomainListItem';
import { AddDomainDialog } from './components/AddDomainDialog';
import { toast } from '@/components/ui/use-toast';
import { Globe } from 'lucide-react';
import { DomainControls } from './components/DomainControls';
import { DomainBulkActions } from './components/DomainBulkActions';

const Domains = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Domain['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const filteredDomains = useMemo(() => {
    let filtered = [...mockDomains];

    if (searchQuery) {
      filtered = filtered.filter(domain =>
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(domain => domain.status === statusFilter);
    }

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
    toast({
      title: "Domain added",
      description: "The domain has been added successfully.",
    });
    navigate(`/home/settings/email/domains/${domain.id}`);
  };

  const handleVerify = (id: string) => {
    toast({
      title: "Verification initiated",
      description: "Domain verification process has started.",
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Domain deleted",
      description: "The domain has been removed successfully.",
    });
    setSelectedDomains(prev => prev.filter(domainId => domainId !== id));
  };

  const handleNavigate = (id: string) => {
    navigate(`/home/settings/email/domains/${id}`);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedDomains(checked ? filteredDomains.map(d => d.id) : []);
  };

  const handleSelectDomain = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDomains(prev => [...prev, id]);
    } else {
      setSelectedDomains(prev => prev.filter(domainId => domainId !== id));
    }
  };

  const handleBulkVerify = () => {
    toast({
      title: "Bulk verification initiated",
      description: `Verification process started for ${selectedDomains.length} domains.`,
    });
  };

  const handleBulkDelete = () => {
    toast({
      title: "Domains deleted",
      description: `Successfully deleted ${selectedDomains.length} domains.`,
    });
    setSelectedDomains([]);
  };

  const handleBulkExport = () => {
    const selectedDomainsData = mockDomains.filter(d => selectedDomains.includes(d.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Domain,Status,Date Added\n" +
      selectedDomainsData.map(d => `${d.domain},${d.status},${d.dateAdded}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "domains.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: `Successfully exported ${selectedDomains.length} domains.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Domains
            </h2>
            <p className="text-muted-foreground">
              Manage your email domains and DNS settings
            </p>
          </div>
          <AddDomainDialog onAddDomain={handleAddDomain} />
        </div>
      </div>

      <DomainControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {selectedDomains.length > 0 && (
        <DomainBulkActions
          selectedCount={selectedDomains.length}
          onVerify={handleBulkVerify}
          onDelete={handleBulkDelete}
          onExport={handleBulkExport}
        />
      )}

      <Card className="overflow-hidden border-t-2 border-t-primary/10">
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
          <div className="divide-y divide-gray-100">
            {filteredDomains.map((domain) => (
              <DomainListItem 
                key={domain.id} 
                domain={domain}
                selected={selectedDomains.includes(domain.id)}
                onSelect={handleSelectDomain}
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

