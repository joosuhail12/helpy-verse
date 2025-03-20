
import { useState } from 'react';
import { Company } from '@/types/company';
import { Activity } from '@/types/activity';
import { CompanyInformation } from './CompanyInformation';
import { CompanyActivityTimeline } from './CompanyActivityTimeline';
import { CompanyDetailSidebar } from './CompanyDetailSidebar';
import { CompanyCustomObjectData } from './CompanyCustomObjectData';
import { CompanyRelated } from './CompanyRelated';
import { CompanyTickets } from './CompanyTickets';
import AssociatedContacts from './AssociatedContacts';
import { AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompanyDetailContentProps {
  company: Company;
  activities: Activity[];
}

export const CompanyDetailContent = ({ company, activities }: CompanyDetailContentProps) => {
  const [activeTab, setActiveTab] = useState('activities');
  const needsAttention = company.status === 'inactive';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
      <div className="lg:col-span-4">
        {needsAttention && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <p className="text-sm text-yellow-700">This company needs attention</p>
          </div>
        )}

        <CompanyDetailSidebar company={company} />
        <div className="mt-4 space-y-4">
          <CompanyInformation company={company} activities={activities} />
          <CompanyRelated company={company} />
          <CompanyCustomObjectData company={company} />
        </div>
      </div>

      <div className="lg:col-span-8">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activities">Activity Timeline</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="activities">
            <CompanyActivityTimeline activities={activities} />
          </TabsContent>

          <TabsContent value="contacts">
            {company.id && <AssociatedContacts companyId={company.id} />}
          </TabsContent>

          <TabsContent value="tickets">
            <CompanyTickets companyId={company.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
