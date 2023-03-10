#include <iostream>
#include <math.h>
#include <vector>

#include "Kupac.hpp"

using namespace std;


int main(void) {
    Kupac Ante(Racun(1)); // Ante ima račun broj 1
    Ante.racun.dodaj(Artikl("Jabuka", 1, 6)); // 1 kg, 6 kn/kg
    Ante.racun.dodaj(Artikl("Banana", 2, 7.5)); // 2 kg, 7.5 kn/kg
    Ante.racun.dodaj(Artikl("Coca cola 2l", 2, 10)); // 2 boce, 10 kn/boca
    cout << "Ukupno: " << Ante.racun.ukupnaCijena << " kn" << endl; // 41 kn
    /* U nastavku ispišite koji je najskuplji artikl kojeg je Ante platio
    (naziv i ukupna cijena). Npr.
    
    */
    Artikl *artikl = Ante.najskuplje();
    cout << "Najskuplje placeni artikl je " << artikl->naziv << " (" << artikl->cijena * artikl->kolicina << "kn)" << endl;
    return 0;
} 