module.exports = (role = 'regular') => {
  return (req, res, next) => {
    // Dummy auth
    let id = req.headers["Authorization"] || '1';

    if (role === 'admin' && id !== '0') {
      return res.status(401);
    } 

    req.authInfo = {
      id: id,
      username: `user${token}`
    }

    return next();
  }
}