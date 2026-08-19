//Unit tests for CommandParser class
//Verify that user commands are parsed correctly

#include "TestFramework.h"
#include "CommandParser.h"

// 1. Parsing "select 1 2 3 4" yields Select command with correct args
TEST(TestCommandParser, testParseSelect) {
    CommandParser parser;
    Command cmd = parser.parse("select 1 2 3 4");

    ASSERT_EQ(cmd.type, CommandType::Select);
    ASSERT_EQ(cmd.args.size(), 4u);
    ASSERT_EQ(cmd.args[0], 1);
    ASSERT_EQ(cmd.args[1], 2);
    ASSERT_EQ(cmd.args[2], 3);
    ASSERT_EQ(cmd.args[3], 4);
}

// 2. Parsing the short alias "s 5 6" yields Select with 2 args
TEST(TestCommandParser, testParseSelectShortAlias) {
    CommandParser parser;
    Command cmd = parser.parse("s 5 6");

    ASSERT_EQ(cmd.type, CommandType::Select);
    ASSERT_EQ(cmd.args.size(), 2u);
    ASSERT_EQ(cmd.args[0], 5);
    ASSERT_EQ(cmd.args[1], 6);
}

// 3. Parsing "submit" yields Submit command
TEST(TestCommandParser, testParseSubmit) {
    CommandParser parser;
    Command cmd = parser.parse("submit");

    ASSERT_EQ(cmd.type, CommandType::Submit);
    ASSERT_TRUE(cmd.args.empty());
}

// 4. Parsing "quit", "q", and "exit" all yield Quit command
TEST(TestCommandParser, testParseQuitAliases) {
    CommandParser parser;

    Command cmd1 = parser.parse("quit");
    ASSERT_EQ(cmd1.type, CommandType::Quit);

    Command cmd2 = parser.parse("q");
    ASSERT_EQ(cmd2.type, CommandType::Quit);

    Command cmd3 = parser.parse("exit");
    ASSERT_EQ(cmd3.type, CommandType::Quit);
}

// 5. Parsing unrecognized input yields Unknown command
TEST(TestCommandParser, testParseUnknown) {
    CommandParser parser;
    Command cmd = parser.parse("gibberish");

    ASSERT_EQ(cmd.type, CommandType::Unknown);
    ASSERT_TRUE(cmd.args.empty());
}

int main() {
    std::cout << "=== TestCommandParser ===" << std::endl;
    return runAllTests();
}
