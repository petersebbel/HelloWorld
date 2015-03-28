// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
	var self = this;
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
    this.fullName = ko.computed(function() {
        return this.firstName() + " " + this.lastName();    
    }, this);
    
    this.inputSeq = ko.observable("Enter your Sequence here");
    this.validatedSeq = ko.computed(function() {
        return this.inputSeq().toUpperCase().replace(/[^ACGTNacgtn]/gi, "");    
    }, this);
    //var helper = self.validatedSeq();
    //self.formatedSeq = ko.computed(formatSequence(helper));


self.formatedSeq = ko.computed(function  () {

		var retSeq = "";
		for (var i = 0; i < self.validatedSeq().length; i+= 60) {
			var h = i;
			while (h < 10000) {
				if (h < 1) { h = 1};
				retSeq += " ";
				h = h * 10;
			}
			retSeq += i + " " + self.validatedSeq().substring(i, i+60) + " "  + ((i+60 < self.validatedSeq().length) ? i+60 : self.validatedSeq().length ) + "\n";
		}
	return retSeq;
	}, this);
    
    

    
    this.doubleSeq = ko.computed(function() {
        return this.validatedSeq() + this.validatedSeq();    
    }, this);
    
    
}

function formatSequence (seq) {
	var tseq = seq.replace(/[^ACGTNacgtn]/gi, "");
		var retSeq = "";
		for (var i = 0; i < tseq.length; i+= 60) {
			var h = i;
			while (h < 10000) {
				if (h < 1) { h = 1};
				retSeq += " ";
				h = h * 10;
			}
			retSeq += i + " " + tseq.substring(i, i+60) + " "  + ((i+60 < tseq.length) ? i+60 : tseq.length ) + "\n";
		}
	return retSeq;
}
