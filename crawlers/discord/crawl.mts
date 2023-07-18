import axios from "axios";
import { getCommunities } from "../lib/get-communities.mts";
import { readFromS3, writeToAWS } from "../lib/s3.mts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getDiscordStats(name: string) {
  try {
    const apiResult = await axios({
      method: "get",
      url: `https://discord.com/api/v9/invites/${name}?with_counts=true&with_expiration=true`,
    });

    const data = apiResult.data;

    if (!data || !data.approximate_member_count) {
      console.log(`No data found for ${name}`);
      return;
    }
    console.log(`Found data for ${name}.`);
    return data;
  } catch (err: any) {
    console.log(`Unable to fetch ${name}`, err?.response?.status, err?.response?.statusText);

    if (err?.response?.status === 429) {
      console.log(
        `Error limited, should retry after ${err.response.headers["retry-after"]} seconds`
      );
      return { error: 429, retryAfter: err.response.headers["retry-after"] };
    }

    return { error: err?.response?.status };
  }
}

async function getCommunitiesToCrawl() {
  const oldResults = await readFromS3("discord-stats.json");
  const date = new Date().getTime();
  return await getCommunities("discord")
    .filter((name) => name.startsWith("https://discord.gg"))
    .filter((name) => {
      const key = name.split("discord.gg/")[1];
      const scrapedAt = oldResults[key]?.scraped_at || oldResults[key.toLowerCase()]?.scraped_at;

      if (scrapedAt && date - new Date(scrapedAt).getTime() < 1000 * 60 * 60) {
        console.log(`Skipping ${name} because it was crawled recently`);
        return false;
      } else {
        return true;
      }
    });
}

async function crawl() {
  const toCrawl = await getCommunitiesToCrawl();

  const result: any[] = [];

  for (const community of toCrawl) {
    const name = community.split("discord.gg/")[1];

    if (!name) {
      console.error(`Invalid name: ${community}`);
      continue;
    }

    console.log(`\nScraping ${name}...`);
    let triesRemaining = 3;

    while (triesRemaining > 0) {
      const data = await getDiscordStats(name);
      if (data.error && data.error === 429) {
        await delay((data.retryAfter + 1) * 1000);

        triesRemaining--;
        console.log("Try", 4 - triesRemaining);
      } else if (data.error) {
        triesRemaining--;
      } else if (data && !data.error) {
        result.push(data);
        break;
      }
    }
  }

  return result;
}

crawl().then(async (communities) => {
  const oldResults = await readFromS3("discord-stats.json");

  const outputArray = communities.filter(Boolean);

  const result = Object.assign(
    {},
    ...outputArray.map((c) => ({
      [c.code]: {
        subscribers: c.approximate_member_count,
        scraped_at: new Date().toISOString(),
      },
    }))
  );

  writeToAWS("discord-stats.json", JSON.stringify({ ...oldResults, ...result }));
});
