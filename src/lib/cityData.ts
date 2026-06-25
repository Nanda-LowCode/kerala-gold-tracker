export interface CityFaqItem {
  q: string;
  a: string;
}

export interface CityData {
  id: string;
  metaDescriptionPrefix: string;
  insightTitle: string;
  insightContent: string;
  localMarketFaq: CityFaqItem;
  buyingOccasionFaq: CityFaqItem;
}

export const CITY_DATA: Record<string, CityData> = {
  trivandrum: {
    id: "trivandrum",
    metaDescriptionPrefix: "Today's latest gold rates in Trivandrum.",
    insightTitle: "Trivandrum's Evolving Gold Market",
    insightContent: "As the capital city, Trivandrum hosts a diverse and fast-paced jewelry market, especially around MG Road and Chalai. While the base rate follows the Kerala board, buyers here often seek a mix of traditional Travancore heritage designs and modern aesthetics.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Trivandrum?",
      a: "MG Road is Trivandrum's main showroom strip — Kalyan Jewellers, Bhima, Joyalukkas, and Malabar Gold all have flagship stores here. Chalai Bazaar is the go-to for traditional Travancore heritage designs and older family jewellers. East Fort and Pazhavangadi areas have mid-range options popular with local buyers. For investment gold (coins and bars), the showrooms on MG Road near Overbridge offer the widest selection.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Trivandrum?",
      a: "Vishu (April) is the single biggest gold-buying event in Trivandrum — auspicious purchases peak across all communities. Onam (Aug-Sep) drives heavy ornament sales especially for lightweight daily-wear designs. The large Catholic population in East Trivandrum and Vattiyoorkavu makes Christmas a third major buying peak. Akshaya Tritiya in April-May is increasingly popular for first-time buyers looking for an auspicious date.",
    },
  },
  ernakulam: {
    id: "ernakulam",
    metaDescriptionPrefix: "Today's gold rates in Ernakulam (Kochi district).",
    insightTitle: "Ernakulam — Kerala's Commercial Gold Hub",
    insightContent: "Ernakulam, the commercial twin of Kochi, hosts some of Kerala's busiest gold showrooms along MG Road, Broadway, and Jewellery Junction. NRI demand is exceptionally high here, with buyers from the Gulf routinely investing in 24K bars and 22K bridal sets. The city's cosmopolitan character drives strong appetite for both traditional Keralan designs and modern lightweight ornaments.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Ernakulam?",
      a: "Jewellery Junction on the NH Bypass in Edapally is Kerala's largest dedicated gold mall — over 50 showrooms including every major chain under one roof. MG Road and Broadway in Ernakulam city are the traditional retail hubs. Gold Souk Grande in Edapally caters to premium buyers. For traditional Keralan designs and antique pieces, the jewellers in Mattancherry and Fort Kochi are worth visiting. Panampilly Nagar has upmarket boutique showrooms popular with the corporate crowd.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Ernakulam?",
      a: "Gulf NRIs returning for summer (May-Jun) and Christmas (Dec) drive Ernakulam's two biggest buying spikes. Onam produces the highest single-month retail volumes of the year. The large Syrian Christian community makes Easter and Christmas significant for bridal purchases. Akshaya Tritiya (Apr-May) is increasingly popular. Ernakulam's corporate economy also sustains steady year-round demand for lightweight and investment gold, even outside festival seasons.",
    },
  },
  kozhikode: {
    id: "kozhikode",
    metaDescriptionPrefix: "Get the current daily gold price in Kozhikode.",
    insightTitle: "A Legacy of Gold Trade in Calicut",
    insightContent: "Kozhikode's historical connection to ancient trade routes translates into a rich legacy of gold craftsmanship. From the bustling lanes near Mittai Theruvu to premium showrooms, the Kozhikode gold market is characterized by a strong demand for classic Malabar designs and high-purity investments.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Kozhikode?",
      a: "SM Street (Mittai Theruvu) near Mananchira Square has Kozhikode's oldest gold trading lanes — this is the place for traditional Malabar designs with filigree work and antique finishes that are rarely available elsewhere in Kerala. Mavoor Road and GH Road have major chain showrooms. The area around Palayam and Nadakkav caters to middle-market buyers. Kozhikode is particularly known for 'Malabar gold' — heavier ornaments with distinct North Kerala craftsmanship.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Kozhikode?",
      a: "Eid-ul-Fitr and Eid-ul-Adha are the biggest gold purchase events in Kozhikode — the large Mappila Muslim community makes these the peak days of the year. Wedding seasons follow Islamic calendar patterns, with Muharram-avoiding months seeing the highest bridal gold purchases. Onam and the post-monsoon harvest season (Sep-Oct) are significant for non-Muslim buyers. Gulf returnees from UAE, Qatar, and Oman typically make their largest purchases during summer and winter holiday visits.",
    },
  },
  thrissur: {
    id: "thrissur",
    metaDescriptionPrefix: "Live gold rates straight from Thrissur.",
    insightTitle: "The Gold Capital of India",
    insightContent: "Widely regarded as the 'Gold Capital of India,' Thrissur is the manufacturing and wholesale heartbeat of Kerala's jewelry industry. Nearly 70% of the state's gold jewelry is crafted in and around Thrissur, making it the most significant trendsetting city for daily gold purchases.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Thrissur?",
      a: "SN Park Road and Round South are the heart of India's gold manufacturing district — hundreds of showrooms and wholesale dealers line these streets. Puzhakkal and Ollur on the city outskirts have wholesale outlets where retail buyers can sometimes negotiate closer to manufacturing rates. Thrissur has over 3,000 registered gold jewellery units employing nearly 30,000 people. For investment gold (bars and coins), Thrissur wholesale dealers often offer marginally better rates than retail showrooms in other cities because of the supply chain proximity.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Thrissur?",
      a: "Thrissur Pooram (Apr-May) is the biggest single gold-buying event in any Kerala city — the festival's months-long build-up drives sustained purchase volumes across all income groups. Vishu in April compounds the peak. The Nov-Jan wedding season sees Thrissur's highest monthly retail volumes, with bridal sets from local manufacturers offering better variety than anywhere else in Kerala. Thrissur buyers are highly rate-conscious — tracking the daily board rate closely before any significant purchase is standard practice here.",
    },
  },
  kollam: {
    id: "kollam",
    metaDescriptionPrefix: "Check Kollam's verified daily 22K/24K gold rates.",
    insightTitle: "Kollam's Traditional Jewelry Demand",
    insightContent: "An ancient port city with a deep cultural heritage, Kollam maintains a very steady, high-volume demand for heavy bridal gold. Local buyers prioritize the purity and resale value, ensuring daily rate tracking is essential for family investments.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Kollam?",
      a: "Chinnakada commercial area is Kollam's main retail hub — major showrooms from Kalyan, Malabar Gold, and Bhima are concentrated here. Parameswar Temple Road has older, traditional jewellers known for heavy bridal sets in classic South Kerala style. Ashtamudickal and the area near Kollam beach road have mid-range outlets. Kollam's port and cashew-industry history made it one of Kerala's earliest gold-trading centres, and family jewellers in Chinnakada carry designs not commonly found in newer showrooms.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Kollam?",
      a: "Attukal Pongala (Feb-Mar) — one of the world's largest women's religious gatherings, drawing millions to Thiruvananthapuram — sees Kollam buyers make post-festival gold purchases in large numbers. Onam (Aug-Sep) and the Hindu wedding season (Nov-Jan) are the main annual peaks. Cashew export season (Mar-May) brings surplus liquidity that traditionally flows into gold investment. Akshaya Tritiya (Apr-May) is increasingly observed by both Hindu and Christian communities here.",
    },
  },
  palakkad: {
    id: "palakkad",
    metaDescriptionPrefix: "Reliable daily gold valuations in Palakkad.",
    insightTitle: "Cross-Border Market Influences",
    insightContent: "Sharing a border with Tamil Nadu, Palakkad features a unique intersection of traditional Kerala jewelry styles with distinct Tamil influences. The local market heavily favors intricate gold workmanship alongside standard solid investment pieces.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Palakkad?",
      a: "Bigbazar Road and the main market area around Palakkad town have the primary showrooms — Joyalukkas, Bhima, and Malabar Gold all have outlets here. The proximity to Tamil Nadu means buyers making large purchases often compare Palakkad rates with Coimbatore and Pollachi — cross-border shopping for major transactions (above 50 sovereigns) is common. Palakkad's Kanjikode industrial area has some wholesale-linked retailers. For traditional Tamil-style gold workmanship, the older family jewellers near Palakkad Fort are the specialists.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Palakkad?",
      a: "Pongal (Jan) is a significant buying occasion unique to Palakkad's large Tamil-origin population — it is observed here more seriously than in most other Kerala districts. Vishu and Onam remain Kerala-wide peaks. Wedding seasons in Palakkad span both Kerala (Nov-Jan) and Tamil Nadu (Apr-May) calendars, making the buying season notably wider than most districts. Akshaya Tritiya (Apr-May) sees some of Palakkad's highest single-day volumes, observed strongly by both communities.",
    },
  },
  kannur: {
    id: "kannur",
    metaDescriptionPrefix: "Finding the best gold prices today in Kannur.",
    insightTitle: "North Malabar's Premium Hub",
    insightContent: "Kannur represents a flourishing hub for premium gold consumption in North Malabar. Remittances from abroad heavily drive the purchasing power here, shifting preferences from just bridal gold towards consistent investment in 24K bars and coins.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Kannur?",
      a: "The area near Kannur Municipal Shopping Complex and Thavakkara Road has the main showrooms. Thalassery — the historic trading town 20 km south — has established family jewellers with a loyal clientele. Iritty and Payyanur in north Kannur serve outlying areas. Kannur district receives among the highest Gulf remittances per capita in North Malabar, making 24K coin and bar investment purchases particularly common here — most major showrooms stock a wider bullion selection than typical in other North Kerala towns.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Kannur?",
      a: "Theyyam season (Nov-May) draws devotees and visitors across North Kerala, boosting local spending including gold purchases around major rituals at Kannur's sacred groves. Eid-ul-Fitr is a major buying event for the Mappila community. Gulf returnees arriving in summer (May-Jun) and during Eid holidays make Kannur's largest individual purchases. The Nov-Jan wedding season is the peak for bridal gold. Vishu in April is the main auspicious-day buying event for the Hindu community.",
    },
  },
  alappuzha: {
    id: "alappuzha",
    metaDescriptionPrefix: "Alappuzha's fastest gold rate updates.",
    insightTitle: "Gold Trends in the Venice of the East",
    insightContent: "In Alappuzha, the demand for gold often correlates with the agricultural and local business cycles. Consumers are increasingly adopting smart buying strategies, utilizing daily board rates to time their purchases of lightweight, daily-wear ornaments.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Alappuzha?",
      a: "Mullackal area near the Mullackal Devi Temple is Alappuzha's commercial heart — major showrooms cluster here and along Mullackal Road. SNDP Junction and Maharaja Road have established mid-range retailers. Cherthala in the north and Kayamkulam in the south serve as satellite gold hubs for the district's outlying areas, with smaller showrooms catering to local buyers. For bridal gold, buyers in south Alappuzha often travel to Kayamkulam or Ernakulam for wider selection.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Alappuzha?",
      a: "Onam — the harvest festival most closely tied to Kerala's backwater identity — is Alappuzha's single biggest gold-buying event, with the Nehru Trophy Boat Race period (Aug) adding to the festive economy. Maramon Convention (Feb) draws tens of thousands of Syrian Christians; this gathering traditionally coincides with engagement planning and wedding preparation, driving early-year bridal gold demand. The fishing and agricultural income cycles make Oct-Nov another strong buying window. Akshaya Tritiya (Apr-May) is widely observed across all communities.",
    },
  },
  kottayam: {
    id: "kottayam",
    metaDescriptionPrefix: "Access Kottayam's market gold rates instantly.",
    insightTitle: "Investment-Driven Gold Buys",
    insightContent: "Backed by the wealth of agricultural and plantation economies, Kottayam buyers are some of the most consistent gold investors in the state. Tracking the daily board rate is customary before making substantial purchases in both 22K bridal sets and 24K bullion.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Kottayam?",
      a: "Baker Junction and KK Road in Kottayam town are the main jewellery hubs — Joyalukkas, Kalyan, and Malabar Gold flagship stores are here. TB Junction has premium showrooms popular with the affluent plantation community. Pala town (30 km east) is the gold-buying centre for the Knanaya community — showrooms here specialise in heavy traditional bridal sets. Erattupetta and Ponkunnam serve the highland agricultural areas. Kottayam district's high per-capita banking deposits translate into a strong preference for 24K coin and bar investment alongside 22K ornaments.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Kottayam?",
      a: "The large Syrian Christian community makes Christmas (Dec) and Easter the biggest gold-purchase events in Kottayam — engagement ceremonies and weddings cluster heavily around these dates. The Knanaya community's wedding tradition is uniquely significant: bridal gold sets of 100–150 sovereigns are not uncommon in Pala and Erattupetta. Onam and Vishu supplement demand. Rubber tapping income peaks (Feb-Mar and Sep-Oct) create predictable investment buying windows among the district's plantation families.",
    },
  },
  malappuram: {
    id: "malappuram",
    metaDescriptionPrefix: "Live updates for Malappuram gold prices.",
    insightTitle: "NRI Demand & High-Purity Focus",
    insightContent: "Malappuram boasts one of the highest volumes of gold trade per capita in the region, fueled largely by substantial Gulf remittances. Buyers here are extremely price-conscious but demand the absolute highest quality 916 hallmarked ornaments.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Malappuram?",
      a: "Manjeri (the district HQ's commercial centre) and Tirur town have the highest density of gold showrooms in the district. Perinthalmanna and Kondotty also have well-established outlets. Malappuram district is widely cited as having one of India's highest per-capita gold consumption rates, driven by Gulf remittances from UAE, Qatar, and Saudi Arabia. Buyers here are extremely quality-conscious — 916 BIS hallmark and purity certification are non-negotiable. Most major showrooms maintain dedicated NRI service counters for large-value transactions.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Malappuram?",
      a: "Eid-ul-Fitr marks the single highest gold-buying day of the year in Malappuram — gift purchases, new ornaments for the festival, and investment buys all peak simultaneously. Eid-ul-Adha is equally significant. The weeks following Ramadan see some of the highest sustained volumes in any Kerala district. Wedding seasons cluster heavily in post-Ramadan months and the winter period (Nov-Feb). Gulf returnees arriving for Eid and summer (May-Jun) make the largest individual purchases, often exceeding 50-100 sovereigns in a single transaction.",
    },
  },
  pathanamthitta: {
    id: "pathanamthitta",
    metaDescriptionPrefix: "Today's gold rates in Pathanamthitta.",
    insightTitle: "Pathanamthitta — Kerala's Pilgrim Gold Market",
    insightContent: "Pathanamthitta, the pilgrim capital of Kerala, sees uniquely high gold demand driven by Sabarimala pilgrims and a deeply Christian diaspora with strong Gulf connections. Religious jewellery — chains, rings, and crosses in 22K — are particularly popular alongside heavy bridal sets. The district's large NRI population ensures consistent investment demand throughout the year.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Pathanamthitta?",
      a: "Pathanamthitta town centre has the main showrooms — Joyalukkas, Kalyan, and several established family jewellers operate here. Adoor (the district's second commercial hub, 30 km south) has good options for southern Pathanamthitta buyers. Pandalam town — near the historic Pandalam Palace linked to Sabarimala — has family jewellers popular for religious ornaments (chains, crosses, and rings). For major bridal purchases requiring wide selection, buyers frequently travel to Ernakulam or Thiruvananthapuram.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Pathanamthitta?",
      a: "Mandalapooja and Makaravilakku (Dec-Jan) — the Sabarimala pilgrimage peak — bring hundreds of thousands through Pathanamthitta, boosting all local retail including gold. The large Gulf diaspora drives two major NRI return waves: summer (May-Jun) and December (Christmas-New Year). Easter and Christmas are the biggest festive buying events for this heavily Christian district. The Maramon Convention (Feb) draws large Syrian Christian congregations whose attendees include families planning engagements and weddings.",
    },
  },
  idukki: {
    id: "idukki",
    metaDescriptionPrefix: "Today's gold rates in Idukki.",
    insightTitle: "Idukki — Plantation Wealth & Gold",
    insightContent: "Idukki's plantation economy — tea, cardamom, and rubber — generates steady surplus income that flows heavily into gold investment. Buyers here favour solid 22K jewellery and 24K coins as a reliable store of wealth, with purchases often timed around harvest seasons and major festival periods like Onam and Vishu.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Idukki?",
      a: "Thodupuzha is Idukki's commercial capital with the main showrooms on Pala Road and the central market area — Kalyan, Malabar Gold, and Joyalukkas have branches here. Kattappana (for the Cardamom Hills area) and Munnar town have smaller outlets serving plantation workers and tourists. Nedumkandam and Adimali serve the high-range cardamom farming communities. For high-value or bridal purchases requiring wide selection, buyers typically travel to Ernakulam — a 2–3 hour drive — where the Jewellery Junction offers the largest showroom density in Kerala.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Idukki?",
      a: "Cardamom harvest (Oct-Nov) and rubber tapping income cycles directly drive gold buying in Idukki — plantation surplus income flows into gold more predictably here than in any other Kerala district. Oct-Dec is Idukki's strongest sustained buying window. Christmas is the major festive peak for this heavily Christian district, often outpacing even Onam. Vishu (Apr) is the main Hindu festive occasion. The tea and cardamom auction prices in Bodinayakanur and Kumily have a measurable effect on local gold demand the following month.",
    },
  },
  wayanad: {
    id: "wayanad",
    metaDescriptionPrefix: "Today's gold rates in Wayanad.",
    insightTitle: "Wayanad — Tribal & Agricultural Gold Traditions",
    insightContent: "Wayanad's gold market reflects its unique tribal and agricultural heritage. Traditional adornments remain culturally significant, with demand centred around local jewellers in Kalpetta and Mananthavady. The district's growing tourism economy is also driving demand for lightweight modern designs among younger buyers.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Wayanad?",
      a: "Kalpetta (district HQ) near the main bus stand and town centre has the primary showrooms — Malabar Gold and a few established family jewellers serve mainstream buyers. Mananthavady and Sultan Bathery have smaller outlets for the northern and eastern parts of the district. For high-value purchases or major bridal sets, most Wayanad buyers travel to Kozhikode city (1–2 hours away) for wider selection at competitive board rates. Local tribal craft jewellers in Kalpetta stock traditional adornments not available in chain showrooms.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Wayanad?",
      a: "Coffee and pepper harvest seasons (Nov-Jan) bring Wayanad's highest agricultural liquidity — plantation income surplus flows directly into gold investment during these months, making it the district's strongest buying window. Onam is the main Kerala-wide festive peak. The growing ecotourism season (Oct-Apr) increases economic activity and spending across Wayanad. Tribal festivals and the Kalpetta annual fair see community purchases of traditional ornaments. Christmas is significant for Wayanad's substantial Christian plantation community.",
    },
  },
  kasaragod: {
    id: "kasaragod",
    metaDescriptionPrefix: "Today's gold rates in Kasaragod.",
    insightTitle: "Kasaragod — Gulf Gateway to Kerala",
    insightContent: "As Kerala's northernmost district, Kasaragod serves as a key entry point for Gulf returnees bringing gold into the state. The Tulu-speaking coastal communities here have a strong tradition of heavy gold adornment, and NRI-driven investment in 24K bars and coins is notably high year-round. Proximity to Karnataka also draws cross-border buyers.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Kasaragod?",
      a: "Kasaragod town near Government Hospital Road has the main showrooms. Kanhangad — the district's second-largest town — has established retailers serving the industrial and coastal belt. Tulu-speaking coastal communities have long-standing family jewellers in Kasaragod and Bekal areas specialising in heavy traditional adornments. Cross-border shoppers from coastal Karnataka (Mangaluru is 70 km north) visit Kasaragod showrooms regularly, as Kerala board rates are competitive with Karnataka prices. Gulf returnees passing through Mangaluru airport often stop to purchase gold in Kasaragod.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Kasaragod?",
      a: "Dussera (Navaratri, Sep-Oct) is uniquely significant in Kasaragod for the Tulu-speaking community — it is observed here more seriously than in any other Kerala district. Gulf returnee influx drives buying during Eid, summer (May-Jun), and the December holiday period. Kasaragod's wedding season bridges both Kannada and Malayalam traditions, extending the peak from Oct through Feb — wider than most Kerala districts. Onam remains an important buying occasion for the sizeable Malayalam-speaking population.",
    },
  },
  calicut: {
    id: "calicut",
    metaDescriptionPrefix: "Today's gold rate in Calicut (Kozhikode).",
    insightTitle: "Calicut — Malabar's Historic Gold Capital",
    insightContent: "Calicut (officially Kozhikode) is the heart of the Malabar gold trade, with a centuries-old craftsmanship tradition centred on SM Street. The same Kerala board rate applies here as across the state, but Calicut is distinctive for heavier classic Malabar designs and strong Gulf-NRI investment demand from the large expatriate community in the UAE, Saudi Arabia and Oman.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Calicut?",
      a: "SM Street (Mittai Theruvu) near Mananchira is Calicut's oldest gold trading hub — the place for traditional Malabar filigree and antique-finish designs. Mavoor Road and GH Road carry the major chain showrooms (Malabar Gold, Bhima, Joyalukkas, Kalyan). Palayam and Nadakkav serve mid-market buyers. Calicut is especially known for heavier 'Malabar gold' ornaments with distinct North Kerala craftsmanship rarely found in the south of the state.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Calicut?",
      a: "Eid-ul-Fitr and Eid-ul-Adha are the biggest gold-buying events in Calicut, given the large Mappila Muslim community. Wedding purchases follow the Islamic calendar. Onam and the post-monsoon harvest months (Sep-Oct) are significant for other communities. Gulf returnees from the UAE, Qatar and Oman typically make their largest purchases during summer and winter holiday visits.",
    },
  },
  kochi: {
    id: "kochi",
    metaDescriptionPrefix: "Today's latest gold rates in Kochi.",
    insightTitle: "Kochi's Cosmopolitan Gold Market",
    insightContent: "As the commercial capital of Kerala, Kochi drives massive retail gold sales. The market here is highly cosmopolitan, with buyers tracking the daily fluctuations closely to make both heavy traditional bridal purchases and modern, lightweight investment choices.",
    localMarketFaq: {
      q: "Where are the best places to buy gold in Kochi?",
      a: "Jewellery Junction on the NH Bypass in Edapally is Kerala's largest dedicated gold mall — over 50 showrooms including all major chains (Malabar Gold, Kalyan, Bhima, Joyalukkas, Tanishq) under one roof. MG Road in Ernakulam city is the traditional retail strip. Gold Souk Grande in Edapally caters to premium buyers. For heritage and traditional designs, the jewellers in Mattancherry and Fort Kochi carry antique Keralan styles favoured by NRI buyers and tourists. Panampilly Nagar has boutique showrooms popular with the corporate and IT community.",
    },
    buyingOccasionFaq: {
      q: "When is the best time to buy gold in Kochi?",
      a: "Gulf NRIs returning for summer (May-Jun) and Christmas-New Year (Dec-Jan) drive Kochi's two biggest purchase spikes. Onam produces the highest single-month retail volumes of the year. Akshaya Tritiya (Apr-May) sees long queues at major showrooms — it is considered the most auspicious day for new gold purchases. Kochi's IT and corporate economy sustains steady year-round demand for lightweight ornaments and investment gold outside festival seasons, making it the most consistent buyer base of any Kerala city.",
    },
  },
};

