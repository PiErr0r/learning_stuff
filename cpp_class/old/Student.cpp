#include "Student.hpp"
#include "Kolegij.hpp"

Student::Student() {};
Student::Student(string _ime, string _prezime, int n)
    : ime(_ime), prezime(_prezime), kolegiji(vector<Kolegij>(n)) {};