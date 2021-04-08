"use strict";

const mssql = require('mssql');

module.exports = class Sql {
    constructor(stringConnection) {
        this.stringConnection = stringConnection;
    }

    connect() {
        return mssql.connect(this.stringConnection);
    }

    close() {
        return mssql.close();
    }

    async select(table) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                return pool.request().query(`select * from ${table}`);
            }).then(result => {
                mssql.close();
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async count(table) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                return pool.request().query(`select count(*) from ${table}`);
            }).then(result => {
                mssql.close();
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async elementAt(table, pos) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                const offset = pos - 1;
                return pool.request().query(
                    `select * 
                     from ${table} 
                     order by Id 
                     offset ${offset < 0 ? 0 : offset} rows
                     fetch next 1 rows only `
                );
            }).then(result => {
                mssql.close();
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async selectById(table, id) {
        if (id == undefined || id === 0) {
            return await this.select(table);
        } else {
            return new Promise((resolve, reject) => {
                this.connect().then(pool => {
                    return pool.request().query(`select * from ${table} where id=${id}`);
                }).then(result => {
                    mssql.close();
                    resolve(result);
                }).catch(err => {
                    reject(err);
                });
            });
        }
    }

    async execStoreProcedure(storeProcedure) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                return pool.request().execute(storeProcedure);
            }).then(result => {
                mssql.close();
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

    async execStoreProcedureById(storeProcedure, parameter) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                return pool.request()
                    .input("id", mssql.Int, parameter)
                    .execute(storeProcedure);
            }).then(result => {
                mssql.close();
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

}