
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/contact';
import { selectCompanyDetails } from '@/store/slices/companies/selectors';
import { fetchCompanyById } from '@/store/slices/companies/companiesSlice';
import { RelatedCompanySelector } from './RelatedCompanySelector';

interface ContactRelatedProps {
  contact: Contact;
}

export const ContactRelated = ({ contact }: ContactRelatedProps) => {
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompanyDetails);
  
  useEffect(() => {
    if (contact.company) {
      dispatch(fetchCompanyById(contact.company));
    }
  }, [dispatch, contact.company]);
  
  const hasRelatedDeals = false; // Placeholder for deals feature
  const hasRelatedTickets = false; // Placeholder for tickets feature
  const hasScheduledActivities = false; // Placeholder for activities feature
  
  return (
    <Card className="bg-white/60 backdrop-blur-sm">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg">Related Items</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Building className="mr-2 h-4 w-4 text-primary" />
                Company
              </h3>
              {!contact.company && !isAddingCompany && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddingCompany(true)}
                >
                  Add
                </Button>
              )}
            </div>
            {isAddingCompany ? (
              <RelatedCompanySelector 
                contact={contact}
                onCancel={() => setIsAddingCompany(false)}
                onSaved={() => setIsAddingCompany(false)}
              />
            ) : (
              contact.company && company ? (
                <Link to={`/contacts/companies/${company.id}`} className="text-sm text-blue-600 hover:underline">
                  {company.name}
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">No company associated</span>
              )
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-primary" />
                Deals & Tickets
              </h3>
            </div>
            {hasRelatedDeals || hasRelatedTickets ? (
              <div className="space-y-2">
                {/* Deals and tickets would be listed here */}
                <p className="text-sm text-muted-foreground">Placeholder for deals and tickets</p>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No deals or tickets</span>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Upcoming Activities
              </h3>
            </div>
            {hasScheduledActivities ? (
              <div className="space-y-2">
                {/* Activities would be listed here */}
                <p className="text-sm text-muted-foreground">Placeholder for activities</p>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">No upcoming activities</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
