
import React from 'react';
import { Company } from '@/types/company';
import { CompanyTags } from './CompanyTags';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Edit, Archive, Globe, Building2 } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useNavigate } from 'react-router-dom';
import { updateCompany } from '@/store/slices/companies/companiesSlice';

interface CompanyDetailSidebarProps {
  company: Company;
}

export const CompanyDetailSidebar = ({ company }: CompanyDetailSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleArchive = () => {
    dispatch(updateCompany({ 
      id: company.id, 
      updates: { status: 'inactive' } 
    }))
      .then(() => {
        navigate('/home/contacts/companies');
      });
  };

  // Format the phone number if present
  const formattedPhone = company.phone ? (
    <Button variant="link" className="p-0 h-auto font-normal text-blue-500" asChild>
      <a href={`tel:${company.phone}`}>{company.phone}</a>
    </Button>
  ) : (
    <span className="text-gray-500 italic">No phone</span>
  );

  return (
    <Card className="bg-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {company.name}
              </h2>
              <p className="text-muted-foreground">
                {company.industry || 'No industry'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {company.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Button variant="link" className="p-0 h-auto font-normal text-blue-500" asChild>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </Button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {formattedPhone}
          </div>

          {company.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Button variant="link" className="p-0 h-auto font-normal text-blue-500" asChild>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  {company.website}
                </a>
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t">
          <CompanyTags companyId={company.id} tags={company.tags || []} />
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button variant="destructive" size="sm" className="w-full" onClick={handleArchive}>
            <Archive className="h-4 w-4 mr-2" />
            Archive Company
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
