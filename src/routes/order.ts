import { Product } from "@prisma/client";
import { FastifyInstance, FastifyRequest } from "fastify";

type User = {
  id: string;
  iat: number;
  exp: number;
};

export default async function OrderRoute(fastify: FastifyInstance) {
  fastify.get(
    "/orders",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply
    ) => {
      const { id } = request.user as User;
      const user = await fastify.db.user.findUnique({
        where: {
          id,
        },
      });
      if (user?.role === "ADMIN") {
        const orders = await fastify.db.order.findMany({
          include: {
            user: true,
            orderDetail: true,
          },
        });
        return reply.status(200).send(orders);
      }
      const orders = await fastify.db.order.findMany({
        where: {
          userId: id,
        },
        include: {
          orderDetail: true,
        },
      });
      return reply.status(200).send(orders);
    }
  );

  fastify.get(
    "/orders/:orderId",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Headers: { authorization: string };
        Params: { orderId: string };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const { orderId } = request.params;
      const user = await fastify.db.user.findUnique({
        where: {
          id,
        },
      });
      if (user?.role !== "admin")
        return reply.status(403).send({ message: "You are not admin" });

      const orders = await fastify.db.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          user: true,
          orderDetail: true,
        },
      });
      return reply.status(200).send(orders);
    }
  );

  fastify.post(
    "/orders",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Headers: { authorization: string };
        Body: { product: Product[]; quantity: number };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const { product, quantity } = request.body;
      const user = await fastify.db.user.findUnique({
        where: { id },
      });

      if (!user) return reply.status(404).send({ message: "User not found" });

      const orders = await fastify.db.order.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          orderDetail: {
            create: {
              product: {
                connect: {
                  id: product[0].id,
                },
              },
              quantity,
            },
          },
        },
      });

      return reply.status(201).send(orders);
    }
  );

  fastify.patch(
    "/orders/:orderId",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { orderId: string };
        Body: { product: Product[]; quantity: number };
        Headers: { authorization: string };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const { orderId } = request.params;
      const { product, quantity } = request.body;
      const user = await fastify.db.user.findUnique({
        where: { id },
      });

      if (!user) return reply.status(404).send({ message: "User not found" });

      const orders = await fastify.db.orderDetail.update({
        where: {
          orderId: orderId,
        },
        data: {
          product: {
            connect: {
              id: product[0].id,
            },
          },
          quantity,
        },
      });

      return reply.status(200).send(orders);
    }
  );

  fastify.delete(
    "/orders/:orderId",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Params: { orderId: string };
        Headers: { authorization: string };
      }>,
      reply
    ) => {
      const { id } = request.user as User;
      const { orderId } = request.params;
      const user = await fastify.db.user.findUnique({
        where: { id },
      });

      if (!user) return reply.status(404).send({ message: "User not found" });

      await fastify.db.order.delete({
        where: {
          id: orderId,
        },
      });
      return reply.status(200).send({ message: "Order deleted" });
    }
  );
}
