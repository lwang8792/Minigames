//Implements MenuScreen class
//Display menu, receive user input, then launching selected minigame

#include "MenuScreen.h"
#include "Puzzle.h"
#include "ConnectionsGame.h"
#include "CommandParser.h"
#include "TerminalRenderer.h"
#include "SudokuBoard.h"
#include "Wordle.h"
#include "FriendList.h"
#include <iostream>
#include <sstream>
#include <limits>
#include <string>
#include <cstdint>
#include <ctime>

// ── Menu loop ────────────────────────────────────────────────────────

void MenuScreen::run() {
    bool running = true;
    while (running) {
        printMenu();
        int choice = readChoice(1, 6);

        switch (choice) {
            case 1: playConnections(); break;
            case 2: playWordle(); break;
            case 3: playSudoku(); break;
            case 4: viewFriends(); break;
            case 5: openSettings(); break;
            case 6: running = false; break;
        }
    }

    std::cout << "\nGoodbye!\n";
}

void MenuScreen::printMenu() const {
    std::cout << "\n=============================\n";
    std::cout << "       Daily Minigames\n";
    std::cout << "=============================\n";
    std::cout << "1) Connections\n";
    std::cout << "2) Wordle\n";
    std::cout << "3) Sudoku\n";
    std::cout << "4) Friends List\n";
    std::cout << "5) Settings\n";
    std::cout << "6) Exit\n";
    std::cout << "Choose an option: ";
}

int MenuScreen::readChoice(int minVal, int maxVal) {
    int x;
    while (true) {
        if (std::cin >> x && x >= minVal && x <= maxVal) {
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            return x;
        }

        if (std::cin.eof()) return maxVal;  // treat EOF as Exit

        std::cout << "Invalid input. Enter a number " << minVal
                  << " to " << maxVal << ": ";

        std::cin.clear();
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
    }
}

void MenuScreen::waitForEnter() {
    std::cout << "\nPress Enter to return to menu...";
    std::string dummy;
    std::getline(std::cin, dummy);
}

// ── Connections ──────────────────────────────────────────────────────

void MenuScreen::playConnections() {
    Puzzle puzzle = makePrototypePuzzle();
    uint32_t seed = static_cast<uint32_t>(std::time(nullptr));
    ConnectionsGame game(puzzle, /*mistakesLimit=*/4, seed);

    CommandParser parser;
    TerminalRenderer renderer;

    std::string pendingMessage;
    renderer.renderBoard(game.view());

    while (!game.isWon() && !game.isLost()) {
        if (!pendingMessage.empty()) {
            renderer.renderMessage(pendingMessage);
            pendingMessage.clear();
        }

        renderer.renderPrompt();

        std::string line;
        if (!std::getline(std::cin, line)) break;

        Command cmd = parser.parse(line);

        switch (cmd.type) {

        case CommandType::Select:
            for (int idx : cmd.args) {
                game.toggleSelect(idx);
            }
            renderer.renderBoard(game.view());
            break;

        case CommandType::Submit: {
            GuessResult res = game.submitGuess();
            renderer.renderBoard(game.view());
            pendingMessage = res.message;
            break;
        }

        case CommandType::Clear:
            game.clearSelection();
            renderer.renderBoard(game.view());
            break;

        case CommandType::Shuffle:
            game.shuffleDisplayOrder();
            renderer.renderBoard(game.view());
            break;

        case CommandType::Help:
            renderer.renderHelp();
            break;

        case CommandType::Quit:
            return;  // back to menu

        case CommandType::Unknown:
            pendingMessage = "Unknown command. Type 'help' for a list of commands.";
            renderer.renderBoard(game.view());
            break;
        }
    }

    // End-of-game screen
    BoardViewModel finalView = game.view();
    if (game.isWon()) {
        renderer.renderWin(finalView);
    } else {
        renderer.renderLose(finalView);
    }
    waitForEnter();
}

