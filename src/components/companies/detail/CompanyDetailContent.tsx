
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Company } from '@/types/company';

export interface CompanyDetailContentProps {
  company: Company;
  activities: any[];
}

export const CompanyDetailContent: React.FC<CompanyDetailContentProps> = ({ company, activities }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p className="text-sm">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No website</span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Industry</p>
                <p className="text-sm">
                  {company.industry || <span className="text-muted-foreground">Not specified</span>}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Number of Employees</p>
                <p className="text-sm">
                  {company.numberOfEmployees || <span className="text-muted-foreground">Not specified</span>}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Annual Revenue</p>
                <p className="text-sm">
                  {company.annualRevenue ? (
                    `$${company.annualRevenue.toLocaleString()}`
                  ) : (
                    <span className="text-muted-foreground">Not specified</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">
                  {company.email ? (
                    <a href={`mailto:${company.email}`} className="text-blue-600 hover:underline">
                      {company.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No email</span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">
                  {company.phone ? (
                    <a href={`tel:${company.phone}`} className="text-blue-600 hover:underline">
                      {company.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No phone</span>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-sm">
                  {company.location?.city && company.location?.country ? (
                    `${company.location.city}, ${company.location.country}`
                  ) : (
                    <span className="text-muted-foreground">No location</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {company.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{company.description}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contacts">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No contacts found for this company.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No tickets found for this company.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              {activities && activities.length > 0 ? (
                <div>Activities list here</div>
              ) : (
                <p className="text-muted-foreground">No recent activities found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
