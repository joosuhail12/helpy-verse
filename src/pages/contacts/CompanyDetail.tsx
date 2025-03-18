
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Building, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ContactsTable from '@/components/contacts/ContactsTable';
import CompanyActivity from '@/components/companies/detail/CompanyActivity';
import CompanyNotes from '@/components/companies/detail/CompanyNotes';
import CompanyDeals from '@/components/companies/detail/CompanyDeals';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const company = useAppSelector(state => 
    state.companies.companies.find(company => company.id === id)
  );

  if (!company) {
    return <div className="p-8 text-center">Company not found</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">{company.name}</h1>
            <p className="text-muted-foreground mt-1">{company.industry || 'No industry specified'}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Company Details</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{company.size || 'Unknown size'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {company.website || 'No website'}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{company.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{company.phone || 'No phone'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <Separator className="my-2" />
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p>{company.address || 'No address'}</p>
                        <p>{company.city}{company.city && company.state ? ', ' : ''}{company.state} {company.zipCode}</p>
                        <p>{company.country}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Additional Info</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                          {company.status || 'Unknown status'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span>Created on {format(new Date(company.createdAt), 'PPP')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList className="mb-4">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ContactsTable 
            contacts={company.contacts || []} 
            title="Associated Contacts" 
          />
        </TabsContent>
        <TabsContent value="deals">
          <CompanyDeals companyId={company.id} />
        </TabsContent>
        <TabsContent value="activity">
          <CompanyActivity companyId={company.id} />
        </TabsContent>
        <TabsContent value="notes">
          <CompanyNotes 
            companyId={company.id} 
            initialNotes={company.notes} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
