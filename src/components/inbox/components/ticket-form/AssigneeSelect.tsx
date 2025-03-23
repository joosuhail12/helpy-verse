
import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AssigneeOption } from './types';

interface AssigneeSelectProps {
  value?: AssigneeOption | null;
  onChange: (value: AssigneeOption | null) => void;
  selectedAssignee?: AssigneeOption | null;
  onSelectAssignee?: (value: AssigneeOption | null) => void;
}

const AssigneeSelect = ({ value, onChange, selectedAssignee, onSelectAssignee }: AssigneeSelectProps) => {
  // Handle both prop patterns
  const actualValue = value || selectedAssignee;
  const handleChange = (valueId: string) => {
    if (valueId === 'none') {
      if (onChange) onChange(null);
      if (onSelectAssignee) onSelectAssignee(null);
      return;
    }

    // In a real app, we'd fetch this from the API
    const newAssignee: AssigneeOption = {
      id: valueId,
      name: valueId === 'self' ? 'Me (Current User)' : 
           valueId === 'team-support' ? 'Support Team' : 
           valueId === 'team-sales' ? 'Sales Team' : 'Agent ' + valueId,
      type: valueId === 'self' ? 'self' : 
           valueId.startsWith('team') ? 'team' : 'teammate',
    };

    if (onChange) onChange(newAssignee);
    if (onSelectAssignee) onSelectAssignee(newAssignee);
  };

  return (
    <Select 
      value={actualValue?.id || 'none'} 
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select assignee">
          {actualValue ? (
            <div className="flex items-center">
              <Avatar className="h-5 w-5 mr-2">
                <AvatarFallback>{actualValue.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{actualValue.name}</span>
            </div>
          ) : (
            "Unassigned"
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">Unassigned</SelectItem>
        <SelectItem value="self">
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <span>Me (Current User)</span>
          </div>
        </SelectItem>
        <SelectItem value="team-support">
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <span>Support Team</span>
          </div>
        </SelectItem>
        <SelectItem value="team-sales">
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <span>Sales Team</span>
          </div>
        </SelectItem>
        <SelectItem value="user1">
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <span>John Smith</span>
          </div>
        </SelectItem>
        <SelectItem value="user2">
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-2">
              <AvatarFallback>S</AvatarFallback>
            </Avatar>
            <span>Sarah Johnson</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AssigneeSelect;
