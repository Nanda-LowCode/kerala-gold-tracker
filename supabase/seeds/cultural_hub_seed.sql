-- ============================================================
-- Cultural Hub: seed data
-- Run AFTER 20260424_001_cultural_hub_schema.sql
-- All dates and muhurats sourced as noted; verify annually.
-- ============================================================

-- ── FESTIVALS ────────────────────────────────────────────────────
insert into festivals (slug, name_en, name_ml, category, is_gold_buying_day) values
  ('vishu',                    'Vishu',             'വിഷു',           'hindu',    false),
  ('akshaya-tritiya',          'Akshaya Tritiya',   'അക്ഷയ തൃതീയ',   'hindu',    true),
  ('onam',                     'Onam',              'ഓണം',            'cultural', false),
  ('dhanteras',                'Dhanteras',         'ധൻതേരസ്',        'hindu',    true),
  ('navratri',                 'Navratri',          'നവരാത്രി',       'hindu',    false),
  ('thiruvathira',             'Thiruvathira',      'തിരുവാതിര',      'hindu',    false),
  ('sabarimala-makaravilakku', 'Makaravilakku',     'മകരവിളക്ക്',     'hindu',    false),
  ('thrissur-pooram',          'Thrissur Pooram',   'തൃശൂർ പൂരം',     'cultural', false),
  ('pushya-nakshatra',         'Pushya Nakshatra',  'പൂയം നക്ഷത്രം',  'cultural', true);


-- ── FESTIVAL DATES (verified 2026 data from spec) ───────────────
-- Source: DrikPanchang, ProKerala, Sabarimala Devaswom

-- Vishu 2026 — Kerala public holiday
insert into festival_dates (festival_id, date, notes, source_url)
values (
  (select id from festivals where slug = 'vishu'),
  '2026-04-15',
  'Kerala public holiday. Kani arranged the night before; family views at dawn.',
  'https://www.drikpanchang.com/malayalam/vishu/kerala-vishu-date.html'
);

-- Akshaya Tritiya 2026 — Abujh muhurat (entire day auspicious)
insert into festival_dates (festival_id, date, muhurat_start, muhurat_end, notes, source_url)
values (
  (select id from festivals where slug = 'akshaya-tritiya'),
  '2026-04-19',
  '2026-04-19T10:49:00+05:30',
  '2026-04-20T07:27:00+05:30',
  'Tritiya tithi: 10:49 AM Apr 19 → 7:27 AM Apr 20. Abujh Muhurat — no specific auspicious window required; entire day is considered auspicious.',
  'https://www.drikpanchang.com/festivals/akshaya-tritiya.html'
);

-- Onam 2026 — Atham (first day)
insert into festival_dates (festival_id, date, notes, source_url)
values (
  (select id from festivals where slug = 'onam'),
  '2026-08-16',
  'Atham — first of the 10 Onam days. Thrikkakara Temple Festival begins.',
  'https://www.prokerala.com/festivals/onam/'
);

-- Onam 2026 — Thiruvonam (main day)
insert into festival_dates (festival_id, date, notes, source_url)
values (
  (select id from festivals where slug = 'onam'),
  '2026-08-25',
  'Thiruvonam — principal Onam day. Kerala public holiday.',
  'https://www.prokerala.com/festivals/onam/'
);

-- Makaravilakku 2026 (already occurred Jan 14)
insert into festival_dates (festival_id, date, notes, source_url)
values (
  (select id from festivals where slug = 'sabarimala-makaravilakku'),
  '2026-01-14',
  'Thiruvabharanam procession arrives Sannidhanam. Makaravilakku observed on 1st of Malayalam month Makaram.',
  'https://sabarimala.kerala.gov.in/'
);

-- Makaravilakku 2027 — verify exact date with Devaswom Board ~Nov 2026
insert into festival_dates (festival_id, date, notes, source_url)
values (
  (select id from festivals where slug = 'sabarimala-makaravilakku'),
  '2027-01-14',
  'Approximate: verify with Travancore Devaswom Board 60 days before. Thiruvabharanam departs Pandalam ~Jan 11.',
  'https://sabarimala.kerala.gov.in/'
);


