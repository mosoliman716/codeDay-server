import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import app from "../server.js";
import request from "supertest";

dotenv.config();

process.env.MONGO_URI = "mongodb://localhost:27017/codeday_test_problems";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Problems controller integration", () => {
  const user = {
    name: "Problem User",
    email: `problem_${Date.now()}@example.com`,
    password: "Password123!",
  };
  const agent = request.agent(app);

  async function getCsrf() {
    const res = await agent.get("/api/csrf-token").expect(200);
    return res.body.csrfToken;
  }

  test("problems lifecycle (add/get/edit/delete)", async () => {
    const csrf = await getCsrf();
    await agent
      .post("/api/users/register")
      .set("X-CSRF-Token", csrf)
      .send(user)
      .expect(200);

    const problemPayload = {
      title: "Two Sum",
      status: "Unsolved",
      difficulty: "Easy",
      problem_url: "https://example.com/two-sum",
    };
    const addRes = await agent
      .post("/api/problems/add")
      .set("X-CSRF-Token", await getCsrf())
      .send(problemPayload)
      .expect(201);
    expect(addRes.body.title).toBe(problemPayload.title);
    const problemId = addRes.body._id;

    const getRes = await agent.get("/api/problems/get").expect(201);
    expect(getRes.body.some((p) => p._id === problemId)).toBeTruthy();

    const editRes = await agent
      .put("/api/problems/edit")
      .set("X-CSRF-Token", await getCsrf())
      .send({ _id: problemId, title: "Updated Problem" })
      .expect(200);
    expect(editRes.body.title).toBe("Updated Problem");

    await agent
      .delete("/api/problems/delete")
      .set("X-CSRF-Token", await getCsrf())
      .send({ _id: problemId })
      .expect(200);
  });
});
