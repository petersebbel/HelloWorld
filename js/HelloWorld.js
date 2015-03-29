// Class to represent a scaffold
function scaffold(name, start, end) {
    var self = this;
    self.name = name;
    self.start = start;
    self.end = end;
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
	var self = this;
 	self.scaffoldArray = ko.observableArray();    // Initially an empty array
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
		//self.scaffoldArray = findORFs(self.validatedSeq()).slice();
		findORFs(self);

        return self.validatedSeq() + self.validatedSeq();    
    }, self);

}


function findORFs(self) {
	var regEx = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
	var myArray;
	var retArray = [];
	while ((myArray = regEx.exec(self.validatedSeq())) !== null) {
  		var msg = 'Found ' + myArray[0] + '. ';
  		msg += 'Next match starts at ' + regEx.lastIndex;
  		console.log(msg);
  		retArray.push(myArray[0]);
  		self.scaffoldArray.push(new scaffold(myArray[0], 1, regEx.lastIndex));
	}
	return retArray;

}

