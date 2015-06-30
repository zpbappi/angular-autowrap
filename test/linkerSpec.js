"use strict";

describe("linker service", function(){
	var linker;
	
	beforeEach(module("angular-autowrap"));
	
	beforeEach(inject(function(autowrapLinker){
		linker = autowrapLinker;
	}));
	
	it("has lot of responsibilities in a single method and needs refactoring", function(){
		expect("my response").toBeTruthy();
	});
});