const bcrypt = require("bcrypt");

module.exports = {
  hashPassword: (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  },
};
