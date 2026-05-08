/**
 * @jest-environment node
 */
import { ExpenseService } from '@/modules/expense/expense.service';

// No jest.mock needed — just pass a fake repository
const mockRepo = {
  findAll: jest.fn(),
  count: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = new ExpenseService(mockRepo as any);

describe('ExpenseService (DI)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('findAll returns paginated results', async () => {
    const mockExpenses = [{ id: '1', item: 'Coffee', price: 5, date: new Date(), createdAt: new Date(), category: { id: 'c1', name: 'Food' } }];
    mockRepo.findAll.mockResolvedValue(mockExpenses);
    mockRepo.count.mockResolvedValue(1);

    const result = await service.findAll('', '', 1, 10);

    expect(result.expenses).toEqual(mockExpenses);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('findById throws NotFoundException when not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(service.findById('999')).rejects.toThrow('Expense 999 not found');
  });

  it('create validates and delegates to repo', async () => {
    const input = { item: 'Tea', price: 3, date: '2026-05-08T00:00:00.000Z', categoryId: '00000000-0000-0000-0000-000000000001' };
    const created = { id: '2', ...input, createdAt: new Date(), category: { id: input.categoryId, name: 'Food' } };
    mockRepo.create.mockResolvedValue(created);

    const result = await service.create(input);

    expect(mockRepo.create).toHaveBeenCalledWith(input);
    expect(result.id).toBe('2');
  });

  it('create rejects invalid data', async () => {
    await expect(service.create({ item: '' })).rejects.toThrow();
  });
});
