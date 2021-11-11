const Validator = require("fastest-validator");
const v = new Validator();

module.exports = (schema = {}) => {
  const check = v.compile(schema);

  return (req, res, next) => {
    const args = { ...req.body, ...req.params, ...req.query };
    const valid = check(args);
    if (valid === true) {
      return next();
    } else {
      return res.status(401).json({
        success: false,
        message: "failed validation",
        data: valid,
      });
    }
  };
};
