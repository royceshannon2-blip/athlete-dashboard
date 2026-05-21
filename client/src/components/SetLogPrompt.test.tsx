// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SetLogPrompt } from './SetLogPrompt';

// Mock vaul Drawer so it renders as plain divs
vi.mock('@/components/ui/drawer', () => ({
  Drawer: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="drawer-root">{children}</div> : null,
  DrawerContent: ({ children, ...props }: { children: React.ReactNode; [k: string]: unknown }) => (
    <div {...props}>{children}</div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DrawerTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
}));

const openExercise = { id: 'ex-1', name: 'Back Squat' };

function renderPrompt(overrides: Partial<React.ComponentProps<typeof SetLogPrompt>> = {}) {
  const onLog = vi.fn();
  const onSkip = vi.fn();
  render(
    <SetLogPrompt
      exercise={openExercise}
      setNumber={2}
      totalSets={4}
      onLog={onLog}
      onSkip={onSkip}
      {...overrides}
    />
  );
  return { onLog, onSkip };
}

function changeInput(value: string) {
  const input = screen.getByRole('spinbutton');
  act(() => {
    fireEvent.change(input, { target: { value } });
  });
}

describe('SetLogPrompt', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders set number and total sets', () => {
    renderPrompt();
    expect(screen.getByText(/set 2 of 4/i)).toBeInTheDocument();
  });

  it('shows the exercise name in the title', () => {
    renderPrompt();
    expect(screen.getByText(/back squat/i)).toBeInTheDocument();
  });

  it('renders nothing when exercise is null (closed)', () => {
    const { container } = render(
      <SetLogPrompt exercise={null} setNumber={1} totalSets={1} onLog={vi.fn()} onSkip={vi.fn()} />
    );
    expect(container.querySelector('[data-testid="drawer-root"]')).toBeNull();
  });

  it('input has inputmode="decimal" for iOS numeric keyboard', () => {
    renderPrompt();
    expect(screen.getByRole('spinbutton')).toHaveAttribute('inputmode', 'decimal');
  });

  it('calls onLog with the entered weight and unit on submit', async () => {
    const user = userEvent.setup();
    const { onLog } = renderPrompt();
    changeInput('225');
    await user.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).toHaveBeenCalledWith(225, 'lbs');
  });

  it('calls onSkip and does not call onLog when skip is pressed', async () => {
    const user = userEvent.setup();
    const { onLog, onSkip } = renderPrompt();
    await user.click(screen.getByRole('button', { name: /skip/i }));
    expect(onSkip).toHaveBeenCalled();
    expect(onLog).not.toHaveBeenCalled();
  });

  it('rejects negative weight and shows error', async () => {
    const user = userEvent.setup();
    const { onLog } = renderPrompt();
    changeInput('-50');
    await user.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).not.toHaveBeenCalled();
    expect(screen.getByText(/enter a valid weight/i)).toBeInTheDocument();
  });

  it('rejects implausibly large weight (>1000 lbs)', async () => {
    const user = userEvent.setup();
    const { onLog } = renderPrompt();
    changeInput('9999');
    await user.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).not.toHaveBeenCalled();
    expect(screen.getByText(/exceeds maximum/i)).toBeInTheDocument();
  });

  it('both lbs and kg unit buttons are rendered', () => {
    renderPrompt();
    expect(screen.getByRole('button', { name: /^lbs$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^kg$/i })).toBeInTheDocument();
  });

  it('kg unit button changes submission unit', async () => {
    const user = userEvent.setup();
    const { onLog } = renderPrompt();
    await user.click(screen.getByRole('button', { name: /^kg$/i }));
    changeInput('100');
    await user.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).toHaveBeenCalledWith(100, 'kg');
  });

  it('does not call onLog when weight field is empty', async () => {
    const user = userEvent.setup();
    const { onLog } = renderPrompt();
    // Input is empty by default — click Log it without entering anything
    await user.click(screen.getByRole('button', { name: /log it/i }));
    expect(onLog).not.toHaveBeenCalled();
    expect(screen.getByText(/enter a valid weight/i)).toBeInTheDocument();
  });
});
