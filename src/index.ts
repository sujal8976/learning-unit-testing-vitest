import express from "express";
import { z } from "zod";
import { prisma } from "./db";

export const app = express();

app.use(express.json());

const sumInputs = z.object({
  a: z.number(),
  b: z.number(),
});

app.post("/sum", async (req, res) => {
  const parsedResponse = sumInputs.safeParse(req.body);

  if (!parsedResponse.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }

  const result = parsedResponse.data.a + parsedResponse.data.b;

  if (parsedResponse.data.a > 100000 || parsedResponse.data.b > 100000) {
    res.status(422).json({
      message: "inputs are too big",
    });
    return;
  }

  const request = await prisma.request.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      answer: result,
      type: "Sum",
    },
  });

  res.json({ sum: result, id: request.id });
});

app.post("/mul", async (req, res) => {
  const parsedResponse = sumInputs.safeParse(req.body);

  if (!parsedResponse.success) {
    res.status(411).json({
      message: "Incorrect Inputs",
    });
    return;
  }

  if (parsedResponse.data.a > 100000 || parsedResponse.data.b > 100000) {
    res.status(422).json({
      message: "inputs are too big",
    });
    return;
  }

  const result = parsedResponse.data.a * parsedResponse.data.b;

  await prisma.request.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      answer: result,
      type: "Multiply",
    },
  });

  res.json({ mul: result });
});
