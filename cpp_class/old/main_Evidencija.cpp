#include <iostream>
#include <math.h>
#include <vector>

#include "Garaza.hpp"
#include "Predmet.hpp"

using namespace std;

string getStr(int n) {
    string res = "";
    while (n) {
        res = (char)(n % 10) + res;
        n /= 10;
    }
    return res;
}

int main(void) {
    int m, n;
    cout << "Unesite broj garaza (N): ";
    cin >> n;
    vector<Garaza> garaze(n);
    int i = 0;
    for (auto &garaza : garaze) {
        int w, h;
        string adresa, automatska;
        ++i;
        cout << "Unesite velicinu, lokaciju i podatak o vratima za " << i << ". garazu: " << endl;
        cin >> w >> h >> adresa >> automatska;
        garaza = Garaza(getStr(w) + "x" + getStr(h), automatska == "DA", adresa);
    }    
    cout << "Unesite broj predmeta (M): ";
    cin >> m;
    for (int j = 0; j < m; ++j) {
        int g, val;
        string naziv;
        cout << "Unesite redni broj garaze u koju spada " << i + 1 << ". predmet: ";
        cin >> g;
        cout << "Unesite naziv i vrijednost predmeta: ";
        cin >> naziv >> val;
        garaze[g-1].predmeti.push_back(Predmet(naziv, val));
    }
    cout << "Ispis garaza i predmeta:" << endl;
    i = 0;
    for (auto g : garaze) {
        ++i;
        cout << i << ". " << g.lokacija << " " << g.velicina << " - predmeti:";
        for (auto p : g.predmeti) {
            cout << " " << p.naziv << " (" << p.vrijednost << "kn)";
        }
        cout << endl;
    }
    return 0;
} 