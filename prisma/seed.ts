import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("User1234_", 10); // Hash password dummy

  // Cek apakah user sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@admin.com" },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@admin.com",
        password: passwordHash,
        role: "ADMIN",
      },
    });
    console.log("BERHASIL !!!");
  } else {
    console.log("DATA SUDAH ADA.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
