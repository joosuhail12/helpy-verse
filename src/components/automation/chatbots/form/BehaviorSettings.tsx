
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Clock, HandHelping, ArrowRight } from 'lucide-react';

export const BehaviorSettings = () => {
  const form = useFormContext();

  const renderSubSettings = () => (
    <div className="space-y-6 pl-8 mt-4">
      <Card className="border border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRight className="w-5 h-5 text-primary" />
            <h3 className="font-medium">After Answering</h3>
          </div>
          <FormField
            control={form.control}
            name="behavior.postAnswerAction"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">What should happen after the bot responds?</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select what happens after bot responds" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="continue">Keep the conversation going</SelectItem>
                    <SelectItem value="close">End conversation automatically</SelectItem>
                    <SelectItem value="handoff">Transfer to a human agent</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Inactivity Settings</h3>
          </div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="behavior.inactivityTimeout"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">After how long should the chat be marked as inactive?</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="max-w-[120px]"
                      />
                    </FormControl>
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="behavior.inactivityAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">What should happen when inactive?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action for inactive chats" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="close">End the conversation</SelectItem>
                      <SelectItem value="handoff">Transfer to a human agent</SelectItem>
                      <SelectItem value="prompt">Ask if the user needs more help</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-2 border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Conversation Style</h3>
          </div>
          <FormField
            control={form.control}
            name="behavior.queryHandling"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">How should the chatbot handle conversations?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-3"
                  >
                    <div className="space-y-6">
                      <div className="flex items-start gap-2 p-3 rounded-lg border border-muted hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="single" id="single" className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor="single" className="text-sm font-medium block">
                            Answer and close
                          </label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Bot will provide a single answer and end the conversation
                          </p>
                          {field.value === 'single' && renderSubSettings()}
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 rounded-lg border border-muted hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="continuous" id="continuous" className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor="continuous" className="text-sm font-medium block">
                            Continue conversation
                          </label>
                          <p className="text-sm text-muted-foreground mb-4">
                            Bot will maintain an ongoing dialogue until the conversation is complete
                          </p>
                          {field.value === 'continuous' && renderSubSettings()}
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="border-2 border-muted">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <HandHelping className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Human Support</h3>
          </div>
          <FormField
            control={form.control}
            name="behavior.enableHumanHandoff"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow transfer to human agents</FormLabel>
                  <FormDescription>
                    Let users request assistance from a human agent when needed
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
        </CardContent>
      </Card>
    </div>
  );
};
