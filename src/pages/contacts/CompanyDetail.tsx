
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchCompanyById } from '@/store/slices/contacts/companiesSlice';
import { CompanyDetailHeader } from '@/components/companies/detail/CompanyDetailHeader';
import ContactsTable from '@/components/contacts/ContactsTable';
import CompanyActivity from '@/components/companies/detail/CompanyActivity';
import CompanyNotes from '@/components/companies/detail/CompanyNotes';
import CompanyDeals from '@/components/companies/detail/CompanyDeals';
import AssociatedContacts from '@/components/companies/detail/AssociatedContacts';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const company = useAppSelector((state) => state.companies.selectedCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id]);

  if (!company) {
    return (
      <div className="container mx-auto py-6">
        <p>Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <CompanyDetailHeader company={company} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                <p>{company.website || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                <p>{company.industry || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{company.email || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <p>{company.phone || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Founded</h3>
                <p>{company.foundedYear || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Employees</h3>
                <p>{company.numberOfEmployees || 'N/A'}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
              <p>
                {company.location?.street || 'No address available'}
              </p>
              {company.location?.city && (
                <p>
                  {company.location.city}
                  {company.location.state ? `, ${company.location.state}` : ''}
                  {company.location.zipcode ? ` ${company.location.zipcode}` : ''}
                </p>
              )}
              {company.location?.country && <p>{company.location.country}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Company Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Status</h3>
              <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                {company.status || 'Unknown'}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Tier Level</h3>
              <Badge variant="outline">{company.tierLevel || 'N/A'}</Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Account Type</h3>
              <p className="capitalize">{company.type || 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Business Model</h3>
              <p className="uppercase">{company.businessModel || 'N/A'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts">
        <TabsList>
          <TabsTrigger value="contacts">Associated Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="p-4 border rounded-md mt-4">
          <AssociatedContacts companyId={company.id} />
        </TabsContent>
        <TabsContent value="deals" className="p-4 border rounded-md mt-4">
          <CompanyDeals company={company} />
        </TabsContent>
        <TabsContent value="activity" className="p-4 border rounded-md mt-4">
          <CompanyActivity company={company} />
        </TabsContent>
        <TabsContent value="notes" className="p-4 border rounded-md mt-4">
          <CompanyNotes company={company} initialNotes={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
