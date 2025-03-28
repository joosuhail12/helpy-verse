
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/types/contact';
import { updateContactCompany } from '@/store/slices/contacts/contactsSlice';
import { Company } from '@/types/company';

interface RelatedCompanySelectorProps {
  contact: Contact;
  onCancel: () => void;
  onSaved: () => void;
}

export const RelatedCompanySelector = ({ contact, onCancel, onSaved }: RelatedCompanySelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const companies = useAppSelector(state => state.companies.companies);
  
  useEffect(() => {
    if (searchTerm.length > 1) {
      setLoading(true);
      // Filter companies based on search term
      const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTimeout(() => {
        setSearchResults(filteredCompanies);
        setLoading(false);
      }, 300);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, companies]);
  
  const handleSelect = (company: Company) => {
    setSelectedCompany(company);
    setSearchTerm(company.name);
    setSearchResults([]);
  };
  
  const handleSave = async () => {
    if (selectedCompany) {
      try {
        await dispatch(updateContactCompany({
          contactId: contact.id,
          companyId: selectedCompany.id
        })).unwrap();
        
        toast({
          title: "Company updated",
          description: `${contact.firstname} ${contact.lastname} is now associated with ${selectedCompany.name}`,
        });
        
        onSaved();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update company association",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          className="pl-10 pr-8"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
            size={16}
            onClick={() => {
              setSearchTerm('');
              setSelectedCompany(null);
            }}
          />
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : searchResults.length > 0 && !selectedCompany ? (
        <div className="border rounded-md max-h-60 overflow-y-auto">
          {searchResults.map(company => (
            <div
              key={company.id}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelect(company)}
            >
              <p className="font-medium">{company.name}</p>
              {company.industry && (
                <p className="text-xs text-gray-500">{company.industry}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!selectedCompany}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
