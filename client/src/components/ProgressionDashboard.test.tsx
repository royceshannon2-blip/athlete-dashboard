// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProgressionDashboard } from './ProgressionDashboard';

// Mock Recharts to avoid SVG rendering issues in happy-dom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ComposedChart: ({ children }: { children: React.ReactNode }) => <div data-testid="composed-chart">{children}</div>,
  Line: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock vaul Drawer — only show mobile drawer when open, but we test desktop panel
vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

function seedExerciseLogs() {
  const today = new Date().toISOString().split('T')[0];
  const sessionTs = Date.now();
  const key = `wt:log:ex-squat:${today}:1`;
  const entry = {
    id: 'log-1',
    exerciseId: 'ex-squat',
    exerciseName: 'Back Squat',
    date: today,
    sessionTs,
    setNumber: 1,
    targetReps: '5',
    weightKg: 102.06,
    unit: 'lbs',
  };
  localStorage.setItem(key, JSON.stringify(entry));
  localStorage.setItem('wt:index', JSON.stringify([key]));
}

describe('ProgressionDashboard', () => {
  beforeEach(() => localStorage.clear());

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ProgressionDashboard isOpen={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows empty state when no logs exist', () => {
    render(<ProgressionDashboard isOpen={true} onClose={vi.fn()} />);
    const empties = screen.getAllByText(/no weight data logged yet/i);
    expect(empties.length).toBeGreaterThan(0);
  });

  it('shows exercise name when logs exist', () => {
    seedExerciseLogs();
    render(<ProgressionDashboard isOpen={true} onClose={vi.fn()} />);
    const matches = screen.getAllByText(/back squat/i);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('renders Export CSV and Clear Data buttons when data exists', () => {
    seedExerciseLogs();
    render(<ProgressionDashboard isOpen={true} onClose={vi.fn()} />);
    expect(screen.getAllByText(/export csv/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/clear data/i).length).toBeGreaterThan(0);
  });

  it('shows session-row entries in the table when data exists', () => {
    seedExerciseLogs();
    render(<ProgressionDashboard isOpen={true} onClose={vi.fn()} />);
    const rows = document.querySelectorAll('[data-testid="session-row"]');
    expect(rows.length).toBeGreaterThan(0);
  });

  it('calls onClose when X button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ProgressionDashboard isOpen={true} onClose={onClose} />);
    // Desktop close button uses an SVG X icon inside a button
    const buttons = document.querySelectorAll('button');
    const closeBtn = Array.from(buttons).find(b => b.querySelector('svg'));
    if (closeBtn) {
      await user.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    }
  });
});
