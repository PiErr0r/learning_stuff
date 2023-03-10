#include "Garaza.hpp"

Garaza::Garaza() {};
Garaza::Garaza(string _velicina, bool _auto, string _lokacija)
    : velicina(_velicina), automatska(_auto), lokacija(_lokacija) {
        predmeti = vector<Predmet>(0);
    };