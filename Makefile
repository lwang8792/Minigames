CXX      := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -O2
INCLUDES := -Iinclude -Itests

SRCS := src/main.cpp src/MenuScreen.cpp \
        src/Puzzle.cpp src/ConnectionsGame.cpp \
        src/CommandParser.cpp src/TerminalRenderer.cpp \
        src/SudokuBoard.cpp src/Wordle.cpp src/FriendList.cpp

TARGET := minigames

all: $(TARGET)

$(TARGET): $(SRCS)
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $(SRCS)

# ── Test targets ─────────────────────────────────────────────────────
TestConnectionsGame: tests/TestConnectionsGame.cpp src/Puzzle.cpp src/ConnectionsGame.cpp
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^

TestCommandParser: tests/TestCommandParser.cpp src/CommandParser.cpp
	$(CXX) $(CXXFLAGS) $(INCLUDES) -o $@ $^

test: TestConnectionsGame TestCommandParser
	@echo ""
	@./TestConnectionsGame
	@echo ""
	@./TestCommandParser

clean:
	rm -f $(TARGET) connections TestConnectionsGame TestCommandParser

.PHONY: all clean test
