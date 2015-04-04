// Class to represent a scaffold
function scaffold(name, start, end, AVModel) {
    var self = this;
    self.scaffName = ko.observable(name);
    self.start =     ko.observable(start);
    self.end =       ko.observable(end);
    self.seq =       ko.pureComputed(function() {
		return formatSeqAA(AVModel.doubleSeq().substring(self.start(), self.end()));
    	});
	self.RRs = [];
	self.VRs = [];
	self.MPs = [];
}

function randomizedRegion(name, start, end) {
    var self = this;
    self.name = name;
    self.start = start;
    self.end = end;
}

function variableRegion(name, start, end) {
    var self = this;
    self.name = name;
    self.start = start;
    self.end = end;
}

function matureProtein(name, start, end) {
    var self = this;
    self.name = name;
    self.start = start;
    self.end = end;
}

function toggleHide(self) {
	var that = this;
	console.log("parent " + $(self).parent());
	var parent = $(self).parent();
		console.log(parent);
	var sibling = parent.siblings();
			console.log(sibling);
	//var sibling = $(parent).sibling();
		//alert("parent sibling " + sibling);
		//$(self).parent().sibling().hide();
		sibling.toggle(300);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
	var self = this;

    self.inputSeq = ko.observable("Enter your Sequence here");
	self.libName = ko.observable("Enter Library Name here");    


    self.validatedSeq = ko.pureComputed(function() {
        return self.inputSeq().toUpperCase().replace(/[^ACGTNacgtn]/gi, "");    
    }, self);

	self.doubleSeq = ko.pureComputed(function() {
		return self.validatedSeq() + self.validatedSeq();    
    }, self);
	
	self.formatedSeq = ko.pureComputed(function() {
		findORFs(self);
		return formatSeq(self.validatedSeq());
	}, self);
	
	 self.scaffoldArray = ko.observableArray();    // Initially an empty array
	 
	 
	 self.addScaff = function(){
		alert("Add Scaffold");
		self.scaffoldArray.push(new scaffold("Scaffold 0 0" , 0 , 0, self));
	}

	self.removeScaff = function(scaffold) {
		alert("Remove Scaffold " + scaffold.scaffName );
		self.scaffoldArray.remove(scaffold);
	}

}


function findORFs(self) {
	var regEx = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
	var myArray;
	var retArray = [];
	var scaffoldNum = 1;
	while ((myArray = regEx.exec(self.validatedSeq())) !== null) {
  		var msg = 'Found ' + myArray[0] + '. ';
  		msg += 'Next match starts at ' + regEx.lastIndex;
  		console.log(msg);
  		retArray.push("Scaffold " + scaffoldNum.toString());
  		
  		self.scaffoldArray.push(new scaffold("Scaffold " + myArray.index.toString() + " " + regEx.lastIndex.toString(), myArray.index, regEx.lastIndex, self));
  		//, self.doubleSeq().substring(myArray.index, regEx.lastIndex)
  		scaffoldNum++;
	}
	return retArray;
}

function findRRs(seq) {
	var regEx = /(NNN){1,}/gi;
	var myArray;
	var retArray = [];
	while ((myArray = regEx.exec(seq) !== null)) {
  		var msg = 'Found ' + myArray[0] + '. ';
  		msg += 'Next match starts at ' + regEx.lastIndex;
  		console.log(msg);
  		
  		retArray.push(new randomizedRegion("name", myArray.index, regEx.lastIndex));
	}
	return retArray;
}

function formatSeq (seq){
	var retSeq = "";
	if (seq === undefined) {
		return;
	}
	for (var i = 0; i < seq.length; i+= 60) {
			for (var j = 0; j <  (seq.length.toString().length - i.toString().length); j++) {
				retSeq += " ";
			}
			retSeq += " " + (i + 1) + " " + seq.substring(i, i+60) + " "  + ((i+60 < seq.length) ? i+60 : seq.length ) + "\n";
		}
	return retSeq;
}

function formatSeqAA (seq){
	var retSeq = "";
	
	if (seq === undefined) {
		return "";
	}
	var aa= dna2aa(seq);
	for (var i = 0; i < seq.length; i+= 60) {
			var spacer = "";
			for (var j = 0; j <  (seq.length.toString().length - i.toString().length); j++) {
				spacer += " ";
			}
			retSeq += spacer + (i + 1) + " " + seq.substring(i, i+60) + " "  + ((i+60 < seq.length) ? i+60 : seq.length ) + "\n";
			retSeq += spacer + (i + 1) + " " + aa.substring((i/3), (i+60)/3).split("").join("  ") + "   "  + ((i+60 < seq.length) ? i+60 : seq.length ) + "\n";
		}
	return retSeq;
}