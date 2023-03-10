#pragma once
#include "Kolegij.hpp"
#include <vector>

class Student {
    public:
    string ime;
    string prezime;
    vector<Kolegij> kolegiji;
    Student();
    Student(string _ime, string _prezime, int n);
};