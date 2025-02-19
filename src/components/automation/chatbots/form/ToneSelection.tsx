
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type { ChatbotTone } from '@/types/chatbot';

const TONE_OPTIONS: { value: ChatbotTone; label: string }[] = [
  { value: 'friendly', label: 'Friendly' },
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'helpful', label: 'Helpful' },
  { value: 'custom', label: 'Custom' },
];

export const ToneSelection = () => {
  const form = useFormContext();
  const showCustomInstructions = form.watch('tone') === 'custom';

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="tone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tone</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-3 gap-4"
              >
                {TONE_OPTIONS.map((tone) => (
                  <FormItem key={tone.value}>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={tone.value} id={tone.value} />
                        <FormLabel htmlFor={tone.value} className="font-normal">
                          {tone.label}
                        </FormLabel>
                      </div>
                    </FormControl>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showCustomInstructions && (
        <FormField
          control={form.control}
          name="customInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter custom instructions for the chatbot's behavior and tone" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
