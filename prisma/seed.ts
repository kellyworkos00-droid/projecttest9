import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedExperts() {
  const experts = [
    {
      name: 'Jane Kariuki',
      email: 'jane@example.com',
      phone: '254712345678',
      domain: ['accounting', 'tax'],
      county: 'Nairobi',
      bio: 'Certified public accountant with 8+ years experience helping Kenyan SMEs with bookkeeping, tax planning, and compliance.',
      rateMin: 2500,
      rateMax: 5000,
      rating: 4.8,
      reviewCount: 42,
      verified: true,
      available: true,
    },
    {
      name: 'James Mwangi',
      email: 'james@example.com',
      phone: '254700000000',
      domain: ['legal', 'compliance'],
      county: 'Nairobi',
      bio: 'Corporate lawyer specializing in business registration, contracts, and regulatory compliance for startups and SMEs.',
      rateMin: 3000,
      rateMax: 7000,
      rating: 4.9,
      reviewCount: 58,
      verified: true,
      available: true,
    },
    {
      name: 'Sarah Kipchoge',
      email: 'sarah@example.com',
      phone: '254722000000',
      domain: ['branding', 'marketing'],
      county: 'Nairobi',
      bio: 'Brand strategist helping SMEs build memorable brands and grow on social media and digital channels.',
      rateMin: 2000,
      rateMax: 4000,
      rating: 4.7,
      reviewCount: 35,
      verified: true,
      available: true,
    },
    {
      name: 'Peter Omondi',
      email: 'peter@example.com',
      phone: '254733000000',
      domain: ['tech', 'ecommerce'],
      county: 'Mombasa',
      bio: 'Full-stack developer and e-commerce consultant helping retailers move online and scale digitally.',
      rateMin: 3500,
      rateMax: 8000,
      rating: 4.6,
      reviewCount: 28,
      verified: true,
      available: true,
    },
    {
      name: 'Grace Mutua',
      email: 'grace@example.com',
      phone: '254744000000',
      domain: ['accounting', 'payroll'],
      county: 'Kisumu',
      bio: 'Accountant and payroll specialist with expertise in NSSF, NHIF, and employee benefits management.',
      rateMin: 2000,
      rateMax: 4500,
      rating: 4.8,
      reviewCount: 44,
      verified: true,
      available: true,
    },
  ];

  console.log('🌱 Seeding experts...');

  for (const expert of experts) {
    try {
      const created = await prisma.expert.create({
        data: expert,
      });
      console.log(`✅ Created: ${created.name}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⏭️  ${expert.email} already exists`);
      } else {
        console.error(`❌ Error creating ${expert.name}:`, error.message);
      }
    }
  }

  console.log('✨ Seeding complete!');
  await prisma.$disconnect();
}

seedExperts().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
