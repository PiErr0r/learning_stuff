#include <iostream>
#include <math.h>
#include <vector>

#include "Spil.hpp"

using namespace std;


int main(void) {
    int n;
    cout << "Unesi broj igraca: ";
    cin >> n;
    vector<Igrac> igraci(n);
    int i = 0;
    for (auto &igrac : igraci) {
        ++i;
        string ime;
        cout << "Unesi ime " << i << ". igraca: ";
        cin >> ime;
        igrac = Igrac(ime);
    }
    Spil spil(true);
    cout << "Karte u spilu (" << spil.karte.size() << "):" << endl;
    for (int i = 0; i < (int)spil.karte.size(); ++i) {
        cout << spil.karte[i] << "\t";
    }
    cout << endl;
    for (auto &igrac : igraci) {
        spil.Podijeli4Karte(&igrac);
        cout << igrac.ime << " je dobio sljedece karte:\t";
        for (int karta : igrac.karte) {
            cout << karta << "\t";
        }
        cout << endl;
    }
    cout << "Preostal karte u spilu (" << spil.karte.size() << "):" << endl;
    for (int i = 0; i < (int)spil.karte.size(); ++i) {
        cout << spil.karte[i] << "\t";
    }
    cout << endl;
    return 0;
} 