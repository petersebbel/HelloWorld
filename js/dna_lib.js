function comp (dna_seq) {
	var c = ""; // complement sequnece to be returned
	for (i = 0;  i < dna_seq.length; i++) {
		switch (dna_seq.substring(i,i+1).toUpperCase())
		{
		 case "A": 
			c += 'T';
			break;
		 case "C":
			 c += 'G';
			break;
		 case "G":
			 c += 'C';
			break;
		 case "T":
			 c += 'A';
			break;
		default:
			c += "*";
		}
	}
	return c;
}

function revcomp (dna_seq) {
	var rc = ""; // reverse complement sequence to be returned
	
	for (i = dna_seq.length -1; i >=0; i--) {
		switch (dna_seq.substring(i,i+1).toUpperCase())
		{
		 case "A": 
			rc += 'T';
			break;
		 case "C":
			 rc += 'G';
			break;
		 case "G":
			 rc += 'C';
			break;
		 case "T":
			 rc += 'A';
			break;
		default:
			rc += "*";
		}
	}
	return rc;
}

function dna2aa(dna_seq) {
	var aa_seq = "";
	for (i = 0; i < dna_seq.length - 2; i+= 3) {
		var codon = dna_seq.substring(i, i+3).toUpperCase();
		var aa = "";
		switch (codon)
		{
		 case "GGG": 
			aa = 'G';
			break;
		 case "GGA":
			 aa = 'G';
			break;
		 case "GGT":
			 aa = 'G';
			break;
		 case "GGC":
			 aa = 'G';
			break;

		 case "GAG":
			 aa = 'E';
			break;
		 case "GAA":
			 aa = 'E';
			break;
		 case "GAT":
			 aa = 'D';
			break;
		 case "GAC":
			 aa = 'D';
			break;

		 case "GTG":
			 aa = 'V';
			break;
		 case "GTA":
			 aa = 'V';
			break;
		 case "GTT":
			 aa = 'V';
			break;
		 case "GTC":
			 aa = 'V';
			break;

		 case "GCG":
			 aa = 'A';
			break;
		 case "GCA":
			 aa = 'A';
			break;
		 case "GCT":
			 aa = 'A';
			break;
		 case "GCC":
			 aa = 'A';
			break;

		 case "AGG":
			 aa = 'R';
			break;
		 case "AGA":
			 aa = 'R';
			break;
		 case "AGT":
			 aa = 'S';
			break;
		 case "AGC":
			 aa = 'S';
			break;

		 case "AAG":
			 aa = 'K';
			break;
		 case "AAA":
			 aa = 'K';
			break;
		 case "AAT":
			 aa = 'N';
			break;
		 case "AAC":
			 aa = 'N';
			break;

		 case "ATG":
			 aa = 'M';
			break;
		 case "ATA":
			 aa = 'I';
			break;
		 case "ATT":
			 aa = 'I';
			break;
		 case "ATC":
			 aa = 'I';
			break;

		 case "ACG":
			 aa = 'T';
			break;
		 case "ACA":
			 aa = 'T';
			break;
		 case "ACT":
			 aa = 'T';
			break;
		 case "ACC":
			 aa = 'T';
			break;

		 case "TGG":
			 aa = 'W';
			break;
		 case "TGA":
			 aa = '*';
			break;
		 case "TGT":
			 aa = 'C';
			break;
		 case "TGC":
			 aa = 'C';
			break;

		 case "TAG":
			 aa = '*';
			break;
		 case "TAA":
			 aa = '*';
			break;
		 case "TAT":
			 aa = 'Y';
			break;
		 case "TAC":
			 aa = 'Y';
			break;

		 case "TTG":
			 aa = 'L';
			break;
		 case "TTA":
			 aa = 'L';
			break;
		 case "TTT":
			 aa = 'F';
			break;
		 case "TTC":
			 aa = 'F';
			break;

		 case "TCG":
			 aa = 'S';
			break;
		 case "TCA":
			 aa = 'S';
			break;
		 case "TCT":
			 aa = 'S';
			break;
		 case "TCC":
			 aa = 'S';
			break;

		 case "CGG":
			 aa = 'R';
			break;
		 case "CGA":
			 aa = 'R';
			break;
		 case "CGT":
			 aa = 'R';
			break;
		 case "CGC":
			 aa = 'R';
			break;

		 case "CAG":
			 aa = 'Q';
			break;
		 case "CAA":
			 aa = 'Q';
			break;
		 case "CAT":
			 aa = 'H';
			break;
		 case "CAC":
			 aa = 'H';
			break;

		 case "CTG":
			 aa = 'L';
			break;
		 case "CTA":
			 aa = 'L';
			break;
		 case "CTT":
			 aa = 'L';
			break;
		 case "CTC":
			 aa = 'L';
			break;

		 case "CCG":
			 aa = 'P';
			break;
		 case "CCA":
			 aa = 'P';
			break;
		 case "CCT":
			 aa = 'P';
			break;
		 case "CCC":
			 aa = 'P';
			break;
		default:
			aa = "*";
		}
		aa_seq += (aa);
	}
	return aa_seq;
}
