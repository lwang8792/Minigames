//Implements FriendList class
//Handles adding, removing, displaying friends stored in list

#include "FriendList.h"
#include <iostream>
#include <algorithm>

//Initializes empty friend list
FriendList::FriendList() {}

FriendList::FriendList(std::vector<std::string> u, std::vector<int> i) {
    friend_data.usernames = std::move(u);
    friend_data.ids = std::move(i);
}

//Add new friend name to list
std::string FriendList::addFriend(const std::string& name) {
    for (size_t i = 0; i < received_data.usernames.size(); ++i) {
        if (name == received_data.usernames[i]) {
            friend_data.usernames.push_back(name);
            friend_data.ids.push_back(received_data.ids[i]);
            std::swap(received_data.usernames.back(), received_data.usernames[i]);
            std::swap(received_data.ids.back(), received_data.ids[i]);
            received_data.usernames.pop_back();
            received_data.ids.pop_back();
            return friend_data.usernames.back();
        }
    }
    return "";
}

std::string FriendList::addFriend(int id) {
    for (size_t i = 0; i < received_data.ids.size(); ++i) {
        if (id == received_data.ids[i]) {
            friend_data.usernames.push_back(received_data.usernames[i]);
            friend_data.ids.push_back(received_data.ids[i]);
            std::swap(received_data.usernames.back(), received_data.usernames[i]);
            std::swap(received_data.ids.back(), received_data.ids[i]);
            received_data.usernames.pop_back();
            received_data.ids.pop_back();
            return friend_data.usernames.back();
        }
    }
    return "";
}

//Removes friend from list
std::string FriendList::deleteFriend(const std::string& name) {
    for (size_t i = 0; i < friend_data.usernames.size(); ++i) {
        if (name == friend_data.usernames[i]) {
            std::swap(friend_data.usernames.back(), friend_data.usernames[i]);
            std::swap(friend_data.ids.back(), friend_data.ids[i]);
            friend_data.usernames.pop_back();
            friend_data.ids.pop_back();
            return name;
        }
    }
    return "";
}

std::string FriendList::deleteFriend(int id) {
    for (size_t i = 0; i < friend_data.ids.size(); ++i) {
        if (id == friend_data.ids[i]) {
            std::string name = friend_data.usernames[i];
            std::swap(friend_data.usernames.back(), friend_data.usernames[i]);
            std::swap(friend_data.ids.back(), friend_data.ids[i]);
            friend_data.usernames.pop_back();
            friend_data.ids.pop_back();
            return name;
        }
    }
    return "";
}

//Prints all friends currently in list
void FriendList::showFriends() {
    std::cout << "  Friend list:\n";
    if (friend_data.usernames.empty()) {
        std::cout << "  (no friends yet)\n";
        return;
    }
    for (size_t i = 0; i < friend_data.usernames.size(); ++i)
        std::cout << "  " << i + 1 << ". Username: " << friend_data.usernames[i]
                  << "\tId: " << friend_data.ids[i] << std::endl;
}

bool FriendList::sendRequest(const std::string& name) {
    sent_data.usernames.push_back(name);
    sent_data.ids.push_back(1111111);
    return true;
}

bool FriendList::sendRequest(int id) {
    sent_data.usernames.push_back("temp");
    sent_data.ids.push_back(id);
    return true;
}

void FriendList::showOutgoingRequests() {
    std::cout << "  Outgoing Requests:\n";
    if (sent_data.usernames.empty()) {
        std::cout << "  (none)\n";
        return;
    }
    for (size_t i = 0; i < sent_data.usernames.size(); ++i)
        std::cout << "  " << i + 1 << ". Username: " << sent_data.usernames[i]
                  << "\tId: " << sent_data.ids[i] << std::endl;
}

void FriendList::showIncomingRequests() {
    std::cout << "  Incoming Requests:\n";
    if (received_data.usernames.empty()) {
        std::cout << "  (none)\n";
        return;
    }
    for (size_t i = 0; i < received_data.usernames.size(); ++i)
        std::cout << "  " << i + 1 << ". Username: " << received_data.usernames[i]
                  << "\tId: " << received_data.ids[i] << std::endl;
}

void FriendList::addIncomingTest(std::vector<std::string> u, std::vector<int> i) {
    received_data.usernames = std::move(u);
    received_data.ids = std::move(i);
}

//Run friend list menu and process user commands
void FriendList::run() {
    std::cout << "\n";
    while (true) {
        std::cout << "\n  Commands: add, delete, view_friends, view_incoming, view_outgoing, back\n";
        std::cout << "  > ";
        std::string input;
        std::getline(std::cin, input);

        //exit friend menu
        if (input == "back" || input == "exit" || input == "quit") {
            break;
        } else if (input == "add") {
            std::cout << "  Add by name or id? ";
            std::getline(std::cin, input);
            if (input == "name") {
                std::cout << "  Enter name: ";
                std::string name;
                std::getline(std::cin, name);
                std::string out = addFriend(name);
                if (!out.empty()) std::cout << "  Added " << out << std::endl;
                else std::cout << "  Error: name not found in incoming requests\n";
            } else if (input == "id") {
                std::cout << "  Enter id: ";
                std::string idStr;
                std::getline(std::cin, idStr);
                try {
                    int id = std::stoi(idStr);
                    std::string out = addFriend(id);
                    if (!out.empty()) std::cout << "  Added " << out << std::endl;
                    else std::cout << "  Error: id not found in incoming requests\n";
                } catch (...) {
                    std::cout << "  Error: invalid id\n";
                }
            }
        } else if (input == "delete") {
            std::cout << "  Delete by name or id? ";
            std::getline(std::cin, input);
            if (input == "name") {
                std::cout << "  Enter name: ";
                std::string name;
                std::getline(std::cin, name);
                std::string out = deleteFriend(name);
                if (!out.empty()) std::cout << "  Deleted friend." << std::endl;
                else std::cout << "  Error: name not found in friend list\n";
            } else if (input == "id") {
                std::cout << "  Enter id: ";
                std::string idStr;
                std::getline(std::cin, idStr);
                try {
                    int id = std::stoi(idStr);
                    std::string out = deleteFriend(id);
                    if (!out.empty()) std::cout << "  Deleted friend." << std::endl;
                    else std::cout << "  Error: id not found in friend list\n";
                } catch (...) {
                    std::cout << "  Error: invalid id\n";
                }
            }
        } else if (input == "view_friends") {
            showFriends();
        } else if (input == "view_incoming") {
            showIncomingRequests();
        } else if (input == "view_outgoing") {
            showOutgoingRequests();
        } else {
            std::cout << "  Unknown command.\n";
        }
    }
}
