// app/topic/topics.ts
// Single source of truth for all SEO topic pages + sitemap

export interface Topic {
  slug: string;
  query: string;
  category: "misquote" | "doctrine" | "cultural" | "moral" | "eschatology";
}

export const TOPICS: Topic[] = [
  // ── Common misquotes ──────────────────────────────────────────────────────
  { slug: "god-helps-those-who-help-themselves",  query: "God helps those who help themselves",  category: "misquote"     },
  { slug: "cleanliness-is-next-to-godliness",     query: "Cleanliness is next to godliness",     category: "misquote"     },
  { slug: "this-too-shall-pass",                  query: "This too shall pass",                  category: "misquote"     },
  { slug: "spare-the-rod-spoil-the-child",        query: "Spare the rod spoil the child",        category: "misquote"     },
  { slug: "money-is-the-root-of-all-evil",        query: "Money is the root of all evil",        category: "misquote"     },
  { slug: "pride-comes-before-a-fall",            query: "Pride comes before a fall",            category: "misquote"     },
  { slug: "to-thine-own-self-be-true",            query: "To thine own self be true",            category: "misquote"     },
  { slug: "lion-shall-lie-down-with-the-lamb",    query: "The lion shall lie down with the lamb",category: "misquote"     },
  { slug: "forbidden-fruit",                      query: "Forbidden fruit",                      category: "misquote"     },

  // ── Church doctrines ──────────────────────────────────────────────────────
  { slug: "the-rapture",                          query: "The Rapture",                          category: "doctrine"     },
  { slug: "purgatory",                            query: "Purgatory",                            category: "doctrine"     },
  { slug: "the-trinity",                          query: "The Trinity",                          category: "doctrine"     },
  { slug: "original-sin",                         query: "Original Sin",                         category: "doctrine"     },
  { slug: "guardian-angels",                      query: "Guardian Angels",                      category: "doctrine"     },
  { slug: "soul-sleep",                           query: "Soul Sleep",                           category: "doctrine"     },
  { slug: "free-will",                            query: "Free Will",                            category: "doctrine"     },
  { slug: "prosperity-gospel",                    query: "Prosperity Gospel",                    category: "doctrine"     },
  { slug: "predestination",                       query: "Predestination",                       category: "doctrine"     },
  { slug: "baptism",                              query: "Baptism",                              category: "doctrine"     },
  { slug: "confession",                           query: "Confession",                           category: "doctrine"     },
  { slug: "transubstantiation",                   query: "Transubstantiation",                   category: "doctrine"     },
  { slug: "immaculate-conception",                query: "Immaculate Conception",                category: "doctrine"     },
  { slug: "penance",                              query: "Penance",                              category: "doctrine"     },

  // ── Cultural beliefs ──────────────────────────────────────────────────────
  { slug: "manifesting",                          query: "Manifesting",                          category: "cultural"     },
  { slug: "karma",                                query: "Karma",                                category: "cultural"     },
  { slug: "reincarnation",                        query: "Reincarnation",                        category: "cultural"     },

  // ── Moral & ethical questions ─────────────────────────────────────────────
  { slug: "eye-of-a-needle",                      query: "Eye of a needle",                      category: "moral"        },
  { slug: "turn-the-other-cheek",                 query: "Turn the other cheek",                 category: "moral"        },
  { slug: "love-thy-neighbor",                    query: "Love thy neighbor",                    category: "moral"        },
  { slug: "judge-not-lest-ye-be-judged",          query: "Judge not lest ye be judged",          category: "moral"        },
  { slug: "the-golden-rule",                      query: "The Golden Rule",                      category: "moral"        },
  { slug: "do-unto-others",                       query: "Do unto others",                       category: "moral"        },
  { slug: "prodigal-son",                         query: "Prodigal son",                         category: "moral"        },
  { slug: "does-god-hate-sinners",                query: "Does God hate sinners",                category: "moral"        },
  { slug: "is-suicide-unforgivable",              query: "Is suicide unforgivable",              category: "moral"        },
  { slug: "can-women-be-pastors",                 query: "Can women be pastors",                 category: "moral"        },
  { slug: "is-abortion-in-the-bible",             query: "Is abortion in the Bible",             category: "moral"        },
  { slug: "homosexuality-in-the-bible",           query: "Homosexuality in the Bible",           category: "moral"        },
  { slug: "is-tattoos-a-sin",                     query: "Is tattoos a sin",                     category: "moral"        },
  { slug: "is-drinking-alcohol-a-sin",            query: "Is drinking alcohol a sin",            category: "moral"        },

  // ── Eschatology ───────────────────────────────────────────────────────────
  { slug: "hell",                                 query: "Hell",                                 category: "eschatology"  },
  { slug: "heaven",                               query: "Heaven",                               category: "eschatology"  },
  { slug: "armageddon",                           query: "Armageddon",                           category: "eschatology"  },
  { slug: "666-mark-of-the-beast",                query: "666 Mark of the Beast",                category: "eschatology"  },
  { slug: "second-coming",                        query: "Second Coming",                        category: "eschatology"  },
  { slug: "resurrection",                         query: "Resurrection",                         category: "eschatology"  },
  { slug: "judgment-day",                         query: "Judgment Day",                         category: "eschatology"  },
  { slug: "eternal-life",                         query: "Eternal life",                         category: "eschatology"  },
];

export function getTopicBySlug(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function getAllSlugs(): string[] {
  return TOPICS.map((t) => t.slug);
}