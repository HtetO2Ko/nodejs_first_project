const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const filePath = "./user-data/users.json";
const users = JSON.parse(fs.readFileSync(filePath));
app.use(express.json());

const getRoute = async (req, res) => {
  return res.status(200).json({
    message: "Server is running",
  });
};

const createUser = async (req, res) => {
  if (req.body.email == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required email",
    });
  } else if (req.body.password == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required pass",
    });
  }
  try {
    const id = uuidv4();
    var email = req.body.email;
    var pass = await bcrypt.hash(req.body.password, 10);
    const newUser = Object.assign({ id: id }, req.body, {
      email: email,
      password: pass,
    });
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      res.status(200).json({
        returncode: "300",
        message: "Success",
        userslist: newUser,
      });
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    res.status(200).json({
      message: "User List",
      returncode: "300",
      total: users.length,
      userslist: users,
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const loginUser = async (req, res) => {
  if (req.body.email == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required email",
    });
  } else if (req.body.password == null) {
    return res.status(200).json({
      returncode: "200",
      message: "required pass",
    });
  }
  try {
    const user = users.find((user) => user.email === req.body.email);
    if (user == undefined) {
      return res.status(200).json({
        returncode: "200",
        message: "User Not Registered",
      });
    }
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (checkPass) {
      return res.status(200).json({
        returncode: "300",
        message: "Login Successfully",
        userlist: user,
      });
    }
    return res.status(200).json({
      returncode: "200",
      message: "Wrong Password",
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    var deleteUser = users.findIndex((user) => user.id === req.body.id);
    if (deleteUser == -1) {
      return res.status(200).json({
        returncode: "200",
        message: "Id not found",
      });
    }
    users.splice(deleteUser, 1);
    fs.writeFile(filePath, JSON.stringify(users), () => {
      res.status(200).json({
        returncode: "300",
        message: "Successfully Deleted",
      });
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

const editUser = async (req, res) => {
  try {
    const user = users.find((user) => user.email === req.body.email);
    if (user == undefined) {
      return res.status(200).json({
        returncode: "200",
        message: "User Not Registered",
      });
    }
    var pass = await bcrypt.hash(req.body.password, 10);
    user.password = pass;
    const editeduser = {
      id: user.id,
      email: user.email,
      password: user.password,
    };
    fs.writeFile(filePath, JSON.stringify(users), () => {
      res.status(200).json({
        returncode: "300",
        message: "Successfully Edited",
        userslist: editeduser,
      });
    });
  } catch (err) {
    return res.status(404).json({
      returncode: "200",
      message: "Error",
    });
  }
};

app.route("/").get(getRoute);
app.route("/user/create").post(createUser);
app.route("/user/getall").get(getUsers);
app.route("/user/login").post(loginUser);
app.route("/user/delete").post(deleteUser);
app.route("/user/edit").post(editUser);

app.listen(3000, () => {
  console.log("Server is running");
});
