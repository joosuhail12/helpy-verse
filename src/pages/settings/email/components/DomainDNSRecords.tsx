
import { Copy, Database, Server, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import type { Domain } from '@/mock/domains';

const DNS_RECORD_ICONS = {
  'TXT': Database,
  'MX': Server,
  'CNAME': Link,
} as const;

const DNS_RECORD_COLORS = {
  'TXT': 'bg-purple-100 text-purple-800 border-purple-200',
  'MX': 'bg-blue-100 text-blue-800 border-blue-200',
  'CNAME': 'bg-emerald-100 text-emerald-800 border-emerald-200',
} as const;

const DNS_RECORD_DESCRIPTIONS = {
  'TXT': 'Text record used for domain verification and SPF records',
  'MX': 'Mail exchange record that specifies mail servers for the domain',
  'CNAME': 'Canonical name record that points to another domain name',
} as const;

interface DomainDNSRecordsProps {
  domain: Domain;
}

export const DomainDNSRecords = ({ domain }: DomainDNSRecordsProps) => {
  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied to clipboard",
      description: "The value has been copied to your clipboard.",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>TTL</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {domain.dnsRecords?.map((record, index) => {
          const RecordIcon = DNS_RECORD_ICONS[record.type];
          return (
            <TableRow key={index}>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge 
                        variant="outline"
                        className={`flex items-center gap-1 ${DNS_RECORD_COLORS[record.type]}`}
                      >
                        <RecordIcon className="h-3 w-3" />
                        {record.type}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{DNS_RECORD_DESCRIPTIONS[record.type]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {record.name}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleCopyToClipboard(record.name)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {record.value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleCopyToClipboard(record.value)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>{record.ttl}</TableCell>
              <TableCell>{record.priority || '-'}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
