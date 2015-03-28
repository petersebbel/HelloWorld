// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    this.firstName = ko.observable("Bert");
    this.lastName = ko.observable("Bertington");
    this.fullName = ko.computed(function() {
        return this.firstName() + " " + this.lastName();    
    }, this);
    
    this.inputSeq = ko.observable("Enter your Sequence here");
    this.formatedSeq = ko.computed(function() {
        return this.inputSeq().replace(/[0-9]|\r|\n|\s/gi, "");    
    }, this);
    this.doubleSeq = ko.computed(function() {
        return this.formatedSeq() + this.formatedSeq();    
    }, this);
    
    
}
