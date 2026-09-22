import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { repositories } from '@/services/repository-registry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showToast } from '@/components/ui/toast-utils';

export function CodeEntryPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      showToast('Please sign in first', 'error');
      navigate('/login', { state: { from: '/adventure/play' } });
      return;
    }

    setIsLoading(true);
    try {
      const validation = await repositories.adventure.validateCode(code);
      if (!validation.data.valid) {
        showToast('Invalid adventure code. Check your welcome card.', 'error');
        return;
      }
      const result = await repositories.adventure.startAdventure(user.id, code);
      if (result.error) {
        showToast(result.error, 'error');
        return;
      }
      // Update cache immediately — account dashboard may have cached "no progress"
      queryClient.setQueryData(['adventure-progress', user.id], { data: result.data });
      queryClient.invalidateQueries({ queryKey: ['adventure-progress', user.id] });
      queryClient.invalidateQueries({ queryKey: ['adventure-achievements', user.id] });
      showToast('Adventure activated! Let the trail begin.', 'success');
      navigate('/adventure/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="adventure-panel rounded-2xl p-8 shadow-sm">
        <h2 className="mb-2 text-center font-serif text-2xl font-semibold">Enter Adventure Code</h2>
        <p className="mb-6 text-center text-sm text-charcoal-500">
          Find the code on your welcome card from check-in.
        </p>

        {!isAuthenticated ? (
          <div className="space-y-4 text-center">
            <p className="text-body">Sign in to link your adventure to your account.</p>
            <Button asChild className="w-full">
              <Link to="/login" state={{ from: '/adventure/play' }}>
                Sign In
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adventure code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="NEG-TRAIL01"
              className="font-mono uppercase"
            />
            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Begin The Hidden Trail
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-charcoal-400">
          Demo: NEG-TRAIL01 or WELCOME-VALLEY
        </p>
      </div>
    </div>
  );
}
