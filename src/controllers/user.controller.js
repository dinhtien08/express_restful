const { getUsers, getUser } = require("../services/user.service");
const { successResponse, errorResponse } = require("../utils/response");
module.exports = {
  index: async (req, res) => {
    try {
      const {
        _sort = "id",
        _order = "ASC",
        q,
        _limit = 2,
        _page = 1,
      } = req.query;
      const { rows: users, count } = await getUsers({
        _sort,
        _order,
        q,
        _page,
        _limit,
      });
      return successResponse({
        res,
        data: users,
        message: "Users fetched successfully",
        meta: { totalRows: count, currentPage: +_page },
      });
    } catch (error) {
      return errorResponse({
        res,
        error: error.message,
        message: "Failed to fetch users ",
      });
    }
  },
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await getUser(id);
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      return successResponse({ res, data: user, message: "User fetched" });
    } catch (error) {
      return errorResponse({
        res,
        error: error.message,
        message: "Failed to fetch user",
        status: error.status || 500,
      });
    }
  },
};
