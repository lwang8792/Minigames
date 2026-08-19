//Defines puzzlee class used in Connections game
//Stores word groups and manages puzzle state

#pragma once
#include <vector>
#include "WordTile.h"
#include "Group.h"

struct Puzzle {
    std::vector<WordTile> tiles;   //16
    std::vector<Group> groups;     //4
};

Puzzle makePrototypePuzzle();
