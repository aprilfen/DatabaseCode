const { Connection } = require('tedious');

let connection;
let dbConfig = {
    server: '',
    userName: '',
    password: '',
    database: ''
};

const setDbConfig = (newConfig) => {
    dbConfig = newConfig;
};

const connectToDatabase = () => {
    const config = {
        server: dbConfig.server,
        authentication: {
            type: 'default',
            options: {
                userName: dbConfig.userName,
                password: dbConfig.password
            }
        },
        options: {
            database: dbConfig.database,
            encrypt: true,
            trustServerCertificate: true
        }
    };

    connection = new Connection(config);

    connection.on('connect', err => {
        if (err) {
            console.error('Database connection failed:', err);
        } else {
            console.log('数据库连接成功！');
        }
    });

    connection.connect();
};

const getConnection = () => {
    if (!connection) {
        connectToDatabase();
    }
    return connection;
};

module.exports = { connectToDatabase, getConnection, setDbConfig, getDbConfig: () => dbConfig };
