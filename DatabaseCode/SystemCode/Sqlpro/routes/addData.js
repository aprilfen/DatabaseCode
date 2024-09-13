const express = require('express');
const router = express.Router();
const { Request, TYPES } = require('tedious');
const { getConnection } = require('../public/db');

// 执行 SQL 查询的通用函数
const executeSQL = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        const connection = getConnection(); // 获取数据库连接

        const request = new Request(sql, (err) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
        });

        // 添加参数到请求中
        params.forEach(param => {
            request.addParameter(param.name, param.type, param.value);
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

// 获取表中的所有数据
const getTableData = (name) => {
    const sql = `SELECT * FROM ${name}`;
    return executeSQL(sql);
};

// 添加数据函数
const insertTableData = async (name, info) => {
    const columns = Object.keys(info);
    const values = Object.values(info);

    const sql = `
        INSERT INTO ${name} (${columns.join(', ')})
        VALUES (${columns.map((_, i) => `@param${i}`).join(', ')})
    `;

    const params = columns.map((col, index) => {
        const value = values[index];
        let type;

        switch (typeof value) {
            case 'number':
                type = Number.isInteger(value) ? TYPES.Int : TYPES.Float;
                break;
            case 'string':
                type = TYPES.NVarChar;
                break;
            case 'boolean':
                type = TYPES.Bit;
                break;
            case 'object':
                if (value instanceof Date) {
                    type = TYPES.DateTime;
                    value = value.toISOString(); // Convert Date to ISO string
                } else if (Array.isArray(value)) {
                    // Example handling for arrays, convert to JSON string
                    type = TYPES.NVarChar; // Or adjust type as needed
                    value = JSON.stringify(value);
                } else {
                    // For other objects, stringify them to JSON
                    type = TYPES.NVarChar; // Or adjust type as needed
                    value = JSON.stringify(value);
                }
                break;
            default:
                type = TYPES.NVarChar;
                value = value.toString();
        }

        return {
            name: `param${index}`,
            type,
            value
        };
    });

    return executeSQL(sql, params);
};

// 删除数据函数
const deleteTableData = async (name, idColumn, id) => {
    const sql = `DELETE FROM ${name} WHERE ${idColumn} = @id`;

    const params = [
        {
            name: 'id',
            type: TYPES.Int,
            value: id
        }
    ];

    return executeSQL(sql, params);
};

// 更新数据函数
const updateTableData = async (name, idColumn, id, info) => {
    const columns = Object.keys(info);
    const updateParams = [];

    columns.forEach((col, index) => {
        let type;
        let value = info[col];

        switch (typeof value) {
            case 'number':
                type = Number.isInteger(value) ? TYPES.Int : TYPES.Float;
                break;
            case 'string':
                type = TYPES.NVarChar;
                break;
            case 'boolean':
                type = TYPES.Bit;
                break;
            case 'object':
                if (value instanceof Date) {
                    type = TYPES.DateTime;
                    value = value.toISOString(); // Convert Date to ISO string
                } else if (Array.isArray(value)) {
                    // Example handling for arrays, convert to JSON string
                    type = TYPES.NVarChar; // Or adjust type as needed
                    value = JSON.stringify(value);
                } else {
                    // For other objects, stringify them to JSON
                    type = TYPES.NVarChar; // Or adjust type as needed
                    value = JSON.stringify(value);
                }
                break;
            default:
                type = TYPES.NVarChar;
                value = value.toString();
        }

        updateParams.push({
            name: `param${index}`,
            type,
            value
        });
    });

    const idValue = isNaN(parseInt(id)) ? 0 : parseInt(id); // Convert ID to integer type

    const setClause = columns.map((col, index) => `${col} = @param${index}`).join(', ');
    const updateSql = `UPDATE ${name} SET ${setClause} WHERE ${idColumn} = @id`;

    updateParams.push({
        name: 'id',
        type: TYPES.Int,
        value: idValue
    });

    try {
        await executeSQL(updateSql, updateParams);
        console.log(`Data updated successfully for ID ${id}`);
    } catch (err) {
        console.error('Error updating data:', err);
        throw err;
    }
};

// 处理添加数据请求
router.post('/insert', async (req, res) => {
    const { name, info } = req.body;

    if (!name || !info) {
        return res.status(400).send({
            code: 400,
            msg: '表名和数据不能为空'
        });
    }

    try {
        await insertTableData(name, info);
        const allTableData = await getTableData(name);
        res.status(200).send({
            code: 200,
            data: allTableData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// 处理删除数据请求
router.post('/delete', async (req, res) => {
    const { name, idColumn, id } = req.body;

    if (!name || !idColumn || id === undefined) {
        return res.status(400).send({
            code: 400,
            msg: '表名、ID 列名和 ID 不能为空'
        });
    }

    try {
        await deleteTableData(name, idColumn, id);
        const allTableData = await getTableData(name);
        res.status(200).send({
            code: 200,
            data: allTableData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// 处理更新数据请求
router.post('/update', async (req, res) => {
    const { name, idColumn, id, info } = req.body;

    if (!name || !idColumn || id === undefined || !info) {
        return res.status(400).send({
            code: 400,
            msg: '表名、ID 列名、ID 和更新数据不能为空'
        });
    }

    // 转换所有数据字段为合适的类型
    const updatedInfo = {};
    Object.keys(info).forEach(key => {
        switch (typeof info[key]) {
            case 'number':
                updatedInfo[key] = Number.isInteger(info[key]) ? info[key] : parseFloat(info[key]);
                break;
            case 'string':
                updatedInfo[key] = info[key];
                break;
            case 'boolean':
                updatedInfo[key] = info[key];
                break;
            case 'object':
                if (info[key] instanceof Date) {
                    updatedInfo[key] = info[key];
                }
                break;
            default:
                updatedInfo[key] = info[key].toString();
        }
    });

    try {
        await updateTableData(name, idColumn, id, updatedInfo);
        const allTableData = await getTableData(name);
        res.status(200).send({
            code: 200,
            data: allTableData
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
