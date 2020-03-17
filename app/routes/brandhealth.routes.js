module.exports = (app) => {
    const correlations = require('../Controllers/brandhealth.controller.js');
     // Create a new Note
    // app.post('/loadmarketcontext', marketcontext.create);
    var result=correlations.findAll;
    console.log(result);
    // Retrieve all marketcontext
    //app.get('/loadmarketcontext',cacheMiddleware(120000), result);
    app.get('/loadbrandhealth', result);

    
}