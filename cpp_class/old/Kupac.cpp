#include "Kupac.hpp"

Kupac::Kupac(Racun _racun): racun(_racun) {};
Artikl* Kupac::najskuplje(void) {
    int mx = 0, mxi = -1;
    int i = 0;
    for (auto artikl : racun.artikli) {
        if (artikl.cijena * artikl.kolicina > mx) {
            mx = artikl.cijena * artikl.kolicina;
            mxi = i;
        }
        ++i;
    }
    return &racun.artikli[mxi];
};