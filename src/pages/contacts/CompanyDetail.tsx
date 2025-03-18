
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import ContactsTable from '@/components/contacts/ContactsTable';
import CompanyDeals from '@/components/companies/detail/CompanyDeals';
import { Company } from '@/types/company';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const company = useAppSelector((state) => 
    state.companies.items.find(item => item.id === id)
  ) as Company;

  useEffect(() => {
    // Fetch company details if needed
    if (!company) {
      // dispatch(fetchCompanyDetails(id));
    }
  }, [dispatch, id, company]);

  if (!company) {
    return <div>Loading company details...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{company.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Website</p>
              <p>{company.website || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Industry</p>
              <p>{company.industry || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{company.email || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p>{company.phone || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Founded</p>
              <p>{company.foundedYear || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Employees</p>
              <p>{company.numberOfEmployees || '-'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            {company.location ? (
              <div className="space-y-1">
                <p>{company.location.street || ''}</p>
                <p>
                  {company.location.city || ''} 
                  {company.location.city && company.location.state ? ', ' : ''} 
                  {company.location.state || ''}
                  {company.location.state && company.location.zipcode ? ' ' : ''}
                  {company.location.zipcode || ''}
                </p>
                <p>{company.location.country || ''}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No address information</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Status</p>
          <Badge className={company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {company.status || 'Not set'}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Tier Level</p>
          <p className="font-medium">{company.tierLevel || '-'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Company Type</p>
          <p className="font-medium">{company.type || '-'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Business Model</p>
          <p className="font-medium">{company.businessModel || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactsTable contacts={[]} />
          </CardContent>
        </Card>

        <CompanyDeals company={company} />

        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Company activity component would go here */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Company notes component would go here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyDetail;
