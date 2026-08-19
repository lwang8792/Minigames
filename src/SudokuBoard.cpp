//Implement SudokuBoard class
//Handle board creation, printing grid, validating moves, updating puzzle

#include "SudokuBoard.h"
#include <iostream>
#include <stdexcept>

//initializes sudoku board with starting puzzle
SudokuBoard::SudokuBoard(const std::string &puzzle) {
    if (puzzle.size() != 81) {
        throw std::invalid_argument("Puzzle must be exactly 81 characters.");
    }

    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) {
            char ch = puzzle[r * N + c];
            int v = 0;

            if (ch == '.' || ch == '0') {
                v = 0;
                fixed[r][c] = false;
            } else if (ch >= '1' && ch <= '9') {
                v = ch - '0';
                fixed[r][c] = true;
            } else {
                throw std::invalid_argument("Puzzle contains invalid characters.");
            }

            cells[r][c] = v;
        }
    }

    // Validate that given numbers don't violate Sudoku rules.
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) {
            int v = cells[r][c];
            if (v != 0 && !isValidMove(r, c, v)) {
                throw std::invalid_argument("Puzzle has conflicts (invalid givens).");
            }
        }
    }
}

int SudokuBoard::get(int r, int c) const {
    return cells[r][c];
}

bool SudokuBoard::isFixed(int r, int c) const {
    return fixed[r][c];
}

bool SudokuBoard::inRange(int r, int c) const {
    return (r >= 0 && r < N && c >= 0 && c < N);
}

bool SudokuBoard::validValue(int v) const {
    return (v >= 0 && v <= 9);
}

bool SudokuBoard::rowOk(int r, int v, int skipC) const {
    for (int c = 0; c < N; c++) {
        if (c == skipC) continue;
        if (cells[r][c] == v) return false;
    }
    return true;
}

bool SudokuBoard::colOk(int c, int v, int skipR) const {
    for (int r = 0; r < N; r++) {
        if (r == skipR) continue;
        if (cells[r][c] == v) return false;
    }
    return true;
}

bool SudokuBoard::boxOk(int r, int c, int v, int skipR, int skipC) const {
    int br = (r / 3) * 3;
    int bc = (c / 3) * 3;

    for (int rr = br; rr < br + 3; rr++) {
        for (int cc = bc; cc < bc + 3; cc++) {
            if (rr == skipR && cc == skipC) continue;
            if (cells[rr][cc] == v) return false;
        }
    }
    return true;
}

//Checks if placing a number at (row, col) follows sudoku rules
bool SudokuBoard::isValidMove(int r, int c, int v) const {
    if (!inRange(r, c)) return false;
    if (!validValue(v)) return false;

    if (v == 0) return true;
    return rowOk(r, v, c) && colOk(c, v, r) && boxOk(r, c, v, r, c);
}

//places number into board at specific position
bool SudokuBoard::set(int r, int c, int v) {
    if (!inRange(r, c)) return false;
    if (!validValue(v)) return false;
    if (fixed[r][c]) return false;

    if (!isValidMove(r, c, v)) return false;

    cells[r][c] = v;
    return true;
}

//returns true if board is fully filled and valid
bool SudokuBoard::isSolved() const {
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) {
            int v = cells[r][c];
            if (v == 0) return false;
            if (!isValidMove(r, c, v)) return false;
        }
    }
    return true;
}

void SudokuBoard::print() const {
    std::cout << "    0 1 2   3 4 5   6 7 8\n";
    std::cout << "  +-------+-------+-------+\n";
    for (int r = 0; r < N; r++) {
        std::cout << r << " | ";
        for (int c = 0; c < N; c++) {
            int v = cells[r][c];
            char ch = (v == 0) ? '.' : char('0' + v);
            std::cout << ch << ' ';
            if (c == 2 || c == 5) std::cout << "| ";
        }
        std::cout << "|\n";
        if (r == 2 || r == 5) {
            std::cout << "  +-------+-------+-------+\n";
        }
    }
    std::cout << "  +-------+-------+-------+\n";
}
