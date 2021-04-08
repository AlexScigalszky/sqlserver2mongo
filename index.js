"use strict";

const config = require("./config");
const sqlConnection = require("./sql");
const mongoConnection = require("./mongo");


async function migrateTable(sql, mongo, tableName) {
    // get data from SQLServer
    let result = await sql.select(tableName);
    let sqlItems = result.recordset;
    let mongoItems = [];
    for (let i = 0; i < sqlItems.length; i++) {
        mongoItems = [
            ...mongoItems,
            {
                ...sqlItems[i],
                _id: +sqlItems[i].Id,
            }
        ];
    }
    console.log(mongoItems)
    mongo.insertItems(tableName, mongoItems);
}

async function migrateTableOneByOne(sql, mongo, tableName) {
    const resultCount = await sql.count(tableName);
    const count = resultCount.recordset[0][''];
    for (let i = 12983; i < count; i++) {
        const result = await sql.elementAt(tableName, i);
        let sqlItem = result.recordset[0];
        await mongo.insertItem(tableName, sqlItem);
        console.log('i', i)
    }
    console.log(`inserted ${count} items`)
}


(async () => {
    try {
        // create SQLServer connection
        const sql = new sqlConnection(config.connectionSQL);
        // create MongoDB connection
        const mongo = new mongoConnection(config.connectionMongo);

        // await migrateTable(sql, mongo, "Tag");
        await migrateTableOneByOne(sql, mongo, "Items");


    } catch (error) {
        console.log(error);
    }
})();

// var mysql = require('mysql');
// var MongoClient = require('mongodb').MongoClient;

// function getTABLESfromSQL(Mysql_Connectionnection, callback) {
//     Mysql_Connectionnection.query("show full tables where Table_Type = 'BASE TABLE';", function(error, results, fields) {
//         if (error) {
//             callback(error);
//         } else {
//             var tables = [];
//             results.forEach(function (row) {
//                 for (var key in row) {
//                     if (row.hasOwnProperty(key)) {
//                         if(key.startsWith('Tables_in')) {
//                             tables.push(row[key]);
//                         }
//                     }
//                 }
//             });
//             callback(null, tables);
//         }
//     });
// }

// function CollectionTable(Mysql_Connectionnection, tableName, mongoCollection, callback) {
//     var sql = 'SELECT * FROM ' + tableName + ';';
//     Mysql_Connectionnection.query(sql, function (error, results, fields) {
//         if (error) {
//             callback(error);
//         } else {
//             if (results.length > 0) {
//                 mongoCollection.insertMany(results, {}, function (error) {
//                     if (error) {
//                         callback(error);
//                     } else {
//                         callback(null);
//                     }
//                 });
//             } else {
//                 callback(null);
//             }
//         }
//     });
// }

// MongoClient.connect("mongodb://localhost:27017/importedDb", function (error, db) {
//     if (error) throw error;
//     var Mysql_Connection = mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'root',
//         port: 8889,
//         database: 'my_database'
//     });
//     Mysql_Connection.connect();
//     var jobs = 0;
//     getTABLESfromSQL(Mysql_Connection, function(error, tables) {
//         tables.forEach(function(table) {
//             var collection = db.collection(table);
//             ++jobs;
//             CollectionTable(Mysql_Connection, table, collection, function(error) {
//                 if (error) throw error;
//                 --jobs;
//             });
//         })
//     });
//     var interval = setInterval(function() {
//         if(jobs<=0) {
//             clearInterval(interval);
//             db.close();
//             Mysql_Connection.end();
//         }
//     }, 300);
// });