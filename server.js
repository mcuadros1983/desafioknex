require("dotenv").config()
require("./options/firebase.js")

const express = require("express");
const exphbs = require("express-handlebars");
const Contenedor = require("./containers/messageContainer.js");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { getMockedItems } = require("./DB/MockApi.js")
const app = express();
const server = createServer(app);
const io = new Server(server);
const morgan = require("morgan") ;
const passport = require("./config/passport.js") ;
const { join } =  require("path");
const indexRoutes= require("./routes/indexRoutes.js")
const userRoutes = require("./routes/userRoutes.js")
const productos = new Contenedor("products");
const mensajes = new Contenedor("messages");
const path = require("path")
const session = require('express-session')
const MongoStore = require('connect-mongo')

//Inizializations
require("./config/passport.js")

// settings
app.set("views", join(path.join(__dirname, "views")));

// config view engine
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"))
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_ATLAS,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 100,
    }),
    secret: 'secreta',
    resave: false,
    saveUninitialized: false,
  })
)
app.use(passport.initialize());
app.use(passport.session());

// static files
app.use(express.static(join(__dirname, "public")));

// routes
app.use(indexRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
  return res.status(404).render("404");
});

//Carga de productos
io.on("connection", async function (socket) {
  socket.emit("products", await productos.getAll());
  socket.on("newProduct", async (data) => {
    try {
      await productos.save(data);
      io.sockets.emit("products", await productos.getAll());
    } catch (error) {
      throw new Error(error?.message);
    }
  });
});

//Web Chat
io.on("connection", async function (socket) {
  socket.emit("messages", await mensajes.getAllMessagesNormalized());
  socket.on("newMessage", async (data) => {
    try {
      await mensajes.save(data);
      io.sockets.emit("messages", await mensajes.getAllMessagesNormalized());
    } catch (error) {
      throw new Error(error?.message);
    }
  });
});

const PORT = process.env.PORT || 8080;
const srv = server.listen(PORT, () =>
  console.log(
    `Servidor http con WebSocket escuchando el puerto ${server.address().port}`
  )
);
srv.on("error", (error) => console.log(`Error en servidor ${server}`));
