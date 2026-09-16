require('dotenv').config({ path: '.env.local', quiet: true });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: 'Groceries', description: 'Everyday pantry staples and food items.' },
  { name: 'Beverages', description: 'Soft drinks, juices, water and more.' },
  { name: 'Fresh Produce', description: 'Fresh fruits and vegetables, restocked daily.' },
  { name: 'Bakery', description: 'Bread, cakes and freshly baked goods.' },
  { name: 'Household Items', description: 'Cleaning supplies and home essentials.' },
  { name: 'Personal Care', description: 'Everyday personal care and hygiene products.' },
  { name: 'Baby Products', description: 'Everything for baby, from food to care items.' },
  { name: 'Toiletries', description: 'Bathroom and toiletry essentials.' },
  { name: 'Snacks', description: 'Chips, biscuits, sweets and treats.' },
  { name: 'Dairy Products', description: 'Milk, cheese, yoghurt and more.' },
  { name: 'Meat / Food Items', description: 'Fresh and frozen meat, poultry and fish.' },
];

const MENU_ITEMS = [
  { name: 'Matooke & Groundnut Sauce', category: 'Lunch', description: 'Steamed green banana served with rich groundnut sauce', price: 8000 },
  { name: 'Posho & Beef Stew', category: 'Lunch', description: 'Maize meal served with slow-cooked beef stew', price: 9000 },
  { name: 'Luwombo (Chicken)', category: 'Lunch', description: 'Chicken steamed in banana leaves with vegetables', price: 15000 },
  { name: 'Rice, Beans & Greens', category: 'Lunch', description: 'Steamed rice with beans and seasonal greens', price: 7000 },
  { name: 'Muchomo (Grilled Meat)', category: 'Lunch', description: 'Charcoal-grilled beef or goat skewers', price: 10000 },
  { name: 'Grilled Chicken (Half)', category: 'Lunch', description: 'Marinated and grilled to order', price: 18000 },
  { name: 'Whole Fried Tilapia', category: 'Lunch', description: 'Served with a side of your choice', price: 20000 },
  { name: 'Chapati (Plain)', category: 'Breakfast', description: 'Freshly made, per piece', price: 1500 },
  { name: 'Rolex', category: 'Breakfast', description: 'Chapati rolled with fried egg and vegetables', price: 4000 },
  { name: 'Samosa', category: 'Breakfast', description: 'Beef or vegetable, per piece', price: 1500 },
  { name: 'Fresh Juice', category: 'Drinks', description: 'Passion, mango or watermelon', price: 5000 },
  { name: 'Soda', category: 'Drinks', description: 'Assorted, 300ml', price: 2000 },
  { name: 'Coffee / Tea', category: 'Drinks', description: 'Local blend, served hot', price: 2500 },
];

async function main() {
  for (const [index, cat] of CATEGORIES.entries()) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { ...cat, slug, sortOrder: index },
    });
  }

  const existingMenuCount = await prisma.menuItem.count();
  if (existingMenuCount === 0) {
    for (const [index, item] of MENU_ITEMS.entries()) {
      await prisma.menuItem.create({ data: { ...item, sortOrder: index } });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
