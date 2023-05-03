#include <string>

using namespace std;

class Osoba {
    private:
    string Ime;
    string Prezime;
    int GodinaRodjenja;

    public:
    Osoba (string _ime, string _prezime, int _godinaRodjenja);
    string getIme();
    void setIme(string _ime);
    string getPrezime();
    void setPrezime(string _prezime);
    int getGodinaRodjenja();
    void setGodinaRodjenja(int _godinaRodjenja);
};