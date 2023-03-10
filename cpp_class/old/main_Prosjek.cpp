#include <iostream>
#include <math.h>
#include <vector>

#include "Student.hpp"
#include "Kolegij.hpp"

using namespace std;

int main(void) {
    int n;
    cout << "Unesite broj studenata: ";
    cin >> n;
    vector<Student> studenti(n);
    int i = 0;
    for (auto &student : studenti) {
        ++i;
        string ime, prezime;
        int br;
        cout << "Unesite ime i prezime " << i  << ". studenta: ";
        cin >> ime >> prezime;
        cout << "Unesi broj kolegija studenta: ";
        cin >> br;
        student = Student(ime, prezime, br);
        int j = 0;
        for (auto &kolegij : student.kolegiji) {
            ++j;
            string naziv;
            int ocjena;
            cout << "Unesite naziv i ocjenu za " << j << ". kolegij: ";
            cin >> naziv >> ocjena;
            kolegij = Kolegij(naziv, ocjena);
        }
        cout << endl;
    }

    string kolegij;
    float prosjek = 0.0;
    int cnt = 0;
    cout << "Unesite naziv kolegija: ";
    cin >> kolegij;
    for (auto s : studenti) {
        for (auto k : s.kolegiji) {
            if (k.naziv == kolegij) {
                ++cnt;
                prosjek += k.ocjena;
            }
        }
    }
    prosjek /= (float)cnt;
    cout << "Prosjek ocjena iz kolegija " << kolegij << " iznosi " << prosjek << endl;
    return 0;
} 