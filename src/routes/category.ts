import { FastifyInstance, FastifyRequest } from "fastify";

export default async function ProductRoute(fastify: FastifyInstance) {
  // GET ALL PRODUCTS
  fastify.get("/categories", async (request, reply) => {
    const Categorys = await fastify.db.category.findMany({
      orderBy: {
        createdAt: "asc",
      },
      include: {
        product: true,
      },
    });
    reply.status(200).send(Categorys);
  });

  // GET Category BY ID
  fastify.get(
    "/categories/:slug",
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply) => {
      const { slug } = request.params;
      const Category = await fastify.db.category.findFirst({
        where: {
          slug,
        },
        include: {
          product: true,
        },
      });

      reply.status(200).send(Category);
    }
  );

  // CREATE Category
  fastify.post(
    "/categories",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          slug: string;
        };
      }>,
      reply
    ) => {
      const { name, slug } = request.body;
      const Category = await fastify.db.category.create({
        data: {
          name,
          slug,
        },
      });
      reply.status(201).send(Category);
    }
  );

  // UPDATE Category
  fastify.patch(
    "/categories/:id",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
        };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.params;
      const { name } = request.body;
      const Categories = await fastify.db.category.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      reply.status(200).send(Categories);
    }
  );

  // DELETE Category
  fastify.delete(
    "/categories/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      try {
        await fastify.db.category.delete({
          where: {
            id,
          },
        });
        return reply.status(200).send({ message: "Category deleted" });
      } catch (error) {
        return reply.status(500).send({ message: error });
      }
    }
  );
}
