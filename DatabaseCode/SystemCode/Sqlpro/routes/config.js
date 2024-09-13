const express = require('express');
const router = express.Router();
const { Connection } = require('tedious');
const { connectToDatabase, setDbConfig } = require('../public/db');

// 接收并更新数据库配置
router.post('/', (req, res) => {
    const { server, userName, password, database } = req.body;

    if (!server || !userName || !password || !database) {
        return res.status(400).send({
            code: 400,
            msg: '所有配置参数都是必需的'
        });
    }

    // 更新 dbConfig
    setDbConfig({ server, userName, password, database });

    // 尝试连接数据库
    const config = {
        server,
        authentication: {
            type: 'default',
            options: {
                userName,
                password
            }
        },
        options: {
            database,
            encrypt: true,
            trustServerCertificate: true
        }
    };

    const testConnection = new Connection(config);

    testConnection.on('connect', (err) => {
        try {
            if (err) {
                return res.status(500).send({
                    code: 500,
                    msg: '数据库连接失败',
                    error: err.message
                });
            } else {
                // 确保实际连接使用最新的配置
                connectToDatabase();
                res.status(200).send({
                    code: 200,
                    msg: '数据库已连接',
                    data: { server, userName, database }
                });
            }
        }catch (error) {
            res.status(500).send({
                code: 500,
                msg: '数据库连接失败，请检查配置。',
                error: err.message
            });
        }

    });

    testConnection.connect();
});

module.exports = { router, setDbConfig };
