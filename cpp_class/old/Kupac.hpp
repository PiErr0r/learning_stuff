#pragma once
#include "Racun.hpp"

class Kupac {
    public:
    Racun racun;
    Kupac(Racun _racun);
    Artikl* najskuplje();
};