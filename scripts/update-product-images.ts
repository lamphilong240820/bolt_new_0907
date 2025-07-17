import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Curated image URLs from Pexels for different product categories
const imagesByCategory = {
  electronics: [
    'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  fashion: [
    'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1464624/pexels-photo-1464624.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  home: [
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1080711/pexels-photo-1080711.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  sports: [
    'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552238/pexels-photo-1552238.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552237/pexels-photo-1552237.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552236/pexels-photo-1552236.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552235/pexels-photo-1552235.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552234/pexels-photo-1552234.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552233/pexels-photo-1552233.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552232/pexels-photo-1552232.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1552231/pexels-photo-1552231.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
  books: [
    'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370297/pexels-photo-1370297.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370299/pexels-photo-1370299.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370300/pexels-photo-1370300.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370301/pexels-photo-1370301.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/1370302/pexels-photo-1370302.jpeg?auto=compress&cs=tinysrgb&w=400',
  ],
};

// Additional generic product images for variety
const genericImages = [
  'https://images.pexels.com/photos/264547/pexels-photo-264547.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/325154/pexels-photo-325154.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/325155/pexels-photo-325155.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/325156/pexels-photo-325156.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/325157/pexels-photo-325157.jpeg?auto=compress&cs=tinysrgb&w=400',
];

function getRandomImages(categorySlug: string, count: number = 2): string[] {
  const categoryImages = imagesByCategory[categorySlug as keyof typeof imagesByCategory] || genericImages;
  const allImages = [...categoryImages, ...genericImages];
  
  // Shuffle and pick unique images
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function main() {
  console.log('🖼️ Starting product images update...');

  try {
    // Get all products with their categories
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    console.log(`📦 Found ${products.length} products to update`);

    let updatedCount = 0;

    // Update each product with unique images
    for (const product of products) {
      const categorySlug = product.category.slug;
      const imageCount = Math.random() > 0.5 ? 2 : 3; // Random 2-3 images per product
      const newImages = getRandomImages(categorySlug, imageCount);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          images: newImages,
        },
      });

      updatedCount++;
      
      // Log progress every 50 products
      if (updatedCount % 50 === 0) {
        console.log(`✅ Updated ${updatedCount}/${products.length} products...`);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} products with unique images!`);
    
    // Show some statistics
    const imageStats = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: {
        id: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log('\n📊 Updated products by category:');
    for (const stat of imageStats) {
      console.log(`   ${stat.category?.name || 'Unknown'}: ${stat._count.id} products`);
    }

  } catch (error) {
    console.error('❌ Error updating product images:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });