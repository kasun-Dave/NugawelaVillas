import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/toast-utils';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from ?? '/account';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await repositories.auth.login(data.email, data.password);
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast('Welcome back!', 'success');
    navigate(from, { replace: true });
  };

  return (
    <div className="section-padding flex min-h-screen items-center justify-center bg-ivory">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="heading-section">Welcome back</h1>
          <p className="text-body mt-2">Sign in to manage your stays and adventures.</p>
        </div>

        <div className="rounded-2xl border border-mist-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="text-forest hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="mt-6 border-t border-mist-200 pt-6 text-center text-sm text-charcoal-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-forest hover:underline">
              Create one
            </Link>
          </div>

          <div className="mt-4 rounded-xl bg-mist/50 p-3 text-xs text-charcoal-500">
            <p className="mb-1 font-medium text-charcoal">Demo accounts</p>
            <p>Guest: guest@nugawela.com / guest123</p>
            <p>Admin: admin@nugawela.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
