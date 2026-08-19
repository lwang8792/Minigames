//Define Wordle class, which manages the Wordle game
//Include guesses, feedback, and game flow

#pragma once
#include <string>
#include <vector>

std::string validateGuess(const std::string& word, const std::string& guess);

//World game and main actions
class Wordle {
public:
    explicit Wordle(std::vector<std::string> words);
    void run();
private:
    std::vector<std::string> word_list;
};
