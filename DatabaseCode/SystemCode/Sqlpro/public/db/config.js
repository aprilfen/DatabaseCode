let dbConfig = {
    server: '127.0.0.1',
    userName: 'sa',
    password: '',
    database: 'management',
};

const setDbConfig = (newConfig) => {
    dbConfig = { ...newConfig };
};

const getDbConfig = () => dbConfig;

module.exports = { setDbConfig, getDbConfig };
