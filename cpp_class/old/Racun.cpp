#include "Racun.hpp"

Racun::Racun(int _id): id(_id), ukupnaCijena(0.0) {};
void Racun::dodaj(Artikl artikl) {
    artikli.push_back(artikl);
    ukupnaCijena += artikl.kolicina * artikl.cijena;
}