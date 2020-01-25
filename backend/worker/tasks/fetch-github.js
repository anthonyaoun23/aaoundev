var fetch = require("node-fetch");
var redis = require("redis"),
  client = redis.createClient();
const { promisify } = require("util");
// const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const baseUrl = "https://jobs.github.com/positions.json";

async function fetchGithub() {
  let count = 1,
    onPage = 0;
  const allJobs = [];
  while (count > 0) {
    const res = await fetch(`${baseUrl}?page=${onPage}&search=cloud`);
    const jobs = await res.json();
    allJobs.push(...jobs);
    count = jobs.length;
    onPage++;
  }

  const cloudJobs = allJobs;
  // const cloudJobs = allJobs.filter(job => {
  //   const jobTitle = job.title.toLowerCase();
  //   if (jobTitle.includes("cloud") || jobTitle.includes("Cloud")) {
  //     return true;
  //   }
  //   return false;
  // });
  console.log(cloudJobs, cloudJobs.length);

  const success = await setAsync("github", JSON.stringify(cloudJobs));
}

module.exports = fetchGithub;
