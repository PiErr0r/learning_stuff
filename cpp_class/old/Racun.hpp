#pragma once
#include <vector>
#include "Artikl.hpp"

class Racun {
    public:
    int id;
    float ukupnaCijena;
    vector<Artikl> artikli;
    void dodaj(Artikl artikl);
    Racun(int _id);
};