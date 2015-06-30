"use strict";

describe("linker helper", function(){
	var helper;
	
	beforeEach(module("angular-autowrap-internal"));
	
	beforeEach(inject(function(autowrapLinkerHelper){
		helper = autowrapLinkerHelper;
	}));
	
	it("should resolve", function(){
		expect(helper).toBeDefined();
		expect(helper).not.toBe(null);
	});
	
	describe("getErrorTypes method", function(){
		it("should return empty array for falsy values", function(){
			var fn = helper.getErrorTypes;
			
			expect(fn(void (0))).toEqual([]);
			expect(fn(false)).toEqual([]);
			expect(fn({})).toEqual([]);
			expect(fn([])).toEqual([]);
			expect(fn("")).toEqual([]);
		});
	});
});