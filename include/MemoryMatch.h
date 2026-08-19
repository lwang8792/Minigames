//Defines MemoryMatch class, which manages memory matching game
//Include board, card flips, check for matches

#ifndef MEMORYMATCH_H
#define MEMORYMATCH_H

#include <vector>

//Memory Match card game
class MemoryMatch {
public:
    MemoryMatch();
    void play();

private:
    static const int N = 4;

    std::vector<std::vector<char>> board;
    std::vector<std::vector<bool>> matched;
    std::vector<std::vector<bool>> shown;

    void setup();
    void printBoard() const;
    bool readPick(int &r, int &c);
    bool validPick(int r, int c) const;

    void tempReveal(int r, int c, bool value);
    void checkMatch(int r1, int c1, int r2, int c2);
    void clearTempReveals();
    bool allMatched() const;
};

#endif