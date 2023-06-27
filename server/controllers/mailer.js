import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { auth } from "../env.credentials.js";

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: auth.USEREMAIL,
        pass: auth.PASSWORD,
    },
};

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Suman Acharyya",
        link: "https://suman-dev.in/",
    },
});

export const registerMail = async (req, res) => {
    const {
        username,
        userEmail,
        text: { text },
        subject,
    } = req.body;
    // Email body using MailGenerator
    console.log(text, "text", req.body);
    const email = {
        body: {
            name: username,
            intro: text || "Welcome to Suman Acharyya's Email Generator",
            outro: "If any query? Just reply us to this mail, we'd love to help.",
        },
    };

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: auth.USEREMAIL,
        to: userEmail,
        subject: subject || "Successfully signedup",
        html: emailBody,
    };
    transporter
        .sendMail(message)
        .then((resp) => {
            return res.status(200).json({
                success: true,
                message: "Successfully sent the email!",
            });
        })
        .catch((err) => {
            console.log(err, "Error");
            return res.status(500).json({
                success: false,
                message: "Server Error!",
                error: err,
            });
        });
};
