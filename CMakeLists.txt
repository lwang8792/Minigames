cmake_minimum_required(VERSION 3.14)
project(connections LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(connections
    src/main.cpp
    src/FriendList.cpp
    src/MenuScreen.cpp
    src/Puzzle.cpp
    src/ConnectionsGame.cpp
    src/CommandParser.cpp
    src/TerminalRenderer.cpp
    src/Wordle.cpp
    src/SudokuBoard.cpp
    src/MemoryMatch.cpp
)

target_include_directories(connections PRIVATE include)

# ── Testing with Google Test ─────────────────────────────────────────
include(FetchContent)
FetchContent_Declare(
    googletest
    URL https://github.com/google/googletest/archive/refs/tags/v1.14.0.zip
)
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

enable_testing()

add_executable(TestConnectionsGame
    tests/TestConnectionsGame.cpp
    src/Puzzle.cpp
    src/ConnectionsGame.cpp
)
target_include_directories(TestConnectionsGame PRIVATE include)
target_link_libraries(TestConnectionsGame GTest::gtest_main)
add_test(NAME TestConnectionsGame COMMAND TestConnectionsGame)

add_executable(TestCommandParser
    tests/TestCommandParser.cpp
    src/CommandParser.cpp
)
target_include_directories(TestCommandParser PRIVATE include)
target_link_libraries(TestCommandParser GTest::gtest_main)
add_test(NAME TestCommandParser COMMAND TestCommandParser)
