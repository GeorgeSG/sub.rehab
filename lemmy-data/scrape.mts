import { crawl } from "./lib/community.mts";
import { getCommunities } from "./lib/get-communities.mts";
import { readFromS3, writeToAWS } from "./lib/s3.mts";

async function scrape() {
  const input = await getCommunities();
  const promises = input.map((community) => {
    const base = community.split("/")[2];
    const name = community.split("/")[4];
    if (base && name) {
      return crawl(base, name);
    } else {
      return Promise.resolve(null);
    }
  });

  return await Promise.all(promises);
}

scrape().then(async (communities) => {
  const oldResults = await readFromS3();

  const outputArray = communities.filter(Boolean);

  const grouped = outputArray.reduce((res: any, c: any) => {
    res[c.actor_id] = c;
    return res;
  }, {});

  writeToAWS("lemmy-stats.json", JSON.stringify({ ...oldResults, ...grouped }));
});
