"use strict";

describe("autowrap controller", function(){
    var ctrl;
	
	beforeEach(module("angular-autowrap-internal"));
	
	beforeEach(inject(function(autowrapController){
		ctrl = autowrapController;
	}));
	
	it("should be resolved correctly", function(){
		expect(ctrl).not.toBe(null);
	});
	
	it("should have a init method", function(){
		expect(ctrl.init).toBeDefined();
	});
	
	describe("$scope", function(){
		var scope = {};
	
		beforeEach(function(){
			ctrl.init(scope);
		});
		
		it("should have validation state properties", function(){
			var properties = ["_dirty", "_valid", "_invalid"];
			
			properties.forEach(function(p) {
				expect(scope[p]).toBeDefined();
			}, this);
		});
		
		it("should have state functions", function(){
			expect(typeof scope.isDirty).toBe("function");
			expect(typeof scope.isValid).toBe("function");
			expect(typeof scope.isInvalid).toBe("function");
		});
		
		it("state functions should return false initially", function(){
			expect(scope.isDirty()).toBe(false);
			expect(scope.isValid()).toBe(false);
			expect(scope.isInvalid()).toBe(false);
		});
		
		it("should have ways to get/set validation message", function(){
			expect(scope._message).toBeDefined();
			expect(typeof scope.validationMessage).toBe("function");
			
			var msg = "test message";
			scope._message = msg;
			expect(scope.validationMessage()).toEqual(msg);
		});
	});
});