// Game database that maps game names to their display names and alternatives
// This will be used to generate questions dynamically based on available files

const gameDatabase = {
  'ark': {
    displayName: 'ARK: Survival Evolved',
    alternatives: ['ark', 'ARK', 'ark survival evolved', 'ARK Survival Evolved', 'Ark: Survival Evolved', 'ark survival', 'ark survivals']
  },
  'assassinscreedodyssee': {
    displayName: 'Assassin\'s Creed Odyssey',
    alternatives: ['assassins creed odyssey', 'assassin\'s creed odyssey', 'assassinscreedodyssey', 'ac odyssey', 'AC Odyssey', 'odyssey']
  },
  'assassinscreedorigins': {
    displayName: 'Assassin\'s Creed Origins',
    alternatives: ['assassins creed origins', 'assassin\'s creed origins', 'assassinscreedorigins', 'ac origins', 'AC Origins', 'origins']
  },
  'badpiggies': {
    displayName: 'Bad Piggies',
    alternatives: ['bad piggies', 'Bad Piggies', 'badpiggies', 'BadPiggies']
  },
  'balatro': {
    displayName: 'Balatro',
    alternatives: ['balatro']
  },
  'baldursgate3': {
    displayName: 'Baldur\'s Gate 3',
    alternatives: ['baldurs gate 3', 'baldur\'s gate 3', 'baldursgate3', 'bg3', 'BG3', 'Baldurs Gate 3', 'baldur\'s gate III', 'baldurs gate III']
  },
  'bindingofisaac': {
    displayName: 'The Binding of Isaac',
    alternatives: ['binding of isaac', 'the binding of isaac', 'isaac', 'tboi', 'TBOI']
  },
  'bioshock2': {
    displayName: 'Bioshock 2',
    alternatives: ['bioshock 2', 'Bioshock 2', 'bioshock2', 'bio shock 2']
  },
  'bioshockinfinite': {
    displayName: 'Bioshock Infinite',
    alternatives: ['bioshock infinite', 'Bioshock Infinite', 'bioshockinfinite', 'bio shock infinite']
  },
  'borderlands2': {
    displayName: 'Borderlands 2',
    alternatives: ['borderlands 2', 'Borderlands 2', 'borderlands2', 'Borderlands2', 'bl2', 'BL2']
  },
  'celeste': {
    displayName: 'Celeste',
    alternatives: ['celeste']
  },
  'clairobscur': {
    displayName: 'Clair Obscur: Expedition 33',
    alternatives: ['clair obscur', 'clairobscur', 'Clair Obscur', 'expedition 33']
  },
  'csgo': {
    displayName: 'Counter-Strike: Global Offensive',
    alternatives: ['csgo', 'counter-strike: global offensive', 'counter strike global offensive', 'counter strike', 'cs:go', 'CS:GO', 'Counter Strike', 'Counter-Strike', 'Csgo', 'cs go']
  },
  'darksouls2': {
    displayName: 'Dark Souls 2',
    alternatives: ['dark souls 2', 'Dark Souls 2', 'darksouls2', 'DarkSouls2', 'ds2', 'DS2', 'dark souls ii']
  },
  'darksouls3': {
    displayName: 'Dark Souls 3',
    alternatives: ['dark souls 3', 'Dark Souls 3', 'darksouls3', 'DarkSouls3', 'ds3', 'DS3', 'dark souls iii']
  },
  'ddlc': {
    displayName: 'Doki Doki Literature Club',
    alternatives: ['doki doki literature club', 'ddlc', 'DDLC', 'Doki Doki', 'doki doki']
  },
  'dispatch': {
    displayName: 'Dispatch',
    alternatives: ['dispatch']
  },
  'dofus': {
    displayName: 'Dofus',
    alternatives: ['dofus']
  },
  'doom': {
    displayName: 'DOOM',
    alternatives: ['doom', 'DOOM', 'Doom']
  },
  'dragonballxenoverse2': {
    displayName: 'Dragon Ball Xenoverse 2',
    alternatives: ['dragon ball xenoverse 2', 'dragonball xenoverse 2', 'xenoverse 2', 'dbx2', 'DBX2', 'Xenoverse 2', 'xenoverse 2']
  },
  'eldenring': {
    displayName: 'Elden Ring',
    alternatives: ['elden ring', 'Elden Ring', 'eldenring', 'EldenRing', 'ER']
  },
  'eldenringnightreign': {
    displayName: 'Elden Ring: Nightreign',
    alternatives: ['elden ring nightreign', 'elden ring: nightreign', 'nightreign', 'Elden Ring Nightreign', 'eldenring nightreign', 'elden ring night reign']
  },
  'farcry5': {
    displayName: 'Far Cry 5',
    alternatives: ['far cry 5', 'Far Cry 5', 'farcry5', 'FarCry5', 'fc5', 'FC5']
  },
  'fearandhunger': {
    displayName: 'Fear & Hunger 2: Termina',
    alternatives: ['fear and hunger 2 termina', 'fear & hunger 2: termina', 'fear and hunger 2', 'termina', 'Fear and Hunger 2', 'fear and hunger termina', 'f&h2', 'fear and hunger', 'fear & hunger']
  },
  'finalfantasy': {
    displayName: 'Final Fantasy',
    alternatives: ['final fantasy', 'Final Fantasy', 'finalfantasy', 'FinalFantasy', 'ff', 'FF']
  },
  'fnaf': {
    displayName: 'Five Nights at Freddy\'s',
    alternatives: ['five nights at freddys', 'five nights at freddy\'s', 'fnaf', 'FNAF', 'Five Nights at Freddys', '5 nights at freddys', '5naf']
  },
  'fortnite': {
    displayName: 'Fortnite',
    alternatives: ['fortnite']
  },
  'geometrydash': {
    displayName: 'Geometry Dash',
    alternatives: ['geometry dash', 'Geometry Dash', 'geometrydash', 'gd', 'GD']
  },
  'ghostrunner': {
    displayName: 'Ghostrunner',
    alternatives: ['ghostrunner', 'ghost runner']
  },
  'goatsimulator': {
    displayName: 'Goat Simulator',
    alternatives: ['goat simulator', 'Goat Simulator', 'goatsimulator', 'GoatSimulator']
  },
  'godofwar3': {
    displayName: 'God of War 3',
    alternatives: ['god of war 3', 'God of War 3', 'godofwar3', 'GodOfWar3', 'gow3', 'GOW3', 'god of war iii']
  },
  'godofwar4': {
    displayName: 'God of War 4',
    alternatives: ['god of war 4', 'God of War 4', 'godofwar4', 'GodOfWar4', 'gow4', 'GOW4', 'god of war']
  },
  'hades': {
    displayName: 'Hades',
    alternatives: ['hades']
  },
  'halo2': {
    displayName: 'Halo 2',
    alternatives: ['halo 2', 'Halo 2', 'halo2', 'Halo2']
  },
  'hearthstone': {
    displayName: 'Hearthstone',
    alternatives: ['hearthstone', 'hearth stone']
  },
  'jetpackjoyride': {
    displayName: 'Jetpack Joyride',
    alternatives: ['jetpack joyride', 'Jetpack Joyride', 'jetpackjoyride']
  },
  'kingdomhearts': {
    displayName: 'Kingdom Hearts',
    alternatives: ['kingdom hearts', 'Kingdom Hearts', 'kingdomhearts', 'kh', 'KH']
  },
  'lastofus2': {
    displayName: 'The Last of Us Part II',
    alternatives: ['last of us 2', 'last of us part 2', 'the last of us 2', 'the last of us part 2', 'tlou2', 'TLOU2', 'last of us part ii', 'the last of us part ii']
  },
  'leagueoflegends': {
    displayName: 'League of Legends',
    alternatives: ['league of legends', 'leagueoflegends', 'lol', 'LoL', 'LOL', 'League of legends']
  },
  'liesofp': {
    displayName: 'Lies of P',
    alternatives: ['lies of p', 'Lies of P', 'liesofp', 'LiesOfP']
  },
  'littlenightmares2': {
    displayName: 'Little Nightmares 2',
    alternatives: ['little nightmares 2', 'Little Nightmares 2', 'littlenightmares2', 'LittleNightmares2', 'ln2', 'LN2', 'little nightmares ii']
  },
  'mario64': {
    displayName: 'Super Mario 64',
    alternatives: ['super mario 64', 'mario 64', 'sm64', 'SM64']
  },
  'mariokart': {
    displayName: 'Mario Kart',
    alternatives: ['mario kart', 'Mario Kart', 'mariokart', 'MarioKart', 'mk', 'mario kart wii', 'mkwii']
  },
  'marvelrivals': {
    displayName: 'Marvel Rivals',
    alternatives: ['marvel rivals', 'Marvel Rivals', 'marvelrivals', 'MarvelRivals']
  },
  'minecraft': {
    displayName: 'Minecraft',
    alternatives: ['minecraft']
  },
  'mortalkombat': {
    displayName: 'Mortal Kombat',
    alternatives: ['mortal kombat', 'Mortal Kombat', 'mortalkombat', 'mk', 'MK']
  },
  'nomansky': {
    displayName: 'No Man\'s Sky',
    alternatives: ['no mans sky', 'no man\'s sky', 'No Mans Sky', 'No Man\'s Sky', 'nomanssky', 'NoMansSky', 'nms', 'NMS']
  },
  'okami': {
    displayName: 'Okami',
    alternatives: ['okami', 'Ōkami', 'ōkami']
  },
  'osu': {
    displayName: 'osu!',
    alternatives: ['osu', 'osu!', 'Osu', 'Osu!', 'OSU']
  },
  'outerwilds': {
    displayName: 'Outer Wilds',
    alternatives: ['outer wilds', 'Outer Wilds', 'outerwilds', 'OuterWilds']
  },
  'palworld': {
    displayName: 'Palworld',
    alternatives: ['palworld', 'Palworld']
  },
  'plantsvszombies': {
    displayName: 'Plants vs. Zombies',
    alternatives: ['plants vs zombies', 'plants vs. zombies', 'pvz', 'PVZ', 'Plants vs Zombies', 'plantsvszombies', 'plants vs zombie', 'plant vs zombie']
  },
  'pokemonplatine': {
    displayName: 'Pokémon Platinum',
    alternatives: ['pokemon platinum', 'pokémon platinum', 'pokemon platine', 'pokémon platine', 'platinum', 'platine']
  },
  'portal2': {
    displayName: 'Portal 2',
    alternatives: ['portal 2', 'Portal2', 'portal2']
  },
  'rainbowsixsiege': {
    displayName: 'Rainbow Six Siege',
    alternatives: ['rainbow six siege', 'Rainbow Six Siege', 'r6', 'R6', 'siege', 'rainbow 6 siege', 'Rainbow 6 Siege']
  },
  'saintsrow4': {
    displayName: 'Saints Row IV',
    alternatives: ['saints row 4', 'saints row iv', 'Saints Row 4', 'Saints Row IV', 'saintsrow4', 'SaintsRow4', 'saints row four']
  },
  'seaofthieves': {
    displayName: 'Sea of Thieves',
    alternatives: ['sea of thieves', 'Sea of Thieves', 'seaofthieves', 'SeaOfThieves', 'sot', 'SOT']
  },
  'shadowofthecolossus': {
    displayName: 'Shadow of the Colossus',
    alternatives: ['shadow of the colossus', 'Shadow of the Colossus', 'shadowofthecolossus', 'ShadowOfTheColossus', 'sotc', 'SOTC']
  },
  'skyrim': {
    displayName: 'The Elder Scrolls V: Skyrim',
    alternatives: ['skyrim', 'Skyrim', 'the elder scrolls v skyrim', 'the elder scrolls 5 skyrim', 'elder scrolls skyrim', 'Elder Scrolls V Skyrim', 'TES Skyrim', 'tes skyrim']
  },
  'smashbrosultimate': {
    displayName: 'Super Smash Bros. Ultimate',
    alternatives: ['super smash bros ultimate', 'smash bros ultimate', 'smash ultimate', 'ssbu', 'SSBU']
  },
  'streetfighter': {
    displayName: 'Street Fighter',
    alternatives: ['street fighter', 'Street Fighter', 'streetfighter']
  },
  'subnautica': {
    displayName: 'Subnautica',
    alternatives: ['subnautica']
  },
  'supermariobros': {
    displayName: 'Super Mario Bros',
    alternatives: ['super mario bros', 'Super Mario Bros', 'supermariobros', 'SuperMarioBros', 'mario bros', 'Mario Bros', 'smb', 'SMB']
  },
  'supermariogalaxy': {
    displayName: 'Super Mario Galaxy',
    alternatives: ['super mario galaxy', 'mario galaxy', 'smg', 'SMG']
  },
  'theforest': {
    displayName: 'The Forest',
    alternatives: ['the forest', 'The Forest', 'theforest', 'TheForest', 'forest']
  },
  'thewitcher3': {
    displayName: 'The Witcher 3',
    alternatives: ['the witcher 3', 'witcher 3', 'witcher3', 'The Witcher3', 'thewitcher3', 'Witcher 3', 'The witcher 3']
  },
  'watchdogs2': {
    displayName: 'Watch Dogs 2',
    alternatives: ['watch dogs 2', 'watchdogs 2', 'Watch Dogs 2', 'watchdogs2', 'WatchDogs2', 'wd2', 'WD2']
  },
  'wiiparty': {
    displayName: 'Wii Party',
    alternatives: ['wii party', 'Wii Party', 'wiiparty', 'WiiParty']
  },
  'wiisports': {
    displayName: 'Wii Sports',
    alternatives: ['wii sports', 'Wii Sports', 'wiisports', 'WiiSports']
  },
  'worldofwarcraft': {
    displayName: 'World of Warcraft',
    alternatives: ['world of warcraft', 'World of Warcraft', 'worldofwarcraft', 'WorldOfWarcraft', 'wow', 'WoW', 'WOW']
  },
  'zelamajorasmask': {
    displayName: 'The Legend of Zelda: Majora\'s Mask',
    alternatives: ['zelda majoras mask', 'majoras mask', 'majora\'s mask', 'zelda mm', 'mm']
  },
  'sonic': {
    displayName: 'Sonic',
    alternatives: ['sonic', 'Sonic', 'sonic the hedgehog', 'Sonic the Hedgehog']
  },
  'valorant': {
    displayName: 'Valorant',
    alternatives: ['valorant', 'Valorant', 'val', 'VAL']
  },
  'undertale': {
    displayName: 'Undertale',
    alternatives: ['undertale', 'Undertale']
  },
  'dragonquest': {
    displayName: 'Dragon Quest',
    alternatives: ['dragon quest', 'Dragon Quest', 'dragonquest', 'DragonQuest', 'dq', 'DQ']
  },
  'sekiro': {
    displayName: 'Sekiro: Shadows Die Twice',
    alternatives: ['sekiro', 'Sekiro', 'sekiro shadows die twice', 'Sekiro: Shadows Die Twice', 'shadows die twice']
  },
  'nierautomata': {
    displayName: 'NieR: Automata',
    alternatives: ['nier automata', 'NieR: Automata', 'nier:automata', 'nierautomata', 'NierAutomata', 'nier', 'Nier']
  },
  'outlast': {
    displayName: 'Outlast',
    alternatives: ['outlast', 'Outlast']
  }
};

module.exports = gameDatabase;
