import Problem from "../models/problem.js";

const addProblem = async (req, res) => {
  const { title, status, difficulty, problem_url } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newProblem = new Problem({
      user_id: userId,
      title,
      status,
      difficulty,
      problem_url,
    });

    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProblems = async (req, res) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const problems = await Problem.find({ user_id: userId });
    res.status(201).json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const editProblem = async (req, res) => {
  const {
    _id: problemId,
    title,
    status,
    difficulty,
    platform,
    problem_url,
  } = req.body;
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const problem = await Problem.findOne({
      _id: { $eq: problemId },
      user_id: userId,
    });
    if (!problem) {
      console.log("Problem not found for editing:", problemId, userId);
      return res.status(404).json({ message: "Problem not found" });
    }
    problem.title = title || problem.title;
    problem.status = status || problem.status;
    problem.difficulty = difficulty || problem.difficulty;
    problem.platform = platform || problem.platform;
    problem.problem_url = problem_url || problem.problem_url;

    await problem.save();
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProblem = async (req, res) => {
  const { _id: problemId } = req.body;
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const problem = await Problem.findOneAndDelete({
      _id: { $eq: problemId },
      user_id: userId,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const syncCodewars = async (req, res) => {
  const { username } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "username is required" });
    }

    const added = [];
    let page = 0;
    const maxPages = 10; // safety cap

    while (page < maxPages) {
      const url = `https://www.codewars.com/api/v1/users/${encodeURIComponent(username)}/code-challenges/completed?page=${page}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        // If user not found or other error, break and return message
        const text = await resp.text();
        return res
          .status(resp.status)
          .json({ message: `Codewars API error: ${text}` });
      }
      const data = await resp.json();
      const challenges = data.data || data; // API shape may vary

      if (!Array.isArray(challenges) || challenges.length === 0) break;

      for (const ch of challenges) {
        // derive fields
        const title = ch.name || ch.slug || ch.id || "Untitled Challenge";
        const kataId =
          ch.id || ch.slug || (ch.completedAt && ch.completedAt.id);
        const problem_url =
          ch.url ||
          (kataId ? `https://www.codewars.com/kata/${kataId}` : undefined) ||
          ch.completedUrl;

        // avoid duplicates by URL or title
        const exists = await Problem.findOne({
          user_id: userId,
          $or: [{ problem_url }, { title }],
        });
        if (exists) continue;

        const newProblem = new Problem({
          user_id: userId,
          title,
          status: "Solved",
          difficulty: ch.rank?.name || ch.difficulty || "Unknown",
          platform: "Codewars",
          problem_url,
        });

        await newProblem.save();
        added.push(newProblem);
      }

      page += 1;
      // if API provides pagination info, we could stop earlier; otherwise loop until empty
    }

    res.status(200).json({ message: "Sync complete", problems: added });
  } catch (err) {
    console.error("syncCodewars error", err);
    res.status(500).json({ message: err.message });
  }
};

export { addProblem, getProblems, editProblem, deleteProblem, syncCodewars };
