const config = {
  PORT: process.env.PORT || 3000,
  MONGOURI: process.env.MONGO_URI,
  JWTSECRET: process.env.JWT_SECRET,
  JWTEXPIRESIN: process.env.JWT_EXPIRES_IN,
};
export default config;
