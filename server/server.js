const express = require("express");
const server = express();
const path = require("path");
const {checkUsersTable} = require("./utils/fakeDatabase")
const { signToken, authMiddleware } = require('./utils/auth');

// Boilerplate: Middleware to parse JSON fetch body and URL-encoded form data
// Boilerplate: Middleware to respond with static files after page is loaded
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "..", "client", "build")));

// Routes
server.post("/login",  async (req, res) => {
    let {username, password} = req.body;
    let userPasswordFound = checkUsersTable(username,password);
    if(userPasswordFound) {
        const token = signToken({username:"admin"}); // create json web token that can be deciphered into this object {username:...}
        res.json({userPasswordFound, token})
    } else {
        res.json({userPasswordFound:false})
    }
});

server.get("/profile", authMiddleware, async (req, res) => {
    // If authorized, authMiddleware modifies req by storing a req.user the deciphered contents of the object originally passed into signToken
    if(req?.user?.username) {
        res.send("Viewing Profile... Pretend this is your profile information... and that you are still logged in.");
    } else {
        res.send("403 Forbidden. You are not logged in to access your profile page");
    }
});


async function startServer() {
    let port = process.env.PORT || 3001;

    server.listen(port, () => {
        console.log(`Server listening at ${port}`);
    });
}

startServer();