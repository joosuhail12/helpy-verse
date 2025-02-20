
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export const BehaviorSettings = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="behavior.queryHandling"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Query Handling</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <label htmlFor="single" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Answer single query and end conversation
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="continuous" id="continuous" />
                  <label htmlFor="continuous" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Continue conversation until resolved
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Determine how the chatbot should handle user queries
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="behavior.postAnswerAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>After Answer Action</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select action after answering" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="continue">Keep conversation open</SelectItem>
                <SelectItem value="close">Close ticket automatically</SelectItem>
                <SelectItem value="handoff">Hand off to human agent</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              What should happen after the chatbot provides an answer
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="behavior.inactivityTimeout"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inactivity Timeout (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="60"
                {...field}
                onChange={e => field.onChange(parseInt(e.target.value))}
              />
            </FormControl>
            <FormDescription>
              Time before marking a chat as inactive (1-60 minutes)
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="behavior.inactivityAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inactive Chat Action</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select action for inactive chats" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="close">Close chat</SelectItem>
                <SelectItem value="handoff">Hand off to human agent</SelectItem>
                <SelectItem value="prompt">Prompt user for response</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              What should happen when a chat becomes inactive
            </FormDescription>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="behavior.enableHumanHandoff"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Human Handoff</FormLabel>
              <FormDescription>
                Allow users to request human assistance
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
