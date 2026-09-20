// One-off: sample placeholder products so Paul can preview the category
// pages before his employers send the real product list. Safe to re-run
// (skips categories that already have products). Run with: node scripts/seed-sample-products.js
require('dotenv').config({ path: '.env.local', quiet: true });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SAMPLE_PRODUCTS_BY_SLUG = {
  groceries: [
    { name: 'Rice (5kg)', price: 28000 },
    { name: 'Sugar (2kg)', price: 9000 },
    { name: 'Cooking Oil (2L)', price: 22000 },
    { name: 'Maize Flour (2kg)', price: 7000 },
    { name: 'Salt (1kg)', price: 2000 },
  ],
  beverages: [
    { name: 'Coca-Cola (500ml)', price: 2000 },
    { name: 'Mineral Water (1.5L)', price: 3000 },
    { name: 'Fresh Juice (1L)', price: 8000 },
  ],
  'dairy-products': [
    { name: 'Fresh Milk (1L)', price: 4000 },
    { name: 'Yoghurt (500ml)', price: 6000 },
    { name: 'Cheese (200g)', price: 12000 },
  ],
};

async function main() {
  for (const [slug, products] of Object.entries(SAMPLE_PRODUCTS_BY_SLUG)) {
    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      console.log(`Skipping ${slug} — category not found.`);
      continue;
    }

    const existingCount = await prisma.product.count({ where: { categoryId: category.id } });
    if (existingCount > 0) {
      console.log(`Skipping ${category.name} — already has ${existingCount} product(s).`);
      continue;
    }

    for (const [index, product] of products.entries()) {
      await prisma.product.create({
        data: { ...product, categoryId: category.id, sortOrder: index },
      });
    }
    console.log(`${category.name}: added ${products.length} sample products.`);
  }

  // The Groceries department's real hours, per the owner's employers (2026-09-20).
  await prisma.category.update({
    where: { slug: 'groceries' },
    data: { operatingHours: '8:30 AM - 10:00 PM' },
  });
  console.log('Set Groceries operating hours to 8:30 AM - 10:00 PM.');

  console.log('Sample product seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
