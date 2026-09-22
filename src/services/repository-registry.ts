import { isFirebaseMode } from '@/config/data-source';
import { createLocalRepositories } from './local-registry';
import type { Repositories } from './repository-types';

let activeRepositories: Repositories = createLocalRepositories();
let initialized = false;

function getActiveRepositories(): Repositories {
  return activeRepositories;
}

export const repositories: Repositories = new Proxy({} as Repositories, {
  get(_target, prop: string) {
    const repo = getActiveRepositories()[prop as keyof Repositories];
    return repo;
  },
});

export function isDataLayerReady(): boolean {
  return initialized || !isFirebaseMode();
}

export async function initializeDataLayer(): Promise<void> {
  if (initialized) return;

  if (isFirebaseMode()) {
    const { createFirebaseRepositories } = await import('./firebase-adapters/registry');
    const { seedFirestoreIfEmpty } = await import('./firebase/seed');
    const { startFirebaseAuthListener } = await import('./firebase/auth-listener');

    activeRepositories = createFirebaseRepositories();
    await seedFirestoreIfEmpty();
    startFirebaseAuthListener();
  }

  initialized = true;
}

export type { Repositories };
