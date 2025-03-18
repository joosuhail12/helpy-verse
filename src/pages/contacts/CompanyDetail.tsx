
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Edit, Mail, Phone, Globe, Building, MapPin, UserGroup, DollarSign, Calendar, Briefcase, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ContactsTable from '@/components/contacts/ContactsTable';
import CompanyActivity from '@/components/companies/detail/CompanyActivity';
import CompanyNotes from '@/components/companies/detail/CompanyNotes';
import CompanyDeals from '@/components/companies/detail/CompanyDeals';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Since we're mocking for now, create a dummy company object
  const mockCompany = {
    id: id || '1',
    name: 'Acme Corporation',
    website: 'www.acme.com',
    industry: 'Technology',
    email: 'info@acme.com',
    phone: '+1 (555) 123-4567',
    foundedYear: '2005',
    numberOfEmployees: '50-100',
    location: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'USA'
    },
    status: 'active',
    tierLevel: 'enterprise',
    type: 'customer',
    businessModel: 'B2B',
    notes: [
      {
        id: 'note1',
        text: 'Had a great meeting with their team about expanding the contract.',
        createdAt: '2023-09-15T10:30:00Z',
        createdBy: {
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=john'
        }
      }
    ],
    contacts: [
      {
        id: 'contact1',
        firstname: 'Alice',
        lastname: 'Johnson',
        email: 'alice@acme.com',
        status: 'active',
        type: 'customer',
        tags: ['key-contact', 'decision-maker'],
        createdAt: '2023-08-10T14:30:00Z',
        updatedAt: '2023-09-01T09:15:00Z'
      },
      {
        id: 'contact2',
        firstname: 'Bob',
        lastname: 'Smith',
        email: 'bob@acme.com',
        status: 'active',
        type: 'customer',
        tags: ['technical'],
        createdAt: '2023-08-15T11:30:00Z',
        updatedAt: '2023-09-02T10:20:00Z'
      }
    ]
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{mockCompany.name}</h1>
          <p className="text-muted-foreground">{mockCompany.industry}</p>
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
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                  {mockCompany.website}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  {mockCompany.industry}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {mockCompany.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {mockCompany.phone}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Founded</p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {mockCompany.foundedYear}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="flex items-center">
                  <UserGroup className="h-4 w-4 mr-2 text-muted-foreground" />
                  {mockCompany.numberOfEmployees}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground align-top" />
                <span>
                  {mockCompany.location.street}<br />
                  {mockCompany.location.city}, {mockCompany.location.state} {mockCompany.location.zipCode}<br />
                  {mockCompany.location.country}
                </span>
              </p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={mockCompany.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                  {mockCompany.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tier</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 capitalize">
                  {mockCompany.tierLevel}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="capitalize">{mockCompany.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Business Model</p>
                <p className="uppercase">{mockCompany.businessModel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Annual Revenue</p>
                <p className="flex items-center text-2xl font-bold">
                  <DollarSign className="h-5 w-5 mr-1 text-green-600" />
                  165,000
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="flex items-center text-2xl font-bold">
                  <UserGroup className="h-5 w-5 mr-1 text-blue-600" />
                  {mockCompany.contacts.length}
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Open Deals</p>
                <p className="flex items-center text-2xl font-bold">
                  <Package className="h-5 w-5 mr-1 text-purple-600" />
                  2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts" className="py-4">
          <ContactsTable contacts={mockCompany.contacts} />
        </TabsContent>
        <TabsContent value="deals" className="py-4">
          <CompanyDeals company={mockCompany} />
        </TabsContent>
        <TabsContent value="activity" className="py-4">
          <CompanyActivity company={mockCompany} />
        </TabsContent>
        <TabsContent value="notes" className="py-4">
          <CompanyNotes company={mockCompany} initialNotes={mockCompany.notes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDetail;
