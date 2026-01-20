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
    const problem = await Problem.findOne({ _id: problemId, user_id: userId });
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
      _id: problemId,
      user_id: userId,
    });

    if (!problem) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { addProblem, getProblems, editProblem, deleteProblem };