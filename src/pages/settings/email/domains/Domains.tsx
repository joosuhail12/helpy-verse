
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { DomainListItem } from './components/DomainListItem';
import { AddDomainDialog } from './components/AddDomainDialog';
import { useToast } from '@/hooks/use-toast';
import { Globe, Loader2 } from 'lucide-react';
import { DomainControls } from './components/DomainControls';
import { DomainBulkActions } from './components/DomainBulkActions';
import { emailService } from '@/api/services/emailService';
import { AddNewDomain, Domain } from '@/types/domains';

const Domains = () => {
  console.log('Domains');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'verified' | "pending" | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredDomains = useMemo(() => {
    if (domains.length === 0) return [];

    let filtered = [...domains];

    if (searchQuery) {
      filtered = filtered.filter(domain =>
        domain.domain.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(domain => domain.isVerified === (statusFilter == "verified" ? true : false));
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.domain.localeCompare(b.domain);
      }
    });

    return filtered;
  }, [domains, searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    const getDomains = async () => {
      const data = await emailService.getDomains();
      if (data?.status === 'success') {
        setDomains(data.data);
        setLoading(false);
      } else {
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch domains.",
        });
      }
    };
    getDomains();
  }, []);

  const handleAddDomain = async (domain: AddNewDomain) => {
    await emailService.addDomain(domain).then((response) => {
      if (!response) {
        throw new Error('Failed to add domain');
      }

      toast({
        title: "Domain added",
        description: "The domain has been added successfully.",
      });

      setTimeout(() => {
        navigate(`/home/settings/email/domains/${response.data.id}`);
      }, 500);
    }).catch((error) => {
      toast({
        title: "Error",
        description: "Failed to add domain.",
      });
    });
  };

  const handleVerify = async (id: string) => {
    await emailService.verifyDomain(id).then((response) => {
      if (response?.data?.isVerified) {
        toast({
          title: "Domain Verified",
          description: "Your domain has been successfully verified.",
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: "Failed to verify domain.",
        });
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  const handleDelete = async (id: string) => {
    await emailService.deleteDomain(id).then((response) => {
      if (!response) {
        throw new Error('Failed to delete domain');
      }

      toast({
        title: "Domain deleted",
        description: "The domain has been removed successfully.",
      });
      setDomains(prev => prev.filter(domainId => domainId.id !== id));
    }).catch((error) => {
      toast({
        title: "Error",
        description: "Failed to add domain.",
      });
    });
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
    const selectedDomainsData = domains.filter(d => selectedDomains.includes(d.id));
    const csvContent = "data:text/csv;charset=utf-8," +
      "Domain,Status,Date Added\n" +
      selectedDomainsData.map(d => `${d.domain},${d.isVerified},${d.createdAt}`).join("\n");

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
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent rounded-xl p-8">
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

      {
        loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )
      }

      <Card className="overflow-hidden border-t-2 border-t-primary/10 shadow-sm">
        {!loading && filteredDomains.length === 0 ? (
          <div className="text-center py-16">
            <Globe className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No domains found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || statusFilter !== 'all'
                ? "Try adjusting your filters"
                : "Add your first domain to start sending emails"}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <AddDomainDialog
                className="mt-6"
                variant="outline"
                onAddDomain={handleAddDomain}
              />
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
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
