import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    console.log("seeding");
    for (let i = 0; i < 100; i++) {
        await prisma.post.create({
            data: {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraphs(),
                score: i,
                author: {
                    connect: {
                        id: "admin",
                    },
                },
            },
        });
    }
}

main()
    .catch((e) => {
        console.log(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
