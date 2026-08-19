//Defines Group structure used in Connections puzzle
//Each group contains related words that belong to same category

#pragma once
#include <array>
#include <string>

//Group of related words in puzzle
struct Group {
    std::string name;
    std::array<int, 4> tileIds;
};
