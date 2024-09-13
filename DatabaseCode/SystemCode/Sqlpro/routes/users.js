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

// 查询数据库中是否存在匹配的用户名和密码
const checkLoginCredentials = async (username, password) => {
    const sql = `
        SELECT *
        FROM Users
        WHERE username = @username AND password = @password
    `;

    const params = [
        { name: 'username', type: TYPES.NVarChar, value: username },
        { name: 'password', type: TYPES.NVarChar, value: password }
    ];

    try {
        const result = await executeSQL(sql, params);
        return result.length > 0; // 如果查询结果有数据，则用户名和密码匹配
    } catch (err) {
        console.error('Error checking login credentials:', err);
        throw err;
    }
};

// 处理登录验证请求
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
        return res.status(400).send({
            code: 400,
            msg: '用户名和密码不能为空'
        });
    }

    try {
        const isValid = await checkLoginCredentials(username, password);
        if (isValid) {
            res.status(200).send({
                code: 200,
                msg: '登录成功'
            });
        } else {
            res.status(401).send({
                code: 401,
                msg: '用户名或密码不正确'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            code: 500,
            msg: '服务器内部错误'
        });
    }
});

module.exports = router;
