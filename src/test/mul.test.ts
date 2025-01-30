import { describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../index";

vi.mock("../db");

describe("tests the multiplication function", () => {
  it("should return 0 when 0 * 1000", async () => {
    const res = await request(app).post("/mul").send({
      a: 1000,
      b: 0,
    });

    expect(res.body.mul).toBe(0);
    expect(res.statusCode).toBe(200);
  });

  it("should return error message, too big no.s", async () => {
    const res = await request(app).post("/mul").send({
      a: 0,
      b: 99999999,
    });

    expect(res.body.message).toBe("inputs are too big");
    expect(res.statusCode).toBe(422);
  });

  it("should return error message, incorrecat inputs", async () => {
    const res = await request(app).post("/mul").send({
      a: "1000",
      b: 0,
    });

    expect(res.body.message).toBe("Incorrect Inputs");
    expect(res.statusCode).toBe(411);
  });
});
