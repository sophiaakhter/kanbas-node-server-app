import * as dao from "./dao.js";
export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
      };
      app.post("/api/users", createUser);
      const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
  
  const findUserById = async (req, res) => { };

  const signup = async (req, res) => {
    const newUser = req.body;
    const existingUser = await dao.findUserByUsername(req.body.username);
    if (existingUser) {
        res.sendStatus(403);
        return;
    } else {
        const insertedUser = await dao.createUser(newUser);
        insertedUser.password = '';
        req.session['profile'] = insertedUser;
        res.json(insertedUser);
    }}
 

  const signin = async (req, res) => {
    const user = req.body;
    const username = user.username;
    const password = user.password;
    const existingUser = await dao.findUserByCredentials(username, password);
    if (existingUser) {
        existingUser.password = '';
        req.session['profile'] = existingUser;
        res.json(existingUser);
    } else {
        res.sendStatus(403);
    }}
 
  const profile = (req, res) =>
   res.json(req.session['profile']);


  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const status = await dao.updateUser(userId, req.body);
    currentUser = await dao.findUserById(userId);
    res.json(status);
  };
  const findAllUsers = async (req, res) => {
    const users = await dao.findAllUsers();
    res.json(users);
  };
  app.get("/api/users", findAllUsers);
  app.post("/api/users", createUser);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
