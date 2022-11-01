const passport = require("passport")
const APIError = require("../utils/APIError")
const { MESSAGES } = require("../utils/constants")
const status = require("http-status")

exports.authJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (info)
      return next(new APIError(MESSAGES.TOKEN_NOT_VALID, status.BAD_REQUEST))
    if (!user.isActive)
      return next(new APIError(MESSAGES.ACCOUNT_BLOCKED, status.BAD_REQUEST))
    req.user = user
    next()
  })(req, res, next)
}
