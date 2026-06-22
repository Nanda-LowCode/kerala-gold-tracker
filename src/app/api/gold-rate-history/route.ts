import { getHistory } from "@/app/page";

export const revalidate = 3600;

// Downloadable Kerala gold-rate history as CSV — a citable dataset (data
// resources attract backlinks). Served from the daily AKGSMA board rate;
// pre-launch rows (if backfilled) are tagged in `source` so users can tell
// official board rates from estimated history.
export async function GET() {
  const history = await getHistory();

  const header = [
    "date",
    "rate_18k_per_gram",
    "rate_22k_per_gram",
    "rate_24k_per_gram",
    "rate_22k_per_pavan_8g",
    "rate_silver_per_gram",
  ].join(",");

  // history is newest-first; output oldest-first for a natural time series.
  const rows = [...history]
    .reverse()
    .map((r) =>
      [
        r.date,
        r.rate_18k_1g,
        r.rate_22k_1g,
        r.rate_24k_1g,
        r.rate_22k_1g * 8,
        r.rate_silver_1g ?? "",
      ].join(",")
    );

  const csv = [
    "# Kerala Gold Rate History — source: livegoldkerala.com (AKGSMA board rate)",
    header,
    ...rows,
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kerala-gold-rate-history.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
