//Implement Wordle class
//Handle gameplay, read guesses, check correctness, display feedback

#include "Wordle.h"
#include <iostream>
#include <random>

#define ANSI_COLOR_GREEN   "\x1b[32m"
#define ANSI_COLOR_YELLOW  "\e[0;93m"
#define ANSI_COLOR_RESET   "\x1b[0m"
#define ANSI_COLOR_BLUE    "\x1b[34m"
#define ANSI_COLOR_RED     "\033[31m"

std::string validateGuess(const std::string& word, const std::string& guess) {
    if (guess.length() != 5)
        return "ERROR";
    std::string result = "XXXXX";
    std::vector<int> counts(26, 0);
    for (size_t i = 0; i < word.size(); ++i)
        ++counts[word[i] - 'a'];
    for (int i = 0; i < 5; ++i) {
        if (!(guess[i] >= 'a' && guess[i] <= 'z'))
            return "ERROR";
        if (guess[i] == word[i]) {
            result[i] = 'G';
            --counts[guess[i] - 'a'];
        }
    }
    for (int i = 0; i < 5; ++i) {
        if (result[i] != 'G' && counts[guess[i] - 'a'] > 0) {
            result[i] = 'Y';
            counts[guess[i] - 'a']--;
        }
    }
    return result;
}

//Initializes wordle game and selects secret word
Wordle::Wordle(std::vector<std::string> w) : word_list(std::move(w)) {}

//Runs main World game loop until player wins or runs out of guesses
void Wordle::run() {
    std::random_device r;
    std::mt19937 engine(r());
    std::uniform_int_distribution<int> dist(0, static_cast<int>(word_list.size()) - 1);
    std::string word = word_list[dist(engine)];
    int tries = 6;
    std::vector<int> letter_count(26, 0);
    for (size_t i = 0; i < word.size(); ++i)
        ++letter_count[word[i] - 'a'];

    std::cout << "\n  Guess the 5-letter word!\n\n";

    std::vector<bool> guessed(26, false);
    while (tries > 0) {
        // Show alphabet with guessed letters highlighted
        std::cout << "  ";
        for (size_t i = 0; i < guessed.size(); ++i) {
            if (guessed[i])
                printf(ANSI_COLOR_BLUE "%c " ANSI_COLOR_RESET, (char)(i + 'a'));
            else
                printf("%c ", (char)(i + 'a'));
        }
        std::cout << std::endl;

        std::string temp;
        bool invalid_flag = true;
        while (invalid_flag) {
            printf("  Enter word (%d tries left): ", tries);
            invalid_flag = false;
            std::getline(std::cin, temp);
            if (temp == "quit" || temp == "q") return;
            if (temp.size() != 5) {
                std::cout << ANSI_COLOR_RED << "  Input should be 5 letters" << ANSI_COLOR_RESET << std::endl << std::endl;
                invalid_flag = true;
            } else {
                for (size_t i = 0; i < temp.size(); ++i) {
                    if (!(temp[i] >= 'a' && temp[i] <= 'z')) {
                        std::cout << ANSI_COLOR_RED << "  Input should contain only lowercase letters" << ANSI_COLOR_RESET << std::endl << std::endl;
                        invalid_flag = true;
                        break;
                    }
                }
            }
        }
        std::cout << std::endl << "  ";
        for (size_t i = 0; i < temp.size(); ++i) {
            guessed[temp[i] - 'a'] = true;
            if (temp[i] == word[i])
                std::cout << ANSI_COLOR_GREEN << temp[i] << ANSI_COLOR_RESET;
            else if (letter_count[temp[i] - 'a'] > 0)
                std::cout << ANSI_COLOR_YELLOW << temp[i] << ANSI_COLOR_RESET;
            else
                std::cout << temp[i];
        }
        std::cout << std::endl << std::endl;
        if (temp == word)
            break;
        --tries;
    }
    if (tries > 0)
        std::cout << "  You got the word!\n";
    else
        std::cout << "  The word was: " << word << std::endl;
}
