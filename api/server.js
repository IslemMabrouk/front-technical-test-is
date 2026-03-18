const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemsRouter = require('./routes');
const compression = require('compression');

const app = express();
const PORT = 3001;

app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', itemsRouter);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
	console.log(`✅ File Manager API running at http://localhost:${PORT}/api`);
});
