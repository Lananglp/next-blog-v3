import { initAdminUser } from "@/helper/system-config";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash(initAdminUser.password, 10); // Hash password dummy

  // Cek apakah user sudah ada
  const existingUser = await prisma.user.findUnique({
    where: { 
      email: initAdminUser.email,
      username: initAdminUser.username,
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        name: initAdminUser.name,
        username: initAdminUser.username,
        email: initAdminUser.email,
        password: passwordHash,
        role: UserRole.ADMIN,
        profile: {
          create: {
            bio: initAdminUser.bio,
          }
        }
      },
    });
    console.log("SUCCESS !!!");
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
