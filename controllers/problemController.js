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
  try{
     if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const problems = await Problem.find({user_id: userId});
    res.status(201).json(problems);
  } catch(err){
    res.status(500).json({ message: err.message });
  }
}

export { addProblem, getProblems };