-- ── ORNAMENTS (23 entries) ────────────────────────────────────────
-- name_ml: null where Malayalam script is unverified (jhoomar-passa, haathphool)
-- community_tags: communities that traditionally wear this ornament
-- weights: indicative per World Gold Council / spec defaults; flag as approximate in UI

insert into ornaments (slug, name_en, name_ml, transliteration, community_tags, typical_weight_pavan_min, typical_weight_pavan_max) values
  ('palakka-mala',      'Palakka Mala',         'പാലക്ക മാല',     'pālakka māla',      array['nair','ezhava'],                                           3.00,  5.00),
  ('kasu-mala',         'Kasu Mala',            'കാശു മാല',        'kāśu māla',         array['nair','namboothiri','ezhava','syrian-christian'],           4.00,  8.00),
  ('mullamottu-mala',   'Mullamottu Mala',      'മുല്ലമൊട്ട് മാല','mullamottu māla',    array['nair','ezhava'],                                           2.00,  4.00),
  ('nagapadam-thali',   'Nagapadam Thali',      'നാഗപദം താലി',    'nāgapadam thāli',   array['nair'],                                                    0.50,  1.00),
  ('manga-mala',        'Manga Mala',           'മാങ്ങ മാല',       'māṅga māla',        array['nair','ezhava'],                                           3.00,  5.00),
  ('karimani-mala',     'Karimani Mala',        'കരിമണി മാല',      'karimani māla',     array['nair','ezhava','syrian-christian'],                        1.00,  3.00),
  ('lakshmi-mala',      'Lakshmi Mala',         'ലക്ഷ്മി മാല',     'lakṣmī māla',       array['nair','ezhava'],                                           2.00,  4.00),
  ('pichimottu-mala',   'Pichimottu Mala',      'പിച്ചിമൊട്ട് മാല','pichimottu māla',  array['nair','ezhava'],                                           2.00,  3.00),
  ('cheruthali',        'Cheruthali',           'ചെറുതാലി',        'cheruthāli',        array['nair','ezhava'],                                           0.50,  1.00),
  ('addiyal',           'Addiyal',              'അടിയാൾ',          'aḍiyāḷ',            array['nair','ezhava'],                                           2.00,  4.00),
  ('poothali',          'Poothali',             'പൂത്താലി',        'pūththāli',         array['nair','ezhava'],                                           1.00,  2.00),
  ('kumbla-thali',      'Kumbla Thali',         'കുമ്പ്ള താലി',    'kumbḷa thāli',      array['nair'],                                                    0.50,  1.00),
  ('malarthi-thali',    'Malarthi Thali',       'മലർത്തി താലി',    'malarthi thāli',    array['namboothiri'],                                             0.50,  1.00),
  ('minnu',             'Minnu',                'മിന്ന്',           'minnu',             array['syrian-christian'],                                        0.50,  1.00),
  ('netti-chutti',      'Netti Chutti',         'നെറ്റിച്ചുട്ടി',  'neṭṭichuṭṭi',       array['nair','ezhava','namboothiri'],                             1.00,  2.00),
  ('jadanagam',         'Jadanagam',            'ജടനാഗം',          'jaṭanāgam',         array['nair','ezhava'],                                           0.50,  1.00),
  ('vanki-aaram',       'Vanki / Aaram',        'വാങ്കി',           'vāṅki',             array['nair','ezhava'],                                           1.00,  3.00),
  ('oddiyanam',         'Oddiyanam',            'ഒഡ്ഡ്യാണം',       'oḍḍyāṇam',          array['nair','ezhava'],                                           2.00,  4.00),
  ('thadavala-ottavala','Thadavala & Ottavala', 'തടവള',            'thaḍavala',         array['nair','ezhava','namboothiri','syrian-christian'],          4.00, 10.00),
  ('jhimki',            'Jhimki',               'ഝിമ്കി',           'jhimki',            array['nair','ezhava','namboothiri','syrian-christian','mappila-muslim'], 0.50, 1.00),
  ('jhoomar-passa',     'Jhoomar / Passa',      null,              'jhoomar',           array['mappila-muslim'],                                          1.00,  3.00),
  ('arappatta',         'Arappatta',            'അരപ്പട്ട',         'arappatta',         array['mappila-muslim'],                                          2.00,  4.00),
  ('haathphool',        'Haathphool',           null,              'haathphool',        array['mappila-muslim'],                                          0.50,  1.00);


