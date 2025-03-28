
import React, { useEffect, useState } from 'react';
import { QueryGroup } from '@/types/queryBuilder';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Contact } from '@/types/contact';
import { Company } from '@/types/company';
import { evaluateRules } from '../utils/ruleValidator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectAllContacts } from '@/store/slices/contacts/contactsSlice';
import { selectAllCompanies } from '@/store/slices/companies/companiesSlice';

interface SampleMatchesPreviewProps {
  queryGroup?: QueryGroup;
  rules?: QueryGroup;
}

const SampleMatchesPreview: React.FC<SampleMatchesPreviewProps> = ({ queryGroup, rules }) => {
  const activeRules = queryGroup || rules;
  const contacts = useAppSelector(selectAllContacts);
  const companies = useAppSelector(selectAllCompanies);
  
  const [matchingContacts, setMatchingContacts] = useState<Contact[]>([]);
  const [matchingCompanies, setMatchingCompanies] = useState<Company[]>([]);
  
  useEffect(() => {
    // Only process if we have rules and data
    if (activeRules && activeRules.rules && activeRules.rules.length > 0) {
      // Filter contacts
      const filteredContacts = contacts.filter(contact => 
        evaluateRules(contact, activeRules)
      );
      setMatchingContacts(filteredContacts.slice(0, 5));
      
      // Filter companies
      const filteredCompanies = companies.filter(company => 
        evaluateRules(company, activeRules)
      );
      setMatchingCompanies(filteredCompanies.slice(0, 5));
    } else {
      setMatchingContacts([]);
      setMatchingCompanies([]);
    }
  }, [activeRules, contacts, companies]);
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Sample Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="contacts">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contacts">
              Contacts ({matchingContacts.length})
            </TabsTrigger>
            <TabsTrigger value="companies">
              Companies ({matchingCompanies.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="contacts">
            <ScrollArea className="h-[200px]">
              {matchingContacts.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {matchingContacts.map(contact => (
                    <div key={contact.id} className="p-2 border rounded-md">
                      <div className="font-medium">{contact.firstname} {contact.lastname}</div>
                      <div className="text-sm text-muted-foreground">{contact.email}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
                  No matching contacts found
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="companies">
            <ScrollArea className="h-[200px]">
              {matchingCompanies.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {matchingCompanies.map(company => (
                    <div key={company.id} className="p-2 border rounded-md">
                      <div className="font-medium">{company.name}</div>
                      <div className="text-sm text-muted-foreground">{company.industry || 'No industry'}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[150px] items-center justify-center text-sm text-muted-foreground">
                  No matching companies found
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SampleMatchesPreview;
