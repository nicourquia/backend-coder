const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const path = require("path");

const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const viewsRouter = require("./routes/views.router");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// APIs
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// WebSockets
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", (product) => {
        io.emit("updateProducts");
    });

    socket.on("deleteProduct", (productId) => {
        io.emit("updateProducts");
    });
});

const PORT = 8080;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
