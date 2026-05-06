import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExpenseTable } from '@/components/ExpenseTable';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ expenses: mockExpenses, total: 2, page: 1, totalPages: 1 }),
  }),
) as jest.Mock;

const mockExpenses = [
  { id: '1', item: 'Coffee', price: 4.5, date: '2026-05-01', category: { id: 'c1', name: 'Food' } },
  { id: '2', item: 'Bus', price: 2.8, date: '2026-05-02', category: { id: 'c2', name: 'Transport' } },
];

describe('ExpenseTable', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders expense rows', () => {
    render(<ExpenseTable initialExpenses={mockExpenses} categories={['Food', 'Transport']} />);

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('Bus')).toBeInTheDocument();
    expect(screen.getByText('€4.50')).toBeInTheDocument();
    expect(screen.getByText('€2.80')).toBeInTheDocument();
  });

  it('renders category badges', () => {
    render(<ExpenseTable initialExpenses={mockExpenses} categories={['Food', 'Transport']} />);

    expect(screen.getAllByText('Food').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Transport').length).toBeGreaterThan(0);
  });

  it('renders search input', () => {
    render(<ExpenseTable initialExpenses={mockExpenses} categories={['Food', 'Transport']} />);

    expect(screen.getByPlaceholderText('Search expenses...')).toBeInTheDocument();
  });

  it('renders category filter dropdown', () => {
    render(<ExpenseTable initialExpenses={mockExpenses} categories={['Food', 'Transport']} />);

    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('calls API when searching', async () => {
    const user = userEvent.setup();
    render(<ExpenseTable initialExpenses={mockExpenses} categories={['Food', 'Transport']} />);

    const searchInput = screen.getByPlaceholderText('Search expenses...');
    await user.type(searchInput, 'coffee');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('search=coffee'),
    );
  });

  it('shows empty state when no expenses', () => {
    render(<ExpenseTable initialExpenses={[]} categories={[]} />);

    expect(screen.getByText('No expenses yet. Add one!')).toBeInTheDocument();
  });
});
