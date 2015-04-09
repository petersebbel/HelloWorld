var globalPGModel;


function feature (name, seq) {
	var self = this;
    self.name      = ko.observable(name);
    self.seq 	   = ko.observable(seq);
	self.incStart = function() {
	 	self.start(self.start() + 3);	 	
	 };
	 self.decStart = function() {
	 	self.start(self.start() - 3);	 	
	 };
	 self.incEnd = function() {
	 	self.end(self.end() + 3);	 	
	 };
	 self.decEnd = function() {
	 	self.end(self.end() - 3);	 	
	 };
	 self.FPArray   = ko.observableArray();
	 var d1 = self.seq().length;
	 var d2 = 10;
	 		  
	 var d3 = d1 -d2;

    for(var i = 0; i < d3; i++) {
  	  	var FP = self.seq().substring(i, i + d2);
  		if (FP.search(/N/i) === 0) {
  		  	self.FPArray.push(new feature(FP, i, i + d2));
		}
	}
}


function sequence(name, seq) {
	var self = this;
    self.name      = ko.observable(name);
    self.seq       = ko.observable(seq);
    self.ORFArray  = ko.observableArray();
    var regEx  = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
	var myArray;

	while ((myArray = regEx.exec(self.seq())) !== null) {
  		self.ORFArray.push(new feature("Scaff " + myArray.index.toString() + " " + regEx.lastIndex.toString(), self.seq().substring(myArray.index, regEx.lastIndex)));
	}  
}


function AppViewModel() {
	var self = this;
	self.currentSeq = ko.observable();
	self.seqs       = ko.observableArray();
	self.FPlength   = ko.observable(10);
    self.noSeqs     = ko.pureComputed(function() {
		return self.seqs().length;
    }, self);
	self.addSeq = function(name){
		self.seqs.push(new sequence("Hugo", self.currentSeq()));
	}; 
}

