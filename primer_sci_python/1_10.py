from math import sqrt, exp, pi

def f(x, m, s):
    A = 1.0 / (s * sqrt(2 * pi))
    E = -1.0*((x-m)/s)**2/2.0
    return A * exp(E)

print '%g' % f(0, 2, 1)
