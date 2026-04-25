-- Fix temple coordinates — verified against Google Maps / Wikipedia coordinates
update temples set lat = 9.431915360838152,  lng = 77.08136532049059  where slug = 'sabarimala';
update temples set lat = 10.598307180462536, lng = 76.03536329449982  where slug = 'guruvayur';
update temples set lat = 8.482947674961506,  lng = 76.94365496839242  where slug = 'padmanabhaswamy';
update temples set lat = 10.524578376347431, lng = 76.21455551074791  where slug = 'vadakkunnathan';    -- was 76.2084, ~700 m off
update temples set lat = 9.933460794224423,  lng = 76.39111127820176  where slug = 'chottanikkara';     -- was 9.9839 / 76.3744, both off
update temples set lat = 8.470074527942938,  lng = 76.95550725304885  where slug = 'attukal';
update temples set lat = 13.864008810982552, lng = 74.81441010710301  where slug = 'mookambika';        -- was 74.8337, ~450 m off
update temples set lat = 9.673915221054028,  lng = 76.56053526840758  where slug = 'ettumanoor';
update temples set lat = 9.32837627340624,  lng = 76.68780663771619  where slug = 'aranmula';
