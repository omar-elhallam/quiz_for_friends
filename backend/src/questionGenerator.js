// Question Generator - Dynamically generates questions based on available game files
const fs = require('fs');
const path = require('path');
const gameDatabase = require('./gameDatabase');

class QuestionGenerator {
  constructor() {
    this.gamesPath = path.join(__dirname, '../../frontend/public/games');
    this.gameCache = null;
  }

  // Scan the games folder and cache available files
  scanGames() {
    if (this.gameCache) {
      return this.gameCache;
    }

    const games = {};
    
    try {
      const gameFolders = fs.readdirSync(this.gamesPath);
      
      for (const gameFolder of gameFolders) {
        const gamePath = path.join(this.gamesPath, gameFolder);
        const stat = fs.statSync(gamePath);
        
        if (!stat.isDirectory()) continue;
        
        // Check for images
        const imagesPath = path.join(gamePath, 'images');
        const audioPath = path.join(gamePath, 'audio');
        
        const gameData = {
          name: gameFolder,
          images: [],
          audio: []
        };
        
        // Scan images folder
        if (fs.existsSync(imagesPath)) {
          const imageFiles = fs.readdirSync(imagesPath);
          for (let i = 1; i <= 3; i++) {
            const pngFile = `${i}.png`;
            const jpgFile = `${i}.jpg`;
            if (imageFiles.includes(pngFile)) {
              gameData.images.push({ difficulty: i, file: pngFile });
            } else if (imageFiles.includes(jpgFile)) {
              gameData.images.push({ difficulty: i, file: jpgFile });
            }
          }
        }
        
        // Scan audio folder
        if (fs.existsSync(audioPath)) {
          const audioFiles = fs.readdirSync(audioPath);
          for (let i = 1; i <= 3; i++) {
            const mp3File = `${i}.mp3`;
            if (audioFiles.includes(mp3File)) {
              gameData.audio.push({ difficulty: i, file: mp3File });
            }
          }
        }
        
        // Only add game if it has at least one image or audio file AND exists in database
        if ((gameData.images.length > 0 || gameData.audio.length > 0) && gameDatabase[gameFolder]) {
          games[gameFolder] = gameData;
        } else if (gameData.images.length > 0 || gameData.audio.length > 0) {
          console.warn(`Warning: Game '${gameFolder}' has media files but is not in gameDatabase.js`);
        }
      }
      
      this.gameCache = games;
      console.log(`Scanned ${Object.keys(games).length} games with media files`);
      return games;
    } catch (error) {
      console.error('Error scanning games folder:', error);
      return {};
    }
  }

  // Generate a single question for a specific game and type
  generateQuestion(gameName, type, difficulty) {
    const games = this.scanGames();
    const game = games[gameName];
    
    if (!game) return null;
    
    const gameInfo = gameDatabase[gameName];
    if (!gameInfo) {
      console.warn(`Game ${gameName} not found in database`);
      return null;
    }
    
    let content = null;
    
    if (type === 'image') {
      const imageFile = game.images.find(img => img.difficulty === difficulty);
      if (!imageFile) return null;
      content = `games/${gameName}/images/${imageFile.file}`;
    } else if (type === 'audio') {
      const audioFile = game.audio.find(aud => aud.difficulty === difficulty);
      if (!audioFile) return null;
      content = `games/${gameName}/audio/${audioFile.file}`;
    }
    
    if (!content) return null;
    
    return {
      type: type,
      questionType: 'open',
      content: content,
      correctAnswer: gameInfo.displayName,
      alternatives: gameInfo.alternatives,
      difficulty: difficulty,
      gameName: gameName
    };
  }

  // Generate N questions of a specific type, excluding already used ones
  generateQuestions(type, count, excludeList = []) {
    const games = this.scanGames();
    const questions = [];
    
    // Get games that have files of the requested type
    const availableGames = Object.keys(games).filter(gameName => {
      const game = games[gameName];
      return type === 'image' ? game.images.length > 0 : game.audio.length > 0;
    });
    
    if (availableGames.length === 0) {
      console.error(`No games available with ${type} files`);
      return questions;
    }
    
    // Build list of all possible combinations
    const allCombinations = [];
    for (const gameName of availableGames) {
      const game = games[gameName];
      const files = type === 'image' ? game.images : game.audio;
      
      for (const fileData of files) {
        const combination = `${gameName}:${type}:${fileData.difficulty}`;
        // Only add if not in exclude list
        if (!excludeList.includes(combination)) {
          allCombinations.push({ gameName, type, difficulty: fileData.difficulty });
        }
      }
    }
    
    // If we don't have enough unused combinations, reset and use all
    if (allCombinations.length < count) {
      console.log(`Not enough unused ${type} questions. Resetting pool.`);
      // Rebuild without exclusions
      allCombinations.length = 0;
      for (const gameName of availableGames) {
        const game = games[gameName];
        const files = type === 'image' ? game.images : game.audio;
        for (const fileData of files) {
          allCombinations.push({ gameName, type, difficulty: fileData.difficulty });
        }
      }
    }
    
    // Shuffle combinations
    for (let i = allCombinations.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allCombinations[i], allCombinations[j]] = [allCombinations[j], allCombinations[i]];
    }
    
    // Generate questions from shuffled combinations
    for (let i = 0; i < Math.min(count, allCombinations.length); i++) {
      const combo = allCombinations[i];
      const question = this.generateQuestion(combo.gameName, combo.type, combo.difficulty);
      
      if (question) {
        questions.push(question);
      }
    }
    
    return questions;
  }

  // Generate a full game set with specified image and audio counts, excluding already used ones
  generateGameSet(imageCount = 20, audioCount = 20, excludeList = []) {
    const imageQuestions = this.generateQuestions('image', imageCount, excludeList);
    const audioQuestions = this.generateQuestions('audio', audioCount, excludeList);
    
    // Combine WITHOUT shuffling - images first, then audio
    const allQuestions = [...imageQuestions, ...audioQuestions];
    
    console.log(`Generated ${allQuestions.length} questions (${imageQuestions.length} images, ${audioQuestions.length} audio)`);
    console.log(`Excluded ${excludeList.length} previously used combinations`);
    
    // Warn if we didn't generate enough questions
    const expectedTotal = imageCount + audioCount;
    if (allQuestions.length < expectedTotal) {
      console.warn(`WARNING: Expected ${expectedTotal} questions but only generated ${allQuestions.length}`);
      console.warn(`Missing: ${imageCount - imageQuestions.length} images, ${audioCount - audioQuestions.length} audio`);
    }
    
    // Log first few questions for debugging
    if (allQuestions.length > 0) {
      console.log('First 3 questions:');
      allQuestions.slice(0, 3).forEach((q, i) => {
        console.log(`  ${i+1}. Type: ${q.type}, Game: ${q.gameName}, Content: ${q.content}, Difficulty: ${q.difficulty}`);
      });
    }
    
    return allQuestions;
  }

  // Clear cache to force rescan
  clearCache() {
    this.gameCache = null;
  }
}

module.exports = new QuestionGenerator();
