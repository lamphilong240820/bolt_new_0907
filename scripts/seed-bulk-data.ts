import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting bulk data insertion...');

  const bcrypt = await import('bcryptjs');

  // Create 50 users (customers)
  const users = [];
  for (let i = 1; i <= 50; i++) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    users.push({
      email: `customer${i}@example.com`,
      name: `Customer ${i}`,
      password: hashedPassword,
      role: 'CUSTOMER',
    });
  }

  // Insert users in batches
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('👥 Created 50 users');

  // Get existing categories
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    throw new Error('No categories found. Please run the main seed script first.');
  }

  // Product names and descriptions for variety
  const productTemplates = [
    { name: 'Wireless Headphones', desc: 'High-quality wireless headphones with noise cancellation' },
    { name: 'Smart Watch', desc: 'Advanced smartwatch with health monitoring' },
    { name: 'Laptop Stand', desc: 'Ergonomic laptop stand for better posture' },
    { name: 'Coffee Mug', desc: 'Premium ceramic coffee mug' },
    { name: 'Phone Case', desc: 'Protective phone case with wireless charging support' },
    { name: 'Desk Lamp', desc: 'LED desk lamp with adjustable brightness' },
    { name: 'Bluetooth Speaker', desc: 'Portable Bluetooth speaker with rich sound' },
    { name: 'Keyboard', desc: 'Mechanical keyboard for gaming and typing' },
    { name: 'Mouse Pad', desc: 'Large gaming mouse pad with smooth surface' },
    { name: 'Water Bottle', desc: 'Insulated water bottle keeps drinks cold/hot' },
    { name: 'Backpack', desc: 'Durable backpack for travel and daily use' },
    { name: 'Sunglasses', desc: 'UV protection sunglasses with polarized lenses' },
    { name: 'Fitness Tracker', desc: 'Activity tracker with heart rate monitoring' },
    { name: 'Wireless Charger', desc: 'Fast wireless charging pad for smartphones' },
    { name: 'Tablet Stand', desc: 'Adjustable tablet stand for hands-free viewing' },
    { name: 'Power Bank', desc: 'High-capacity portable power bank' },
    { name: 'Cable Organizer', desc: 'Keep your cables neat and organized' },
    { name: 'Phone Holder', desc: 'Car phone holder with secure grip' },
    { name: 'Notebook', desc: 'Premium notebook for writing and sketching' },
    { name: 'Pen Set', desc: 'Professional pen set for business use' },
  ];

  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Silver', 'Gold'];
  const brands = ['TechPro', 'SmartLife', 'ProGear', 'EliteMax', 'UltraFit', 'PremiumPlus'];

  // Create 200 products
  const products = [];
  for (let i = 1; i <= 200; i++) {
    const template = productTemplates[i % productTemplates.length];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const basePrice = Math.floor(Math.random() * 500) + 20; // $20 - $520
    const hasDiscount = Math.random() > 0.7; // 30% chance of discount
    const comparePrice = hasDiscount ? basePrice + Math.floor(Math.random() * 100) + 20 : null;
    
    const product = {
      name: `${brand} ${template.name} - ${color}`,
      slug: `${brand.toLowerCase()}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase()}-${i}`,
      description: `${template.desc}. Premium quality from ${brand} in ${color} color.`,
      price: basePrice,
      comparePrice,
      sku: `${brand.substring(0, 3).toUpperCase()}-${String(i).padStart(4, '0')}`,
      stock: Math.floor(Math.random() * 100) + 1, // 1-100 stock
      images: [
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      categoryId: category.id,
      featured: Math.random() > 0.9, // 10% chance of being featured
      status: 'ACTIVE',
    };
    
    products.push(product);
  }

  // Insert products in batches
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('🛍️ Created 200 products');

  // Create some orders for the users
  const allUsers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  const allProducts = await prisma.product.findMany();

  for (let i = 1; i <= 100; i++) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];
    const orderProducts = [];
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    
    for (let j = 0; j < numItems; j++) {
      const product = allProducts[Math.floor(Math.random() * allProducts.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      orderProducts.push({
        productId: product.id,
        quantity,
        price: product.price,
      });
    }

    const subtotal = orderProducts.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 50 ? 0 : 9.99;
    const total = subtotal + tax + shipping;

    const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${String(i).padStart(4, '0')}`,
        userId: user.id,
        status,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: {
          firstName: user.name?.split(' ')[0] || 'John',
          lastName: user.name?.split(' ')[1] || 'Doe',
          address1: `${Math.floor(Math.random() * 9999)} Main St`,
          city: 'Sample City',
          state: 'CA',
          postalCode: '90210',
          country: 'US',
        },
        billingAddress: {
          firstName: user.name?.split(' ')[0] || 'John',
          lastName: user.name?.split(' ')[1] || 'Doe',
          address1: `${Math.floor(Math.random() * 9999)} Main St`,
          city: 'Sample City',
          state: 'CA',
          postalCode: '90210',
          country: 'US',
        },
        paymentMethod: 'credit_card',
        orderItems: {
          create: orderProducts,
        },
      },
    });
  }

  console.log('📦 Created 100 orders');

  // Add some reviews
  for (let i = 1; i <= 150; i++) {
    const user = allUsers[Math.floor(Math.random() * allUsers.length)];
    const product = allProducts[Math.floor(Math.random() * allProducts.length)];
    const rating = Math.floor(Math.random() * 5) + 1;
    
    const comments = [
      'Great product! Highly recommended.',
      'Good quality for the price.',
      'Fast shipping and excellent packaging.',
      'Exactly as described. Very satisfied.',
      'Would buy again!',
      'Perfect for my needs.',
      'Excellent customer service.',
      'Good value for money.',
    ];

    try {
      await prisma.review.create({
        data: {
          userId: user.id,
          productId: product.id,
          rating,
          comment: comments[Math.floor(Math.random() * comments.length)],
          verified: Math.random() > 0.3, // 70% verified
        },
      });
    } catch (error) {
      // Skip if review already exists for this user-product combination
      continue;
    }
  }

  console.log('⭐ Created reviews');
  console.log('✅ Bulk data insertion completed!');
}

main()
  .catch((e) => {
    console.error('❌ Bulk seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });