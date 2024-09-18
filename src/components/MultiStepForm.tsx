import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Input } from './ui/input';
import DatePicker from './DatePicker';

const formSchema = z.object({
  // username: z
  //   .string()
  //   .min(3, { message: 'Username must be at least 3 characters.' }),
  date: z.date({
    required_error: 'Date is required',
    invalid_type_error: 'Invalid date',
  }),
  email: z.string().email({ message: 'Invalid email address.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
});

function MultiStepForm({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // username: '',
      date: undefined,
      email: '',
      bio: '',
    },
  });

  const nextStep = async () => {
    let isStepValid = true;

    if (step === 1) {
      isStepValid = await form.trigger('date');
    } else if (step === 2) {
      isStepValid = await form.trigger('email');
    } else if (step === 3) {
      isStepValid = await form.trigger('bio');
    }

    if (isStepValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
                      <FormDescription>
                        {/* This is your public display name. */}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 2 && (
              <>
                <DialogHeader>
                  <DialogTitle>Email address</DialogTitle>
                  <DialogDescription>Email</DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === 3 && (
              <>
                <DialogHeader>
                  <DialogTitle>Bio</DialogTitle>
                  <DialogDescription>About you</DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Tell us about yourself"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a short bio about yourself.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Save changes</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default MultiStepForm;
