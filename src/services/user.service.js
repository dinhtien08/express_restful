const { User } = require("../models/index");
const { Op } = require("sequelize");
module.exports = {
  getUsers: async ({ _sort, _order, q, _page, _limit }) => {
    const where = {};
    if (q) {
      where[Op.or] = {
        name: {
          [Op.like]: `%${q}%`,
        },
        email: {
          [Op.like]: `%${q}%`,
        },
      };
    }
    const offset = (_page - 1) * _limit;
    const users = await User.findAndCountAll({
      attributes: { exclude: "password" },
      order: [[_sort, _order]],
      where,
      limit: _limit,
      offset,
    });
    return users;
  },
  getUser: async (id) => {
    const user = await User.findByPk(id, {
      attributes: { exclude: "password" },
    });
    return user;
  },
};
