// index.js

const express = require("express");
const { PrismaClient } = require("./src/generated/client");

const app = express();
const port = 3000;
const prisma = new PrismaClient({ log: ["query"] });

app.use(express.json());

// Endpoint to get all orders
app.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Example data seeding
async function seedData() {
  const order1 = await prisma.order.create({
    data: {
      order_date: new Date(),
      items: {
        create: [
          {
            quantity: 2,
            product: {
              create: {
                name: "Product A",
                price: 19.99,
              },
            },
          },
          {
            quantity: 1,
            product: {
              create: {
                name: "Product B",
                price: 29.99,
              },
            },
          },
        ],
      },
    },
  });

  console.log("Data seeded successfully:", { order1 });
}

seedData();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
