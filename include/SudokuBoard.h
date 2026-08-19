//Define SudokuBoard class which manages Sudoku puzzle grid
//Include start values, check moves, update board

#ifndef SUDOKU_BOARD_H
#define SUDOKU_BOARD_H

#include <array>
#include <string>

//sudoku game board and operations
class SudokuBoard {
public:
    static constexpr int N = 9;

    // Create board: '0' or '.' means empty, '1'–'9' are filled numbers
    explicit SudokuBoard(const std::string &puzzle);

    int  get(int r, int c) const;
    bool isFixed(int r, int c) const;

    // place value v
    bool set(int r, int c, int v);

    bool isValidMove(int r, int c, int v) const;
    bool isSolved() const;

    void print() const;

private:
    std::array<std::array<int, N>, N> cells{};
    std::array<std::array<bool, N>, N> fixed{};

    bool inRange(int r, int c) const;
    bool validValue(int v) const;
    bool rowOk(int r, int v, int skipC) const;
    bool colOk(int c, int v, int skipR) const;
    bool boxOk(int r, int c, int v, int skipR, int skipC) const;
};

#endif
