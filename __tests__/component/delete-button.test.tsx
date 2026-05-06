import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteButton } from '@/components/DeleteButton';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) })) as jest.Mock;
global.confirm = jest.fn();

describe('DeleteButton', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders delete button', () => {
    render(<DeleteButton id="123" />);
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('shows confirm dialog on click', async () => {
    (global.confirm as jest.Mock).mockReturnValue(false);
    const user = userEvent.setup();

    render(<DeleteButton id="123" />);
    await user.click(screen.getByTitle('Delete'));

    expect(global.confirm).toHaveBeenCalledWith('Delete this expense?');
  });

  it('calls API when confirmed', async () => {
    (global.confirm as jest.Mock).mockReturnValue(true);
    const user = userEvent.setup();

    render(<DeleteButton id="123" />);
    await user.click(screen.getByTitle('Delete'));

    expect(global.fetch).toHaveBeenCalledWith('/api/expenses/123', { method: 'DELETE' });
  });

  it('does not call API when cancelled', async () => {
    (global.confirm as jest.Mock).mockReturnValue(false);
    const user = userEvent.setup();

    render(<DeleteButton id="123" />);
    await user.click(screen.getByTitle('Delete'));

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
