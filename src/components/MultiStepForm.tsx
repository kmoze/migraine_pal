import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { symptomOptions, triggerOptions } from '@/data/formOptions';
import Select from 'react-select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from './ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import DatePicker from './DatePicker';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Toast } from './ui/toast';
import { toast, useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date',
  }),
  pain: z.string(),
  symptoms: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  triggers: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
  duration: z.string(),
});

interface ChildComponentProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getMigraines: () => Promise<void>;
}

function MultiStepForm({
  isOpen,
  onOpenChange,
  getMigraines,
}: ChildComponentProps) {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      pain: undefined,
      symptoms: undefined,
      triggers: undefined,
      duration: undefined,
    },
  });

  const nextStep = async () => {
    let isStepValid = true;

    if (step === 1) {
      isStepValid = await form.trigger('date');
    } else if (step === 2) {
      isStepValid = await form.trigger('pain');
    } else if (step === 3) {
      isStepValid = await form.trigger('symptoms');
    } else if (step === 4) {
      isStepValid = await form.trigger('triggers');
    }

    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    onOpenChange(false);

    let newDate = new Date(data.date);
    const formattedDate = format(newDate, 'yyyy-MM-dd');

    // Transforming the data to array format instead of array of objects
    let symptomsArray = data.symptoms.map((symptom) => symptom.value);
    let triggersArray = data.triggers.map((trigger) => trigger.value);

    let painLevelInteger = Number(data.pain);
    let durationVal = Number(data.duration);

    const migraineData = {
      date: formattedDate,
      symptoms: symptomsArray,
      triggers: triggersArray,
      pain: painLevelInteger,
      duration: durationVal,
    };

    try {
      const { data: insertedData, error } = await supabase
        .from('migraine_logs')
        .insert([migraineData]);

      if (error) {
        console.error('Error inserting data', error.message);
      } else {
        console.log('Data successfully inserted:', insertedData);
      }
      // Re-fetch the migraines to ensure the UI is updated
      await getMigraines();
    } catch (error) {
      console.error('Error during Supabase insert', error);
    }

    form.reset({
      date: undefined,
      pain: undefined,
      symptoms: undefined,
      triggers: undefined,
      duration: undefined,
    });
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] min-h-[250px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <>
                <DialogHeader>
                  <DialogTitle>Date of your migraine</DialogTitle>
                  <DialogDescription>
                    Select the starting date of your migraine attack.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onDateChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <DialogHeader>
                  <DialogTitle>Pain level</DialogTitle>
                  <DialogDescription>
                    How painful is your migraine?
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="pain"
                  render={({ field }) => (
                    <FormItem>
                      <ShadcnSelect
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a pain level from 1 - 10" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="9">9</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </ShadcnSelect>
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
              <>
                <DialogHeader>
                  <DialogTitle>Symptoms</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select your symptoms</FormLabel>
                      <FormControl>
                        <Controller
                          name="symptoms"
                          control={form.control}
                          render={({ field }) => (
                            <div className="w-full">
                              <Select
                                {...field}
                                options={symptomOptions}
                                placeholder="Symptoms"
                                isClearable
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                                isMulti
                              />
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 4 && (
              <>
                <DialogHeader>
                  <DialogTitle>Triggers</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="triggers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select your triggers (if any)</FormLabel>
                      <FormControl>
                        <Controller
                          name="triggers"
                          control={form.control}
                          render={({ field }) => (
                            <div className="w-full">
                              <Select
                                {...field}
                                options={triggerOptions}
                                placeholder="Triggers"
                                isClearable
                                onChange={(value) => field.onChange(value)}
                                value={field.value}
                                isMulti
                              />
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 5 && (
              <>
                <DialogHeader>
                  <DialogTitle>Migraine duration</DialogTitle>
                  <DialogDescription>
                    How long has your migraine lasted?
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <ShadcnSelect
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How long has your migraine lasted?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1h</SelectItem>
                          <SelectItem value="2">2h</SelectItem>
                          <SelectItem value="4">4h</SelectItem>
                          <SelectItem value="6">6h</SelectItem>
                          <SelectItem value="8">8h</SelectItem>
                          <SelectItem value="10">10h</SelectItem>
                          <SelectItem value="15">12h+</SelectItem>
                          <SelectItem value="24">A full day</SelectItem>
                        </SelectContent>
                      </ShadcnSelect>
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter className="sticky bottom-0 pt-4 bg-white">
              {step > 1 && (
                <Button variant="outline" type="button" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 5 && (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
              {step === 5 && (
                <Button
                  type="submit"
                  onClick={() => {
                    toast({
                      title: 'Migraine successfully logged',
                      description: 'We hope you feel better soon!',
                    });
                  }}
                >
                  Log Migraine
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MultiStepForm;
