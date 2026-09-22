import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/toast-utils';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    try {
      const result = await repositories.newsletter.subscribe(data.email);
      if (result.data.success) {
        showToast("Welcome! You're subscribed to our newsletter.", 'success');
        reset();
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-forest" aria-labelledby="newsletter-heading">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <Mail className="h-8 w-8 text-gold" />
          </div>
          <h2 id="newsletter-heading" className="heading-section mb-4 text-ivory">
            Travel notes from the island
          </h2>
          <p className="mb-8 text-ivory/80">
            Seasonal tips, park advisories, and new guides from Lanka Horizons — no booking spam.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Your email address"
                aria-label="Email address"
                className="border-white/20 bg-white/10 text-ivory placeholder:text-ivory/50"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <Button type="submit" variant="secondary" isLoading={isSubmitting} className="shrink-0">
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-ivory/50">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
