"use strict";

describe("custom-property-helper", function(){
	
	var helper,
		propertyPrefix = "testPrefix";
	
	beforeEach(module("angular-autowrap-internal"));
	
	beforeEach(function(){
		var utility = {
			isUpperCase: function(str){
				return angular.uppercase(str) === str;
			}	
		};
		
		module(function($provide){
			$provide.value("autowrapUtility", utility);
			$provide.constant("customObjectPropertyPrefix", propertyPrefix);
		});
		
		inject(function($injector){
			helper = $injector.get("autowrapCustomPropertyHelper");
		});
	});
	
	it("should be resolved properly", function(){
		expect(helper).toBeDefined();
		expect(typeof helper).toBe("object");
	});
	
	describe("isCustomProperty method", function(){
		
		it("shold return true for strings starting with property prefix", function(){
			expect(helper.isCustomProperty(propertyPrefix + "Prop")).toBe(true);
		})
		
		it("should return false for falsy values", function(){
			expect(helper.isCustomProperty(void (0))).toBe(false);
			expect(helper.isCustomProperty(false)).toBe(false);
			expect(helper.isCustomProperty(0)).toBe(false);
			expect(helper.isCustomProperty([])).toBe(false);
			expect(helper.isCustomProperty('')).toBe(false);
		});
		
		it("should return false without the property prefix", function(){
			expect(helper.isCustomProperty("$$$" + propertyPrefix + "Prop")).toBe(false);
		});
		
		it("should detect presence of only prefix", function(){
			expect(helper.isCustomProperty(propertyPrefix)).toBe(false);
		});
		
		it("should detect prefix as substring", function(){
			expect(helper.isCustomProperty(propertyPrefix + "continuation")).toBe(false);
		});
	});
	
	describe("getCustomPropertyName method", function(){
		
		it("should trim prefix and return camel-cased property", function(){
			var propertyName = propertyPrefix + "MyProperty";
			expect(helper.getCustomPropertyName(propertyName)).toBe("myProperty");
		});
	});
});