//Implements MemoryMatch class
//Handles game board, card flipping, check for matches

#include "MemoryMatch.h"
#include <iostream>
#include <algorithm>
#include <random>
#include <limits>

using namespace std;

//Initializes memory match board and prepares cards
MemoryMatch::MemoryMatch() {
    setup();
}

void MemoryMatch::setup() {
    vector<char> cards = {
        'A','A','B','B','C','C','D','D',
        'E','E','F','F','G','G','H','H'
    };

    random_device rd;
    mt19937 gen(rd());
    shuffle(cards.begin(), cards.end(), gen);

    board.assign(N, vector<char>(N));
    matched.assign(N, vector<bool>(N, false));
    shown.assign(N, vector<bool>(N, false));

    int k = 0;
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) {
            board[r][c] = cards[k++];
        }
    }
}

//Runs main memory game loop until all pairs are found
void MemoryMatch::play() {
    cout << "\n=== Memory Match (4x4) ===\n";
    cout << "Pick two cards each turn using row and column (0-3).\n";

    while (!allMatched()) {
        printBoard();

        int r1, c1, r2, c2;

        cout << "\nFirst pick (row col): ";
        if (!readPick(r1, c1)) return;

        tempReveal(r1, c1, true);
        printBoard();

        cout << "\nSecond pick (row col): ";
        if (!readPick(r2, c2)) return;

        while (r1 == r2 && c1 == c2) {
            cout << "Pick a different card.\n";
            cout << "Second pick (row col): ";
            if (!readPick(r2, c2)) return;
        }

        tempReveal(r2, c2, true);
        printBoard();

        checkMatch(r1, c1, r2, c2);
        clearTempReveals();
    }

    cout << "\n🎉 You matched them all!\n";
}

//prints memory board and shows flipped cards
void MemoryMatch::printBoard() const {
    cout << "\n   0 1 2 3\n";
    cout << "  ---------\n";
    for (int r = 0; r < N; r++) {
        cout << r << "| ";
        for (int c = 0; c < N; c++) {
            if (matched[r][c] || shown[r][c])
                cout << board[r][c] << " ";
            else
                cout << "* ";
        }
        cout << "\n";
    }
}

bool MemoryMatch::readPick(int &r, int &c) {
    if (!(cin >> r >> c)) return false;

    while (!validPick(r, c)) {
        cout << "Invalid pick. Try again (row col): ";
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        if (!(cin >> r >> c)) return false;
    }
    return true;
}

bool MemoryMatch::validPick(int r, int c) const {
    if (r < 0 || r >= N || c < 0 || c >= N) return false;
    if (matched[r][c]) return false;
    return true;
}

void MemoryMatch::tempReveal(int r, int c, bool value) {
    shown[r][c] = value;
}

//Check if two flipped cards is the same
void MemoryMatch::checkMatch(int r1, int c1, int r2, int c2) {
    if (board[r1][c1] == board[r2][c2]) {
        cout << "\nMatch!\n";
        matched[r1][c1] = true;
        matched[r2][c2] = true;
    } else {
        cout << "\nNot a match.\n";
        cout << "Press Enter to continue...";
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cin.get();
    }
}

void MemoryMatch::clearTempReveals() {
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) {
            if (!matched[r][c])
                shown[r][c] = false;
        }
    }
}

//Returns true when all pairs are matched
bool MemoryMatch::allMatched() const {
    for (int r = 0; r < N; r++) {
        for (int c = 0; c < N; c++) {
            if (!matched[r][c]) return false;
        }
    }
    return true;
}