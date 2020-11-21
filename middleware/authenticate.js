import jwt from 'jsonwebtoken'
import config from '../config'

module.exports = (req, res, next) => {
  let errorMsg;
  let errors = {};

  try {
    let token;

    if (req.headers.authorization) {
      token = req.headers.authorization;
    } else {
      token = req.query.authorization;
    }

    token = token.split(' ')[1];
    const decoded = jwt.verify(token, config.JWT_KEY);
    req.userData = decoded;

    next();
  } catch (exception) {
    errorMsg = 'Authentication failed';
    errors.jwt = [errorMsg];
    return res.status(401).json({ errors });
  }
}
