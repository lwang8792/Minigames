//Unit tests for ConnectionsGame class
//Verifies puzzle behavior

#include "TestFramework.h"
#include "ConnectionsGame.h"
#include "Puzzle.h"

// Helper: build the standard 4-group prototype puzzle
static Puzzle makePuzzle()
{
    return makePrototypePuzzle();
}

// 1. Selecting 4 correct tiles and submitting yields Correct outcome
TEST(TestConnectionsGame, testCorrectGuess)
{
    Puzzle p = makePuzzle();
    ConnectionsGame game(p, 4, 42);

    // Group A tiles have ids 0,1,2,3 — find their display positions
    auto vm = game.view();
    for (const auto &tile : vm.tiles)
    {
        // Group A tiles contain "(GROUP A)" in their text
        if (tile.text.find("GROUP A") != std::string::npos)
        {
            game.toggleSelect(tile.displayIndex);
        }
    }

    GuessResult result = game.submitGuess();
    ASSERT_EQ(result.outcome, GuessOutcome::Correct);
    ASSERT_TRUE(result.solvedGroupName.has_value());
    ASSERT_EQ(result.solvedGroupName.value(), "GROUP A");
}

// 2. Submitting with fewer than 4 tiles selected yields Invalid
TEST(TestConnectionsGame, testInvalidGuessNotEnoughTiles)
{
    Puzzle p = makePuzzle();
    ConnectionsGame game(p, 4, 42);

    // Only select 2 tiles
    game.toggleSelect(1);
    game.toggleSelect(2);

    GuessResult result = game.submitGuess();
    ASSERT_EQ(result.outcome, GuessOutcome::Invalid);
}

// 3. Selecting 3 from one group + 1 from another yields OneAway
TEST(TestConnectionsGame, testOneAwayGuess)
{
    Puzzle p = makePuzzle();
    ConnectionsGame game(p, 4, 42);

    auto vm = game.view();

    int groupACount = 0;
    bool pickedOther = false;
    for (const auto &tile : vm.tiles)
    {
        if (tile.text.find("GROUP A") != std::string::npos && groupACount < 3)
        {
            game.toggleSelect(tile.displayIndex);
            ++groupACount;
        }
        else if (tile.text.find("GROUP B") != std::string::npos && !pickedOther)
        {
            game.toggleSelect(tile.displayIndex);
            pickedOther = true;
        }
    }

    GuessResult result = game.submitGuess();
    ASSERT_EQ(result.outcome, GuessOutcome::OneAway);
}

// 4. A fully wrong guess (tiles from 4 different groups) yields Incorrect
TEST(TestConnectionsGame, testIncorrectGuess)
{
    Puzzle p = makePuzzle();
    ConnectionsGame game(p, 4, 42);

    auto vm = game.view();

    // Pick one tile from each of the 4 groups
    bool pickedA = false, pickedB = false, pickedC = false, pickedD = false;
    for (const auto &tile : vm.tiles)
    {
        if (tile.text.find("GROUP A") != std::string::npos && !pickedA)
        {
            game.toggleSelect(tile.displayIndex);
            pickedA = true;
        }
        else if (tile.text.find("GROUP B") != std::string::npos && !pickedB)
        {
            game.toggleSelect(tile.displayIndex);
            pickedB = true;
        }
        else if (tile.text.find("GROUP C") != std::string::npos && !pickedC)
        {
            game.toggleSelect(tile.displayIndex);
            pickedC = true;
        }
        else if (tile.text.find("GROUP D") != std::string::npos && !pickedD)
        {
            game.toggleSelect(tile.displayIndex);
            pickedD = true;
        }
    }

    GuessResult result = game.submitGuess();
    ASSERT_EQ(result.outcome, GuessOutcome::Incorrect);
}

// 5. Solving all 4 groups causes isWon() to return true
TEST(TestConnectionsGame, testGameWon)
{
    Puzzle p = makePuzzle();
    ConnectionsGame game(p, 4, 42);

    // Solve each group in order: A, B, C, D
    std::string groupNames[] = {"GROUP A", "GROUP B", "GROUP C", "GROUP D"};
    for (const auto &groupName : groupNames)
    {
        auto vm = game.view();
        for (const auto &tile : vm.tiles)
        {
            if (tile.text.find(groupName) != std::string::npos)
            {
                game.toggleSelect(tile.displayIndex);
            }
        }
        game.submitGuess();
    }

    ASSERT_TRUE(game.isWon());
}

int main()
{
    std::cout << "=== TestConnectionsGame ===" << std::endl;
    return runAllTests();
}
