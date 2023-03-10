#pragma once
#include <string>

using namespace std;

class Kolegij {
    public:
    Kolegij();
    Kolegij(string _naziv, int _ocjena);
    string naziv;
    int ocjena;
};