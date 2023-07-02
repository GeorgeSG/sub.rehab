import { readFileSync } from "fs";

const subredditsUrl = new URL("../../../../data/subreddits.json", import.meta.url);
const linksUrl = new URL("./links.json", import.meta.url);

const getExistingData = () => JSON.parse(readFileSync(subredditsUrl).toString()).subs;

export function manualImport() {
  const importData = JSON.parse(readFileSync(linksUrl).toString());
  const existingLinks = getExistingData()
    .flatMap((sub: any) => sub.links)
    .map((link: any) => link.url.toLowerCase());

  importData.forEach((link: string) => {
    if (!existingLinks.includes(link.toLowerCase())) {
      console.log(link);
    }
  });
}
