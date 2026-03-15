import bcrypt from "bcrypt";
import * as userModel from "../model/users.js";
import jwt from "jsonwebtoken";

// Authenticates a user and issues a JWT session cookie upon success.
export async function login(req, res) {
    // Ensure both email and password are provided in the request body
    if (!req.body.email || !req.body.password) {
        return res.status(404).json({
            success: false,
            message: "Email and password Can't be empty"
        });
    }

    const email = req.body.email;

    // Verify that the provided password matches the hashed password in the database
    if (await checkPasswordByEmail(email, req.body.password)) {
        // fetch the user's data
        const userData = await userModel.getUserByEmail(email);

        // Create a JSON Web Token containing the user's data
        const token = jwt.sign({ user: userData }, process.env.PRIVATE_KEY, {
            algorithm: "HS256",
            expiresIn: "1 year",
        });

        // Attach the JWT to a cookie
        res.cookie("session", token, {
            expires: new Date(Date.now() + 31556952000), // Expires in 1 year
        });

        res.json({ success: true, token, user: userData });
    } else {
        res.status(401).json({
            success: false,
            message: "Incorrect Email or password",
        });
    }
}

// Validates user input, hashes the password, and creates a new user in the DB.
export async function register(req, res) {
    //  Regular Expression to validate standard email formats
    const regmail =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    // Regular Expression for passwords: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const regpass =
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,]).{8,}$/;

    const email = req.body.email;
    const password = req.body.password;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;

    // Validate Email
    if (email == null || !regmail.test(email)) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email",
        });
    }

    // Validate Password 
    if (password == null || !regpass.test(password)) {
        return res.status(401).json({
            success: false,
            message:
                "Invalid password (minimum 8 characters, one uppercase English letter, one lowercase English letter, one digit and one special character) ",
        });
    }

    // Validate First Name 
    if (firstName == null || firstName.trim().length === 0) {
        return res.status(401).json({
            success: false,
            message: "First name can't be empty",
        });
    }

    // Validate Last Name
    if (lastName == null || lastName.trim().length === 0) {
        return res.status(401).json({
            success: false,
            message: "Last name can't be empty",
        });
    }

    // Hash the valid password 
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Attempt to create the user in the database
    if (await userModel.createUser(email, firstName, lastName, hashedPassword)) {
        // If successful, log them in immediately by generating a token
        const userData = await userModel.getUserByEmail(email);

        const token = jwt.sign({ user: userData }, process.env.PRIVATE_KEY, {
            algorithm: "HS256",
            expiresIn: "1 year",
        });

        res.cookie("session", token, {
            expires: new Date(Date.now() + 31556952000),
        });

        res.json({ success: true, user: userData });
    } else {
        res.status(401).json({
            success: false,
            message: "Email already exist"
        });
    }
}

// Protects routes by requiring a valid JWT via Cookie, Bearer Header, or Body.
export async function auth(req, res, next) {
    // Check for a JWT in the cookies
    const session = req.cookies.session;

    if (session != null) {
        try {
            // Decode the token 
            const data = jwt.verify(session, process.env.PRIVATE_KEY);
            req.user = data.user;
            return next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }

    // Check for a JWT in the Authorization Header 
    if (typeof req.get("Authorization") !== "undefined") {
        const bearer = req.get("Authorization").split(" ")[1];
        if (bearer != null) {
            try {
                const data = jwt.verify(bearer, process.env.PRIVATE_KEY);

                req.user = data.user;
                return next();
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }
        }
    }

    // authentication via raw email/password in the body
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (typeof email !== "undefined" && typeof password !== "undefined") {
            if (await checkPasswordByEmail(email, password)) {
                req.user = await userModel.getUserByEmail(email);
                return next();
            }
        }
    } catch (TypeError) {
        return res.status(401).json({
            message: "You need to be logged in",
        });
    }

    // If all three methods fail, deny access
    return res.status(401).json({
        message: "You need to be logged in",
    });
}

export async function isAdmin(req, res, next) {
    // Check the database to see if the user's `is_admin` flag is true
    const data = await userModel.getIsAdminByEmail(req.user.email)
    if (!data.is_admin) {
        return res.status(403).json({
            message: "You need to be an admin to go further",
        });
    }

    return next();
}

// Invalidates the user's session by deleting the cookie.
export async function logoutUser(req, res) {
    res.clearCookie("session")
    res.json({ success: true })
}


export async function checkPasswordByEmail(email, password) {
    const userPassword = await userModel.getPasswordByEmail(email);
    if (userPassword === null) {
        return false;
    }
    // compare the plaintext string with the stored hash
    return await bcrypt.compare(password, userPassword);
}


export async function getUserByCookie(req, res) {
    const session = req.cookies.session;
    if (session != null) {
        try {
            // If the token is valid, return the decoded user data to the client
            const data = jwt.verify(session, process.env.PRIVATE_KEY);
            res.json(data);
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(404).json({ message: "No cookie" });
    }
}