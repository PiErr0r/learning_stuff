#pragma once
#include <string>

using namespace std;

class Artikl {
    public:
    string naziv;
    int kolicina;
    float cijena;
    Artikl(string _naziv, int _kolicina, float _cijena);
};