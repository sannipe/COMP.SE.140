import express from "express";
import fetch from "node-fetch";
import checkDiskSpace from "check-disk-space";

const app = express();

const PORT = 8199;
const startTime = Date.now();
const SERVICE2_URL= "http://service2:5000/status";
const STORAGE_URL = "http://storage:5001/log";

async function getFreeSpace(path) {
  const diskSpace = await checkDiskSpace(path);
  return diskSpace.free;
}

async function getRecord() {
  const now = Date.now();
  const timestamp = new Date(now).toISOString()
  const uptime = (now - startTime) / 1000 / 60 / 60; // in hours

  const free = await getFreeSpace("/");
  const freeMB = (free / (1024 * 1024)).toFixed(2);
  
  const record1 = `${timestamp}: uptime ${uptime.toFixed(2)} hours, free disk in root: ${freeMB} Mbytes`;
  return record1;
}

app.get("/status", async (req, res) => {
  try {
    // Make record1
    const record1 = await getRecord();

    // Forward to storage
    const response1 = await fetch(STORAGE_URL, {
      method: 'POST',
      body: record1,
      headers: { 'Content-Type': 'text/plain' }
    });

    // vstorage?

    // Forward to service2
    const response2 = await fetch(SERVICE2_URL);
    const record2 = await response2.text(); 

    const records = `${record1}\n${record2}`;

    res.send(records);
  } catch (err) {
    console.error(err);
  }
});

app.get("/log", async (req, res) => {
    try {
        const response = await fetch(STORAGE_URL);
        const log = await response.text();
        res.send(log);
    }
    catch (err) {
        console.error(err);
    }
});

app.listen(PORT, () => {
});