export function getCityData(cityId: string): CityData | null {
  const normalized = cityId.toLowerCase();
  return CITY_DATA[normalized] || null;
}

/**
 * Notable towns in each district. The Kerala board rate is uniform statewide,
 * so listing a district's towns on its city page gives town-level "gold rate
 * today {town}" searches (Vadakara, Kunnamkulam, Muvattupuzha, etc.) a relevant
 * page to rank — without spinning up thin duplicate town pages. Curated to
 * include the towns that show real search demand in Search Console.
 */
export const DISTRICT_TOWNS: Record<string, string[]> = {
  trivandrum: ["Neyyattinkara", "Attingal", "Nedumangad", "Varkala", "Kazhakkoottam", "Kovalam"],
  kollam: ["Karunagappally", "Kottarakkara", "Punalur", "Paravur", "Chavara", "Kundara"],
  pathanamthitta: ["Adoor", "Thiruvalla", "Pandalam", "Ranni", "Mallappally", "Konni"],
  alappuzha: ["Cherthala", "Kayamkulam", "Mavelikkara", "Chengannur", "Haripad", "Ambalapuzha"],
  kottayam: ["Pala", "Changanassery", "Ettumanoor", "Kanjirappally", "Vaikom", "Erattupetta"],
  idukki: ["Thodupuzha", "Munnar", "Kattappana", "Nedumkandam", "Adimali"],
  ernakulam: ["Muvattupuzha", "Aluva", "Angamaly", "Perumbavoor", "Kothamangalam", "Tripunithura", "Kalady"],
  kochi: ["Tripunithura", "Aluva", "Perumbavoor", "Muvattupuzha", "Angamaly", "Kakkanad", "Fort Kochi"],
  thrissur: ["Kunnamkulam", "Chalakudy", "Irinjalakuda", "Chavakkad", "Kodungallur", "Guruvayur", "Wadakkanchery"],
  palakkad: ["Ottapalam", "Shoranur", "Chittur", "Mannarkkad", "Pattambi", "Cherpulassery"],
  malappuram: ["Nilambur", "Tirur", "Manjeri", "Perinthalmanna", "Ponnani", "Kottakkal", "Tanur"],
  kozhikode: ["Vadakara", "Koyilandy", "Ramanattukara", "Feroke", "Mukkam", "Thamarassery", "Koduvally"],
  calicut: ["Vadakara", "Koyilandy", "Ramanattukara", "Feroke", "Mukkam", "Thamarassery", "Koduvally"],
  wayanad: ["Kalpetta", "Mananthavady", "Sulthan Bathery", "Meppadi"],
  kannur: ["Thalassery", "Payyanur", "Iritty", "Taliparamba", "Mattannur", "Kuthuparamba"],
  kasaragod: ["Kanhangad", "Nileshwar", "Uppala", "Bekal", "Cheruvathur"],
};

export function getCityTowns(cityId: string): string[] {
  return DISTRICT_TOWNS[cityId.toLowerCase()] ?? [];
}
