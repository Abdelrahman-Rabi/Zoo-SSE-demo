const zookeeper = require("node-zookeeper-client");

const client = zookeeper.createClient("localhost:2181");

client.once("connected", () => {
	console.log("Connected to ZooKeeper");
	zookeeperClient = client;
});

client.connect();

module.exports.createNode = function (path, data) {
	client.connect();

	client.once("connected", () => {
		console.log("Connected to ZooKeeper");

		// Check if node exists
		client.exists(path, (error, stat) => {
			if (error) {
				console.log("Failed to check if node exists: %s.", error);
				return;
			}

			if (stat) {
				console.log("Node already exists. Updating data.");

				// Update node data
				client.setData(path, new Buffer.from(data), (error, stat) => {
					if (error) {
						console.log("Failed to update node data: %s.", error);
						return;
					}

					console.log("Node data updated with stat: %j.", stat);
					client.close();
				});
			} else {
				console.log("Node does not exist. Creating new node.");

				// Create new node
				client.create(path, new Buffer.from(data), (error, path) => {
					if (error) {
						console.log("Failed to create node: %s.", error);
						return;
					}

					console.log("Node created with path: %s.", path);
					client.close();
				});
			}
		});
	});
};

module.exports.isNodeExists = function (path) {
	return new Promise((resolve, reject) => {
		zookeeperClient.exists(path, (error, stat) => {
			if (error) {
				console.log("Error checking if node exists:", error.stack);
				return reject(error);
			}
			resolve(stat);
		});
	});
};

module.exports.watcher = function (path, callback) {
	return new Promise((resolve, reject) => {
		zookeeperClient.exists(path, callback, (error, stat) => {
			if (error) {
				console.log(`Error setting data listener for ${path}: ${err.stack}`);
				return reject(error);
			}
			resolve(stat);
		});
	});
};

module.exports.getChildren = function (category) {
	return new Promise((resolve, reject) => {
		zookeeperClient.getChildren(category, (error, children, stats) => {
			if (error) {
				console.log("Error getting children:", error.stack);
				return reject(error);
			}
			console.log("Got children", children);
			resolve(children);
		});
	});
};

module.exports.getData = function (path) {
	return new Promise((resolve, reject) => {
		zookeeperClient.getData(path, (error, data, stat) => {
			if (error) {
				console.log("Error getting data:", error.stack);
				return reject(error);
			}
			console.log("Got data:", data.toString("utf8"));
			const parsedData = JSON.parse(data.toString("utf8"));
			resolve(parsedData);
		});
	});
};

module.exports.getAll = function (path) {
	return new Promise((resolve, reject) => {
		zookeeperClient.getData(path, (error, data, stat) => {
			if (error) {
				console.log("Error getting data:", error.stack);
				return reject(error);
			}
			console.log("Got data:", data.toString("utf8"));
			const parsedData = JSON.parse(data.toString("utf8"));
			resolve(parsedData);
		});
	});
};

module.exports.setData = function (path, data) {
	return new Promise((resolve, reject) => {
		zookeeperClient.setData(path, data, (error, stat) => {
			if (error) {
				console.log("Error updating data:", error.stack);
				return reject(error);
			}
			resolve();
		});
	});
};

// module.exports.watchCategory = function (path,data) {
// 	return new Promise((resolve, reject) => {
//      zookeeperClient.setData(path, data, (error, stat)=>{
//         if (error) {
//             console.log("Error updating data:", error.stack);
//             return reject(error);
//         }
//         resolve();
//      });

// 	});
// };
// zookeeperClient.getChildren(path, watcher, (error, children, stats) => {
//     if (error) {
//       console.error(`Failed to get children for ${znodePath}: ${error}`);
//       return;
//     }

//     console.log(`Initial children of ${znodePath}: ${children}`);

//     // Watch for changes to children
//     function watcher(event) {
//       console.log(`Received event type: ${event.getType()}`);

//       // Get updated children and set new watch
//       zkClient.getChildren(znodePath, watcher, (error, newChildren, stats) => {
//         if (error) {
//           console.error(`Failed to get updated children for ${znodePath}: ${error}`);
//           return;
//         }

//         console.log(`Updated children of ${znodePath}: ${newChildren}`);
//       });
//     }
//   });
