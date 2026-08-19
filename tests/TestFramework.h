//Provides testing framework to run unit tests

#pragma once
#include <iostream>
#include <string>
#include <vector>
#include <functional>
#include <cmath>

// Minimal test framework

struct TestCase
{
    std::string name;
    std::function<void()> func;
};

inline std::vector<TestCase> &testRegistry()
{
    static std::vector<TestCase> tests;
    return tests;
}

struct TestRegistrar
{
    TestRegistrar(const std::string &name, std::function<void()> func)
    {
        testRegistry().push_back({name, func});
    }
};

#define TEST(suite, name)                                       \
    void suite##_##name();                                      \
    static TestRegistrar reg_##suite##_##name(#suite "." #name, \
                                              suite##_##name);  \
    void suite##_##name()

#define ASSERT_EQ(a, b)                                     \
    do                                                      \
    {                                                       \
        if ((a) != (b))                                     \
        {                                                   \
            std::cerr << "  FAILED: " << #a << " != " << #b \
                      << " (line " << __LINE__ << ")\n";    \
            throw std::runtime_error("assertion failed");   \
        }                                                   \
    } while (0)

#define ASSERT_TRUE(expr)                                         \
    do                                                            \
    {                                                             \
        if (!(expr))                                              \
        {                                                         \
            std::cerr << "  FAILED: " << #expr                    \
                      << " is false (line " << __LINE__ << ")\n"; \
            throw std::runtime_error("assertion failed");         \
        }                                                         \
    } while (0)

#define ASSERT_FALSE(expr)                                       \
    do                                                           \
    {                                                            \
        if ((expr))                                              \
        {                                                        \
            std::cerr << "  FAILED: " << #expr                   \
                      << " is true (line " << __LINE__ << ")\n"; \
            throw std::runtime_error("assertion failed");        \
        }                                                        \
    } while (0)

inline int runAllTests()
{
    int passed = 0, failed = 0;
    for (auto &tc : testRegistry())
    {
        try
        {
            tc.func();
            std::cout << "  PASSED: " << tc.name << "\n";
            ++passed;
        }
        catch (...)
        {
            std::cout << "  FAILED: " << tc.name << "\n";
            ++failed;
        }
    }
    std::cout << "\nResults: " << passed << " passed, "
              << failed << " failed, "
              << (passed + failed) << " total\n";
    return failed > 0 ? 1 : 0;
}
