//Implements TerminalRenderer class
//Handles printing game boards, tiles, and messages to terminal

#include "TerminalRenderer.h"
#include <iostream>
#include <iomanip>
#include <sstream>

// ANSI escape helpers
namespace ansi {
    const char* reset   = "\033[0m";
    const char* bold    = "\033[1m";
    const char* reverse = "\033[7m";
    const char* green   = "\033[32m";
    const char* red     = "\033[31m";
    const char* yellow  = "\033[33m";
    const char* cyan    = "\033[36m";
    const char* dim     = "\033[2m";
}

void TerminalRenderer::clearScreen() const {
    std::cout << "\033[2J\033[H";
}

//Displays puzzle board and current tile layout
void TerminalRenderer::renderBoard(const BoardViewModel& vm) const {
    clearScreen();

    //Header
    std::cout << "\n";
    std::cout << ansi::bold
              << "  ============================================\n"
              << "           C O N N E C T I O N S\n"
              << "  ============================================\n"
              << ansi::reset << "\n";

    //Solved groups
    for (const auto& sg : vm.solvedGroups) {
        std::cout << "  " << ansi::green << ansi::bold
                  << sg.name << ": " << ansi::reset << ansi::green;
        for (size_t i = 0; i < sg.tileTexts.size(); ++i) {
            if (i > 0) std::cout << ", ";
            std::cout << sg.tileTexts[i];
        }
        std::cout << ansi::reset << "\n";
    }
    if (!vm.solvedGroups.empty()) {
        std::cout << "\n";
    }

    //Tile grid
    const int cols = 4;
    const int colWidth = 20;

    for (size_t i = 0; i < vm.tiles.size(); ++i) {
        const auto& tile = vm.tiles[i];

        //Format: " 1. text"
        std::ostringstream entry;
        entry << std::setw(2) << tile.displayIndex << ". " << tile.text;
        std::string entryStr = entry.str();

        //Pad to column width
        if (static_cast<int>(entryStr.size()) < colWidth) {
            entryStr.resize(colWidth, ' ');
        }

        if (tile.selected) {
            std::cout << "  " << ansi::reverse << entryStr << ansi::reset;
        } else {
            std::cout << "  " << entryStr;
        }

        if ((i + 1) % cols == 0) {
            std::cout << "\n";
        }
    }
    //Finish partial row
    if (vm.tiles.size() % cols != 0) {
        std::cout << "\n";
    }

    std::cout << "\n";

    //Mistakes
    std::cout << "  Mistakes: ";
    for (int i = 0; i < vm.mistakesLimit; ++i) {
        if (i < vm.mistakesUsed) {
            std::cout << ansi::red << "X " << ansi::reset;
        } else {
            std::cout << ansi::dim << "O " << ansi::reset;
        }
    }
    std::cout << "  (" << (vm.mistakesLimit - vm.mistakesUsed) << " remaining)\n";

    //Selection count
    std::cout << "  Selected: " << vm.selectionCount << " / 4\n";
    std::cout << "\n";
}

void TerminalRenderer::renderMessage(const std::string& msg) const {
    if (msg.empty()) return;
    std::cout << "  " << ansi::yellow << ">> " << msg << ansi::reset << "\n\n";
}

void TerminalRenderer::renderHelp() const {
    std::cout << "\n"
              << ansi::bold << "  Commands:" << ansi::reset << "\n"
              << "    select <n> [n...]   Toggle tile(s) by index\n"
              << "    s <n> [n...]        Short alias for select\n"
              << "    submit              Submit your 4 selected tiles\n"
              << "    clear               Clear current selection\n"
              << "    shuffle             Reshuffle remaining tiles\n"
              << "    help                Show this help\n"
              << "    quit                Exit the game\n"
              << "\n";
}

void TerminalRenderer::renderWin(const BoardViewModel& vm) const {
    clearScreen();
    std::cout << "\n";
    std::cout << ansi::bold << ansi::green
              << "  ============================================\n"
              << "              Y O U   W I N !\n"
              << "  ============================================\n"
              << ansi::reset << "\n";

    for (const auto& sg : vm.solvedGroups) {
        std::cout << "  " << ansi::green << sg.name << ": " << ansi::reset;
        for (size_t i = 0; i < sg.tileTexts.size(); ++i) {
            if (i > 0) std::cout << ", ";
            std::cout << sg.tileTexts[i];
        }
        std::cout << "\n";
    }

    std::cout << "\n  Mistakes: " << vm.mistakesUsed << " / " << vm.mistakesLimit << "\n\n";
}

void TerminalRenderer::renderLose(const BoardViewModel& vm) const {
    clearScreen();
    std::cout << "\n";
    std::cout << ansi::bold << ansi::red
              << "  ============================================\n"
              << "           G A M E   O V E R\n"
              << "  ============================================\n"
              << ansi::reset << "\n";

    for (const auto& sg : vm.solvedGroups) {
        std::cout << "  " << ansi::green << sg.name << ": " << ansi::reset;
        for (size_t i = 0; i < sg.tileTexts.size(); ++i) {
            if (i > 0) std::cout << ", ";
            std::cout << sg.tileTexts[i];
        }
        std::cout << "\n";
    }

    std::cout << "\n  Better luck next time!\n\n";
}

void TerminalRenderer::renderPrompt() const {
    std::cout << "  > ";
    std::cout.flush();
}
