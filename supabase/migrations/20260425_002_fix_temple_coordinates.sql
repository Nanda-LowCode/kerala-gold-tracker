-- Fix temple coordinates — verified against Google Maps / Wikipedia coordinates
update temples set lat = 9.4353,  lng = 77.0811  where slug = 'sabarimala';
update temples set lat = 10.5966, lng = 76.0413  where slug = 'guruvayur';
update temples set lat = 8.4828,  lng = 76.9486  where slug = 'padmanabhaswamy';
update temples set lat = 10.5242, lng = 76.2158  where slug = 'vadakkunnathan';    -- was 76.2084, ~700 m off
update temples set lat = 9.9811,  lng = 76.3689  where slug = 'chottanikkara';     -- was 9.9839 / 76.3744, both off
update temples set lat = 8.4850,  lng = 76.9447  where slug = 'attukal';
update temples set lat = 13.8639, lng = 74.8294  where slug = 'mookambika';        -- was 74.8337, ~450 m off
update temples set lat = 9.6694,  lng = 76.5600  where slug = 'ettumanoor';
update temples set lat = 9.3650,  lng = 76.6864  where slug = 'aranmula';
