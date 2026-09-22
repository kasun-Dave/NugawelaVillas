import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { showToast } from '@/components/ui/toast-utils';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  country: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyPhone: z.string().optional(),
  emergencyRelationship: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => repositories.auth.getProfile(user!.id),
    enabled: !!user,
  });

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone ?? '',
        country: profile.country ?? '',
        emergencyName: profile.emergencyContact?.name ?? '',
        emergencyPhone: profile.emergencyContact?.phone ?? '',
        emergencyRelationship: profile.emergencyContact?.relationship ?? '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (formData: FormData) => {
    if (!user) return;
    const result = await repositories.auth.updateProfile(user.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      country: formData.country,
      emergencyContact: formData.emergencyName
        ? {
            name: formData.emergencyName,
            phone: formData.emergencyPhone ?? '',
            relationship: formData.emergencyRelationship ?? '',
          }
        : undefined,
    });
    if (result.error) {
      showToast(result.error, 'error');
      return;
    }
    showToast('Profile updated', 'success');
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  return (
    <div className="rounded-2xl border border-mist-200 bg-white p-6">
      <h2 className="mb-6 font-serif text-xl font-semibold">Profile Details</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">Email</label>
          <p className="rounded-xl border border-mist-200 bg-mist/30 px-4 py-2.5 text-sm text-charcoal-500">
            {user?.email}
          </p>
        </div>
        <Input label="Phone" type="tel" {...register('phone')} />
        <Input label="Country" {...register('country')} />

        <div>
          <h3 className="mb-3 font-medium text-charcoal">Emergency Contact</h3>
          <div className="space-y-4">
            <Input label="Name" {...register('emergencyName')} />
            <Input label="Phone" type="tel" {...register('emergencyPhone')} />
            <Input label="Relationship" {...register('emergencyRelationship')} />
          </div>
        </div>

        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Save Profile
        </Button>
      </form>
    </div>
  );
}
