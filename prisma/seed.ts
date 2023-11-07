import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@test.com",
      password: "test",
      role: "ADMIN",
      address: "test address",
      phone: "1234567890",
    },
  });

  // const product = await prisma.product.createMany({
  //   data: [
  //     {
  //       name: "Product 1",
  //       price: 100,
  //       description: "Product 1 description",
  //       images: [
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //       ],
  //     },
  //     {
  //       name: "Product 2",
  //       price: 200,
  //       description: "Product 2 description",
  //       images: [
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //       ],
  //     },
  //     {
  //       name: "Product 3",
  //       price: 300,
  //       description: "Product 3 description",
  //       images: [
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //       ],
  //     },
  //     {
  //       name: "Product 4",
  //       price: 400,
  //       description: "Product 4 description",
  //       images: [
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //         "https://placeimg.com/640/480/any",
  //       ],
  //     },
  //   ],
  // });

  // const category = await prisma.category.createMany({
  //   data: [{ name: "Category 1" }, { name: "Category 2" }],
  // });

  // console.log({ user, product, category });
  const category = await prisma.category.create({
    data: {
      name: "ขายดีประจำสัปดาห์",
      slug: "best-seller",
    },
  });
  const product = await prisma.product.createMany({
    data: [
      {
        name: "เมื่อแมวที่บ้านคุณผันตัวมาเป็นไลฟ์โค้ช (How to Live Like Your Cat)",
        description: "",
        price: 175,
        stock: 100,
        slug: "978616200001",
        images: [
          "http://localhost:4000/assets/Cover_%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%81%E0%B8%A1%E0%B8%A7%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9C%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%A1%E0%B8%B2%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B9%82%E0%B8%84%E0%B9%89%E0%B8%8A_1.jpg",
          "http://localhost:4000/assets/Cover_%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B9%81%E0%B8%A1%E0%B8%A7%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%9C%E0%B8%B1%E0%B8%99%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B8%A1%E0%B8%B2%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B9%84%E0%B8%A5%E0%B8%9F%E0%B9%8C%E0%B9%82%E0%B8%84%E0%B9%89%E0%B8%8A_2.jpg",
        ],
      },
      {
        name: "จิตวิทยาสายดาร์ก",
        description: "",
        price: 250,
        stock: 100,
        slug: "978616200002",
        images: [
          "http://localhost:4000/assets/Cover_จิตวิทยาสายดาร์ก_1.jpg",
          "http://localhost:4000/assets/Cover_จิตวิทยาสายดาร์ก_2.jpg",
        ],
      },
      {
        name: "เทคนิคเลิกคิดเยอะ แล้วทำทันที",
        description: "",
        price: 260,
        stock: 100,
        slug: "978616200003",
        images: [
          "http://localhost:4000/assets/Cover_เทคนิคเลิกคิดเยอะ_แล้วทำทันที_1.jpg",
          "http://localhost:4000/assets/Cover_เทคนิคเลิกคิดเยอะ_แล้วทำทันที_2.jpg",
        ],
      },
      {
        name: "ไม่ได้มีชีวิตอยู่เพื่อหล่อน จะแคร์เพื่อ? (お前のために生きてないから大丈夫です　カマたくの人生ざっくり相談室)",
        description: "",
        price: 215,
        stock: 100,
        slug: "978616200004",
        images: [
          "http://localhost:4000/assets/Cover_ไม่ได้มีชีวิตอยู่เพื่อหล่อน จะแคร์เพื่อ_1.jpeg",
          "http://localhost:4000/assets/Cover_ไม่ได้มีชีวิตอยู่เพื่อหล่อน_จะแคร์เพื่อ_2.jpg",
        ],
      },
    ],
  });
  console.log({ user, product, category });
  console.log("Seeding done!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    throw err;
  });
