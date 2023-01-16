import express from 'express'
import { engine } from 'express-handlebars';
import { optionsMDB } from './options/mariaDB.js'
import { optionsSQL3 } from './options/SQLite3.js'
import Contenedor from "./sql.js"
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express(); 
const server = createServer(app); 
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productos = new Contenedor(optionsMDB)
const mensajes = new Contenedor(optionsSQL3)

app.use(express.static('public'))
app.engine("handlebars", engine())
app.set("views", "./views") //declarar extension y ubicacion
app.set("view engine", "handlebars") //declarar el motor y extension
app.use(express.urlencoded({ extended: true }))

//Ruta para cargar nuestro archivo index.html en la raiz de la misma
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/views" })
})

//Creacion de tablas
productos.crearTablaProductos()
    .then(() => {
        console.log('1) Tabla de Porductos creada')
        return mensajes.crearTablaMensajes()
    })
    .then(() => {
        console.log('1) Tabla de Mensajes creada')
    })
    .catch((error) => {
        console.log(error); throw error
    })
    .finally(() => productos.close)
    .finally(() => mensajes.close)

//Carga de productos
io.on('connection', async function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('products',
        await productos.getAllProducts()
    );
    socket.on("newProduct", async (data) => {
        await productos.saveProducts(data)
        io.sockets.emit("products", await productos.getAllProducts())
    })
});

//Web Chat
io.on('connection', async function (socket) {
    socket.emit('messages',
        await mensajes.getAllMessages()
    );
    socket.on("newMessage", async (data) => {
        await mensajes.saveMessages(data)
        io.sockets.emit("messages",
            await mensajes.getAllMessages()
        )
        console.log(await mensajes.getAllMessages())
    })
});

const PORT = 8080
const srv = server.listen(PORT, () => console.log(`Servidor http con WebSocket escuchando el puerto ${server.address().port}`))
srv.on("error", error => console.log(`Error en servidor ${server}`))