-- ── TEMPLES (9 entries from spec) ───────────────────────────────
-- Coordinates verified from Google Maps / Wikidata

insert into temples (slug, name_en, name_ml, district, lat, lng, deity, primary_festival_id) values
  (
    'sabarimala',
    'Sabarimala Sree Dharma Sastha Temple',
    'ശബരിമല ശ്രീ ധർമ്മശാസ്താ ക്ഷേത്രം',
    'Pathanamthitta', 9.434700, 77.084100,
    'Lord Ayyappa (Dharma Sastha)',
    (select id from festivals where slug = 'sabarimala-makaravilakku')
  ),
  (
    'guruvayur',
    'Guruvayur Sree Krishna Temple',
    'ഗുരുവായൂർ ശ്രീകൃഷ്ണ ക്ഷേത്രം',
    'Thrissur', 10.596700, 76.041200,
    'Lord Guruvayurappan (Krishna/Vishnu)',
    null
  ),
  (
    'padmanabhaswamy',
    'Sree Padmanabhaswamy Temple',
    'ശ്രീ പദ്മനാഭസ്വാമി ക്ഷേത്രം',
    'Thiruvananthapuram', 8.482700, 76.949600,
    'Lord Padmanabha (Vishnu)',
    null
  ),
  (
    'vadakkunnathan',
    'Vadakkunnathan Temple',
    'വടക്കുംനാഥൻ ക്ഷേത്രം',
    'Thrissur', 10.524100, 76.208400,
    'Lord Shiva (Vadakkunnathan)',
    (select id from festivals where slug = 'thrissur-pooram')
  ),
  (
    'chottanikkara',
    'Chottanikkara Devi Temple',
    'ചോറ്റാനിക്കര ദേവി ക്ഷേത്രം',
    'Ernakulam', 9.983900, 76.374400,
    'Goddess Bhagavathy (Chottanikkara Amma)',
    null
  ),
  (
    'attukal',
    'Attukal Bhagavathy Temple',
    'ആറ്റുകൽ ഭഗവതി ക്ഷേത്രം',
    'Thiruvananthapuram', 8.485400, 76.944700,
    'Goddess Attukal Amma (Kannaki)',
    null
  ),
  (
    'mookambika',
    'Kollur Mookambika Temple',
    'കൊല്ലൂർ മൂകാംബിക ക്ഷേത്രം',
    'Udupi (Karnataka)', 13.862500, 74.833700,
    'Goddess Mookambika (Saraswati/Parvati)',
    null
  ),
  (
    'ettumanoor',
    'Ettumanoor Mahadeva Temple',
    'എട്ടുമാനൂർ മഹാദേവ ക്ഷേത്രം',
    'Kottayam', 9.669400, 76.559600,
    'Lord Shiva (Mahadeva)',
    null
  ),
  (
    'aranmula',
    'Aranmula Parthasarathy Temple',
    'ആറന്മുള പാർത്ഥസാരഥി ക്ഷേത്രം',
    'Pathanamthitta', 9.364900, 76.687000,
    'Lord Parthasarathy (Krishna/Vishnu)',
    null
  );


-- ── WEDDING ORNAMENT DEFAULTS ────────────────────────────────────
-- Weights are indicative estimates; flag as such in all UI.
-- Source basis: World Gold Council Kerala bride avg ~320g (40 pavan);
--   per-ornament from spec section 5 + jeweller blogs cited in content_sources.

