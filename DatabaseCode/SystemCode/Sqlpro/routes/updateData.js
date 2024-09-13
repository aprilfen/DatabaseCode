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

// 更新数据函数
const updateTableData = async (name, idColumn, id, info) => {
    const columns = Object.keys(info);
    const updateParams = columns.map((col, index) => {
        let type;

        switch (typeof info[col]) {
            case 'number':
                type = Number.isInteger(info[col]) ? TYPES.Int : TYPES.Float;
                break;
            case 'string':
                type = TYPES.NVarChar;
                break;
            case 'boolean':
                type = TYPES.Bit;
                break;
            case 'object':
                if (info[col] instanceof Date) {
                    type = TYPES.DateTime;
                }
                break;
            default:
                type = TYPES.NVarChar;
        }

        return {
            name: `param${index}`,
            type,
            value: info[col]
        };
    });

    const idValue = isNaN(parseInt(id)) ? 0 : parseInt(id); // 转换 ID 为整数类型

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

// 处理更新数据请求
router.post('/', async (req, res) => {
    const { name, idColumn, id, info } = req.body;

    if (!name || !idColumn || id === undefined || !info) {
        return res.status(400).send({
            code: 400,
            msg: '表名、ID 列名、ID 和更新数据不能为空'
        });
    }

    try {
        console.log('Update data:', info);
        await updateTableData(name, idColumn, id, info);
        // 更新成功后获取更新后的全部表数据
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
