import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  CreatePaymentSchema,
  UpdatePaymentSchema,
} from "../schemas/payment.schema.js";

export async function createPayment(req: Request, res: Response) {
  try {
    const result = CreatePaymentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Dados inválidos",
      });
    }

    const { clientId, serviceIds, price, date, time, description } =
      result.data;

    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: req.user.id,
      },
    });

    if (!client) {
      return res.status(404).json({
        error: "Cliente não encontrado",
      });
    }

    const services = await prisma.service.findMany({
      where: {
        id: {
          in: serviceIds,
        },
        userId: req.user.id,
      },
    });

    /* Se nenhum serviço correspondente foi encontrado. */
    if (services.length === 0) {
      return res.status(404).json({
        error: "Serviços não encontrado",
      });
    }

    /* Se todos os serviços enviados existem e pertencem ao usuário. */
    if (services.length !== serviceIds.length) {
      return res.status(404).json({
        error: "Um ou mais serviços não foram encontrados",
      });
    }

    await prisma.payment.create({
      data: {
        userId: req.user.id,
        clientId: clientId,
        amount: price,
        description: description ?? null,
        date,
        time: time ?? null,

        items: {
          create: services.map((service) => ({
            serviceId: service.id,
            name: service.name,
            price: service.price,
          })),
        },
      },
    });

    return res.status(201).json({
      message: "OS criado com sucesso!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao criar OS",
    });
  }
}

export async function getPayments(req: Request, res: Response) {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        items: true,
        client: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return res.status(200).json({
      payments,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Erro ao carregar as Ordem de Serviço",
    });
  }
}

export async function deletePayment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !id.trim()) {
      return res.status(400).json({
        error: "ID inválido ou não informado",
      });
    }

    const result = await prisma.payment.deleteMany({
      where: {
        userId: req.user.id,
        id,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "OS não encontrado",
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao deletar OS",
    });
  }
}

export async function updatePayment(req: Request, res: Response) {
  try {
    const result = UpdatePaymentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Dados inválidos",
      });
    }

    const { clientId, serviceIds, price, date, time, description } =
      result.data;

    if (clientId !== undefined) {
      const client = await prisma.client.findFirst({
        where: {
          id: clientId,
          userId: req.user.id,
        },
      });

      if (!client) {
        return res.status(404).json({
          error: "Cliente não encontrado",
        });
      }
    }

    const services =
      serviceIds !== undefined
        ? await prisma.service.findMany({
            where: {
              id: {
                in: serviceIds,
              },
              userId: req.user.id,
            },
          })
        : [];

    if (serviceIds !== undefined) {
      if (services.length === 0) {
        return res.status(404).json({
          error: "Serviços não encontrados",
        });
      }

      if (services.length !== serviceIds.length) {
        return res.status(404).json({
          error: "Um ou mais serviços não foram encontrados",
        });
      }
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "ID da Ordem de Serviço inválido",
      });
    }

    const payment = await prisma.payment.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        error: "Ordem de Serviço não encontrada",
      });
    }

    const data = {
      ...(clientId !== undefined && {
        client: {
          connect: {
            id: clientId,
          },
        },
      }),
      ...(price !== undefined && { amount: price }),
      ...(date !== undefined && { date }),
      ...(time !== undefined && { time }),
      ...(description !== undefined && { description }),
    };

    await prisma.$transaction(async (tx) => {
      if (Object.keys(data).length > 0) {
        await tx.payment.update({
          where: {
            id: payment.id,
            userId: req.user.id,
          },
          data,
        });
      }

      if (serviceIds !== undefined) {
        await tx.paymentItem.deleteMany({
          where: {
            paymentId: payment.id,
          },
        });

        await tx.paymentItem.createMany({
          data: services.map((service) => ({
            paymentId: payment.id,
            serviceId: service.id,
            name: service.name,
            price: service.price,
          })),
        });
      }
    });

    return res.status(200).json({
      message: "OS atualizada com sucesso!",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erro ao editar OS",
    });
  }
}
