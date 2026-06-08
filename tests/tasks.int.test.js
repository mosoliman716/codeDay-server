import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import app from "../server.js";
import request from "supertest";

dotenv.config();

// dedicated test DB
process.env.MONGO_URI = "mongodb://localhost:27017/codeday_test_tasks";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Tasks controller integration", () => {
  const user = {
    name: "Task User",
    email: `task_${Date.now()}@example.com`,
    password: "Password123!",
  };
  const agent = request.agent(app);

  async function getCsrf() {
    const res = await agent.get("/api/csrf-token").expect(200);
    return res.body.csrfToken;
  }

  test("tasks lifecycle (add/get/edit/delete)", async () => {
    const csrf = await getCsrf();
    await agent
      .post("/api/users/register")
      .set("X-CSRF-Token", csrf)
      .send(user)
      .expect(200);

    const csrf2 = await getCsrf();
    const taskPayload = {
      title: "Test Task",
      priority: "High",
      status: "Open",
    };
    const addRes = await agent
      .post("/api/tasks/add")
      .set("X-CSRF-Token", csrf2)
      .send(taskPayload)
      .expect(201);
    expect(addRes.body.title).toBe(taskPayload.title);
    const taskId = addRes.body._id;

    const getRes = await agent.get("/api/tasks/get").expect(201);
    expect(getRes.body.some((t) => t._id === taskId)).toBeTruthy();

    const editRes = await agent
      .put("/api/tasks/edit")
      .set("X-CSRF-Token", await getCsrf())
      .send({ _id: taskId, title: "Updated Task" })
      .expect(200);
    expect(editRes.body.title).toBe("Updated Task");

    await agent
      .delete("/api/tasks/delete")
      .set("X-CSRF-Token", await getCsrf())
      .send({ _id: taskId })
      .expect(200);
  });
});
