import { Product } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

export default async function ProductRoute(fastify: FastifyInstance) {
  // GET ALL PRODUCTS
  fastify.get(
    "/products",
    async (
      request: FastifyRequest<{ Querystring: { slug: string } }>,
      reply
    ) => {
      const { slug } = request.query;
      if (slug) {
        const product = await fastify.db.product.findFirstOrThrow({
          where: {
            slug,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });
        return reply.status(200).send(product);
      }

      const products = await fastify.db.product.findMany({
        orderBy: {
          createdAt: "asc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      return reply.status(200).send(products);
    }
  );

  // GET PRODUCT BY ID
  fastify.get(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const product = await fastify.db.product.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      reply.status(200).send(product);
    }
  );

  // CREATE PRODUCT
  fastify.post(
    "/products",
    async (
      request: FastifyRequest<{
        Body: {
          product_type: Product;
          categories_id?: string;
        };
      }>,
      reply
    ) => {
      try {
        const { product_type, categories_id } = request.body;
        if (categories_id) {
          const product = await fastify.db.product.create({
            data: {
              ...product_type,
              category: {
                connect: {
                  id: categories_id,
                },
              },
            },
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

          return reply.status(201).send(product);
        }
        const product = await fastify.db.product.create({
          data: product_type,
        });
        return reply.status(201).send(product);
      } catch (error) {
        reply.status(500).send({ message: error });
      }
    }
  );

  // UPDATE PRODUCT
  fastify.patch(
    "/products/:id",
    async (
      request: FastifyRequest<{
        Body: {
          product_type: Product;
        };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.params;
      const { product_type } = request.body;
      const product = await fastify.db.product.update({
        where: {
          id,
        },
        data: product_type,
      });

      reply.status(200).send(product);
    }
  );

  // DELETE PRODUCT
  fastify.delete(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      await fastify.db.product.delete({
        where: {
          id,
        },
      });
      reply.status(200).send({ message: "Product deleted" });
    }
  );
}
