import { useContext } from 'react';
import { PreviewContext } from '../context/PreviewContext';

export function usePreview() {
  const ctx = useContext(PreviewContext);
  if (!ctx) throw new Error('usePreview must be used within a PreviewProvider');
  return ctx;
}
