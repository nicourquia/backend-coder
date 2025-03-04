const fs = require("fs/promises");
const path = require("path");
const { io } = require("../app");

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getAll() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async getById(id) {
        try {
            const products = await this.getAll();
            return products.find((product) => product.id === Number(id)) || null;
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            const products = await this.getAll();
            const newProduct = {
                id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
                ...product,
            };
            products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));

            io.emit("updateProducts");

            return newProduct;
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getAll();
            const index = products.findIndex((product) => product.id === Number(id));
            if (index === -1) return null;

            products[index] = { ...products[index], ...updatedFields };
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));

            io.emit("updateProducts");

            return products[index];
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getAll();
            const updatedProducts = products.filter((product) => product.id !== Number(id));
            await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));

            io.emit("updateProducts");

            return true;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            throw error;
        }
    }
}

const productManager = new ProductManager(path.join(__dirname, "../../products.json"));
module.exports = productManager;
