// One-off import of Taata Owen Restaurant's real menu (2026-09-17).
// Run with: npm run import-menu
// Safe to re-run: wipes existing MenuCategory/MenuItem/MenuItemVariant rows first.
require('dotenv').config({ path: '.env.local', quiet: true });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const CAKE_VARIANT_LABELS = ['1kg', '2kg', 'Slice'];
const PIZZA_VARIANT_LABELS = ['Medium', 'Large'];

function cakeVariants(oneKg, twoKg, slice) {
  return CAKE_VARIANT_LABELS.map((label, i) => ({ label, price: [oneKg, twoKg, slice][i] }));
}

function pizzaVariants(medium, large) {
  return PIZZA_VARIANT_LABELS.map((label, i) => ({ label, price: [medium, large][i] }));
}

const MENU = [
  {
    name: 'Breakfast',
    items: [
      { name: 'Matooke + Beef', price: 20000 },
      { name: 'Chapati', price: 3000 },
    ],
  },
  {
    name: 'Chicken Combos & Buckets',
    items: [
      { name: 'T1', description: '1 piece of chicken, chips, 330ml Coca-Cola', price: 15000 },
      { name: 'T2', description: '2 pieces of chicken, chips, sauce, 330ml Coca-Cola', price: 20000 },
      { name: 'T3', description: '3 pieces of chicken, chips, sauce, 330ml Coca-Cola', price: 28000 },
      { name: 'T4', description: '4 pieces of chicken, chips, sauce, 330ml Coca-Cola', price: 35000 },
      { name: 'T5', description: '5 pieces of chicken, chips, sauce, 330ml Coca-Cola', price: 45000 },
      { name: '8pc Bucket', description: '8 pieces of chicken + chips & soda', price: 75000 },
      { name: '12pc Bucket', description: '12 pieces of chicken + chips & soda', price: 95000 },
      { name: '15pc Bucket', description: '15 pieces of chicken + chips & soda', price: 111000 },
      { name: 'BBQ Chicken Wings', price: 27000 },
    ],
  },
  {
    name: 'Burgers & Wraps',
    items: [
      { name: 'Kids Burger Combo', description: '2 burgers together', price: 20000 },
      { name: 'Plain Chicken Burger', description: '1 burger', price: 20000 },
      { name: 'Chicken Burger Combo', description: 'Burger, fries and a 300ml soda', price: 30000 },
      { name: 'Plain Wrap', price: 15000 },
      { name: 'Wrap Combo', description: 'Wrap with a 300ml Fanta', price: 20000 },
      { name: 'Premium Fries', price: 10000 },
    ],
  },
  {
    name: 'Pizza',
    items: [
      { name: 'Chicken Royale Pizza', variants: pizzaVariants(25000, 40000) },
      { name: 'Hawaiian Pizza', variants: pizzaVariants(25000, 40000) },
      { name: 'Vegetable Pizza', variants: pizzaVariants(25000, 40000) },
      { name: 'Margherita Pizza', variants: pizzaVariants(25000, 40000) },
      { name: 'Beef Fest Pizza', variants: pizzaVariants(25000, 40000) },
      { name: 'Beef Royale Pizza', variants: pizzaVariants(25000, 40000) },
      { name: 'Extra Mayonnaise', description: 'Pizza add-on', price: 3000 },
      { name: 'Extra Black Olives', description: 'Pizza add-on', price: 3000 },
      { name: 'Extra Cheese', description: 'Pizza add-on', price: 5000 },
      { name: 'Extra Chicken', description: 'Pizza add-on', price: 5000 },
    ],
  },
  {
    name: 'Pilau & Local Dishes',
    items: [
      { name: 'Goat + Pilau', price: 25000 },
      { name: 'Beef + Pilau', price: 20000 },
      { name: 'Chicken + Pilau', price: 20000 },
      { name: 'Liver + Chips', price: 30000 },
      { name: "Goat's Meat + Chips", price: 35000 },
    ],
  },
  {
    name: 'Samosas',
    items: [
      { name: 'Beef Samosa', price: 5000 },
      { name: 'Chicken Samosa', price: 5000 },
      { name: 'Vegetable Samosa', price: 5000 },
      { name: 'Sausage Samosa', price: 4000 },
    ],
  },
  {
    name: 'Muffins',
    items: [
      { name: 'Chocolate Muffin', price: 5000 },
      { name: 'Strawberry Muffin', price: 5000 },
      { name: 'Vanilla Muffin', price: 5000 },
      { name: 'Lemon Muffin', price: 5000 },
      { name: 'Banana Muffin', price: 5000 },
    ],
  },
  {
    name: 'Pies & Rolls',
    items: [
      { name: 'Chicken Pie', price: 8000 },
      { name: 'Beef Pie', price: 8000 },
      { name: 'Chicken Cheese Roll', price: 8000 },
      { name: 'Sausage Roll', price: 5000 },
      { name: 'Chaps', price: 6000 },
      { name: 'Kebab', price: 6000 },
    ],
  },
  {
    name: 'Cakes',
    items: [
      { name: 'Vanilla Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Lemon Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Blueberry Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Mango Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Coffee Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Milk Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Butter Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Coconut Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Banana Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Strawberry Cake', variants: cakeVariants(60000, 85000, 9000) },
      { name: 'Chocolate Fudge Cake', variants: cakeVariants(75000, 95000, 10000) },
      { name: 'Chocolate Cake', variants: cakeVariants(75000, 100000, 12000) },
      { name: 'Oreo Cake', variants: cakeVariants(80000, 120000, 12000) },
      { name: 'Black Forest Cake', variants: cakeVariants(80000, 130000, 12000) },
      { name: 'Red Velvet Cake', variants: cakeVariants(80000, 130000, 12000) },
      { name: 'White Forest Cake', variants: cakeVariants(80000, 130000, 12000) },
      { name: 'Fruit Cake', variants: cakeVariants(90000, 130000, 12000) },
    ],
  },
  {
    name: 'Juice',
    items: [
      { name: 'Mango Juice', price: 10000 },
      { name: 'Passion Juice', price: 10000 },
      { name: 'Orange Juice', price: 12000 },
    ],
  },
  {
    name: 'Milkshakes',
    items: [
      { name: 'Oreo Milkshake', price: 17000 },
      { name: 'Vanilla Milkshake', price: 15000 },
      { name: 'Strawberry Milkshake', price: 15000 },
      { name: 'Chocolate Milkshake', price: 15000 },
    ],
  },
  {
    name: 'Smoothies',
    items: [
      { name: 'Peanut Butter Smoothie', price: 15000 },
      { name: 'Tropical Smoothie', price: 15000 },
      { name: 'Energizer Smoothie', price: 18000 },
    ],
  },
  {
    name: 'Tea & Coffee',
    items: [
      { name: 'African Tea', price: 10000 },
      // NOTE: Paul's list gave two different prices for Black Tea (7000 and
      // 8000) -- using the later value pending his confirmation, flagged separately.
      { name: 'Black Tea', price: 8000 },
      { name: 'Espresso (Single)', price: 5000 },
      { name: 'Espresso (Double)', price: 7000 },
      { name: 'Americano', price: 10000 },
      { name: 'Cappuccino / Latte (Single)', price: 10000 },
      { name: 'Cappuccino / Latte (Double)', price: 10000 },
      // NOTE: given as 1000 -- almost certainly a typo for 10000, flagged separately.
      { name: 'Cafe Mocha', price: 1000 },
      { name: 'Hot Chocolate', price: 10000 },
      { name: 'Dawa Tea', price: 10000 },
    ],
  },
];

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});

  for (const [categoryIndex, category] of MENU.entries()) {
    const menuCategory = await prisma.menuCategory.create({
      data: {
        name: category.name,
        slug: `${slugify(category.name)}-${Date.now().toString(36)}${categoryIndex}`,
        sortOrder: categoryIndex,
      },
    });

    for (const [itemIndex, item] of category.items.entries()) {
      await prisma.menuItem.create({
        data: {
          name: item.name,
          description: item.description || null,
          price: item.variants ? null : item.price,
          categoryId: menuCategory.id,
          sortOrder: itemIndex,
          variants: item.variants
            ? { create: item.variants.map((v, i) => ({ label: v.label, price: v.price, sortOrder: i })) }
            : undefined,
        },
      });
    }

    console.log(`${category.name}: ${category.items.length} items`);
  }

  console.log('Menu import complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
