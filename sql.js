import knexLib from "knex"

class Contenedor {
    constructor(config) {
        this.knex = knexLib(config)
    }

    async crearTablaMensajes() {
        return this.knex.schema.hasTable('mensajes').then(function (exists) {
            if (!exists) {
                return this.knex.schema.createTable('mensajes', table => {
                    table.increments('id').primary();
                    table.string('author', 15).notNullable();
                    table.string('text', 100).notNullable();
                    table.datetime('dateMsg');
                })
            }
        });
    }

    async crearTablaProductos() {
        return this.knex.schema.hasTable('productos').then(function (exists) {
            if (!exists) {
                return this.knex.schema.createTable('productos', table => {
                    table.increments('id').primary();
                    table.string('title', 15).notNullable();
                    table.float('price', 10).notNullable();
                    table.string('image', 50).notNullable();
                })
            }
        });
    }

    async saveMessages(objeto) {
        return this.knex('mensajes').insert(objeto);
    }

    async saveProducts(objeto) {
        return this.knex('productos').insert(objeto);
    }

    async getProductById(id) {
        return this.knex.from('articulos').where('id', id).del();
    }

    async getMessageById(id) {
        return this.knex.from('articulos').select("*").where('id', id);
    }

    async getAllMessages() {
        return this.knex.from('mensajes').select("*");
    }

    async getAllProducts() {
        return this.knex('productos').select('*');
    }

    async deleteProductById(id) {
        return this.knex.from('articulos').where('id', id).del();
    }

    async deleteMessageById(id) {
        return this.knex.from('mensajes').where('id', id).del();
    }

    async deleteAllProducts() {
        return this.knex.from('productos').del();
    }

    async deleteAllProducts() {
        return this.knex.from('mensajes').del();
    }

    async close() {
        this.knex.destroy();
    }
}

export default Contenedor