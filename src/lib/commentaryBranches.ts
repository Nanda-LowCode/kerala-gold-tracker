// Phrasing variants for the daily news commentary generator.
// Each branch is an array of complete sentences. Placeholders use {name}
// syntax and are substituted by the generator before output.

export const RISING_STREAK: string[] = [
  "Kerala's gold market continues its upward run, marking {days} consecutive days of gains.",
  "The Kerala board rate climbed again today, extending a {days}-day rally.",
  "Gold buyers in Kerala are watching another rise, the {days}th in a row.",
  "Today marks the {days}th straight session of higher 22K prices in Kerala.",
  "The trend remains firmly upward — {days} days of consecutive increases in the Kerala gold rate.",
  "Kerala's gold rate has now risen for {days} straight days, a notable run for short-term buyers.",
];

export const FALLING_STREAK: string[] = [
  "Kerala's gold rate has now eased for {days} consecutive days, offering relief to buyers.",
  "The board rate slipped again today, extending a {days}-day decline.",
  "Today's update marks the {days}th straight day of softer prices for Kerala buyers.",
  "Gold has been on a downward run, with {days} consecutive sessions of lower rates.",
  "The Kerala market continues to cool, posting its {days}th straight day of declines.",
  "Buyers eyeing a window may take note: {days} consecutive days of price drops in Kerala.",
];

export const FLAT_TODAY: string[] = [
  "The Kerala board rate held flat today, with no change from yesterday.",
  "Today's update brings no movement in Kerala's gold rate.",
  "The Kerala market took a breather, leaving the 22K rate unchanged from yesterday.",
  "No change in the board rate today — the Kerala gold price is steady.",
  "Gold rates in Kerala held their ground today, posting no day-over-day change.",
  "It was a flat session for Kerala gold today, with the board rate unchanged.",
];

export const MIXED_RECENT: string[] = [
  "Recent sessions have been mixed, with the market swinging in both directions before settling today.",
  "The last several days have shown no clear direction in Kerala's gold rate.",
  "Trading has been choppy this week, with gains and losses alternating.",
  "Kerala's gold rate has moved sideways with no sustained direction lately.",
  "Recent price action has been uneven, making short-term trends harder to read.",
  "The market has lacked conviction this week, alternating between small gains and losses.",
];

export const NEW_HIGH: string[] = [
  "Today's rate sets a fresh 30-day high in Kerala.",
  "The 22K price in Kerala just hit its highest level in a month.",
  "Kerala buyers are looking at a new monthly peak for gold today.",
  "Today's level marks the highest the Kerala board rate has been in the past 30 days.",
  "Gold in Kerala has broken to a new monthly high.",
  "The current rate is the dearest gold has been for Kerala buyers in the last 30 days.",
];

export const NEAR_HIGH: string[] = [
  "Today's level sits near the top of the 30-day range — gold is on the expensive side relative to the past month.",
  "Kerala's gold rate is trading close to its monthly peak.",
  "Today's price is in the upper portion of where it's been this month.",
  "Buyers are facing rates near the upper edge of the 30-day band.",
  "The current rate is closer to the month's high than its low.",
  "Today's level is in the priciest fifth of the last 30 days.",
];

export const NEAR_LOW: string[] = [
  "Today's level sits near the bottom of the 30-day range, often a notable zone for buyers.",
  "Kerala's gold rate is trading close to its monthly low — a watched level for jewellery shoppers.",
  "Today's price is in the lower portion of where it's been this month, historically a buying window.",
  "Buyers are seeing rates near the lower edge of the 30-day band.",
  "The current rate is closer to the month's low than its high.",
  "Today's level is in the cheapest fifth of the last 30 days.",
];

export const NEW_LOW: string[] = [
  "Today's rate prints a fresh 30-day low in Kerala — the cheapest gold has been in a month.",
  "Kerala buyers are looking at the lowest 22K rate of the past 30 days.",
  "Gold in Kerala just broke to a new monthly low.",
  "The current rate is the lowest the Kerala board rate has been in the last 30 days.",
  "Today's update sets a fresh monthly low for Kerala gold.",
  "Buyers eyeing a discount may take note: today is the cheapest gold has been this month.",
];

export const MID_RANGE: string[] = [
  "Today's rate sits in the middle of the 30-day range — no extreme reading either way.",
  "The current price is roughly in the middle of where gold has traded this month.",
  "Kerala's gold rate is at a neutral level relative to the past 30 days.",
  "Today's rate is mid-range when compared to the last month's prices.",
  "The price is neither rich nor cheap by recent standards.",
  "Today's level is right around the centre of the past month's band.",
];

export const PAVAN_NOTE: string[] = [
  "At today's rate, one pavan (8 grams) of 22K gold works out to {pavan}.",
  "For pavan buyers, today's 22K rate translates to {pavan} for a single sovereign.",
  "Wedding-bound buyers should note: a pavan of 22K is priced at {pavan} today.",
  "The pavan-level price — 8 grams of 22K — sits at {pavan} based on today's update.",
  "In pavan terms, today's 22K rate amounts to {pavan} per sovereign.",
  "Today's 22K rate puts one pavan at {pavan}.",
];

export const ABOVE_MONTH_AVG: string[] = [
  "The current rate is {pct}% above the 30-day average, suggesting recent strength.",
  "Today's price sits {pct}% over the rolling 30-day average for Kerala gold.",
  "Buyers are paying {pct}% more than the monthly average right now.",
  "Compared with the 30-day mean, today's rate is {pct}% higher.",
  "The market is trading {pct}% above its 30-day average — on the firmer side.",
  "Today's level is {pct}% above the recent monthly mean.",
];

export const BELOW_MONTH_AVG: string[] = [
  "The current rate is {pct}% below the 30-day average, a softer reading versus the recent trend.",
  "Today's price sits {pct}% under the rolling 30-day average for Kerala gold.",
  "Buyers are getting today's gold at {pct}% less than the monthly average.",
  "Compared with the 30-day mean, today's rate is {pct}% lower.",
  "The market is trading {pct}% below its 30-day average — on the softer side.",
  "Today's level is {pct}% under the recent monthly mean.",
];

export const AT_MONTH_AVG: string[] = [
  "The current rate sits right around the 30-day average for Kerala gold.",
  "Today's price is in line with the rolling 30-day average.",
  "Buyers are paying close to the monthly average right now.",
  "The market is trading at roughly the 30-day mean.",
  "Compared with the past month, today's level is neither expensive nor cheap.",
  "Today's rate matches the recent monthly mean almost exactly.",
];
