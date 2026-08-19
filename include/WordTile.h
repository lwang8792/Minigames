//Defines WordTile structure used in Connections puzzle
//Each tile represents word that can be selected by the player

#pragma once
#include <string>

enum class TileState { Available, Solved };

struct WordTile {
    int id;
    std::string text;
    TileState state = TileState::Available;
};
