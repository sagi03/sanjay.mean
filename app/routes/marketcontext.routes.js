module.exports = (app) => {
    const marketcontext = require('../Controllers/marketcontext.controller.js');
    app.get('/loadmarketcontext', marketcontext.findAll);

    
}