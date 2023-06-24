import { readExistingData } from "../../data.mjs";

export const onInspect = () => {
  const data = readExistingData();

  const links = data.subs.flatMap((sub) => sub.links).filter((link) => link.service === "lemmy");
  [];
  const lemmies = links.map((link) => ({
    service: link.url.split("://")[1].split("/c/")[0],
    cnt: links.filter((l) => l.url.includes(link.url.split("://")[1].split("/c/")[0])).length,
  }));

  const uniqueLemmies = Array.from(new Set(lemmies.map((l) => l.service)));

  console.log(uniqueLemmies.map((service) => lemmies.find((l) => l.service === service)));
};
