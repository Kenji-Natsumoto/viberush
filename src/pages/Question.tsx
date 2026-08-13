import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Zap, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const CHOICES = [
  { value: 'confirmed', label: 'Confirmed — I talked to users first' },
  { value: 'assumed', label: 'Assumed — I shipped on instinct' },
  { value: 'mix', label: 'Honestly, a mix of both' },
] as const;

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const questionSchema = z.object({
  shippedKind: z.enum(['confirmed', 'assumed', 'mix'], {
    required_error: 'Pick one — it takes a second.',
  }),
  story: z.string().max(5000, 'That is longer than we can store — trim it a little?').optional(),
  shippedUrl: z
    .string()
    .optional()
    .refine((v) => !v || !v.trim() || isHttpUrl(v.trim()), {
      message: 'Please use a full link, starting with http:// or https://',
    }),
  handle: z.string().max(120).optional(),
  // Honeypot. Real people never see this field, so anything in it is a bot.
  website: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

/** sessionStorage throws in some privacy modes — never let that break a submit. */
const readSession = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const clean = (value?: string) => {
  const trimmed = (value ?? '').trim();
  return trimmed === '' ? null : trimmed;
};

export default function Question() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'What actually moved? — VibeRush';
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = async (data: QuestionFormData) => {
    // Bots fill every field they can see. Show them the same thank-you screen
    // a human gets, but store nothing.
    if (clean(data.website)) {
      setIsSent(true);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from('question_responses').insert({
        shipped_kind: data.shippedKind,
        story: clean(data.story),
        shipped_url: clean(data.shippedUrl),
        handle: clean(data.handle),
        // Captured site-wide by useUTMCapture (see components/UTMCapture).
        // Tells us which post this answer came from.
        utm_source: readSession('vr_utm_source'),
        utm_campaign: readSession('vr_utm_campaign'),
        user_agent: navigator.userAgent,
      });

      if (error) throw error;
      setIsSent(true);
    } catch (err) {
      console.error('[Question] submit failed:', err);
      // Keep every value the user typed. Losing a written answer to a failed
      // request is the one thing we cannot ask them to redo.
      toast({
        variant: 'destructive',
        title: 'Something broke on our end.',
        description: 'Mind trying once more? Your answer is still here.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">VibeRush</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-12 md:py-20">
        <Card className="w-full max-w-2xl mx-auto">
          {isSent ? (
            <CardContent className="py-16 text-center space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Thanks — genuinely.
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                If you left your handle, we might reach out to hear the rest of the story.
              </p>
              <div className="pt-4">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
                >
                  See what other builders are shipping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">What actually moved?</CardTitle>
                <CardDescription className="text-base">
                  One question from this week's Builder's Issue. Takes 60 seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-foreground mb-3">
                      Think about the last thing you shipped. Did it solve a confirmed problem, or
                      an assumed one?
                    </legend>
                    <Controller
                      name="shippedKind"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          {CHOICES.map((choice) => (
                            <div
                              key={choice.value}
                              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:border-primary/50 transition-colors"
                            >
                              <RadioGroupItem value={choice.value} id={choice.value} />
                              <Label
                                htmlFor={choice.value}
                                className="font-normal cursor-pointer flex-1"
                              >
                                {choice.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    />
                    {errors.shippedKind && (
                      <p className="text-sm text-destructive">{errors.shippedKind.message}</p>
                    )}
                  </fieldset>

                  <div className="space-y-2">
                    <Label htmlFor="story">
                      What's the story? What did you ship, and what actually moved?
                    </Label>
                    <Textarea id="story" rows={5} {...register('story')} />
                    {errors.story && (
                      <p className="text-sm text-destructive">{errors.story.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippedUrl">Link to what you shipped</Label>
                    <Input id="shippedUrl" placeholder="https://" {...register('shippedUrl')} />
                    {errors.shippedUrl && (
                      <p className="text-sm text-destructive">{errors.shippedUrl.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handle">
                      Your name / handle — if you'd like a shout-out or a chat
                    </Label>
                    <Input id="handle" {...register('handle')} />
                  </div>

                  {/* Honeypot — hidden from people, irresistible to bots. */}
                  <div className="sr-only" aria-hidden="true">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" tabIndex={-1} autoComplete="off" {...register('website')} />
                  </div>

                  <Button type="submit" size="lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send it
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
