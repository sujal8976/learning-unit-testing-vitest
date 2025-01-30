import { it, describe, expect, vi } from "vitest";
import { app } from "../index";
import request from "supertest";
import { prisma } from "../__mocks__/db";

vi.mock("../db");

describe("tests the sum function", () => {
  it("should return 3 when 1 + 2", async () => {
    prisma.request.create.mockResolvedValue({
      id: 1,
      answer: 3,
      type: "Sum",
      a: 1,
      b: 1,
    });

    vi.spyOn(prisma.request, "create");

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2,
    });

    expect(prisma.request.create).toHaveBeenCalledWith({
      data: { a: 1, b: 2, type: "Sum", answer: 3 },
    });
    expect(prisma.request.create).toHaveBeenCalledOnce();
    expect(res.body.sum).toBe(3);
    expect(res.body.id).toBe(1);
    expect(res.statusCode).toBe(200);
  });

  it("should return error message, too big no.s", async () => {
    const res = await request(app).post("/sum").send({
      a: 99999999,
      b: 0,
    });

    expect(res.body.message).toBe("inputs are too big");
    expect(res.statusCode).toBe(422);
  });

  it("should return error message, incorrect inputs", async () => {
    const res = await request(app).post("/sum").send({
      a: "1000",
      b: 0,
    });

    expect(res.body.message).toBe("Incorrect Inputs");
    expect(res.statusCode).toBe(411);
  });
});
