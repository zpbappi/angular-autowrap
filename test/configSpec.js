"use strict";

describe("default configuration", function(){
	var config;
	
	beforeEach(module("angular-autowrap"));
	beforeEach(inject(function(autowrapConfig){
		config = autowrapConfig;
	}));
	
	it("should apply states to default wrapper", function(){
		expect(config.auto.applyStatesToWrapper).toBe(true);
	});
	
	it("should not apply state css classes to the element", function(){
		expect(config.applyStatesToInput).toBe(false);
	});
	
	it("should have validation enabled", function(){
		expect(config.noTrack).toBe(false);
	})
});