#include <iostream>
#include <math.h>
#include <vector>

#include "Osoba.hpp"

using namespace std;


int main(void) {
    Osoba o1("ante", "svemir", 1899);
    Osoba o2("Ante", "Svemir", 1900);
    cout << 1 << " " << o1.getIme() << " " << o1.getPrezime() << " " << o1.getGodinaRodjenja() << endl;
    cout << 2 << " " << o2.getIme() << " " << o2.getPrezime() << " " << o2.getGodinaRodjenja() << endl;
    return 0;
} 