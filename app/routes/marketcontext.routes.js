module.exports = (app) => {
    const correlations = require('../Controllers/marketcontext.controller.js');
    var result=correlations.findAll;
    console.log(result);
    app.get('/loadmarketcontext', result);

    
}