import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by"); // less hackers know about your stack

const PORT = 8080;

// Routes

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to HOME!",
    });
});

// Start server only when we have valid connection
connect()
    .then(() => {
        try {
            // Server Listen
            app.listen(PORT, (err) => {
                console.log(
                    `App listening at port --> http://localhost:${PORT}`
                );
            });
        } catch (error) {
            console.log("Error while start the server!");
        }
    })
    .catch((err) => {
        console.log("Error while connect to database!", err);
    });