-- Nair Hindu
insert into wedding_ornament_defaults (community, ornament_id, default_pavan, is_required, notes) values
  ('nair', (select id from ornaments where slug = 'kumbla-thali'),       1.00, true,  'Leaf-shaped Nair Thali; central to Talikettu ceremony'),
  ('nair', (select id from ornaments where slug = 'karimani-mala'),      2.00, false, 'Black bead chain; worn with or instead of Mangalsutra'),
  ('nair', (select id from ornaments where slug = 'kasu-mala'),          5.00, false, 'Coin necklace; centrepiece bridal necklace'),
  ('nair', (select id from ornaments where slug = 'mullamottu-mala'),    3.00, false, 'Jasmine-bud motif chain'),
  ('nair', (select id from ornaments where slug = 'manga-mala'),         4.00, false, 'Mango-motif necklace'),
  ('nair', (select id from ornaments where slug = 'palakka-mala'),       4.00, false, 'Jackfruit-seed motif necklace'),
  ('nair', (select id from ornaments where slug = 'lakshmi-mala'),       3.00, false, 'Lakshmi pendant chain'),
  ('nair', (select id from ornaments where slug = 'netti-chutti'),       2.00, false, 'Forehead ornament (maang tikka equivalent)'),
  ('nair', (select id from ornaments where slug = 'jadanagam'),          1.00, false, 'Hair serpent ornament'),
  ('nair', (select id from ornaments where slug = 'thadavala-ottavala'), 10.00, false,'Combined: Thadavala 6 pavan + Ottavala 4 pavan'),
  ('nair', (select id from ornaments where slug = 'vanki-aaram'),        2.00, false, 'Upper arm armlet'),
  ('nair', (select id from ornaments where slug = 'oddiyanam'),          3.00, false, 'Waist belt'),
  ('nair', (select id from ornaments where slug = 'jhimki'),             1.00, false, 'Bell earrings');

-- Namboothiri Hindu (intentionally simpler aesthetic per spec)
insert into wedding_ornament_defaults (community, ornament_id, default_pavan, is_required, notes) values
  ('namboothiri', (select id from ornaments where slug = 'malarthi-thali'),      1.00, true,  'Distinct Namboothiri Thali; Malarthi pattern'),
  ('namboothiri', (select id from ornaments where slug = 'lakshmi-mala'),        5.00, false, '5–10 pavan range per spec; 5 used as midpoint default'),
  ('namboothiri', (select id from ornaments where slug = 'thadavala-ottavala'),  4.00, false, 'Bangles set'),
  ('namboothiri', (select id from ornaments where slug = 'jhimki'),              1.00, false, 'Earrings');

-- Syrian Christian
insert into wedding_ornament_defaults (community, ornament_id, default_pavan, is_required, notes) values
  ('syrian-christian', (select id from ornaments where slug = 'minnu'),              1.00, true,  'Leaf-shaped pendant with cross; given at Minnukettu (parallels Talikettu)'),
  ('syrian-christian', (select id from ornaments where slug = 'karimani-mala'),      2.00, false, 'Black bead chain'),
  ('syrian-christian', (select id from ornaments where slug = 'kasu-mala'),          5.00, false, 'Longer chain(s); 4–6 pavan per spec'),
  ('syrian-christian', (select id from ornaments where slug = 'thadavala-ottavala'), 2.00, false, 'Diamond bangles; 2 pavan equivalent'),
  ('syrian-christian', (select id from ornaments where slug = 'jhimki'),             1.00, false, 'Earrings');

-- Mappila Muslim
-- NOTE: Mahr is NOT included here — it is a mandatory gift from groom to bride
-- (distinct from dowry; bride''s property by Islamic law) and must be a user-input
-- field in the calculator, not a preset. Never pre-fill Mahr.
insert into wedding_ornament_defaults (community, ornament_id, default_pavan, is_required, notes) values
  ('mappila-muslim', (select id from ornaments where slug = 'kasu-mala'),          10.00, false, 'Represents multiple necklaces combined; 8–12 pavan per spec'),
  ('mappila-muslim', (select id from ornaments where slug = 'jhoomar-passa'),       2.00, false, 'Head ornament; Mughal influence'),
  ('mappila-muslim', (select id from ornaments where slug = 'haathphool'),          1.00, false, 'Hand ornament (finger-to-wrist chain)'),
  ('mappila-muslim', (select id from ornaments where slug = 'arappatta'),           3.00, false, 'Waist belt'),
  ('mappila-muslim', (select id from ornaments where slug = 'thadavala-ottavala'),  4.00, false, 'Bangles'),
  ('mappila-muslim', (select id from ornaments where slug = 'jhimki'),              1.00, false, 'Bell earrings');
