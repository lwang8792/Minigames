//Implements CommandParser class
//Reads user input and converts to commands for program

#include "CommandParser.h"
#include <sstream>
#include <algorithm>
#include <cctype>

//Read user input and determine which command
Command CommandParser::parse(const std::string& input) const {
    std::istringstream iss(input);
    std::string cmd;
    iss >> cmd;

    // Lowercase the command token
    std::transform(cmd.begin(), cmd.end(), cmd.begin(),
                   [](unsigned char c) { return std::tolower(c); });

    Command result;
    result.type = CommandType::Unknown;

    if (cmd == "select" || cmd == "s") {
        result.type = CommandType::Select;
        int idx;
        while (iss >> idx) {
            result.args.push_back(idx);
        }
    } else if (cmd == "submit") {
        result.type = CommandType::Submit;
    } else if (cmd == "clear") {
        result.type = CommandType::Clear;
    } else if (cmd == "shuffle") {
        result.type = CommandType::Shuffle;
    } else if (cmd == "help" || cmd == "h" || cmd == "?") {
        result.type = CommandType::Help;
    } else if (cmd == "quit" || cmd == "q" || cmd == "exit") {
        result.type = CommandType::Quit;
    }

    return result;
}
