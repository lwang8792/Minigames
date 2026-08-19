//Defines TerminalRenderer class
//Which handles displaying game board, tiles, and messages in terminal

#pragma once
#include "ConnectionsGame.h"

class TerminalRenderer {
public:
    void clearScreen() const;
    void renderBoard(const BoardViewModel& vm) const;
    void renderMessage(const std::string& msg) const;
    void renderHelp() const;
    void renderWin(const BoardViewModel& vm) const;
    void renderLose(const BoardViewModel& vm) const;
    void renderPrompt() const;
};
