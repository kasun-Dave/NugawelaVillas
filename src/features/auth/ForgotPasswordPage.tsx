import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/toast-utils';
import { Mail } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Valid email required'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    await repositories.auth.requestPasswordReset(data.email);
    showToast('If an account exists, reset instructions have been sent.', 'success');
  };

  return (
    <div className="section-padding flex min-h-screen items-center justify-center bg-ivory">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Mail className="mx-auto mb-4 h-10 w-10 text-forest" />
          <h1 className="heading-section">Reset password</h1>
          <p className="text-body mt-2">
            Enter your email and we&apos;ll send reset instructions. (Mock — no email is sent.)
          </p>
        </div>

        <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-forest hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
