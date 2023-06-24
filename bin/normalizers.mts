export const normalizeSubreddit = (subreddit: string) => {
  let response = subreddit.trim();
  if (response.startsWith("/")) {
    response = response.slice(1);
  }

  if (response.endsWith("/")) {
    response = response.slice(0, -1);
  }

  return response;
};

export const normalizeLink = (link: string) => {
  let response = link.trim();
  if (response.startsWith("http://")) {
    response = response.replace("http://", "https://");
  }

  if (!response.startsWith("https://")) {
    response = `https://${response}`;
  }

  if (response.endsWith("/")) {
    response = response.slice(0, -1);
  }
  return response;
};
