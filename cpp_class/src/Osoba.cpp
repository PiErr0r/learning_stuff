#include "Osoba.hpp"

Osoba::Osoba (string _ime, string _prezime, int _godinaRodjenja)
    // : Ime(_ime), Prezime(_prezime), GodinaRodjenja(_godinaRodjenja)
    {
        setIme(_ime);
        setPrezime(_prezime);
        setGodinaRodjenja(_godinaRodjenja);
    };

string Osoba::getIme() { return Ime; };
void Osoba::setIme(string _ime) {
    Ime = "";
    if ((int)_ime.length() == 0) return;
    if (_ime[0] < 'A' || _ime[0] > 'Z') return;
    Ime = _ime;
}

string Osoba::getPrezime() { return Prezime; };
void Osoba::setPrezime(string _prezime) {
    Prezime = "";
    if ((int)_prezime.length() == 0) return;
    if (_prezime[0] < 'A' || _prezime[0] > 'Z') return;
    Prezime = _prezime;
}

int Osoba::getGodinaRodjenja() { return GodinaRodjenja; };
void Osoba::setGodinaRodjenja(int _godinaRodjenja) {
    GodinaRodjenja = -1;
    if (_godinaRodjenja < 1900) return;
    GodinaRodjenja = _godinaRodjenja;
}
