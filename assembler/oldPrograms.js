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


const program = `
before_interrupt:
	mov $01, r1
	mov $02, r2
	psh $0003

call_interrupt:
	int $03

mask_interrupt_4:
	mov $01, r3
	lsf r3, $03
	not r3
	and im, acc
	mov acc, im

call_interrupt_again:
	int $03

this_should_run_instead:
	mov $05, r5

end:
	hlt
`