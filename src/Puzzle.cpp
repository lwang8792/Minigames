//Implements Puzzle class
//Handles creating puzzle, storing word groups, acccessing puzzle data

#include "Puzzle.h"

//Creates sample puzzle with 4 groups of 4 tiles
Puzzle makePrototypePuzzle() {
    Puzzle p;

    int id = 0;
    auto addGroup = [&](const std::string& groupName, const std::string& prefix) {
        Group g;
        g.name = groupName;
        for (int i = 0; i < 4; ++i) {
            WordTile tile;
            tile.id = id;
            tile.text = prefix + std::to_string(i + 1) + " (" + groupName + ")";
            tile.state = TileState::Available;
            p.tiles.push_back(tile);
            g.tileIds[i] = id;
            ++id;
        }
        p.groups.push_back(g);
    };

    addGroup("GROUP A", "A");
    addGroup("GROUP B", "B");
    addGroup("GROUP C", "C");
    addGroup("GROUP D", "D");

    return p;
}
