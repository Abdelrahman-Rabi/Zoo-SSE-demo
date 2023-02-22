const zookeeper = require("node-zookeeper-client");

const client = zookeeper.createClient("localhost:2181");

const systemSettings = {
  acdm: {
    tobtConfirmation: 15,
    tsatMargin: 4,
    X:20
  },
  vtt: {
    cutOff: true,
    taxiIn: 10,
    taxiOut: 20
  },
  pds: {
    pdsInterval: { start: 5, end: 10 },
  },
};

const setSystemSettings = async () => {
    try {
      await new Promise((resolve, reject) => {
        client.once("connected", resolve);
        client.connect();
      });
  
      const root = "/systemSettings";
  
      // create root node if it doesn't exist
      await createNodeIfNotExists(root);
  
      const children = Object.keys(systemSettings);
  
      for (const child of children) {
        const childPath = `${root}/${child}`;
        // create subnode if it doesn't exist
        await createNodeIfNotExists(childPath);
  
        const values = systemSettings[child];
        const keys = Object.keys(values);
        for (const key of keys) {
          const keyPath = `${childPath}/${key}`;
          const value = values[key];
          // create znode for each key in the object
          await createNodeIfNotExists(keyPath, value);
        }
      }
  
      console.log("System settings are set successfully.");
    } catch (error) {
      console.error(`Error setting system settings: ${error}`);
    } finally {
      client.close();
    }
  };
  
const createNodeIfNotExists = async (path, value = null) => {
  const exists = await new Promise((resolve, reject) => {
    client.exists(path, (error, stat) => {
      if (error) return reject(error);
      resolve(stat);
    });
  });

  if (!exists) {
    await new Promise((resolve, reject) => {
      client.create(
        path,
        value != null ? Buffer.from(JSON.stringify(value)) : null,
        (error, path) => {
          if (error) return reject(error);
          console.log(`Node ${path} is created.`);
          resolve();
        }
      );
    });
  } else {
    console.log(`Node ${path} already exists.`);
  }
};

module.exports = setSystemSettings;
