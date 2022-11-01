require("dotenv").config()
const status = require("http-status")
const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const Users = require("../models/User");
const APIError = require("../utils/APIError")
const { MESSAGES } = require("../utils/constants")

exports.getJwtStrategy = () => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY
  }

  return new JwtStrategy(options, async (jwtPayload, done) => {
    const user = Users.findById(jwtPayload.id)
    //await db[MODELS.ADMIN].findByPk(jwtPayload.id)
    if (!user)
      return done(
        new APIError({
          message: MESSAGES.TOKEN_NOT_FOUND,
          status: status.BAD_REQUEST
        }),
        null
      )

    done(false, user)
  })
}
