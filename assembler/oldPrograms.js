const program = `
start:
	mov $0a, &0050
loop:
	mov &0050, acc
	dec acc
	mov acc, &0050
	inc r2
	inc r2
	inc r2
	jne $00, &[!loop]
end:
	hlt
`;

const programxx =`mov $42, r1
mov r1, r2
add r1, r1`;


