//Defines the MenuScreen class
//User choose between different minigames

#ifndef MENUSCREEN_H
#define MENUSCREEN_H

//Main menu interface
class MenuScreen {
public:
    void run();

private:
    void printMenu() const;
    int readChoice(int minVal, int maxVal);
    void waitForEnter();

    void playConnections();
    void playWordle();
    void playSudoku();
    void viewFriends();
    void openSettings();
};

#endif
