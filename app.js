const express = require("express");
const zookeeper = require("./zookeeper");
const bodyParser = require("body-parser");
const setSystemSettings = require("./settings_initial");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// POST endpoint to save data to ZooKeeper
app.post("/systemSettings/:category/:param", async (req, res) => {
    console.log('req: params', req.params);
    console.log('req.body: ', req.body);
	const { category, param } = req.params;
	const { value } = req.body;
	const path = `/systemSettings/${category}/${param}`;
	const data = Buffer.from(JSON.stringify(value));
	try {
		await zookeeper.setData(path, data);
		console.log(`Updated param ${path}`);
		res.sendStatus(204);
	} catch (error) {
		console.error(`Error updating param ${path}: ${error}`);
		res.status(500).send("Error updating node");
	}
});

// GET endpoint to retrieve data from ZooKeeper

app.get("/systemSettings/:category", async (req, res) => {
	const { category } = req.params;
	const categoryPath = `/systemSettings/${category}`;

	const exists = await zookeeper.isNodeExists(categoryPath);
	if (!exists) {
		return res.status(404).send(`Node ${categoryPath} does not exist`);
	}

	try {
		const children = await zookeeper.getChildren(categoryPath);
		const childData = await Promise.all(
			children.map(async (child) => {
				const childPath = `${categoryPath}/${child}`;
				const data = await zookeeper.getData(childPath);
				return { [child]: data };
			})
		);

		const responseData = Object.assign({}, ...childData);
		res.send(responseData);
	} catch (error) {
		console.log(`Error getting data for category ${category}: ${error.stack}`);
		res.status(500).send(`Error getting data for category ${category}`);
	}
});

app.get("/systemSettings/:category/:param", async (req, res) => {
	try {
		const { category, param } = req.params;
		const childPath = `/systemSettings/${category}/${param}`;

		const exists = await zookeeper.isNodeExists(childPath);
		if (!exists) {
			return res.status(404).send(`Node ${childPath} does not exist`);
		}

		const data = await zookeeper.getData(childPath);
		res.json(data);
	} catch (error) {
		console.error(`Error retrieving data from ZooKeeper: ${error}`);
		res.status(500).send(`Error retrieving data from ZooKeeper: ${error}`);
	}
});

app.get("/systemSettings/acdm", async (req, res) => {
	const categoryPath = `/systemSettings/acdm`;
	try {
		const children = await zookeeper.getChildren(categoryPath);
		const childData = await Promise.all(
			children.map(async (child) => {
				const childPath = `${categoryPath}/${child}`;
				const data = await zookeeper.getData(childPath);
				return { [child]: data };
			})
		);

		const responseData = Object.assign({}, ...childData);
		res.send(responseData);
	} catch (error) {
		console.log(`Error getting data for category ${category}: ${error.stack}`);
		res.status(500).send(`Error getting data for category ${category}`);
	}
});

app.get("/", async (req, res) => {
	const categoryPath = "/systemSettings/acdm";
	try {
		const children = await zookeeper.getChildren(categoryPath);

		// Stream the initial values of the children nodes
		const childData = await Promise.all(
			children.map(async (child) => {
				const childPath = `${categoryPath}/${child}`;
				// const initialData = await zookeeper.getData(childPath);
				const data = await zookeeper.getData(childPath);

				const dataListener = async (event) => {
					if (event.name === "NODE_DATA_CHANGED") {
						const updatedData = await zookeeper.getData(childPath);
						const eventData = {
							event: "update",
							data: { [child]: updatedData },
						};
                        console.log('UPDATE WATCHER');
						res.write(`data: ${JSON.stringify(eventData)}\n\n`);
					}
				};

				await zookeeper.watcher(childPath, dataListener);

				return { [child]: data };
			})
		);

		res.set({
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		const responseData = { event: "initial", data: Object.assign({}, ...childData) };
		console.log("responseData: ", responseData);
		res.write(`data: ${JSON.stringify(responseData)}\n\n`);
	} catch (error) {
		console.log(`Error getting data for category acdm: ${error.stack}`);
		res.status(500).send(`Error getting data for category acdm`);
	}
});

app.listen(5000, () => {
	console.log("Server started on port 5000");
	setSystemSettings();
});

// app.get('/data', (req, res) => {
//     client.once('connected', () => {
//       console.log('Connected to ZooKeeper GET');
//       client.getData('/systemSettings/acdm', (error, data) => {
//         if (error) {
//           console.log('Error getting data:', error.stack);
//           res.status(500).send('Error getting data');
//           return;
//         }
//         console.log('Got data:', data.toString('utf8'));
//         const parsedData = JSON.parse(data.toString('utf8'));
//         res.send(parsedData);
//       });
//     });
//     client.connect();
//   });
