// Sample questions for the quiz game
// Each question has:
// - type: 'image', 'audio', 'text', 'review'
// - questionType: 'qcm' or 'open'
// - content: the actual content (path/url/text)
// - correctAnswer: the correct answer
// - alternatives: optional array of acceptable alternative answers
// - options: for QCM questions only

const questions = [
  // IMAGE QUESTIONS (COMMENTED OUT FOR TESTING)

  {
    type: 'image',
    questionType: 'open',
    content: 'games/portal2/images/portal2.jpg',
    correctAnswer: 'Portal 2',
    alternatives: ['portal 2', 'Portal2', 'portal2']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/thewitcher3/images/thewitcher3.jpg',
    correctAnswer: 'The Witcher 3',
    alternatives: ['the witcher 3', 'witcher 3', 'witcher3', 'The Witcher3', 'thewitcher3', 'Witcher 3', 'The witcher 3']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/borderlands2/images/borderlands2.jpg',
    correctAnswer: 'Borderlands 2',
    alternatives: ['borderlands 2', 'borderlands2', 'Borderlands2', 'Borderlands  2']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/leagueoflegends/images/leagueoflegends.jpg.png',
    correctAnswer: 'League of Legends',
    alternatives: ['league of legends', 'leagueoflegends', 'LeagueOfLegends', 'League of legends', 'lol', 'LoL', 'Lol']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/rainbowsixsiege/images/r6.png',
    correctAnswer: 'Rainbow Six Siege',
    alternatives: ['rainbow six siege', 'r6', 'rainbow six', 'Rainbow Six Siege', 'R6']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/littlenightmares2/images/littlenightmares2.jpg',
    correctAnswer: 'Little Nightmares 2',
    alternatives: ['little nightmares 2', 'littlenightmares2', 'Little Nightmares 2', 'LittleNightmares2', 'Little nightmares 2', 'little nightmare 2', 'littlenightmare2', 'Little Nightmare 2', 'LittleNightmare2']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/bioshock/images/bioshock.png',
    correctAnswer: 'Bioshock Infinite',
    alternatives: ['bioshock infinite', 'bioshock', 'Bioshock', 'Bioshock Infinite']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/darksouls2/images/ds2.jpg',
    correctAnswer: 'Dark Souls 2',
    alternatives: ['dark souls 2', 'ds2', 'Dark Souls II', 'Dark Souls 2', 'DS2', 'Dark souls 2', 'dark souls ii' ]
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/seaofthieves/images/seaofthieves.jpg',
    correctAnswer: 'Sea of Thieves',
    alternatives: ['sea of thieves', 'Sea of Thieves', 'seaofthieves', 'SeaOfThieves']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/clairobscur/images/clairobscur.jpg',
    correctAnswer: 'Clair Obscur',
    alternatives: ['clair obscur', 'Clair Obscur', ' Clair Obscur Expedition 33', 'Clair obscur Expedition 33', 'clairobscur', 'Clairobscur', 'ClairObscur', 'clair obscur expedition 33', 'Clair Obscur expedition 33']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/godofwar3/images/godofwar3.jpg',
    correctAnswer: 'God of War 3',
    alternatives: ['god of war 3', 'God of War 3', 'godofwar3', 'GodOfWar3']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/farcry5/images/farcry5.jpg',
    correctAnswer: 'Far Cry 5',
    alternatives: ['far cry 5', 'Far Cry 5', 'farcry5', 'FarCry5']
  }, 
  {
    type: 'image',
    questionType: 'open',
    content: 'games/zelda-minishcap/images/minishcap.png',
    correctAnswer: 'The Legend of Zelda: The Minish Cap',
    alternatives: ['the legend of zelda: the minish cap', 'minish cap', 'The Minish Cap', 'minishcap', 'The legend of zelda minish cap', 'The Legend of Zelda Minish Cap', 'Zelda Minish Cap', 'zelda minish cap', 'zelda minishcap', 'Zelda The Minish Cap', 'zelda the minish cap']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/lastofus2/images/lastofus2.jpg',
    correctAnswer: 'The Last of Us Part II',
    alternatives: ['the last of us part ii', 'last of us 2', 'last of us ii', 'The Last of Us Part II', 'The Last of Us 2', 'The Last of Us II', 'lastofus2', 'LastOfUs2', 'Last of Us 2', 'Last of Us II']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/hentainazi/images/hentainazi.jpg',
    correctAnswer: 'Hentai Nazi',
    alternatives: ['hentai nazi', 'Hentai Nazi', 'HentaiNazi', 'hentainazi']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/okami/images/okami.jpg',
    correctAnswer: 'Okami',
    alternatives: ['okami', 'Ōkami', 'ōkami']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/theforest/images/theforrest.png',
    correctAnswer: 'The Forest',
    alternatives: ['the forest', 'The Forest', 'theforest', 'TheForest', 'forest']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/skyrim/images/skyrim.jpg',
    correctAnswer: 'The Elder Scrolls V: Skyrim',
    alternatives: ['skyrim', 'Skyrim', 'the elder scrolls v skyrim', 'the elder scrolls 5 skyrim', 'elder scrolls skyrim', 'Elder Scrolls V Skyrim', 'TES Skyrim', 'tes skyrim']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/saintsrow4/images/saintsrow4.jpg',
    correctAnswer: 'Saints Row IV',
    alternatives: ['saints row 4', 'saints row iv', 'Saints Row 4', 'Saints Row IV', 'saintsrow4', 'SaintsRow4', 'saints row four']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/ark/images/ark.png',
    correctAnswer: 'ARK: Survival Evolved',
    alternatives: ['ark', 'ARK', 'ark survival evolved', 'ARK Survival Evolved', 'Ark: Survival Evolved', 'ark survival', 'ark survivals']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/shadowofthecolossus/images/shadowofthecolossus.jpg',
    correctAnswer: 'Shadow of the Colossus',
    alternatives: ['shadow of the colossus', 'Shadow of the Colossus', 'shadowofthecolossus', 'ShadowOfTheColossus', 'sotc', 'SOTC']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/nomansky/images/nomansky.jpg',
    correctAnswer: 'No Man\'s Sky',
    alternatives: ['no mans sky', 'no man\'s sky', 'No Mans Sky', 'No Man\'s Sky', 'nomanssky', 'NoMansSky', 'nms', 'NMS']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/dofus/images/dofus.png',
    correctAnswer: 'Dofus',
    alternatives: ['dofus']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/worldofwarcraft/images/worldofwarcraft.jpg',
    correctAnswer: 'World of Warcraft',
    alternatives: ['world of warcraft', 'World of Warcraft', 'worldofwarcraft', 'WorldOfWarcraft', 'wow', 'WoW', 'WOW']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/halo2/images/halo2.jpg',
    correctAnswer: 'Halo 2',
    alternatives: ['halo 2', 'Halo 2', 'halo2', 'Halo2']
  },


  // AUDIO QUESTIONS
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/csgo/audio/csgo.mp3',
    correctAnswer: 'Counter-Strike: Global Offensive',
    alternatives: ['csgo', 'counter-strike: global offensive', 'counter strike global offensive', 'counter strike', 'cs:go', 'CS:GO', 'Counter Strike', 'Counter-Strike', 'Csgo', 'cs go']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/assassinscreed/audio/assassinscreedodysee.mp3',
    correctAnswer: 'Assassin\'s Creed Odyssey',
    alternatives: ['assassins creed odyssey', 'assassin\'s creed odyssey', 'assassinscreedodyssey', 'ac odyssey', 'AC Odyssey', 'odyssey']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/badpiggies/audio/badpiggies.mp3',
    correctAnswer: 'Bad Piggies',
    alternatives: ['bad piggies', 'Bad Piggies', 'badpiggies', 'BadPiggies']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/baldursgate3/audio/baldursgate3.mp3',
    correctAnswer: 'Baldur\'s Gate 3',
    alternatives: ['baldurs gate 3', 'baldur\'s gate 3', 'baldursgate3', 'bg3', 'BG3', 'Baldurs Gate 3', 'baldur\'s gate III', 'baldurs gate III']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/ddlc/audio/ddlc.mp3',
    correctAnswer: 'Doki Doki Literature Club',
    alternatives: ['doki doki literature club', 'ddlc', 'DDLC', 'Doki Doki', 'doki doki']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/dispatch/audio/dispatch.mp3',
    correctAnswer: 'Dispatch',
    alternatives: ['dispatch']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/eldenring/audio/eldenringnightreign.mp3',
    correctAnswer: 'Elden Ring: Nightreign',
    alternatives: ['elden ring nightreign', 'elden ring: nightreign', 'nightreign', 'Elden Ring Nightreign', 'eldenring nightreign', 'elden ring night reign']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/fearandhunger2/audio/fearandhunger2termina.mp3',
    correctAnswer: 'Fear & Hunger 2: Termina',
    alternatives: ['fear and hunger 2 termina', 'fear & hunger 2: termina', 'fear and hunger 2', 'termina', 'Fear and Hunger 2', 'fear and hunger termina', 'f&h2']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/fnaf/audio/fnaf.mp3',
    correctAnswer: 'Five Nights at Freddy\'s',
    alternatives: ['five nights at freddys', 'five nights at freddy\'s', 'fnaf', 'FNAF', 'Five Nights at Freddys', '5 nights at freddys', '5naf']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/fortnite/audio/fortnite.mp3',
    correctAnswer: 'Fortnite',
    alternatives: ['fortnite']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/goatsimulator/audio/goatsimulator.mp3',
    correctAnswer: 'Goat Simulator',
    alternatives: ['goat simulator', 'Goat Simulator', 'goatsimulator', 'GoatSimulator']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/leagueoflegends/audio/leagueoflegends.mp3',
    correctAnswer: 'League of Legends',
    alternatives: ['league of legends', 'leagueoflegends', 'lol', 'LoL', 'LOL', 'League of legends']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/liesofp/audio/liesofp.mp3',
    correctAnswer: 'Lies of P',
    alternatives: ['lies of p', 'Lies of P', 'liesofp', 'LiesOfP']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/mariokart/audio/mariokartwii.mp3',
    correctAnswer: 'Mario Kart Wii',
    alternatives: ['mario kart wii', 'Mario Kart Wii', 'mariokartwii', 'MarioKartWii', 'mkwii', 'mk wii']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/marvelrivals/audio/marvelrivals.mp3',
    correctAnswer: 'Marvel Rivals',
    alternatives: ['marvel rivals', 'Marvel Rivals', 'marvelrivals', 'MarvelRivals']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/minecraft/audio/minecraft.mp3',
    correctAnswer: 'Minecraft',
    alternatives: ['minecraft']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/osu/audio/osu.mp3',
    correctAnswer: 'osu!',
    alternatives: ['osu', 'osu!', 'Osu', 'Osu!', 'OSU']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/outerwilds/audio/outerwilds.mp3',
    correctAnswer: 'Outer Wilds',
    alternatives: ['outer wilds', 'Outer Wilds', 'outerwilds', 'OuterWilds']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/plantsvszombies/audio/plantsvszombie.mp3',
    correctAnswer: 'Plants vs. Zombies',
    alternatives: ['plants vs zombies', 'plants vs. zombies', 'pvz', 'PVZ', 'Plants vs Zombies', 'plantsvszombies', 'plants vs zombie', 'plant vs zombie']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/pokemongo/audio/pokemongo.mp3',
    correctAnswer: 'Pokémon GO',
    alternatives: ['pokemon go', 'pokémon go', 'Pokemon GO', 'Pokémon GO', 'pokemongo', 'pogo']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/subnautica/audio/subnautica.mp3',
    correctAnswer: 'Subnautica',
    alternatives: ['subnautica']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/watchdogs2/audio/watchdogs2.mp3',
    correctAnswer: 'Watch Dogs 2',
    alternatives: ['watch dogs 2', 'watchdogs 2', 'Watch Dogs 2', 'watchdogs2', 'WatchDogs2', 'wd2', 'WD2']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/wiiparty/audio/wiiparty.mp3',
    correctAnswer: 'Wii Party',
    alternatives: ['wii party', 'Wii Party', 'wiiparty', 'WiiParty']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/leagueoflegends/audio/leagueoflegends2.mp3',
    correctAnswer: 'League of Legends',
    alternatives: ['league of legends', 'leagueoflegends', 'lol', 'LoL', 'LOL', 'League of legends']
  },
  {
    type: 'audio',
    questionType: 'open',
    content: 'games/finalfantasy/audio/finalfantasy.mp3',
    correctAnswer: 'Final Fantasy',
    alternatives: ['final fantasy', 'Final Fantasy', 'finalfantasy', 'FinalFantasy']
  }, 

  // MAP IMAGE QUESTIONS
  {
    type: 'image',
    questionType: 'open',
    content: 'games/eldenring/images/eldenringmap.jpg',
    correctAnswer: 'Elden Ring',
    alternatives: ['elden ring', 'Elden Ring', 'eldenring', 'EldenRing']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/baldursgate3/images/baldursgate3map.jpg',
    correctAnswer: 'Baldur\'s Gate 3',
    alternatives: ['baldurs gate 3', 'baldur\'s gate 3', 'baldursgate3', 'bg3', 'BG3', 'Baldurs Gate 3', 'baldur\'s gate III', 'baldurs gate III']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/supermariobros/images/supermariobrosmap.jpg',
    correctAnswer: 'Super Mario Bros',
    alternatives: ['super mario bros', 'Super Mario Bros', 'supermariobros', 'SuperMarioBros', 'mario bros', 'Mario Bros', 'smb', 'SMB']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/gtasanandreas/images/gtasanandreasmap.jpg',
    correctAnswer: 'Grand Theft Auto: San Andreas',
    alternatives: ['gta san andreas', 'gta: san andreas', 'grand theft auto san andreas', 'Grand Theft Auto San Andreas', 'san andreas', 'San Andreas', 'gtasa', 'GTASA', 'GTA SA']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'games/palworld/images/palworldmap.jpg',
    correctAnswer: 'Palworld',
    alternatives: ['palworld', 'Palworld', 'pal world', 'Pal World']
  }

  // STEAM REVIEW QUESTIONS (IMAGE-BASED QCM) - COMMENTED OUT
  /*
  {
    type: 'review',
    questionType: 'qcm',
    content: 'clairobscur.jpg',
    correctAnswer: 'Clair Obscur: Expedition 33',
    options: [
      'Clair Obscur: Expedition 33',
      'Final Fantasy XVI',
      'Persona 5 Royal',
      'Assassin’s Creed Unity'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'cyberpunk2077.png',
    correctAnswer: 'Cyberpunk 2077',
    options: [
      'Call of Duty WWII',
      'Assassin’s Creed Unity',
      'Watch Dogs: Legion',
      'Cyberpunk 2077'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'ds2.jpg',
    correctAnswer: 'Dark Souls 2',
    options: [
      'Terraria',
      'Elden Ring',
      'Dark Souls 2',
      'Demon\'s Souls'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'geoguessr.png',
    correctAnswer: 'GeoGuessr',
    options: [
      'GeoGuessr',
      'Fc 26',
      'Worldle',
      'Civilization VI'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'gta5.png',
    correctAnswer: 'Grand Theft Auto V',
    options: [
      'Rainbow Six Siege',
      'Grand Theft Auto V',
      'Among Us',
      'Rocket League'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'lastofuspart2.png',
    correctAnswer: 'The Last of Us Part II',
    options: [
      'The Last of Us Part II',
      'Hells Diver 2',
      'Monster Hunter: Wilds ',
      'Dying Light 2'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'lethalcompany.png',
    correctAnswer: 'Lethal Company',
    options: [
      'Lethal Company',
      'Phasmophobia',
      'Outlast Trials',
      'Devour'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'monsterhunterwilds.jpg',
    correctAnswer: 'Monster Hunter Wilds',
    options: [
      'Fc 26',
      'Fc 25',
      'Destiny 2',
      'Monster Hunter Wilds'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'outlast.jpg',
    correctAnswer: 'Outlast',
    options: [
      'Amnesia: A machine for Pigs',
      'Outlast',
      'Peak',
      'Fc 26'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'persona5royal.png',
    correctAnswer: 'Persona 5 Royal',
    options: [
      'Yakuza 0',
      'Final Fantasy XV',
      'Persona 5 Royal',
      'Dragon Quest XI'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'pinkman.png',
    correctAnswer: 'Pinkman',
    options: [
      'Pinkman',
      'Schedule 1',
      'Cartel Tycoon',
      'Hollow Knight'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'r6.png',
    correctAnswer: 'Rainbow Six Siege',
    options: [
      'Valorant',
      'Counter-Strike 2',
      'Rainbow Six Siege',
      'Rocket League'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'stardewvalley.png',
    correctAnswer: 'Stardew Valley',
    options: [
      'SimCity',
      'Sims 4',
      'Minecraft',
      'Stardew Valley'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'undertale.png',
    correctAnswer: 'Undertale',
    options: [
      'Undertale',
      'Dark Souls 3',
      'Elden Ring',
      'Hollow Knight'
    ]
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: 'yakuza.png',
    correctAnswer: 'Yakuza 0',
    options: [
      'Saints Row IV',
      'Gta San Andreas',
      'Yakuza 0',
      'Sleeping Dogs'
    ]
  }
  */
];

module.exports = questions;
