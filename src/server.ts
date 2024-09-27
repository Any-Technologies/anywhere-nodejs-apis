import express from "express";
import cors from "cors";
import { MailRoute } from "./modules/mails/mail.route";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/mail", new MailRoute().getRoutes());

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});