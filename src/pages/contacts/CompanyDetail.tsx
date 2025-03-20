import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  fetchCompanyById, 
  selectCompanyDetails, 
  selectCompanyLoading, 
  selectCompanyError 
} from '@/store/slices/companies/companiesSlice';
import {
  Edit, Users, Globe, Briefcase, Mail, Phone, Calendar, MapPin, DollarSign, Package
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Placeholder for contacts, deals, activity, notes sections (you can keep them or enhance later)
const ContactsTable = ({ contacts }: { contacts: any[] }) => (
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-4">Associated Contacts</h3>
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left pb-2">Name</th>
          <th className="text-left pb-2">Email</th>
          <th className="text-left pb-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map(contact => (
          <tr key={contact.id}>
            <td className="py-2">{contact.firstname} {contact.lastname}</td>
            <td className="py-2">{contact.email}</td>
            <td className="py-2">{contact.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const company = useAppSelector(selectCompanyDetails);
  const loading = useAppSelector(selectCompanyLoading);
  const error = useAppSelector(selectCompanyError);

  useEffect(() => {
    if (id) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id]);

  if (loading) return <p>Loading company details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!company) return <p>No company details found.</p>;

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-muted-foreground">{company.industry}</p>
        </div>
        <Button className="ml-auto">
          <Edit className="mr-2 h-4 w-4" />
          Edit Company
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Website" icon={<Globe />} value={company.website} />
              <InfoRow label="Industry" icon={<Briefcase />} value={company.industry} />
              <InfoRow label="Email" icon={<Mail />} value={company.contactInfo?.email} />
              <InfoRow label="Phone" icon={<Phone />} value={company.contactInfo?.phone} />
              <InfoRow label="Employees" icon={<Users />} value={company.size} />
            </div>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {company.address?.street}<br />
                  {company.address?.city}, {company.address?.state} {company.address?.zipCode}<br />
                  {company.address?.country}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <StatCard label="Annual Revenue" value="165,000" icon={<DollarSign className="text-green-600" />} />
              <StatCard label="Total Contacts" value="0" icon={<Users className="text-blue-600" />} />
              <StatCard label="Open Deals" value="0" icon={<Package className="text-purple-600" />} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper component for display rows
const InfoRow = ({ label, icon, value }: { label: string; icon: React.ReactNode; value?: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="flex items-center">
      <span className="h-4 w-4 mr-2 text-muted-foreground">{icon}</span>
      {value || '-'}
    </p>
  </div>
);

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="bg-muted p-4 rounded-lg">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="flex items-center text-2xl font-bold">{icon} {value}</p>
  </div>
);

export default CompanyDetail;
