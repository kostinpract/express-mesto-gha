const { PORT = 3000 } = process.env;
const { MONGOURI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { SECRET = 'super-strong-secret' } = process.env;
const REGEXPR = /https?:\/\/(www\.)?[-a-zA-Z0-9:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  PORT,
  MONGOURI,
  SECRET,
  REGEXPR,
};
