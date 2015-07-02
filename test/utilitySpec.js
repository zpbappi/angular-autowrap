"use strict";

describe("utility service", function(){
	var service,
		filterFnHolder = {},
		exp = function(a, b){ return a%2 === 0; };
	
	beforeEach(module("angular-autowrap-internal"));
	
	beforeEach(function(){
		filterFnHolder.fn = function(array, expression, comparator){};
		
		var filter = function(method){
			if(method !== "filter"){
				throw "I wasn't expecting: " + method;
			}
			
			return filterFnHolder.fn;
		};
		
		spyOn(filterFnHolder, "fn");
		
		module(function($provide){
			$provide.value("$filter", filter);
		});
	});
	
	beforeEach(inject(function(autowrapUtility){
		service = autowrapUtility;
	}));
	
	it("should use angular 'filter' service from $filter", function(){
		service.filter([1, 2, 3], exp);
		expect(filterFnHolder.fn).toHaveBeenCalledWith([1,2,3], exp, void (0));
	});
	
	describe("isUpperCase method", function(){
		it("should return false for falsy values", function(){
			expect(service.isUpperCase("")).toBe(false);
			expect(service.isUpperCase(false)).toBe(false);
			expect(service.isUpperCase(void (0))).toBe(false);
			expect(service.isUpperCase(null)).toBe(false);
		});
		
		it("should decide properly when only alpha characters are used", function(){
			expect(service.isUpperCase("A")).toBe(true);
			expect(service.isUpperCase("c")).toBe(false);
			expect(service.isUpperCase("ABCD")).toBe(true);
			expect(service.isUpperCase("abcdc")).toBe(false);
			expect(service.isUpperCase("AbcD")).toBe(false);
		});
		
		it("should treat non-alpha characters uppercase trivially", function(){
			expect(service.isUpperCase("-")).toBe(true);
			expect(service.isUpperCase(" ")).toBe(true);
			expect(service.isUpperCase("0")).toBe(true);
			expect(service.isUpperCase("  -#5345 3599345 345")).toBe(true);
		});
		
		it("should treat mixture of alpha and non-alpha characters considering alpha-characters only", function(){
			expect(service.isUpperCase("A--9 45")).toBe(true);
			expect(service.isUpperCase("A  B")).toBe(true);
			expect(service.isUpperCase("A -c D")).toBe(false);
		});
	});
	
});