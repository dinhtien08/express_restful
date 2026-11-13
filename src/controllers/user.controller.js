const { getUsers, getUser, createUser } = require("../services/user.service");
const { successResponse, errorResponse } = require("../utils/response");
const { object, string } = require("yup");
const { hashPassword } = require("../utils/hashing");
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
  store: async (req, res) => {
    try {
      const schema = object({
        name: string().required(),
        email: string()
          .email()
          .required()
          .test("check-unique", "Email is already in use", async (value) => {
            const email = await getUser(value, "email");
            return !email;
          }),
        password: string().required(),
        status: string().test("check-status", "Invalid status", (value) => {
          return value === "true" || value === "false";
        }),
      });
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      body.password = hashPassword(body.password);
      const user = await createUser(body);
      return successResponse({
        res,
        status: 201,
        data: user,
        message: "User created",
      });
    } catch (error) {
      let errors = null;
      let status = error.status;
      let message = "Failed to create user";
      if (error.inner) {
        errors = Object.fromEntries(
          error.inner.map((err) => [err.path, err.message]),
        );
        status = 400;
        message = "Validation failed";
      }
      return errorResponse({
        res,
        error: errors ? errors : error.message,
        message,
        status: status || 500,
      });
    }
  },
};
