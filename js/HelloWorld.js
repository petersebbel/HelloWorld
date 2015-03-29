// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
	var self = this;
 
    self.inputSeq = ko.observable("Enter your Sequence here");
    self.validatedSeq = ko.computed(function() {
        return self.inputSeq().toUpperCase().replace(/[^ACGTNacgtn]/gi, "");    
    }, self);

	self.formatedSeq = ko.pureComputed(function  () {
		var retSeq = "";
		var vlen = self.validatedSeq().length;
		for (var i = 0; i < vlen; i+= 60) {
			for (var j = 0; j <  (vlen.toString().length - i.toString().length); j++) {
				retSeq += " ";
			}
			retSeq += i + " " + self.validatedSeq().substring(i, i+60) + " "  + ((i+60 < vlen) ? i+60 : vlen ) + "\n";
		}
		return retSeq;
	}, self);
    
	self.doubleSeq = ko.computed(function() {
        return this.validatedSeq() + this.validatedSeq();    
    }, self);
}


function findORFs(seq) {
	var regEx = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
	var myArray;
	while ((myArray = regEx.exec(str)) !== null) {
  		var msg = 'Found ' + myArray[0] + '. ';
  		msg += 'Next match starts at ' + regEx.lastIndex;
  		console.log(msg);
	}

}

