import { AxiosClient } from "../lib/axios.mts";

async function crawlAndRetry(
  client: AxiosClient,
  instance: string,
  communityName: string,
  attempt = 0
): Promise<any> {
  console.log(`crawling ${communityName} on ${instance} (attempt ${attempt})`);
  try {
    const communityData = await client.get(`https://${instance}/api/v3/community`, {
      params: { name: communityName },
    });

    if (communityData.data.community_view) {
      return communityData.data.community_view;
    } else {
      console.error(`Community ${communityName} not found on ${instance}`);
      return null;
    }
  } catch (e: any) {
    if (attempt < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await crawlAndRetry(client, instance, communityName, attempt + 1);
    }

    console.trace(`communityData error`, e);
    return null;
  }
}

function toJSON({ community, blocked, counts }: { community: any; blocked: boolean; counts: any }) {
  return {
    ...community,
    blocked,
    subscribers: counts.subscribers,
    posts: counts.posts,
    comments: counts.comments,
    users_active_day: counts.users_active_day,
    users_active_week: counts.users_active_week,
    users_active_month: counts.users_active_month,
    users_active_half_year: counts.users_active_half_year,
    hot_rank: counts.hot_rank,
    scraped_at: new Date().toISOString(),
  };
}

export async function crawl(instance: string, communityName: string) {
  const client = new AxiosClient();
  const data = await crawlAndRetry(client, instance, communityName);
  return data ? toJSON(data) : null;
}
