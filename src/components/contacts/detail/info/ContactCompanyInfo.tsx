
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Phone, Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Contact } from '@/types/contact';

interface ContactCompanyInfoProps {
  contact: Contact;
}

export const ContactCompanyInfo = ({ contact }: ContactCompanyInfoProps) => {
  const navigate = useNavigate();
  const companies = useAppSelector((state) => state.companies?.companies) || [];
  
  // Handle company details
  let companyDetails = null;
  
  if (contact.company) {
    // Company might be an object or a string (ID)
    const companyId = typeof contact.company === 'object' ? contact.company.id : contact.company;
    const companyName = typeof contact.company === 'object' ? contact.company.name : '';
    
    // Try to find detailed company info
    const company = companies.find(c => c.id === companyId);
    
    if (company) {
      companyDetails = (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{company.name}</span>
          </div>
          
          {company.industry && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{company.industry}</span>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{company.phone}</span>
            </div>
          )}
          
          {company.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
          
          {company.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                {company.location.street && <div>{company.location.street}</div>}
                {company.location.city && company.location.state && (
                  <div>
                    {company.location.city}, {company.location.state} {company.location.zipCode || ''}
                  </div>
                )}
                {company.location.country && <div>{company.location.country}</div>}
              </div>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/home/contacts/companies/${companyId}`)}
          >
            View Company
          </Button>
        </div>
      );
    } else if (companyName) {
      // We only have minimal company info
      companyDetails = (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{companyName}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Limited company information available
          </div>
        </div>
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company</CardTitle>
      </CardHeader>
      <CardContent>
        {companyDetails ? (
          companyDetails
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No company associated with this contact
          </div>
        )}
      </CardContent>
    </Card>
  );
};
