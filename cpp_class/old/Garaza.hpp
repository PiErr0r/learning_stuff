#pragma once
#include "Predmet.hpp"
#include <vector>

class Garaza {
    public:
    string velicina;
    bool automatska;
    string lokacija;
    vector<Predmet> predmeti;

    Garaza();
    Garaza(string _velicina, bool _auto, string _lokacija);
};