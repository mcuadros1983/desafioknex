const loginUser = require("../public/js/auth.js");

const renderUserLogout = (req, res) => {
  const user = req.session.name;
  console.log("test2", user);

  if (user) {
    res.render("auth/logout", { user });
    req.session.destroy();

  } else {
    res.redirect("./login");
    // res.render("auth/logout");
    // const message = "No existe sesión activa";
    // document.getElementById("message").innerHTML = message;
  }
};

const loginForm = (req, res) => {
  const user = req.session.name;
  if (user) {
    res.render("index", { user });
  } else {
    res.render("auth/login");
  }
};

const signin = (req, res) => {
  const { name } = req.body;
  req.session.name = name;
  res.redirect("../");
  console.log(req.session.name);
};

function checkSession(req, res) {
  const name = req.session.name
  if (name) {
    return res.status(200).json({
      session: {
        state: true,
        user: name,
      },
      message: `El usuario ${name} ha iniciado sesión antes`,
    })
  }
  res.status(200).json({
    session: {
      state: false,
      user: '',
    },
    message: `No existe una sesión del usuario`,
  })
}

module.exports = { renderUserLogout, loginForm, signin, checkSession };
