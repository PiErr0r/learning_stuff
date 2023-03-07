from random import randint

def Check(checksum = 88692589):
	tab = "                   azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789_$&#@"
	entry = "c0ZHu3HycZmk"
	n = len(entry)
	suma = suma1 = 1
	for i in range(n):
		index = tab.index(entry[i:i+1])
		suma = suma + index ** 2 * i ** 3
		# suma = suma+(index*n*i)*(index*i*i);
	res = 7391050
	print("@#",suma - res)
	suma *= n
	suma -= n - 1
	print(suma, suma - checksum)
	return suma == checksum # checksum = 88692589

Check()


checksum = 88692589
tab = "                   azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789_$&#@"
a_i = 19
at_i = len(tab) - 1
min_len = 12

def compare(entry):
	n = len(entry)
	suma = 1
	for i in range(n):
		index = tab.index(entry[i:i+1][0])
		suma = suma + n * index ** 2 * i ** 3

	return suma - checksum

res = 7391050
koefs = [i ** 3 for i in range(min_len)]

def comp(entry):
	n = len(entry)
	suma = 1
	for i in range(n):
		index = tab.index(entry[i:i+1][0])
		suma += index ** 2 * koefs[i]

	return suma - res

# print(comp("@9&#@#@@7aaa"))

def dec(s, i):
	if s[i] == ' ' :
		return s
	s[i] = tab[ tab.index(s[i]) - 1 ]
	if s[i] == ' ': s[i] = 'a'
	return s

def inc(s, i):
	if s[i] == '@':
		return s
	s[i] = tab[ tab.index(s[i]) + 1 ]
	return s

def app(s, i, f, f_cmp, other_f):
	s = f(s, i)
	saved = s[i]
	broken = False
	while f_cmp(comp(s)):
		prev_s = s[::]
		s = f(s, i)
		if ''.join(s) == ''.join(prev_s):
			broken = True
			# s[i] = saved
			break
	if not broken and f_cmp(1):
		s = other_f(s, i)
	return s, s[i] == saved

more = lambda x: x > 0
less = lambda x: x < 0

def change(s, i, decrease, n):
	s, change = app(s, i, dec if decrease else inc, more if decrease else less, inc if decrease else dec)
	# n = int(change)
	# n = 1
	return s, i - (n if decrease else n)

def main():
	s = "c" * min_len
	s = list(s) # array so we can change it
	i = min_len - 1
	cnt = 0
	tmp = 0
	mv = 1
	count = 0
	while True:
		if cnt % 10000 == 0:
			print(''.join(s), i, tmp, cnt)
		
		p_tmp = tmp
		tmp = comp(s)
		if tmp == p_tmp:
			# s[(i+mv) % min_len] = tab[ tab.index(s[i]) + mv ] if tab.index(s[i]) + mv < len(tab) else s[i]
			# i = (i-mv) % min_len
			s[(tmp % (min_len - 1)) + 1] = tab[randint(20, len(tab) - 1)]
		# 	count += 1
		# else:
		# 	count = 0
		
		# if count == 10:
		# 	break
		print(''.join(s), i, tmp)
		if tmp == 0:
			broken = True
			break
		else:
			s, i = change(s, i, tmp > 0, mv)
		if i <= 1:
			mv = -1
		elif i == 12:
			mv = 1
			i-=1
		# i = i % min_len
		cnt += 1
	print(''.join(s))

# for i in range(len(koefs)):
# 	print(koefs[i] + koefs[len(koefs) - 1], end = " ")

main()