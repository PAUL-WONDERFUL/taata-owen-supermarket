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

async function main() {
  for (const [index, cat] of CATEGORIES.entries()) {
    const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { ...cat, slug, sortOrder: index },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
