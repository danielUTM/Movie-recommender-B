const app = require('./app');

var port = process.env.PORT || 8091;

app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})