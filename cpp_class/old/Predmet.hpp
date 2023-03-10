#pragma once
#include <string>

using namespace std;

class Predmet {
    public:
    string naziv;
    int vrijednost;
    Predmet();
    Predmet(string _naziv, int _vrijednost);
};