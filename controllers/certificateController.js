import Certificate from "../models/certificate.js";

const addCertificate = async (req, res) => {
  const { title, category, provider, issueDate, url } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newCertificate = new Certificate({
      user_id: userId,
      title,
      category,
      provider,
      issueDate,
      url,
    });

    await newCertificate.save();
    res.status(201).json(newCertificate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCertificates = async (req, res) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const certificates = await Certificate.find({ user_id: userId });
    res.status(201).json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { addCertificate, getCertificates };