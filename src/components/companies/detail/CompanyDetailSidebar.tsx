
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updateCompany } from '@/store/slices/companies/companiesSlice';
import type { Company } from '@/types/company';

interface CompanyDetailSidebarProps {
  company: Company;
}

export const CompanyDetailSidebar: React.FC<CompanyDetailSidebarProps> = ({ company }) => {
  const dispatch = useDispatch();

  const handleUpdateCompany = (data: Partial<Company>) => {
    dispatch(updateCompany({ 
      companyId: company.id, 
      data 
    }));
  };

  return (
    <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
      <div className="space-y-4">
        {/* Company Type */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Company Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={company.type === 'customer' ? 'default' : 'secondary'} className="capitalize">
              {company.type || 'Not Set'}
            </Badge>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              variant={company.status === 'active' ? 'default' : 'outline'}
              className={`capitalize ${company.status === 'active' ? 'bg-green-500' : ''}`}
            >
              {company.status || 'Not Set'}
            </Badge>
          </CardContent>
        </Card>

        {/* Account Owner */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Account Owner</CardTitle>
          </CardHeader>
          <CardContent>
            {company.accountOwner ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                  {company.accountOwner.charAt(0)}
                </div>
                <span className="text-sm">{company.accountOwner}</span>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-3.5 w-3.5 mr-2" />
                Assign Owner
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {company.tags && company.tags.length > 0 ? (
                Array.isArray(company.tags) && company.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {typeof tag === 'string' ? tag : tag.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No tags</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Company Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Founded:</span>{' '}
              {company.foundedYear || 'Not available'}
            </div>
            <div>
              <span className="text-muted-foreground">Market Segment:</span>{' '}
              {company.marketSegment || 'Not available'}
            </div>
            <div>
              <span className="text-muted-foreground">Business Model:</span>{' '}
              {company.businessModel || 'Not available'}
            </div>
            <div>
              <span className="text-muted-foreground">Tier Level:</span>{' '}
              {company.tierLevel || 'Not available'}
            </div>
          </CardContent>
        </Card>

        {/* Created & Updated */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Record Details</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Created:</span>{' '}
              {new Date(company.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>{' '}
              {new Date(company.updatedAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
