module.exports = {
  successResponse: ({
    res,
    data,
    status = 200,
    message = "Success",
    meta = {},
  }) => {
    res.status(status).json({
      success: true,
      data,
      message,
      ...meta,
    });
  },
  errorResponse: ({ res, error, status = 500, message }) => {
    res.status(status).json({
      success: false,
      error,
      message,
    });
  },
};
