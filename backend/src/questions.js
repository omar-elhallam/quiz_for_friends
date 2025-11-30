// Sample questions for the quiz game
// Each question has:
// - type: 'image', 'audio', 'text', 'review'
// - questionType: 'qcm' or 'open'
// - content: the actual content (path/url/text)
// - correctAnswer: the correct answer
// - alternatives: optional array of acceptable alternative answers
// - options: for QCM questions only

const questions = [
  // IMAGE QUESTIONS
  {
    type: 'image',
    questionType: 'open',
    content: 'portal2.jpg',
    correctAnswer: 'Portal 2',
    alternatives: ['portal 2', 'Portal2', 'portal2']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'thewitcher3.jpg',
    correctAnswer: 'The Witcher 3',
    alternatives: ['the witcher 3', 'witcher 3', 'witcher3', 'The Witcher3', 'thewitcher3', 'Witcher 3', 'The witcher 3']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'borderlands2.jpg',
    correctAnswer: 'Borderlands 2',
    alternatives: ['borderlands 2', 'borderlands2', 'Borderlands2', 'Borderlands  2']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'leagueoflegends.jpg.png',
    correctAnswer: 'League of Legends',
    alternatives: ['league of legends', 'leagueoflegends', 'LeagueOfLegends', 'League of legends', 'lol', 'LoL', 'Lol']
  },
  {
    type: 'image',
    questionType: 'open',
    content: 'r6.png',
    correctAnswer: 'Rainbow Six Siege',
    alternatives: ['rainbow six siege', 'r6', 'rainbow six', 'Rainbow Six Siege', 'R6']
  },



  {
    type: 'image',
    questionType: 'qcm',
    content: 'game3.jpg',
    correctAnswer: 'Dark Souls',
    options: [
      'Dark Souls',
      'Bloodborne',
      'Sekiro',
      'Elden Ring'
    ]
  },

  // AUDIO QUESTIONS
  {
    type: 'audio',
    questionType: 'open',
    content: 'game1.mp3',
    correctAnswer: 'Super Mario Bros',
    alternatives: ['Super Mario', 'Mario Bros', 'Mario']
  },
  {
    type: 'audio',
    questionType: 'qcm',
    content: 'game2.mp3',
    correctAnswer: 'The Last of Us',
    options: [
      'The Last of Us',
      'Uncharted',
      'Days Gone',
      'The Walking Dead'
    ]
  },

  // TEXT DESCRIPTION QUESTIONS
  {
    type: 'text',
    questionType: 'open',
    content: 'A battle royale game where 100 players parachute onto an island and fight to be the last one standing. Known for its building mechanics.',
    correctAnswer: 'Fortnite',
    alternatives: ['fortnite']
  },
  {
    type: 'text',
    questionType: 'qcm',
    content: 'A space-based action RPG where you play as Commander Shepard, leading a diverse team to save the galaxy from an ancient alien threat.',
    correctAnswer: 'Mass Effect',
    options: [
      'Mass Effect',
      'Star Wars: Knights of the Old Republic',
      'Halo',
      'Dead Space'
    ]
  },
  {
    type: 'text',
    questionType: 'open',
    content: 'A rhythm game where you hit colored blocks with lightsabers to the beat of music in virtual reality.',
    correctAnswer: 'Beat Saber',
    alternatives: ['beatsaber', 'beat saber']
  },

  // STEAM REVIEW QUESTIONS
  {
    type: 'review',
    questionType: 'qcm',
    content: '"This game taught me that rolling is the most important skill in life. 10/10 would die to the same boss 47 times again."',
    correctAnswer: 'Dark Souls',
    options: [
      'Dark Souls',
      'Cuphead',
      'Sekiro',
      'Hollow Knight'
    ]
  },
  {
    type: 'review',
    questionType: 'open',
    content: '"Started playing at 9 PM, blinked, and suddenly it was 6 AM. My farm has never looked better but I need help."',
    correctAnswer: 'Stardew Valley',
    alternatives: ['stardew valley', 'stardew']
  },
  {
    type: 'review',
    questionType: 'qcm',
    content: '"I spent 3 hours making my character look perfect, then put a helmet on that covers their entire face. Peak gaming."',
    correctAnswer: 'Skyrim',
    options: [
      'Skyrim',
      'Dark Souls',
      'Fallout 4',
      'The Witcher 3'
    ]
  },
  {
    type: 'review',
    questionType: 'open',
    content: '"My wife asked why I was crying. I told her a blocky character died. She doesn\'t understand true pain."',
    correctAnswer: 'Minecraft',
    alternatives: ['minecraft']
  }
];

module.exports = questions;
