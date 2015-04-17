var globalPGModel;

function fp (seq, start, end) {
	var self = this;
    self.seq 	   = ko.observable(seq);
    self.start     = ko.observable(start);
    self.end      = ko.observable(end);
}

function ORFcoords (regEx, seq, withRNDregion) {
	var retArray =  [];
	//var regEx;
	var prefix = "";
	if (withRNDregion) {
		//regEx  = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
		
		prefix = "Scaff ";
	} else {
		//regEx  = /ATG((?!(TGA|TAG|TAA|NNN)).{3}){150,}(TAA|TGA|TAG)/gi;	
		prefix = "ORF ";
	}
	var myArray;
	
	while ((myArray = regEx.exec(seq) !== null)) {
		retArray.push({
			"name": "Orf", 
			"start": seq.substring(myArray.index, regEx.lastIndex), 
			"end": regEx.lastIndex });
  		//self.scaffoldArray.push(new scaffold("Scaff " + myArray.index.toString() + " " + regEx.lastIndex.toString(), self.seq().substring(myArray.index, regEx.lastIndex)));
	}  
	return retArray;  	
}


function scaffold (name, seq) {
	var self = this;
    self.name      = ko.observable(name);
    self.seq 	   = ko.observable(seq);
    self.FPArray   = ko.observableArray();
    self.validFPs  = ko.observableArray();
    self.noValidFPs = ko.pureComputed(function() {
		return self.validFPs().length;
    }, self);
    
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
	 self.noFPs = ko.pureComputed(function(){
	 	return self.FPArray().length;
	 });

     for(var i = 0; i < (self.seq().length  - 1*globalPGModel.FPlength()); i++) {
  	  	var FP = self.seq().substring(i, (i + 1*globalPGModel.FPlength()));
  		if (FP.search(/N/i) === -1) {
  			self.FPArray.push(new fp(FP, i, (i + 1*globalPGModel.FPlength())));
		}
	 }
}

function sequence(name, seq) {
	var self = this;
    self.name      = ko.observable(name);
    self.seq       = ko.observable(seq);
    self.ORFArray  = ko.observableArray();
    self.scaffoldArray  = ko.observableArray();
    self.noScaffs = ko.pureComputed(function() {
    	return self.scaffoldArray().length;
    });
    self.noORFs = ko.pureComputed(function() {
    	return self.ORFArray().length;
    });
    
    var regEx  = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
	var myArray;
	
	//var dArray = ORFcoords (regEx, self.seq(), true);
	//for (var ORF in dArray) {
	//	console.log(ORF.name);
	//}
	
	
	
	while ((myArray = regEx.exec(self.seq())) !== null) {
  		self.scaffoldArray.push(new scaffold("Scaff " + myArray.index.toString() + " " + regEx.lastIndex.toString(), self.seq().substring(myArray.index, regEx.lastIndex)));
	}  
	regEx  = /ATG((?!(TGA|TAG|TAA|NNN)).{3}){150,}(TAA|TGA|TAG)/gi;
	myArray = [];
	while ((myArray = regEx.exec(self.seq())) !== null) {
  		self.ORFArray.push(new scaffold("ORF " + myArray.index.toString() + " " + regEx.lastIndex.toString(), self.seq().substring(myArray.index, regEx.lastIndex)));
	}  
}


function AppViewModel() {
	var self = this;
	self.currentSeq = ko.observable();
	self.currentORFs = ko.observableArray();
	self.seqs       = ko.observableArray();
	self.FPlength   = ko.observable(10);
    self.noSeqs     = ko.pureComputed(function() {
		return self.seqs().length;
    }, self);
    self.currentSeqName = ko.observable("PlasmidNo " + (self.noSeqs() +1).toString());
	self.addSeq = function(){
		self.seqs.push(new sequence(self.currentSeqName(), self.currentSeq()));
		self.currentSeq('');
		self.currentSeqName("PlasmidNo " + (self.noSeqs() +1).toString());
		self.updateUniqueFPs();
	}; 
	self.uniqueFPs = ko.observableArray();
	var allFPs = {};
	var totalFPs = 0;
	var uFPs = 0;
	self.updateUniqueFPs = function () {
		allFPs = {};
		totalFPs = 0;
		uFPs = 0;
		self.uniqueFPs.removeAll();
		ko.utils.arrayForEach(self.seqs(), function(seq) {
			ko.utils.arrayForEach(seq.scaffoldArray(), function(scaff) {
				scaff.validFPs.removeAll();
				ko.utils.arrayForEach(scaff.FPArray(), function(FP) {
					//console.log("iterating " + seq.name());
					//console.log("iterating " + scaff.name());
					//console.log("iterating " + FP.seq());
					totalFPs++;
					if (allFPs[FP.seq()] >= 1) {
						allFPs[FP.seq()] = allFPs[FP.seq()] + 1;
					} else {
						allFPs[FP.seq()] = 1;
					}
        		});
    		});
		});
		ko.utils.arrayForEach(self.seqs(), function(seq) {
		   //console.log("Working on Seq " + seq.name()); //"aa", bb", "cc"
			ko.utils.arrayForEach(seq.scaffoldArray(), function(scaff) {
				///console.log("Working on Scaff " + scaff.name());
				ko.utils.arrayForEach(scaff.FPArray(), function(FP) {
					//console.log("iterating " + seq.name());
					//console.log("iterating " + scaff.name());
					//console.log("iterating " + FP.seq());
					
					if (allFPs[FP.seq()] > 1) {
						//console.log("Dropped " + FP.seq());
					} else {
						scaff.validFPs.push(new fp(FP.seq(), FP.start(), FP.end()));
						//console.log("Probably found a unique Fingerprint" + FP.seq() + " for scaff " + scaff.name());
					}
        		});
    		});
		});

		console.log("Analysed " + totalFPs + " and found " + Object.keys(allFPs).length + " unique");
		for (var i in allFPs) {
				if (allFPs[i] === 1) {
  					//console.log(i + " " + allFPs[i]); //"aa", bb", "cc"
  					uFPs++;
  				}
		}
		console.log("Identified " + uFPs + " sequences that occured only once")
	
	}
	
}

