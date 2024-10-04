import express from "express";
import cors from "cors";
import { conn } from "./configs/database.config";
import { MailRoute } from "./modules/mails/mail.route";

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
    methods: ["*"],
    allowedHeaders: ["*"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/mail", new MailRoute().getRoutes());

(async () => {
    try {
        await conn();
        app.listen(PORT, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start application:", error);
    }
})();