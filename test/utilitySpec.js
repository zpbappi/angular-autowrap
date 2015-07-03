"use strict";

describe("utility service", function(){
	var service;
	
	beforeEach(module("angular-autowrap-internal"));
	
	describe("filter method", function(){
		var mockFilterProvider,
			mockFilterService,
			filterExpression;
			
		beforeEach(function(){
			mockFilterService = jasmine.createSpy("filterService");
			mockFilterProvider = jasmine.createSpy("filterProvider").and.returnValue(mockFilterService);
			filterExpression = function(){};
			
			module(function($provide){
				$provide.value("$filter", mockFilterProvider);
			});
		});
		
		beforeEach(inject(function(autowrapUtility){
			service = autowrapUtility;
		}));
		
		it("should use angular 'filter' service from $filter", function(){
			service.filter([1, 2, 3], filterExpression);
			expect(mockFilterProvider).toHaveBeenCalledWith("filter");
			expect(mockFilterService).toHaveBeenCalledWith([1,2,3], filterExpression, void (0));
		});
	});
	
	
	describe("isUpperCase method", function(){
		beforeEach(inject(function(autowrapUtility){
			service = autowrapUtility;
		}));
		
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
	
	describe("getCamelCasedAttributeName method", function(){
		beforeEach(inject(function(autowrapUtility){
			service = autowrapUtility;
		}));
		
		it("should return the same input for falsy strings", function(){
			expect(service.getCamelCasedAttributeName(null)).toBe(null);
			expect(service.getCamelCasedAttributeName("")).toBe("");
		});
		
		it("should reurn camelCased name from dashed", function(){
			expect(service.getCamelCasedAttributeName("my-property")).toBe("myProperty");
		});
		
		it("should return the same for a single word", function(){
			expect(service.getCamelCasedAttributeName("property")).toBe("property");
		});
		
		it("should append the prefix passed to it", function(){
			expect(service.getCamelCasedAttributeName("property", "my")).toBe("myProperty");
			expect(service.getCamelCasedAttributeName("my-property", "prefixed")).toBe("prefixedMyProperty");
		});
	});
	
	describe("hasAnyProperty method", function(){
		beforeEach(inject(function(autowrapUtility){
			service = autowrapUtility;
		}));
		
		it("should return false for falsy values", function(){
			expect(service.hasAnyProperty(false)).toBe(false);
			expect(service.hasAnyProperty(null)).toBe(false);
			expect(service.hasAnyProperty(void (0))).toBe(false);
		});
		
		it("should return false for empty objects", function(){
			expect(service.hasAnyProperty({})).toBe(false);
		});
		
		it("should return true for any object with any property", function(){
			expect(service.hasAnyProperty({a: true})).toBe(true);
		});
	});
	
});