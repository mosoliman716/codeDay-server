import Course from "../models/course.js";

const addCourse = async (req, res) => {
  const { title, category, status, platform } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newCourse = new Course({
      user_id: userId,
      title,
      category,
      status,
      platform,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourses = async (req, res) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const courses = await Course.find({ user_id: userId });
    res.status(201).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { addCourse, getCourses };