import nodemailer from "nodemailer";
import mailgen from "mailgen";

let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD,
    },
};

let transporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new mailgen({
    theme: "default",
    product: {
        name: "Mailgen Product Name",
        link: "https://suman-dev.in",
    },
});

export const registerMail = (req, res) => {
    const { username, userEmail, text, subject } = req.body;
    // Email body using MailGenerator
    var email = {
        body: {
            name: username,
            intro: text || "Welcome to Suman Acharyya's Email Generator",
            outro: "If any query? Just reply us to this mail, we'd love to help.",
        },
    };

    var emailBody = mailGenerator.generate(email);

    let message = {
        from: process.env.USERNAME,
        to: userEmail,
        subject: subject || "Successfully signedup",
        html: emailBody,
    };
    transporter
        .sendMail(message)
        .then((resp) => {
            return res.status(200).json({
                success: true,
                message: "Server Error!",
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: "Server Error!",
                error: err,
            });
        });
};
