// Class to represent a scaffold
function scaffold(name, start, end, AVModel) {
    var self = this;
    self.scaffName = ko.observable(name);
    self.start     = ko.observable(start);
    self.end       = ko.observable(end);
    self.AVModel   = AVModel;
    self.seq       = ko.pureComputed(function() {
		return formatSeqAA(AVModel.doubleSeq().substring(self.start(), self.end()));
    });
}

function randomizedRegion(name, start, end, parent ) {
    var self    = this;
    self.name   = ko.observable(name);
    self.start  = ko.observable(start);
    self.minLen = ko.observable((end - start));
    self.maxLen = ko.observable((end - start));
    self.parent = parent;
}

function variableRegion(name, start, end, parent) {
    var self    = this;
    self.name   = ko.observable(name);
    self.start  = ko.observable(start);
    self.end    = ko.observable(end);
    self.parent = parent;
    self.aaSeq  = ko.pureComputed(function(){
    	return dna2aa(parent.AVModel.doubleSeq().substring(self.start(), self.end())).replace(/(.{1,80})/g, '$1\n');
    }, self);
}

function matureProtein(name, start, end, parent) {
    var self    = this;
    self.name   = ko.observable(name);
    self.start  = ko.observable(start);
    self.end    = ko.observable(end);
    self.parent = parent;
    self.aaSeq  = ko.pureComputed(function(){
    	return dna2aa(parent.AVModel.doubleSeq().substring(self.start(), self.end())).replace(/(.{1,80})/g, '$1\n');
    }, self);
}

function toggleHide(self) {
	$(self).parent().siblings().toggle(300);
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
	var self = this;

    self.inputSeq = ko.observable("Enter your Sequence here");
	self.libName  = ko.observable("Enter Library Name here");    

    self.validatedSeq = ko.pureComputed(function() {
        return self.inputSeq().toUpperCase().replace(/[^ACGTNacgtn]/gi, "");    
    }, self);

	self.doubleSeq = ko.pureComputed(function() {
		return self.validatedSeq() + self.validatedSeq();    
    }, self);
	
	self.formatedSeq = ko.pureComputed(function() {
		return formatSeq(self.validatedSeq());
	}, self);
	
	 self.scaffoldArray = ko.observableArray();    // Initially an empty array
	 self.RRs = ko.observableArray();
	 self.VRs = ko.observableArray();
	 self.MPs = ko.observableArray();
	 
	 self.incStart = function(ref) {
	 	ref.start(ref.start() + 3);	 	
	 };
	 self.decStart = function(ref) {
	 	ref.start(ref.start() - 3);	 	
	 };
	 self.incEnd = function(ref) {
	 	ref.end(ref.end() + 3);	 	
	 };
	 self.decEnd = function(ref) {
	 	ref.end(ref.end() - 3);	 	
	 };
	
	 self.incMaxLen = function(ref) {
	 	ref.maxLen(ref.maxLen() + 3);	 	
	 };
	 self.decMaxLen = function(ref) {
	 	if (ref.maxLen() <= ref.minLen()) {
	 		ref.maxLen(ref.minLen());
	 	} else {
	 		ref.maxLen(ref.maxLen() - 3);	 	
	 	}
	 };
	 
	 self.addScaff = function(){
		self.scaffoldArray.push(new scaffold("Scaffold 0 0" , 0 , 0, self));
	};
	
	 self.addMP = function(ref){
		self.MPs.push(new matureProtein("Mature Prot " + ref.scaffName() , ref.start() , ref.end(), ref));
	};

	self.removeScaff = function(scaffold) {
		self.scaffoldArray.remove(scaffold);
	};
	
	self.addRR = function(){
		self.RRs.push(new randomizedRegion("Rnd.Reg 0 0" , 0 , 0, self));
	};

	self.removeRR = function(RR) {
		self.RRs.remove(RR);
	};
	
	self.removeMP = function(MP) {
		self.MPs.remove(MP);
	};
	
	self.addVR = function(ref){
		self.VRs.push(new variableRegion("Var.Reg. "+ ref.scaffName() , ref.start() , ref.end(), ref));
	};
	
	self.removeVR = function(VR) {
		self.MPs.remove(VR);
	};
	
	
	
	self.findORFs = function () {
		var regEx = /ATG((?!(TGA|TAG|TAA)).{3})*(NNN){1,}((?!(TGA|TAG|TAA)).{3})*(TAA|TGA|TAG)/gi;
		var myArray;
		
		self.scaffoldArray.removeAll();  
	 	self.RRs.removeAll();
	 	self.VRs.removeAll();
	 	self.MPs.removeAll();
		while ((myArray = regEx.exec(self.validatedSeq())) !== null) {
  			self.scaffoldArray.push(new scaffold("Scaffold " + myArray.index.toString() + " " + regEx.lastIndex.toString(), myArray.index, regEx.lastIndex, self));
		}
		regEx = /(NNN){1,}/gi;
	
		while ((myArray = regEx.exec(self.validatedSeq())) !== null) {
			var parent = "none";
  			
  			ko.utils.arrayForEach(self.scaffoldArray(), function(scaff) {
  				if ((myArray.index >= scaff.start()) && regEx.lastIndex <= scaff.end()) {
  					parent = scaff;
  				}
  			});
			self.RRs.push(new randomizedRegion("Rnd. Reg. " + myArray.index.toString() + " " + regEx.lastIndex.toString(), myArray.index, regEx.lastIndex, parent));  		
		}
	};
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