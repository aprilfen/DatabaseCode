const express = require('express');
const router = express.Router();
const { Request } = require('tedious');
const { getConnection } = require('../public/db');

// 执行 SQL 查询的通用函数
const executeSQL = (sql) => {
    return new Promise((resolve, reject) => {
        const connection = getConnection(); // 获取数据库连接

        const request = new Request(sql, (err) => {
            if (err) {
                return reject(err);
            }
        });

        const result = [];
        request.on('row', columns => {
            const row = {};
            columns.forEach(column => {
                row[column.metadata.colName] = column.value;
            });
            result.push(row);
        });

        request.on('requestCompleted', () => {
            resolve(result);
        });

        connection.execSql(request);
    });
};

// 获取全部表名
const getTableNames = () => {
    const sql = `
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
    `;
    return executeSQL(sql);
};

// 获取表中的所有数据
const getTableData = (tableName) => {
    const sql = `SELECT * FROM ${tableName}`;
    return executeSQL(sql);
};

// 处理 GET 请求，获取所有表的数据
router.get('/', async (req, res) => {
    try {
        const tableNamesResult = await getTableNames();
        const tableList = tableNamesResult.map(row => row.TABLE_NAME);

        const allTableData = {};
        for (const tableName of tableList) {
            allTableData[tableName] = await getTableData(tableName);
        }

        res.status(200).send({
            code: 200,
            tableList,
            allTableData
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
