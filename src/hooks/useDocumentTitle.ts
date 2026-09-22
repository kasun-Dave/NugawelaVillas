import { useEffect } from 'react';

const SITE = 'Lanka Horizons';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Sri Lanka Travel Guide`;
  }, [title]);
}
