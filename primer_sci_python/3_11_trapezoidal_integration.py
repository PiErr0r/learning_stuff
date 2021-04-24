from math import pi, sin, cos

def integrate(a, b, f):
    return (f(a) + f(b)) * (b - a) / 2.0

print '%g' % integrate(0, pi, sin)
print '%g' % integrate(0, pi, cos)
