
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter, Linkedin, ExternalLink } from "lucide-react";
import type { Contact } from '@/types/contact';

interface ContactSocialLinksProps {
  contact: Contact;
}

export const ContactSocialLinks = ({ contact }: ContactSocialLinksProps) => {
  const hasSocialLinks = contact.linkedinUrl || contact.twitterUrl;

  if (!hasSocialLinks) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md">Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contact.linkedinUrl && (
          <a 
            href={contact.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:underline text-blue-600"
          >
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn Profile
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
        
        {contact.twitterUrl && (
          <a 
            href={contact.twitterUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm hover:underline text-blue-400"
          >
            <Twitter className="h-4 w-4 mr-2" />
            Twitter Profile
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactSocialLinks;
