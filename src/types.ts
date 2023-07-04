export type Link = {
  service: string;
  url: string;
  official?: boolean;
  added_ts?: number;
};

export type Subreddit = {
  name: string;
  links: Link[];
};
