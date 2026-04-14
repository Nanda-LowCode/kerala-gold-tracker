export interface CityData {
  id: string;
  metaDescriptionPrefix: string;
  insightTitle: string;
  insightContent: string;
}

export const CITY_DATA: Record<string, CityData> = {
  trivandrum: {
    id: "trivandrum",
    metaDescriptionPrefix: "Today's latest gold rates in Trivandrum.",
    insightTitle: "Trivandrum's Evolving Gold Market",
    insightContent: "As the capital city, Trivandrum hosts a diverse and fast-paced jewelry market, especially around MG Road and Chalai. While the base rate follows the Kerala board, buyers here often seek a mix of traditional Travancore heritage designs and modern aesthetics.",
  },
  kozhikode: {
    id: "kozhikode",
    metaDescriptionPrefix: "Get the current daily gold price in Kozhikode.",
    insightTitle: "A Legacy of Gold Trade in Calicut",
    insightContent: "Kozhikode's historical connection to ancient trade routes translates into a rich legacy of gold craftsmanship. From the bustling lanes near Mittai Theruvu to premium showrooms, the Kozhikode gold market is characterized by a strong demand for classic Malabar designs and high-purity investments.",
  },
  thrissur: {
    id: "thrissur",
    metaDescriptionPrefix: "Live gold rates straight from Thrissur.",
    insightTitle: "The Gold Capital of India",
    insightContent: "Widely regarded as the 'Gold Capital of India,' Thrissur is the manufacturing and wholesale heartbeat of Kerala's jewelry industry. Nearly 70% of the state's gold jewelry is crafted in and around Thrissur, making it the most significant trendsetting city for daily gold purchases.",
  },
  kollam: {
    id: "kollam",
    metaDescriptionPrefix: "Check Kollam's verified daily 22K/24K gold rates.",
    insightTitle: "Kollam's Traditional Jewelry Demand",
    insightContent: "An ancient port city with a deep cultural heritage, Kollam maintains a very steady, high-volume demand for heavy bridal gold. Local buyers prioritize the purity and resale value, ensuring daily rate tracking is essential for family investments.",
  },
  palakkad: {
    id: "palakkad",
    metaDescriptionPrefix: "Reliable daily gold valuations in Palakkad.",
    insightTitle: "Cross-Border Market Influences",
    insightContent: "Sharing a border with Tamil Nadu, Palakkad features a unique intersection of traditional Kerala jewelry styles with distinct Tamil influences. The local market heavily favors intricate gold workmanship alongside standard solid investment pieces.",
  },
  kannur: {
    id: "kannur",
    metaDescriptionPrefix: "Finding the best gold prices today in Kannur.",
    insightTitle: "North Malabar's Premium Hub",
    insightContent: "Kannur represents a flourishing hub for premium gold consumption in North Malabar. Remittances from abroad heavily drive the purchasing power here, shifting preferences from just bridal gold towards consistent investment in 24K bars and coins.",
  },
  alappuzha: {
    id: "alappuzha",
    metaDescriptionPrefix: "Alappuzha's fastest gold rate updates.",
    insightTitle: "Gold Trends in the Venice of the East",
    insightContent: "In Alappuzha, the demand for gold often correlates with the agricultural and local business cycles. Consumers are increasingly adopting smart buying strategies, utilizing daily board rates to time their purchases of lightweight, daily-wear ornaments.",
  },
  kottayam: {
    id: "kottayam",
    metaDescriptionPrefix: "Access Kottayam's market gold rates instantly.",
    insightTitle: "Investment-Driven Gold Buys",
    insightContent: "Backed by the wealth of agricultural and plantation economies, Kottayam buyers are some of the most consistent gold investors in the state. Tracking the daily board rate is customary before making substantial purchases in both 22K bridal sets and 24K bullion.",
  },
  malappuram: {
    id: "malappuram",
    metaDescriptionPrefix: "Live updates for Malappuram gold prices.",
    insightTitle: "NRI Demand & High-Purity Focus",
    insightContent: "Malappuram boasts one of the highest volumes of gold trade per capita in the region, fueled largely by substantial Gulf remittances. Buyers here are extremely price-conscious but demand the absolute highest quality 916 hallmarked ornaments.",
  },
  kochi: {
    id: "kochi",
    metaDescriptionPrefix: "Today's latest gold rates in Kochi.",
    insightTitle: "Kochi's Cosmopolitan Gold Market",
    insightContent: "As the commercial capital of Kerala, Kochi drives massive retail gold sales. The market here is highly cosmopolitan, with buyers tracking the daily fluctuations closely to make both heavy traditional bridal purchases and modern, lightweight investment choices.",
  },
};

export function getCityData(cityId: string): CityData | null {
  const normalized = cityId.toLowerCase();
  return CITY_DATA[normalized] || null;
}
