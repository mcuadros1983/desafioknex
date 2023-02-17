const passport = require("passport");

const renderSignUpForm = (req, res) => {
  const user = req.user;
  if (user) {
    res.render("index", { user });
  } else {
    res.render("auth/signup");
  }
};

const signup = passport.authenticate("register", {
  successRedirect: "/",
  failureRedirect: "/auth/register-error",
});

const failregister = (req, res) => {
  res.render("auth/register-error");
};

const loginForm = (req, res) => {
  const user = req.user;
  if (user) {
    res.render("index", { user });
  } else {
    res.render("auth/login");
  }
};

const login = passport.authenticate("login", {
  successRedirect: "/",
  failureRedirect: "/auth/login-error",
});


const faillogin = (req, res) => {
  res.render("auth/login-error");
};

const renderUserLogout = async (req, res, next) => {
  const user = req.user;
  if (user) {
    await req.logout((err) => {
      if (err) return next(err);
      res.render("auth/logout", { user });
    });
  } else {
    res.redirect("./login");
  }
};

const getLogout = async (req, res, next) => {
  const user = req.user;
  if (user) {
    res.redirect("/");
  } else {
    res.redirect("./login");
  }
};


const checkSession = (req, res) => {
  const name = req.user;
  if (name) {
    return res.status(200).json({
      session: {
        state: true,
        user: name,
      },
      message: `El usuario ${name} ha iniciado sesión antes`,
    });
  }
  res.status(200).json({
    session: {
      state: false,
      user: "",
    },
    message: `No existe una sesión del usuario`,
  });
};

module.exports = {
  renderSignUpForm,
  signup,
  failregister,
  loginForm,
  login,
  faillogin,
  renderUserLogout,
  getLogout,
  checkSession,
};
