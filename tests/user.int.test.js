import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../configs/db.js";
import app from "../server.js";
import request from "supertest";

dotenv.config();

// use a dedicated test database
process.env.MONGO_URI = "mongodb://localhost:27017/codeday_test";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

afterAll(async () => {
  // drop test database and close connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe("User controller integration", () => {
  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "Password123!",
  };

  test("register sets httpOnly cookie and returns user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send(user)
      .expect(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.includes("token="))).toBeTruthy();
    expect(cookies.some((c) => /httponly/i.test(c))).toBeTruthy();
  });

  test("login sets cookie and allows access to protected route", async () => {
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: user.email, password: user.password })
      .expect(200);
    const cookies = loginRes.headers["set-cookie"];
    expect(cookies).toBeDefined();
    const protectedRes = await request(app)
      .get("/api/tasks/get")
      .set("Cookie", cookies)
      .expect(201);
    expect(Array.isArray(protectedRes.body)).toBe(true);

    // Tasks lifecycle
    const taskPayload = {
      title: "Test Task",
      priority: "High",
      status: "Open",
    };
    const addTaskRes = await request(app)
      .post("/api/tasks/add")
      .set("Cookie", cookies)
      .send(taskPayload)
      .expect(201);
    expect(addTaskRes.body.title).toBe(taskPayload.title);
    const taskId = addTaskRes.body._id;

    const getTasksRes = await request(app)
      .get("/api/tasks/get")
      .set("Cookie", cookies)
      .expect(201);
    expect(getTasksRes.body.find((t) => t._id === taskId)).toBeTruthy();

    const editTaskRes = await request(app)
      .put("/api/tasks/edit")
      .set("Cookie", cookies)
      .send({ _id: taskId, title: "Updated Task" })
      .expect(200);
    expect(editTaskRes.body.title).toBe("Updated Task");

    await request(app)
      .delete("/api/tasks/delete")
      .set("Cookie", cookies)
      .send({ _id: taskId })
      .expect(200);

    // Projects lifecycle
    const projectPayload = {
      title: "Test Project",
      description: "desc",
      technologies: ["js"],
      status: "Active",
    };
    const addProjectRes = await request(app)
      .post("/api/projects/add")
      .set("Cookie", cookies)
      .send(projectPayload)
      .expect(201);
    const projectId = addProjectRes.body._id;

    const getProjectsRes = await request(app)
      .get("/api/projects/get")
      .set("Cookie", cookies)
      .expect(201);
    expect(getProjectsRes.body.find((p) => p._id === projectId)).toBeTruthy();

    const editProjectRes = await request(app)
      .put("/api/projects/edit")
      .set("Cookie", cookies)
      .send({ _id: projectId, title: "Updated Project" })
      .expect(200);
    expect(editProjectRes.body.title).toBe("Updated Project");

    await request(app)
      .delete("/api/projects/delete")
      .set("Cookie", cookies)
      .send({ _id: projectId })
      .expect(200);

    // Problems lifecycle
    const problemPayload = {
      title: "Two Sum",
      status: "Unsolved",
      difficulty: "Easy",
      problem_url: "https://example.com/two-sum",
    };
    const addProblemRes = await request(app)
      .post("/api/problems/add")
      .set("Cookie", cookies)
      .send(problemPayload)
      .expect(201);
    const problemId = addProblemRes.body._id;

    const getProblemsRes = await request(app)
      .get("/api/problems/get")
      .set("Cookie", cookies)
      .expect(201);
    expect(getProblemsRes.body.find((p) => p._id === problemId)).toBeTruthy();

    const editProblemRes = await request(app)
      .put("/api/problems/edit")
      .set("Cookie", cookies)
      .send({ _id: problemId, title: "Updated Problem" })
      .expect(200);
    expect(editProblemRes.body.title).toBe("Updated Problem");

    await request(app)
      .delete("/api/problems/delete")
      .set("Cookie", cookies)
      .send({ _id: problemId })
      .expect(200);
  });
});
