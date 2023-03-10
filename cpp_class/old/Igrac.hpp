#pragma once
#include <string>
#include <vector>

using namespace std;

class Igrac {
    public:
    string ime;
    vector<int> karte;
    Igrac();
    Igrac(string _ime);
};