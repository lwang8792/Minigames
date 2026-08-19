//Defines ConnectionsGame class
//which manages Connections puzzle, like word groups, guesses, and game progress

#pragma once
#include <vector>
#include <set>
#include <optional>
#include <string>
#include <cstdint>
#include "Puzzle.h"

//Guess result types 

enum class GuessOutcome { Correct, Incorrect, OneAway, Invalid };

struct GuessResult {
    GuessOutcome outcome;
    std::string message;
    std::optional<std::string> solvedGroupName;
};

//Board view model 

struct BoardTileView {
    int displayIndex;
    std::string text;
    bool selected;
    bool solved;
};

struct SolvedGroupView {
    std::string name;
    std::vector<std::string> tileTexts;
};

struct BoardViewModel {
    std::vector<SolvedGroupView> solvedGroups;
    std::vector<BoardTileView> tiles;   // only unsolved tiles
    int mistakesUsed;
    int mistakesLimit;
    int groupsSolved;
    int selectionCount;
};

//Connections puzzle game
class ConnectionsGame {
public:
    ConnectionsGame(Puzzle puzzle, int mistakesLimit, uint32_t seed);

    void toggleSelect(int displayIndex);
    void clearSelection();
    GuessResult submitGuess();
    void shuffleDisplayOrder();

    bool isWon() const;
    bool isLost() const;
    int mistakesRemaining() const;
    BoardViewModel view() const;

private:
    Puzzle puzzle_;
    int mistakesLimit_;
    int mistakesUsed_;
    uint32_t seed_;

    std::vector<int> displayOrder_;     // maps display position to tileId
    std::set<int> selectedTileIds_;     // selection stored as tileIds
    std::vector<bool> groupSolved_;     // parallel to puzzle_.groups

    int tileIdAtDisplay(int displayIndex) const;
    WordTile& tileById(int id);
    const WordTile& tileById(int id) const;
};
