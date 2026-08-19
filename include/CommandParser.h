//Defines CommandParser class, which reads user input
//converts user input to commands which program can use

#pragma once
#include <string>
#include <vector>

enum class CommandType {
    Select,
    Submit,
    Clear,
    Shuffle,
    Help,
    Quit,
    Unknown
};

struct Command {
    CommandType type;
    std::vector<int> args;
};

//handles parsing text commands
class CommandParser {
public:
    Command parse(const std::string& input) const;
};
