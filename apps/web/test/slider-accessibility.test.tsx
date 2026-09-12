import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { Slider } from '../src/components/ui/slider';
// This test covers naming; jsdom has no layout observer.
beforeEach(() => vi.stubGlobal('ResizeObserver', class {
  observe() {} unobserve() {} disconnect() {}
}));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('names the interactive slider thumb in either interface language', () => {
  const { rerender } = render(<Slider value={[40]} aria-label="图标尺寸" />);
  expect(screen.getByRole('slider', { name:'图标尺寸' }).getAttribute('aria-valuenow')).toBe('40');
  rerender(<Slider value={[40]} aria-label="Icon size" />);
  expect(screen.getByRole('slider', { name:'Icon size' })).toBeTruthy();
});
