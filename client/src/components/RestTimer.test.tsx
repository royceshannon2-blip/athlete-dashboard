// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RestTimer } from './RestTimer';

const defaultProps = {
  remaining: 120_000,
  isRunning: false,
  isFinished: false,
  duration: 120_000,
  onStart: vi.fn(),
  onPause: vi.fn(),
  onReset: vi.fn(),
  onNudge: vi.fn(),
  onOpenSettings: vi.fn(),
};

describe('RestTimer', () => {
  it('renders formatted time display', () => {
    render(<RestTimer {...defaultProps} remaining={90_000} />);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('1:30');
  });

  it('formats 2 minutes correctly', () => {
    render(<RestTimer {...defaultProps} />);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('2:00');
  });

  it('formats zero as 0:00', () => {
    render(<RestTimer {...defaultProps} remaining={0} />);
    expect(screen.getByTestId('timer-display')).toHaveTextContent('0:00');
  });

  it('shows play button when not running', () => {
    render(<RestTimer {...defaultProps} isRunning={false} />);
    expect(screen.getByTitle('Play')).toBeInTheDocument();
  });

  it('shows pause button when running', () => {
    render(<RestTimer {...defaultProps} isRunning={true} />);
    expect(screen.getByTitle('Pause')).toBeInTheDocument();
  });

  it('calls onStart when play button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<RestTimer {...defaultProps} isRunning={false} onStart={onStart} />);
    await user.click(screen.getByTitle('Play'));
    expect(onStart).toHaveBeenCalled();
  });

  it('calls onPause when pause button is clicked', async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();
    render(<RestTimer {...defaultProps} isRunning={true} onPause={onPause} />);
    await user.click(screen.getByTitle('Pause'));
    expect(onPause).toHaveBeenCalled();
  });

  it('calls onReset when reset button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<RestTimer {...defaultProps} onReset={onReset} isRunning={true} />);
    await user.click(screen.getByTitle('Reset'));
    expect(onReset).toHaveBeenCalled();
  });

  it('calls onNudge with +30000 when +30s button is clicked', async () => {
    const user = userEvent.setup();
    const onNudge = vi.fn();
    render(<RestTimer {...defaultProps} onNudge={onNudge} isRunning={true} />);
    await user.click(screen.getByTitle('+30s'));
    expect(onNudge).toHaveBeenCalledWith(30_000);
  });

  it('calls onNudge with -30000 when −30s button is clicked', async () => {
    const user = userEvent.setup();
    const onNudge = vi.fn();
    render(<RestTimer {...defaultProps} onNudge={onNudge} isRunning={true} />);
    await user.click(screen.getByTitle('−30s'));
    expect(onNudge).toHaveBeenCalledWith(-30_000);
  });

  it('calls onOpenSettings when settings button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenSettings = vi.fn();
    render(<RestTimer {...defaultProps} onOpenSettings={onOpenSettings} isRunning={true} />);
    await user.click(screen.getByTestId('timer-settings-button'));
    expect(onOpenSettings).toHaveBeenCalled();
  });

  it('shows running indicator only when running', () => {
    const { rerender } = render(<RestTimer {...defaultProps} isRunning={false} />);
    expect(screen.queryByTestId('timer-running-indicator')).toBeNull();

    rerender(<RestTimer {...defaultProps} isRunning={true} />);
    expect(screen.getByTestId('timer-running-indicator')).toBeInTheDocument();
  });

  it('timer container has data-testid="rest-timer"', () => {
    render(<RestTimer {...defaultProps} isRunning={true} />);
    expect(screen.getByTestId('rest-timer')).toBeInTheDocument();
  });
});
