"use strict";

const { DATE } = require("sequelize");
const { hashPassword } = require("../../../utils/hashing");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "User 1",
          email: "user1@gmail.com",
          password: hashPassword("user1"),
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "User 2",
          email: "user2@gmail.com",
          password: hashPassword("user2"),
          status: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "User 3",
          email: "user3@gmail.com",
          password: hashPassword("user3"),
          status: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
