import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import app from "../server.js";
import request from "supertest";

dotenv.config();

process.env.MONGO_URI = "mongodb://localhost:27017/codeday_test_projects";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("Projects controller integration", () => {
  const user = {
    name: "Project User",
    email: `project_${Date.now()}@example.com`,
    password: "Password123!",
  };
  const agent = request.agent(app);

  async function getCsrf() {
    const res = await agent.get("/api/csrf-token").expect(200);
    return res.body.csrfToken;
  }

  test("projects lifecycle (add/get/edit/delete)", async () => {
    const csrf = await getCsrf();
    await agent
      .post("/api/users/register")
      .set("X-CSRF-Token", csrf)
      .send(user)
      .expect(200);

    const projectPayload = {
      title: "Test Project",
      description: "desc",
      technologies: ["js"],
      status: "Active",
    };
    const addRes = await agent
      .post("/api/projects/add")
      .set("X-CSRF-Token", await getCsrf())
      .send(projectPayload)
      .expect(201);
    expect(addRes.body.title).toBe(projectPayload.title);
    const projectId = addRes.body._id;

    const getRes = await agent.get("/api/projects/get").expect(201);
    expect(getRes.body.some((p) => p._id === projectId)).toBeTruthy();

    const editRes = await agent
      .put("/api/projects/edit")
      .set("X-CSRF-Token", await getCsrf())
      .send({ _id: projectId, title: "Updated Project" })
      .expect(200);
    expect(editRes.body.title).toBe("Updated Project");

    await agent
      .delete("/api/projects/delete")
      .set("X-CSRF-Token", await getCsrf())
      .send({ _id: projectId })
      .expect(200);
  });
});
