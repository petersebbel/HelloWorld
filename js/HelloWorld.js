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
	}, this);
    
	this.doubleSeq = ko.computed(function() {
        return this.validatedSeq() + this.validatedSeq();    
    }, this);
    
    
}


