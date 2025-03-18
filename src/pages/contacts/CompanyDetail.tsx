
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin, Globe, Users } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { fetchCompanyById, selectCompanyDetails } from '@/store/slices/contacts/companiesSlice';
import { ContactsTable } from '@/components/contacts/ContactsTable';
import { CompanyActivity } from '@/components/companies/detail/CompanyActivity';
import { CompanyNotes } from '@/components/companies/detail/CompanyNotes';
import { CompanyDeals } from '@/components/companies/detail/CompanyDeals';
import AssociatedContacts from '@/components/companies/detail/AssociatedContacts';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompanyDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id]);

  if (!company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/contacts/companies')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{company.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary">
                    {company.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{company.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.industry && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span>{company.industry}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {company.website}
                  </a>
                </div>
              )}
              {company.address?.city && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>
                    {company.address.city}
                    {company.address.state && `, ${company.address.state}`}
                    {company.address.country && `, ${company.address.country}`}
                  </span>
                </div>
              )}
              {company.size && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{company.size} employees</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                  <p>{company.industry || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Size</h3>
                  <p>{company.size || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Website</h3>
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {company.website}
                    </a>
                  ) : (
                    <p>Not specified</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Address</h3>
                  {company.address ? (
                    <div>
                      {company.address.street && <p>{company.address.street}</p>}
                      <p>
                        {company.address.city && `${company.address.city}, `}
                        {company.address.state && `${company.address.state} `}
                        {company.address.zipCode && company.address.zipCode}
                      </p>
                      {company.address.country && <p>{company.address.country}</p>}
                    </div>
                  ) : (
                    <p>Not specified</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-6">
          <AssociatedContacts companyId={id!} />
          <CompanyActivity companyId={id!} />
          <CompanyNotes companyId={id!} />
          <CompanyDeals companyId={id!} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;
