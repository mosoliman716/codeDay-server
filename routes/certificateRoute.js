import { addCertificate, getCertificates } from "../controllers/certificateController.js";
import express from "express";
import verifyToken from "../configs/verifyToken.js";

const CertificateRouter = express.Router();

CertificateRouter.post("/add", verifyToken, addCertificate);
CertificateRouter.get("/get", verifyToken, getCertificates);


export default CertificateRouter;