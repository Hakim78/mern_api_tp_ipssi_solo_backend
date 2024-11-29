const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

const PORT = 8080;

// cors from * all
app.use(cors( {origin: "*" }));

const mongoose = require('mongoose');

// url de mon cluster
mongoose.connect("mongodb://localhost:27017/tp_individuelle", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}) 

.then(() => {
    console.log("connected to mongo");
})
.catch((err) => {
    console.error("error connecting to mongo", err);
});

const routes = require("./Routes/routes");

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 