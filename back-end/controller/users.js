import * as userModel from "../model/users.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function getAllUsers(req, res) {
  const users = await userModel.getAll()
  res.json({ success: true, users });
}

export async function login(req, res) {
  if (bcrypt.compare(req.body.password, userModel.getPasswordByEmail(req.body.email))) {

    const userData = userModel.getUserByEmail()

    const token = jwt.sign({ "user_id": userData["id"] }, process.env.PRIVATE_KEY, { algorithm: 'RS256' }, { expiresIn: "1 year" })

    res.cookie("session", token, { expires: new Date(Date.now() + 31556952000) })

    res.json({ "success": true, token, "user": userData })
  } else {
    res.json({
      "success": false,
      "message": "Incorrect Email or password",
      "error": 401
    })
  }
}

export async function register(req, res) {

  const regmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const regpass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  const email = req.body.email
  const password = req.body.password
  if (!regmail.test(email)) {
    res.json({
      "success": false,
      "message": "Invalid Email",
      "error": 401
    })
  }

  if (!regpass.test(password)) {
    res.json({
      "success": false,
      "message": "Invalid password(minimum 8 characters,one uppercase English letter,one lowercase English letter,one digit and one special character) ",
      "error": 401
    })
  }
  if (userModel.createUser(email, req.body.mail, req.body.first_name, req.body.last_name, bcrypt.hash(req.body.password))) {
    const userData = userModel.getUserByEmail()

    const token = jwt.sign({ "user_id": userData["id"] }, process.env.PRIVATE_KEY, { algorithm: 'RS256' }, { expiresIn: "1 year" })

    res.cookie("session", token, { expires: new Date(Date.now() + 31556952000) })

    res.json({ "success": true, token, "user": userData })
  } else {
    res.json({
      "success": false,
      "message": "Email already exist",
      "error": 401
    })
  }
}

export async function auth(req, res) {
  session = req.cookie.session
  if (session == null) {
    res.json({
      "success": false,
      "message": "Session doesn't exist",
      "error": 401
    })
  }
}