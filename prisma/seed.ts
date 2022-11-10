import {PrismaClient} from "@prisma/client";
import {faker} from "@faker-js/faker";

const prisma = new PrismaClient();

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/[àÀáÁâÂãäÄÅåª]+/g, "a") // Special Characters #1
        .replace(/[èÈéÉêÊëË]+/g, "e") // Special Characters #2
        .replace(/[ìÌíÍîÎïÏ]+/g, "i") // Special Characters #3
        .replace(/[òÒóÓôÔõÕöÖº]+/g, "o") // Special Characters #4
        .replace(/[ùÙúÚûÛüÜ]+/g, "u") // Special Characters #5
        .replace(/[ýÝÿŸ]+/g, "y") // Special Characters #6
        .replace(/[ñÑ]+/g, "n") // Special Characters #7
        .replace(/[çÇ]+/g, "c") // Special Characters #8
        .replace(/[ß]+/g, "ss") // Special Characters #9
        .replace(/[Ææ]+/g, "ae") // Special Characters #10
        .replace(/[Øøœ]+/g, "oe") // Special Characters #11
        .replace(/[%]+/g, "pct") // Special Characters #12
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}

async function main() {
    console.log("seeding");
    for (let i = 0; i < 100; i++) {
        const title = faker.lorem.sentence();
        const content = faker.lorem.paragraphs();
        const slug = slugify(title);

        await prisma.post.create({
            data: {
                title,
                content,
                slug,
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
