const { MongoClient } = require('mongodb');
const config = require("./config");

"use strict";


module.exports = class Sql {
    constructor(stringConnection) {
        this.stringConnection = stringConnection;
    }

    async connect() {
        this.client = new MongoClient(this.stringConnection);
        await this.client.connect({
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        return this.client;
    }

    async listDatabases() {
        await this.connect();
        databasesList = await this.client.db().admin().listDatabases();
    
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };
    
    async listItemsOfCollection(collection) {
        await this.connect();
        const database = await this.client.db("PalabrasAleatorias");
        const tags = database.collection(collection);
        const items = await tags.find({}).toArray();
        console.log(items);
    }
    
    async insertItem(collection, newItem) {
        await this.connect();
        const database = await this.client.db("PalabrasAleatorias");
        database.collection(collection).insertOne(newItem, function (err, res) {
            if (err) throw err;
        });
    }

    async insertItems(collection, newItems) {
        await this.connect();
        const database = await this.client.db("PalabrasAleatorias");
        database.collection(collection).insertMany(newItems, function (err, res) {
            if (err) throw err;
            // console.log(`${newItems.length} document inserted`);
        });
    }
    

}

// (async () => {
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */

    

//     try {
//         // Connect to the MongoDB cluster
//         await client.connect({
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         // Make the appropriate DB calls
//         await listDatabases(client);
//         await listItemsOfCollection(client, "Tag");

//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// })();