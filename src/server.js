import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.send('FC5Y Entry Task');
});

app.get('/timestamp', (req, res) => {
	res.send({"timestamp": Math.floor(Date.now() / 1000)});
})

app.post('/logs', (req, res) => {
	fs.appendFile(process.env.FILE_NAME, `${Math.floor(Date.now() / 1000)} ${req.body.level} ${req.body.message} \n`, (err) => {
		if (err) res.send({"error": 1});
		else res.send({"error": 0})
	})
})

app.get('/logs', (req, res) => {
	try {
		let data = fs.readFileSync(process.env.FILE_NAME, 'utf-8');
		let logs = data.split('\n');
		logs.pop();
		logs = logs.reverse();
		let firstNLogs = {"logs": []};

		for (let i = 1; i <= Math.min(req.query.limit, logs.length); i++) {
			let log = logs[i - 1].split(" ");
			firstNLogs.logs.push({
				"timestamp": log[0],
				"level": log[1],
				"message": log[2]
			})
		}

		res.send({
			"error": 0,
			"data": firstNLogs
		})
	} catch (err) {
		console.error(err);
		res.send({"error": 1})
	}
})

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});