// ── Wordle ───────────────────────────────────────────────────────────

void MenuScreen::playWordle() {
    Wordle game({
        "apple", "beach", "chair", "clock", "cloud",
        "dress", "earth", "field", "floor", "glass",
        "heart", "horse", "house", "knife", "light",
        "money", "music", "night", "ocean", "paper",
        "phone", "piano", "plant", "radio", "river",
        "shirt", "shoes", "smile", "stone", "table",
        "train", "truck", "voice", "watch", "water",
        "wheel", "world", "bread", "fruit", "sugar",
        "begin", "bring", "build", "carry", "catch",
        "cause", "check", "close", "count", "dance",
        "drink", "drive", "fight", "focus", "guess",
        "laugh", "learn", "leave", "maybe", "order",
        "paint", "party", "pause", "point", "print",
        "raise", "reach", "share", "sleep", "speak",
        "spend", "stand", "start", "study", "teach",
        "thank", "think", "throw", "touch", "angry",
        "basic", "black", "blind", "brave", "brief",
        "broad", "brown", "cheap", "clean", "clear",
        "empty", "fresh", "great", "green", "happy",
        "heavy", "large", "quiet", "smart", "uncut"
    });
    game.run();
    waitForEnter();
}

// ── Sudoku ───────────────────────────────────────────────────────────

void MenuScreen::playSudoku() {
    std::string puzzleStr =
        "530070000"
        "600195000"
        "098000060"
        "800060003"
        "400803001"
        "700020006"
        "060000280"
        "000419005"
        "000080079";

    SudokuBoard board(puzzleStr);

    std::cout << "\n  [Sudoku]\n";
    std::cout << "  Commands: show, set <row> <col> <val>, clear <row> <col>, quit\n";
    std::cout << "  Rows and columns are 0-8.\n\n";

    board.print();

    while (true) {
        if (board.isSolved()) {
            std::cout << "\n  Solved! Nice.\n";
            break;
        }

        std::cout << "> ";
        std::string line;
        if (!std::getline(std::cin, line)) break;

        std::istringstream iss(line);
        std::string cmd;
        iss >> cmd;

        if (cmd == "quit" || cmd == "q") {
            break;
        } else if (cmd == "show") {
            board.print();
        } else if (cmd == "set") {
            int r, c, v;
            if (iss >> r >> c >> v) {
                if (board.set(r, c, v))
                    std::cout << "OK\n";
                else
                    std::cout << "Invalid move (out of range, conflicts, or fixed cell).\n";
            } else {
                std::cout << "Usage: set <row> <col> <value>\n";
            }
        } else if (cmd == "clear") {
            int r, c;
            if (iss >> r >> c) {
                if (board.set(r, c, 0))
                    std::cout << "Cleared\n";
                else
                    std::cout << "Can't clear (out of range or fixed cell).\n";
            } else {
                std::cout << "Usage: clear <row> <col>\n";
            }
        } else {
            std::cout << "Unknown command.\n";
        }
    }
    waitForEnter();
}

// ── Friends ──────────────────────────────────────────────────────────

void MenuScreen::viewFriends() {
    FriendList fl;
    fl.addIncomingTest({"John", "Kate", "Bob", "Joe"}, {1, 2, 3, 4});
    fl.run();
}

// ── Settings ──────────────────────────────────────────────────

void MenuScreen::openSettings() {
    std::cout << "\n  [Settings]\n";
    std::cout << "  1) Change Language (coming soon)\n";
    std::cout << "  2) Audio Settings (coming soon)\n";
    std::cout << "  3) Back\n";
    std::cout << "  Choose an option: ";

    int choice = readChoice(1, 3);
    if (choice == 1) {
        std::cout << "\n  Language change not implemented yet.\n";
    } else if (choice == 2) {
        std::cout << "\n  Audio settings not implemented yet.\n";
    }
}
