//Defines FriendList class
//Manages list of friends and provides add, remove, an display options

#pragma once
#include <string>
#include <vector>

//Stores and manages list of friends
class FriendList {
public:
    FriendList();
    FriendList(std::vector<std::string> usernames, std::vector<int> ids);

    std::string addFriend(const std::string& name);
    std::string addFriend(int id);
    std::string deleteFriend(const std::string& name);
    std::string deleteFriend(int id);
    void showFriends();
    bool sendRequest(const std::string& name);
    bool sendRequest(int id);
    void showOutgoingRequests();
    void showIncomingRequests();
    void addIncomingTest(std::vector<std::string> u, std::vector<int> i);

    void run();  //Interactive command loop

private:
    struct UserData {
        std::vector<std::string> usernames;
        std::vector<int> ids;
    };
    UserData friend_data;
    UserData sent_data;
    UserData received_data;
};
