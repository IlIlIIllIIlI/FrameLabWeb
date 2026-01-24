import * as userModel from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function getAllUsers(req, res) {
  const users = await userModel.getAll();
  res.json({ success: true, users });
}

export async function checkPasswordByEmail(email, password) {
  const userPassword = await userModel.getPasswordByEmail(email);
  if (userPassword === null) {
    return false;
  }
  return await bcrypt.compare(password, userPassword);
}

export async function login(req, res) {
  const email = req.body.email;
  if (await checkPasswordByEmail(email, req.body.password)) {
    const userData = userModel.getUserByEmail(email);
    const token = jwt.sign({ user: userData }, process.env.PRIVATE_KEY, {
      algorithm: "HS256",
      expiresIn: "1 year",
    });
    res.cookie("session", token, {
      expires: new Date(Date.now() + 31556952000),
    });

    res.json({ success: true, token, user: userData });
  } else {
    res.json({
      success: false,
      message: "Incorrect Email or password",
      error: 401,
    });
  }
}

export async function register(req, res) {
  const regmail =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const regpass =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const email = req.body.email;
  const password = req.body.password;
  const lastName = req.body.lastName;
  const firstName = req.body.firstName;

  if (email == null || !regmail.test(email)) {
    return res.json({
      success: false,
      message: "Invalid Email",
      error: 401,
    });
  }

  if (password == null || !regpass.test(password)) {
    return res.json({
      success: false,
      message:
        "Invalid password (minimum 8 characters, one uppercase English letter, one lowercase English letter, one digit and one special character) ",
      error: 401,
    });
  }

  if (firstName == null || firstName.trim().length === 0) {
    return res.json({
      success: false,
      message: "First name can't be empty",
      error: 401,
    });
  }

  if (lastName == null || lastName.trim().length === 0) {
    return res.json({
      success: false,
      message: "Last name can't be empty",
      error: 401,
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (await userModel.createUser(email, firstName, lastName, hashedPassword)) {
    const userData = userModel.getUserByEmail(email);

    const token = jwt.sign({ user: userData }, process.env.PRIVATE_KEY, {
      algorithm: "HS256",
      expiresIn: "1 year",
    });

    res.cookie("session", token, {
      expires: new Date(Date.now() + 31556952000),
    });

    res.json({ success: true, token, user: userData });
  } else {
    res.json({
      success: false,
      message: "Email already exist",
      error: 401,
    });
  }
}

export async function auth(req, res, next) {
  session = req.cookie.session;

  if (session != null) {
    const data = jwt.verify(session, process.env.PRIVATE_KEY);

    req.user = data.user;
    next();
  }

  bearer = req.get("Authorization").split(" ")[2];
  if (bearer != null) {
    const data = jwt.verify(bearer, process.env.PRIVATE_KEY);

    req.user = data.user;
    next();
  }

  email = req.body.email;
  password = req.body.password;
  if (typeof email !== "undefined" && typeof password !== "undefined") {
    if (checkPasswordByEmail(email, password)) {
      req.user = userModel.getUserByEmail(email);
      next();
    }
  }
  res.error(401);
}

export async function isAdmin(req, res) {
  if (!req.user.is_admin) {
    res.error(403);
  }
}
