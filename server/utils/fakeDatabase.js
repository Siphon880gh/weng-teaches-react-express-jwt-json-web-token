module.exports = {
    /**
     * @function checkUsernameAndPassword
     * This is a mock database to demonstrate json web token. You can swap out with Mongo/Mongoose/MySQL/Sequelize
     * As such, the password is plain text and not encrypted like using bcrypt or various other utilities.
     * 
     */
    checkUsersTable: (username, password) =>{
        let user = (function findUser(user) { return username==="admin" })(username);
        return user && (function verifyPassword(password) { return password==="admin"})(password);
    }
}