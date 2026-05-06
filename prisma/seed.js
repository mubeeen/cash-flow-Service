const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.expense.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const food = await prisma.category.create({ data: { name: 'Food' } });
  const transport = await prisma.category.create({ data: { name: 'Transport' } });
  const entertainment = await prisma.category.create({ data: { name: 'Entertainment' } });
  const bills = await prisma.category.create({ data: { name: 'Bills' } });

  // Create expenses
  await prisma.expense.createMany({
    data: [
      { item: 'Coffee', price: 4.50, date: new Date('2026-05-01'), categoryId: food.id },
      { item: 'Lunch', price: 12.00, date: new Date('2026-05-01'), categoryId: food.id },
      { item: 'Groceries', price: 45.80, date: new Date('2026-05-02'), categoryId: food.id },
      { item: 'Bus ticket', price: 2.80, date: new Date('2026-05-01'), categoryId: transport.id },
      { item: 'Taxi', price: 15.00, date: new Date('2026-05-02'), categoryId: transport.id },
      { item: 'Netflix', price: 12.99, date: new Date('2026-05-01'), categoryId: entertainment.id },
      { item: 'Cinema', price: 14.00, date: new Date('2026-05-03'), categoryId: entertainment.id },
      { item: 'Electricity', price: 65.00, date: new Date('2026-05-01'), categoryId: bills.id },
      { item: 'Phone', price: 19.99, date: new Date('2026-05-01'), categoryId: bills.id },
    ],
  });

  console.log('Seeded: 4 categories, 9 expenses');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
