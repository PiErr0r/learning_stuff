#pragma once
#include "Igrac.hpp"

class Spil {
    public:
    vector<int> karte;
    Spil(bool pomijesane);
    void Podijeli4Karte(Igrac* igrac);
};