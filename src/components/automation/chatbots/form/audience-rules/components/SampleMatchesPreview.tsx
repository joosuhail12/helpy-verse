
import { useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Eye, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { QueryGroup } from '@/types/queryBuilder';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';

interface SampleMatchesPreviewProps {
  queryGroup: QueryGroup;
}

export const SampleMatchesPreview = ({ queryGroup }: SampleMatchesPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targetEntityType, setTargetEntityType] = useState<'contacts' | 'companies'>('contacts');
  const [sampleMatches, setSampleMatches] = useState<any[]>([]);
  
  const { contacts } = useAppSelector(state => state.contacts);
  const companies = useAppSelector(state => state.companies.companies);

  // Function to fetch sample matches
  const fetchSampleMatches = async () => {
    setIsLoading(true);
    
    try {
      // Determine if we're querying contacts or companies
      // Simple heuristic based on the first rule's field
      if (queryGroup.rules.length > 0) {
        for (const rule of queryGroup.rules) {
          if ('field' in rule && rule.field) {
            const fieldId = rule.field;
            if (fieldId.startsWith('company.')) {
              setTargetEntityType('companies');
              break;
            } else {
              setTargetEntityType('contacts');
              break;
            }
          }
        }
      }
      
      const entities = targetEntityType === 'contacts' ? contacts : companies;
      
      // Simple filtering logic (this is a simplified version)
      // In a real app, you'd send the rules to the backend for proper SQL querying
      const matches = entities.filter(entity => {
        // This is a very basic implementation - in a real app, this would be handled by the backend
        return matchesQueryGroup(entity, queryGroup);
      }).slice(0, 5); // Take just 5 sample matches
      
      setSampleMatches(matches);
    } catch (error) {
      console.error('Error fetching sample matches:', error);
      setSampleMatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Very simplified matching logic - in a real app this would be done server-side
  const matchesQueryGroup = (entity: any, group: QueryGroup): boolean => {
    if (group.rules.length === 0) return true;
    
    const results = group.rules.map(rule => {
      if ('combinator' in rule) {
        return matchesQueryGroup(entity, rule);
      } else if ('field' in rule) {
        const fieldPath = rule.field.split('.');
        let value = entity;
        
        // Navigate through nested object properties
        for (const key of fieldPath) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            value = undefined;
            break;
          }
        }
        
        // Very basic operator implementation
        if (value === undefined) return false;
        
        switch (rule.operator) {
          case 'equals':
            return value === rule.value;
          case 'not_equals':
            return value !== rule.value;
          case 'contains':
            return typeof value === 'string' && value.includes(String(rule.value));
          case 'starts_with':
            return typeof value === 'string' && value.startsWith(String(rule.value));
          case 'greater_than':
            return typeof value === 'number' && value > Number(rule.value);
          case 'less_than':
            return typeof value === 'number' && value < Number(rule.value);
          default:
            return false;
        }
      }
      return false;
    });
    
    // Apply the combinator (AND/OR)
    if (group.combinator === 'and') {
      return results.every(Boolean);
    } else {
      return results.some(Boolean);
    }
  };

  const renderContactsTable = (contacts: Contact[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No matches found
            </TableCell>
          </TableRow>
        ) : (
          contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>{contact.firstname} {contact.lastname}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.type}</TableCell>
              <TableCell>{contact.status}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const renderCompaniesTable = (companies: Company[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No matches found
            </TableCell>
          </TableRow>
        ) : (
          companies?.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.industry || 'N/A'}</TableCell>
              <TableCell>{company.type || 'N/A'}</TableCell>
              <TableCell>{company.status || 'N/A'}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-slate-50 p-4 rounded-lg border"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Sample Matches Preview</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchSampleMatches();
              if (!isOpen) setIsOpen(true);
            }}
            disabled={isLoading || queryGroup.rules.length === 0}
          >
            <Search className="h-4 w-4 mr-2" />
            Preview Matches
          </Button>
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent className="mt-4">
        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <ScrollArea className="h-64">
            {targetEntityType === 'contacts' 
              ? renderContactsTable(sampleMatches as Contact[])
              : renderCompaniesTable(sampleMatches as Company[])}
          </ScrollArea>
        )}
        
        {sampleMatches.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            Showing 5 sample matches. Actual audience may be larger.
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
