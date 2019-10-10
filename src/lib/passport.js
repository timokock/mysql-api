const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pool = require("../database");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      console.log(req.body);
      const rows = await pool.query("SELECT * FROM users where username = ?", [
        username
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(null, user, req.flash("success", "Welcome " + user.username));
        } else {
          done(
            null,
            false,
            req.flash("message", "*PASSWORD*Username or password not valid")
          );
        }
      } else {
        return done(
          null,
          false,
          req.flash("message", "*USER*Username or password not valid")
        );
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      const { fullname } = req.body;
      const newUser = {
        username,
        password,
        fullname
      };

      newUser.password = await helpers.encryptPassword(password);
      const result = await pool.query("INSERT INTO users SET ?", [newUser]);
      newUser.id = result.insertId;
      return done(null, newUser);
    }
  )
);

// Para guardar el usuario dentro de la sesión
// Cuando serializamos guardamos el id
passport.serializeUser((usr, done) => {
  done(null, usr.id);
});

// Usa el id para tomar los datos almacenados
passport.deserializeUser(async (id, done) => {
  const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  done(null, rows[0]);
});
