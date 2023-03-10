#include <iostream>
#include <math.h>
#include <vector>

#include "Kompleksni.hpp"

using namespace std;

float Modul(const Kompleksni& z) {
    return sqrtf(z.re * z.re + z.im * z.im);
}

void swap(Kompleksni* a, Kompleksni* b) {
    Kompleksni *tmp = a;
    a = b;
    b = tmp;
}

void Sortiraj(vector<Kompleksni>& complex) {
    for (int i = 0; i < (int)complex.size() - 1; ++i) {
        int j = i + 1;
        bool swapped = false;
        while (j > 0 && Modul(complex[j]) < Modul(complex[j - 1])) {
            swap(complex[j-1], complex[j]);
            --j;
        }
    }
}

int main(void) {

    int n;
    cout << "Unesi N: ";
    cin >> n;
    vector<Kompleksni> complex(n);

    for (int i = 0; i < n; ++i) {
        float re, im;
        cout << "niz[" << i << "].re = ";
        cin >> re;
        cout << "niz[" << i << "].im = ";
        cin >> im;
        complex[i] = Kompleksni(re, im);
    }

    Sortiraj(complex);
    for (auto k : complex) {
        cout << "Z(" << k.re << (k.im < 0 ? "" : "+") << k.im << "i) Modul: " << Modul(k) << endl; 
    }

    return 0;
} 