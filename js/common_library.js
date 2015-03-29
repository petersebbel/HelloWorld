
var find_ORFs = function(dna_seq) {
	var ddna_seq = dna_seq + dna_seq;
	var complete_ORFs = []; 
	
	for (var i = 0; i < 3; i++) {
		var rf = dna2aa(ddna_seq.substring(i));
		var tORFs = split_RF2ORF(rf);
		tORFs.forEach( function(entry) {
			if ((entry.end - entry.start > 74) &&  (entry.start * 3 + i < dna_seq.length)) {
				complete_ORFs.push( {
					"seq"       : entry.seq,
					"dna_start" : entry.start * 3 + i,
					"dna_end"   : (entry.end  * 3 + i) % dna_seq.length,
					"dna_seq"   : ddna_seq.substring(entry.start  * 3 + i, entry.end * 3 + i),
					"frame"     : i + 1,
				}
				);
			}
		})
	}
	for (var i = 0; i < 3; i++) {
		var rf = dna2aa(revcomp(ddna_seq).substring(i));
		var tORFs = split_RF2ORF(rf);
		tORFs.forEach( function(entry) {
			if ((entry.end - entry.start > 74) &&  (entry.start * 3 + i < dna_seq.length)) {
				complete_ORFs.push( {
					"seq"       : entry.seq,
					"dna_start" : dna_seq.length - entry.start * 3 + i,
					"dna_end"   : dna_seq.length - (entry.end   * 3 + i) % dna_seq.length,
					"dna_seq"   : revcomp(ddna_seq).substring(entry.start * 3 + i, entry.end * 3 + i),
					"frame"     : i + 4,
				}
				);
			}
		});
	}
	return complete_ORFs;

}

var find_rnd_codons  = function(seq) {
	var rnd_cdns = [];
	var re = /N+/g;
	while (match = re.exec(seq)) {
		rnd_cdns.push( {
				"start" : match.index,
				"length": match[0].length,
		});
	}
	return rnd_cdns;
	
}

var split_RF2ORF = function(aa_seq) {
	var orfs = [];
	
	var re = /M.*?\*/g;

    while (match = re.exec(aa_seq)) {
		var orf = {seq: "", start: "", end: ""};
		orf.seq = match[0];
		orf.start = match.index;
		orf.end = orf.start + orf.seq.length;
		console.log("match found at " + match.index + " with start " + orf.start + " end " + orf.end + " and seq " + orf.seq);
		orfs.push(orf);
    }
	return orfs;
	
}

function comp (dna_seq) {
	var c = "";
	//console.log(dna_seq);
	for (i = 0;  i < dna_seq.length; i++) {
		//var nucleotide = dna_seq.substring(i,i+1).toUpperCase();
		//console.log("At pos " + i + nucleotide);
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
		case "N":
			 c += 'N';
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
	var rc = "";
	//console.log(dna_seq);
	for (i = dna_seq.length -1; i >=0; i--) {
		//var nucleotide = dna_seq.substring(i,i+1).toUpperCase();
		//console.log(nucleotide);
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
		//console.log(i +" " + codon + "@");
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
			aa = "?";
		}
		//console.log("    " + aa + "    ");
		aa_seq += (aa);
	}
	return aa_seq;
}
