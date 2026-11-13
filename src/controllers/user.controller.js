const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/user.service");
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
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const rules = {};
      if (req.body.name) {
        rules.name = string().min(4);
      }
      if (req.body.email) {
        rules.email = string()
          .email()
          .test("check-unique", "Email is already in use", async (value) => {
            const user = await getUser(value, "email");
            return !user || (user && user.id === +id);
          });
      }
      if (req.body.password) {
        rules.password = string().min(6);
        req.body.password = hashPassword(req.body.password);
      }
      if (req.body.status) {
        string().test("check-status", "Invalid status", (value) => {
          return value === "true" || value === "false";
        });
      }
      const schema = object(rules);
      const body = await schema.validate(req.body, {
        abortEarly: false,
      });
      const user = await updateUser(body, id);
      if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
      }
      return successResponse({
        res,
        status: 200,
        data: user,
        message: "User updated",
      });
    } catch (error) {
      let errors = null;
      let status = error.status;
      let message = "Failed to update user";
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
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const status = await deleteUser(id);
      if (!status) {
        throw new Error("Server Error");
      }
      return successResponse({
        res,
        status: 200,
        message: "User deleted",
      });
    } catch (error) {
      return errorResponse({
        res,
        error: error.message,
        message,
      });
    }
  },
};
