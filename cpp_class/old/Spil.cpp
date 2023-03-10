#include <algorithm>
#include "Spil.hpp"

Spil::Spil(bool pomijesane): karte(vector<int>(52)) {
    for (int i = 0; i < 52; ++i) {
        karte[i] = i + 1;
    }
    if (pomijesane) {
        random_shuffle(karte.begin(), karte.end());
    }
}
void Spil::Podijeli4Karte(Igrac *igrac) {
    for (int i = 0; i < 4; ++i) {
        igrac->karte.push_back(karte[0]);
        karte.erase(karte.begin());
    }
}