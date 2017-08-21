const express = require('express');
const app = express();

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    if(req.headers['x-forwarded-proto']!='https' && process.env.NODE_ENV === "production") {
        return res.redirect(['https://', req.headers.host, req.url].join(''));
    } else {
        next();
    }
});


// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);

