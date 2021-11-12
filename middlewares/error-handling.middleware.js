module.exports = (err, req, res, next) => {
  console.log(err);
  if (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }

  return next();
}