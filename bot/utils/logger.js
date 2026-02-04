const luxon = require("luxon");

module.exports = {
    log: (content) => {
        const time = luxon.DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
        console.log(`[${time}] [INFO] ${content}`);
    },
    error: (content) => {
        const time = luxon.DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss");
        console.error(`[${time}] [ERROR] ${content}`);
    }
};
