module.exports = (role = 'regular') => {
  return (req, res, next) => {
    // Dummy auth
    let id = req.headers["authorization"] || '1';

    if (role === 'admin' && id !== '0') {
      return res.status(401);
    } 

    req.authInfo = {
      id: id,
      username: `user${id}`
    }

    return next();
  }
}