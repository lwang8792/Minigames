//Implements ConnectionsGame class
//Handlees displaying puzzle, processing guesses, checking groups, managing game progress

#include "ConnectionsGame.h"
#include <algorithm>
#include <random>
#include <stdexcept>

//Construction
ConnectionsGame::ConnectionsGame(Puzzle puzzle, int mistakesLimit, uint32_t seed)
    : puzzle_(std::move(puzzle))
    , mistakesLimit_(mistakesLimit)
    , mistakesUsed_(0)
    , seed_(seed)
{
    groupSolved_.resize(puzzle_.groups.size(), false);

    for (const auto& tile : puzzle_.tiles) {
        displayOrder_.push_back(tile.id);
    }

    shuffleDisplayOrder();
}

//Selection
void ConnectionsGame::toggleSelect(int displayIndex) {
    if (displayIndex < 1 || displayIndex > static_cast<int>(displayOrder_.size())) {
        return;
    }
    int tileId = tileIdAtDisplay(displayIndex);

    if (selectedTileIds_.count(tileId)) {
        selectedTileIds_.erase(tileId);
    } else {
        if (static_cast<int>(selectedTileIds_.size()) < 4) {
            selectedTileIds_.insert(tileId);
        }
    }
}

void ConnectionsGame::clearSelection() {
    selectedTileIds_.clear();
}

//Guess
GuessResult ConnectionsGame::submitGuess() {
    if (static_cast<int>(selectedTileIds_.size()) != 4) {
        return { GuessOutcome::Invalid,
                 "You must select exactly 4 tiles.",
                 std::nullopt };
    }

    // Check for exact group match
    for (size_t i = 0; i < puzzle_.groups.size(); ++i) {
        if (groupSolved_[i]) continue;

        const auto& group = puzzle_.groups[i];
        std::set<int> groupSet(group.tileIds.begin(), group.tileIds.end());

        if (selectedTileIds_ == groupSet) {
            groupSolved_[i] = true;
            for (int id : group.tileIds) {
                tileById(id).state = TileState::Solved;
            }
            // Remove solved tiles from display order
            displayOrder_.erase(
                std::remove_if(displayOrder_.begin(), displayOrder_.end(),
                    [&groupSet](int id) { return groupSet.count(id) > 0; }),
                displayOrder_.end());

            selectedTileIds_.clear();
            return { GuessOutcome::Correct,
                     "Correct! Solved: " + group.name,
                     group.name };
        }
    }

    //Check if 3 of the 4 words belong to the same group
    for (size_t i = 0; i < puzzle_.groups.size(); ++i) {
        if (groupSolved_[i]) continue;

        const auto& group = puzzle_.groups[i];
        std::set<int> groupSet(group.tileIds.begin(), group.tileIds.end());

        int overlap = 0;
        for (int id : selectedTileIds_) {
            if (groupSet.count(id)) ++overlap;
        }
        if (overlap == 3) {
            ++mistakesUsed_;
            selectedTileIds_.clear();
            return { GuessOutcome::OneAway,
                     "One away!",
                     std::nullopt };
        }
    }

    //Fully incorrect
    ++mistakesUsed_;
    selectedTileIds_.clear();
    return { GuessOutcome::Incorrect,
             "Incorrect.",
             std::nullopt };
}

//Shuffle
void ConnectionsGame::shuffleDisplayOrder() {
    std::mt19937 rng(seed_);
    seed_ = rng();  //advance seed so next shuffle differs
    std::shuffle(displayOrder_.begin(), displayOrder_.end(), rng);
}

//Queries
bool ConnectionsGame::isWon() const {
    return std::all_of(groupSolved_.begin(), groupSolved_.end(),
                       [](bool b) { return b; });
}

bool ConnectionsGame::isLost() const {
    return mistakesUsed_ >= mistakesLimit_;
}

int ConnectionsGame::mistakesRemaining() const {
    return mistakesLimit_ - mistakesUsed_;
}

//View model
BoardViewModel ConnectionsGame::view() const {
    BoardViewModel vm;
    vm.mistakesUsed  = mistakesUsed_;
    vm.mistakesLimit = mistakesLimit_;
    vm.groupsSolved  = 0;
    vm.selectionCount = static_cast<int>(selectedTileIds_.size());

    //Solved groups
    for (size_t i = 0; i < puzzle_.groups.size(); ++i) {
        if (groupSolved_[i]) {
            SolvedGroupView sgv;
            sgv.name = puzzle_.groups[i].name;
            for (int tileId : puzzle_.groups[i].tileIds) {
                sgv.tileTexts.push_back(tileById(tileId).text);
            }
            vm.solvedGroups.push_back(sgv);
            ++vm.groupsSolved;
        }
    }

    //Unsolved tiles in display order
    for (size_t i = 0; i < displayOrder_.size(); ++i) {
        int tileId = displayOrder_[i];
        const auto& tile = tileById(tileId);

        BoardTileView btv;
        btv.displayIndex = static_cast<int>(i) + 1;
        btv.text     = tile.text;
        btv.selected = selectedTileIds_.count(tileId) > 0;
        btv.solved   = false;
        vm.tiles.push_back(btv);
    }

    return vm;
}

//Private helpers
int ConnectionsGame::tileIdAtDisplay(int displayIndex) const {
    return displayOrder_[displayIndex - 1];
}

WordTile& ConnectionsGame::tileById(int id) {
    for (auto& t : puzzle_.tiles) {
        if (t.id == id) return t;
    }
    throw std::runtime_error("Invalid tile id");
}

const WordTile& ConnectionsGame::tileById(int id) const {
    for (const auto& t : puzzle_.tiles) {
        if (t.id == id) return t;
    }
    throw std::runtime_error("Invalid tile id");
}
