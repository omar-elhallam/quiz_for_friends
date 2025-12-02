// Test script to verify Play Again functionality
// This simulates running 2 games and checks if questions are different

const questionGenerator = require('./src/questionGenerator');
const fs = require('fs');
const path = require('path');

// Simulate GameSession's usedQuestions tracking
let usedQuestions = [];

function generateGame(gameNumber) {
  console.log(`\n=== Generating Game ${gameNumber} ===`);
  
  // Generate questions like GameSession does
  const questions = questionGenerator.generateGameSet(20, 20, usedQuestions);
  
  // Track these questions as used
  for (const question of questions) {
    const combination = `${question.gameName}:${question.type}:${question.difficulty}`;
    if (!usedQuestions.includes(combination)) {
      usedQuestions.push(combination);
    }
  }
  
  console.log(`Generated ${questions.length} questions`);
  console.log(`Total used combinations: ${usedQuestions.length}`);
  
  // Create game log
  const gameLog = {
    gameNumber: gameNumber,
    timestamp: new Date().toISOString(),
    totalRounds: questions.length,
    usedCombinationsCount: usedQuestions.length,
    rounds: questions.map((q, index) => ({
      round: index + 1,
      type: q.type,
      game: q.gameName,
      difficulty: q.difficulty,
      content: q.content,
      answer: q.correctAnswer,
      combination: `${q.gameName}:${q.type}:${q.difficulty}`
    }))
  };
  
  // Write to file
  const filename = path.join(__dirname, `test-game-${gameNumber}.json`);
  fs.writeFileSync(filename, JSON.stringify(gameLog, null, 2));
  console.log(`✓ Written to ${filename}`);
  
  return gameLog;
}

function analyzeGames(game1, game2) {
  console.log('\n=== Analysis ===');
  
  // Extract combinations from each game
  const game1Combinations = new Set(game1.rounds.map(r => r.combination));
  const game2Combinations = new Set(game2.rounds.map(r => r.combination));
  
  // Find duplicates
  const duplicates = [];
  for (const combo of game1Combinations) {
    if (game2Combinations.has(combo)) {
      duplicates.push(combo);
    }
  }
  
  console.log(`\nGame 1: ${game1.rounds.length} questions`);
  console.log(`Game 2: ${game2.rounds.length} questions`);
  console.log(`Unique combinations in Game 1: ${game1Combinations.size}`);
  console.log(`Unique combinations in Game 2: ${game2Combinations.size}`);
  console.log(`\nDuplicates between games: ${duplicates.length}`);
  
  if (duplicates.length > 0) {
    console.log('\n⚠️  WARNING: Found duplicate combinations:');
    duplicates.forEach(dup => console.log(`  - ${dup}`));
  } else {
    console.log('\n✓ SUCCESS: No duplicate combinations between games!');
  }
  
  // Show some examples from each game
  console.log('\nFirst 5 questions from Game 1:');
  game1.rounds.slice(0, 5).forEach(r => {
    console.log(`  ${r.round}. ${r.type} - ${r.game} (difficulty ${r.difficulty})`);
  });
  
  console.log('\nFirst 5 questions from Game 2:');
  game2.rounds.slice(0, 5).forEach(r => {
    console.log(`  ${r.round}. ${r.type} - ${r.game} (difficulty ${r.difficulty})`);
  });
  
  // Statistics
  console.log('\n=== Statistics ===');
  console.log(`Total unique combinations used across both games: ${usedQuestions.length}`);
  console.log(`Questions per game: 40 (20 images + 20 audio)`);
  console.log(`Combinations needed for 2 games: 80`);
  console.log(`Available combinations used: ${usedQuestions.length}/80`);
}

// Run the test
console.log('Testing Play Again functionality...\n');
console.log('This will generate 2 games with 40 questions each (20 images + 20 audio)');
console.log('and verify that no questions are repeated between games.\n');

try {
  const game1 = generateGame(1);
  const game2 = generateGame(2);
  
  analyzeGames(game1, game2);
  
  console.log('\n✓ Test complete! Check test-game-1.json and test-game-2.json');
} catch (error) {
  console.error('\n✗ Test failed:', error);
  process.exit(1);
}
