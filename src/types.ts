export type Link = {
  service: string;
  url: string;
  official?: boolean;
  added_ts?: number;
  stats?: any;
};

export type Subreddit = {
  name: string;
  links: Link[];
};
