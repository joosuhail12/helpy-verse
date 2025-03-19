import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Contact } from '@/types/contact';
import { ContactCompanyInfo } from './ContactCompanyInfo';
import { ContactTags } from './ContactTags';
import { ContactAddress } from './ContactAddress';
import { ContactSocialLinks } from './ContactSocialLinks';

export const ContactInformation = ({ contact, activities }: { contact: Contact, activities: any[] }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="ml-2 font-medium">{contact.firstname} {contact.lastname}</span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="ml-2">{contact.email}</span>
                </div>
                {contact.phone && (
                  <div>
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span className="ml-2">{contact.phone}</span>
                  </div>
                )}
                {contact.title && (
                  <div>
                    <span className="text-sm text-muted-foreground">Title:</span>
                    <span className="ml-2">{contact.title}</span>
                  </div>
                )}
                {contact.department && (
                  <div>
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <span className="ml-2">{contact.department}</span>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="ml-2">
                    {contact.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge variant="outline" className="ml-2">
                    {contact.type}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Details</h3>
              <div className="space-y-2">
                {contact.source && (
                  <div>
                    <span className="text-sm text-muted-foreground">Source:</span>
                    <span className="ml-2">{contact.source}</span>
                  </div>
                )}
                {contact.timezone && (
                  <div>
                    <span className="text-sm text-muted-foreground">Timezone:</span>
                    <span className="ml-2">{contact.timezone}</span>
                  </div>
                )}
                {contact.language && (
                  <div>
                    <span className="text-sm text-muted-foreground">Language:</span>
                    <span className="ml-2">{contact.language}</span>
                  </div>
                )}
                {contact.lastContacted && (
                  <div>
                    <span className="text-sm text-muted-foreground">Last Contacted:</span>
                    <span className="ml-2">
                      {formatDistanceToNow(new Date(contact.lastContacted), { addSuffix: true })}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="ml-2">
                    {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {/* Company information */}
          <ContactCompanyInfo contact={contact} />
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactAddress contact={contact} />
            <ContactSocialLinks contact={contact} />
          </div>
          
          <Separator className="my-4" />
          
          <ContactTags contact={contact} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No recent activity</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
