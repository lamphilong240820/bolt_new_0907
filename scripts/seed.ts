import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Dynamic import for bcryptjs to avoid build issues
  const bcrypt = await import('bcryptjs');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shopflow.com' },
    update: {},
    create: {
      email: 'admin@shopflow.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create a demo customer user
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      name: 'Demo Customer',
      password: await bcrypt.hash('password123', 12),
      role: 'CUSTOMER',
    },
  });

  console.log('👤 Created customer user:', customerUser.email);

  // Create categories
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Latest gadgets and technology',
      image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Trendy clothing and accessories',
      image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Home & Garden',
      slug: 'home',
      description: 'Furniture and home decor',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Sports & Fitness',
      slug: 'sports',
      description: 'Equipment and activewear',
      image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Books',
      slug: 'books',
      description: 'Knowledge and entertainment',
      image: 'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
  }

  console.log('📂 Created categories:', createdCategories.length);

  // Get category IDs safely
  const electronicsCategory = createdCategories.find(c => c.slug === 'electronics');
  const homeCategory = createdCategories.find(c => c.slug === 'home');
  
  if (!electronicsCategory || !homeCategory) {
    throw new Error('Required categories not found');
  }

  // Create sample products
  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      slug: 'wireless-bluetooth-headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life.',
      price: 89.99,
      comparePrice: 119.99,
      sku: 'WBH-001',
      stock: 50,
      images: [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      categoryId: electronicsCategory.id,
      featured: true,
    },
    {
      name: 'Smart Watch Series 5',
      slug: 'smart-watch-series-5',
      description: 'Advanced smartwatch with health monitoring and GPS tracking.',
      price: 299.99,
      comparePrice: 399.99,
      sku: 'SW-005',
      stock: 30,
      images: [
        'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      categoryId: electronicsCategory.id,
      featured: true,
    },
    {
      name: 'Premium Coffee Maker',
      slug: 'premium-coffee-maker',
      description: 'Professional-grade coffee maker for the perfect brew every time.',
      price: 159.99,
      sku: 'PCM-001',
      stock: 25,
      images: [
        'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      categoryId: homeCategory.id,
      featured: false,
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Comfortable office chair with lumbar support and adjustable height.',
      price: 249.99,
      comparePrice: 319.99,
      sku: 'EOC-001',
      stock: 15,
      images: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      ],
      categoryId: homeCategory.id,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log('🛍️ Created products:', products.length);
  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });