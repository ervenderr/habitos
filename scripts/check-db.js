const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database...");
  
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} user(s):`);
  users.forEach((user) => {
    console.log(`- ${user.email} (ID: ${user.id})`);
  });
  
  if (users.length === 0) {
    console.log("\nNo users found. You can create one by logging in.");
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

