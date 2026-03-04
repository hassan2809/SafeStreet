import fetch from "node-fetch";
import * as cheerio from "cheerio";
import DeathStats from "../models/deathStats.model.js";

export async function scrapeStatsAndSave() {
  try {
    const url =
      "https://datahub.roadsafety.gov.au/progress-reporting/monthly-road-deaths";

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    const stats = [];
    $(".ct-promo-card__title.h3").each((i, el) => {
      const number = $(el).text().trim();
      const subtitle = $(el)
        .parent()
        .next(".ct-promo-card__subtitle")
        .text()
        .trim();
      stats.push({ number, subtitle });
    });

    const today = new Date().toISOString().split("T")[0];

    await DeathStats.findOneAndUpdate(
      { date: today },
      { stats, scrapedAt: new Date() },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}
