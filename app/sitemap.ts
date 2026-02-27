import { MetadataRoute } from "next";

const SITE_URL = "https://isitinthebible.com";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: SITE_URL,                  lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
  { url: `${SITE_URL}/about`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/methodology`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/privacy`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
];

const POPULAR_QUERIES: string[] = [
  "God helps those who help themselves",
  "Cleanliness is next to godliness",
  "This too shall pass",
  "Spare the rod spoil the child",
  "Money is the root of all evil",
  "Pride comes before a fall",
  "To thine own self be true",
  "The lion shall lie down with the lamb",
  "The Rapture",
  "Purgatory",
  "The Trinity",
  "Original Sin",
  "Guardian Angels",
  "Hell",
  "Heaven",
  "Soul Sleep",
  "Free Will",
  "Prosperity Gospel",
  "Predestination",
  "Baptism",
  "Confession",
  "Transubstantiation",
  "Immaculate Conception",
  "Penance",
  "Manifesting",
  "Karma",
  "Reincarnation",
  "Eye of a needle",
  "Turn the other cheek",
  "Love thy neighbor",
  "Judge not lest ye be judged",
  "The Golden Rule",
  "Do unto others",
  "Forbidden fruit",
  "Prodigal son",
  "Armageddon",
  "666 Mark of the Beast",
  "Second Coming",
  "Resurrection",
  "Judgment Day",
  "Eternal life",
  "Does God hate sinners",
  "Is suicide unforgivable",
  "Can women be pastors",
  "Is abortion in the Bible",
  "Homosexuality in the Bible",
  "Is tattoos a sin",
  "Is drinking alcohol a sin",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const queryPages: MetadataRoute.Sitemap = POPULAR_QUERIES.map((query) => ({
    url: `${SITE_URL}/?q=${encodeURIComponent(query)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...STATIC_PAGES, ...queryPages];
}