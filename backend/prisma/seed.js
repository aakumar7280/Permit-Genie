// Seed script — runs after migrations to populate Toronto permits
const { PrismaClient } = require('../src/generated/prisma');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

function generateKeywords(name, description, category) {
  const words = new Set();
  [name, description, category].forEach(text => {
    if (text) {
      text.toLowerCase().split(/\s+/).forEach(w => {
        if (w.length > 2) words.add(w);
      });
    }
  });
  return [...words].join(' ');
}

async function main() {
  const count = await prisma.torontoPermit.count();
  if (count > 0) {
    console.log(`✅ Database already has ${count} permits — skipping seed.`);
    return;
  }

  const csvPath = path.join(__dirname, '../toronto-permits-final-table.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found:', csvPath);
    process.exit(1);
  }

  const permits = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        permits.push({
          csvId: parseInt(row.ID),
          name: row.Name,
          category: row.Category,
          description: row.Description,
          url: row.URL,
          keywords: generateKeywords(row.Name, row.Description, row.Category),
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`📝 Seeding ${permits.length} Toronto permits...`);
  await prisma.torontoPermit.createMany({ data: permits });
  console.log(`✅ Seeded ${permits.length} permits!`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
