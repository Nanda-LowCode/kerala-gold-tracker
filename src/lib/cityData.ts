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
  ernakulam: {
    id: "ernakulam",
    metaDescriptionPrefix: "Today's gold rates in Ernakulam (Kochi district).",
    insightTitle: "Ernakulam — Kerala's Commercial Gold Hub",
    insightContent: "Ernakulam, the commercial twin of Kochi, hosts some of Kerala's busiest gold showrooms along MG Road, Broadway, and Jewellery Junction. NRI demand is exceptionally high here, with buyers from the Gulf routinely investing in 24K bars and 22K bridal sets. The city's cosmopolitan character drives strong appetite for both traditional Keralan designs and modern lightweight ornaments.",
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
  pathanamthitta: {
    id: "pathanamthitta",
    metaDescriptionPrefix: "Today's gold rates in Pathanamthitta.",
    insightTitle: "Pathanamthitta — Kerala's Pilgrim Gold Market",
    insightContent: "Pathanamthitta, the pilgrim capital of Kerala, sees uniquely high gold demand driven by Sabarimala pilgrims and a deeply Christian diaspora with strong Gulf connections. Religious jewellery — chains, rings, and crosses in 22K — are particularly popular alongside heavy bridal sets. The district's large NRI population ensures consistent investment demand throughout the year.",
  },
  idukki: {
    id: "idukki",
    metaDescriptionPrefix: "Today's gold rates in Idukki.",
    insightTitle: "Idukki — Plantation Wealth & Gold",
    insightContent: "Idukki's plantation economy — tea, cardamom, and rubber — generates steady surplus income that flows heavily into gold investment. Buyers here favour solid 22K jewellery and 24K coins as a reliable store of wealth, with purchases often timed around harvest seasons and major festival periods like Onam and Vishu.",
  },
  wayanad: {
    id: "wayanad",
    metaDescriptionPrefix: "Today's gold rates in Wayanad.",
    insightTitle: "Wayanad — Tribal & Agricultural Gold Traditions",
    insightContent: "Wayanad's gold market reflects its unique tribal and agricultural heritage. Traditional adornments remain culturally significant, with demand centred around local jewellers in Kalpetta and Mananthavady. The district's growing tourism economy is also driving demand for lightweight modern designs among younger buyers.",
  },
  kasaragod: {
    id: "kasaragod",
    metaDescriptionPrefix: "Today's gold rates in Kasaragod.",
    insightTitle: "Kasaragod — Gulf Gateway to Kerala",
    insightContent: "As Kerala's northernmost district, Kasaragod serves as a key entry point for Gulf returnees bringing gold into the state. The Tulu-speaking coastal communities here have a strong tradition of heavy gold adornment, and NRI-driven investment in 24K bars and coins is notably high year-round. Proximity to Karnataka also draws cross-border buyers.",
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
