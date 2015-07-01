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
		var fn;
		
		beforeEach(function(){
			fn = helper.getErrorTypes;
		});
		
		it("should return empty array for falsy values", function(){
			expect(fn(void (0))).toEqual([]);
			expect(fn(false)).toEqual([]);
			expect(fn({})).toEqual([]);
			expect(fn([])).toEqual([]);
			expect(fn("")).toEqual([]);
		});
		
		it("should return properties only with truthy values from $error object", function(){
			var field = {
				$error: {
					a: true,
					b: false,
					c: true
				}
			};
			
			expect(fn(field)).toEqual(["a", "c"]);
		});
	});
	
	describe("setWatch method", function(){
		var scope,
			ctrl;
		
		beforeEach(inject(function($rootScope){
			scope = $rootScope.$new();
			spyOn(scope, "$watch").and.callThrough();
		}));
		
		beforeEach(function(){
			ctrl = {
				myElement: {
					myProperty: 1
				}
			};
		});
		
		it("should set scope property initially from controller", function(){
			helper.setWatch(scope, ctrl, "myElement", "myProperty", "myScopeProperty");
			scope.$apply();
			expect(scope.myScopeProperty).toBe(ctrl.myElement.myProperty);
		});
		
		describe("on changing the value of the element", function(){
			
			var obj = {
			};
			
			beforeEach(function(){
				obj.callback = function(newVal, oldVal){};
				spyOn(obj, "callback");
				helper.setWatch(scope, ctrl, "myElement", "myProperty", "myScopeProperty", obj.callback);
				scope.$apply();
			});
			
			beforeEach(function(){
				ctrl.myElement.myProperty = 42;
				scope.$apply();
			});
			
			it("should update scope value properly", function(){
				expect(scope.myScopeProperty).toBe(42);
			});
			
			it("should execute the callback function with new and old values", function(){
				expect(obj.callback).toHaveBeenCalledWith(42, 1);
			});
		});
	});
	
	describe("enableAddingStateClassesToInputElement method", function(){
		var element = {},
			scope,
			config = {
				dirtyStateClass: "dirty-class",
				validStateClass: "valid-class",
				invalidStateClass: "invalid-class"
			};
		
		beforeEach(inject(function($rootScope){
			scope = $rootScope.$new();
		}));
		
		beforeEach(function(){
			scope.dirty = false;
			scope.isDirty = function(){
				return this.dirty;
			};
			scope.valid = false;
			scope.isValid = function(){
				return this.valid;
			};
			scope.invalid = false;
			scope.isInvalid = function(){
				return this.invalid;
			};
			
			spyOn(scope, "$watch").and.callThrough();
		});
		
		beforeEach(function(){
			element.addClass = function(){};
			element.removeClass = function(){};
			
			spyOn(element, "addClass");
			spyOn(element, "removeClass");
		});
		
		beforeEach(function(){
			helper.enableAddingStateClassesToInputElement(scope, element, config);
		});
		
		it("should register by calling $watch", function(){
			expect(scope.$watch).toHaveBeenCalled();
			expect(scope.$watch.calls.count()).toBe(1);
		});
		
		it("should add proper state class to the element", function(){
			scope.dirty = true;
			scope.valid = true;
			scope.invalid = true;
			scope.$apply();
			
			expect(element.addClass).toHaveBeenCalledWith(config.validStateClass);
			expect(element.addClass).toHaveBeenCalledWith(config.invalidStateClass);
			expect(element.addClass).toHaveBeenCalledWith(config.dirtyStateClass);
		});
		
		it("should remove relevant state class from element", function(){
			scope.dirty = false;
			scope.valid = false;
			scope.invalid = false;
			scope.$apply();
			
			expect(element.removeClass).toHaveBeenCalledWith(config.validStateClass);
			expect(element.removeClass).toHaveBeenCalledWith(config.invalidStateClass);
			expect(element.removeClass).toHaveBeenCalledWith(config.dirtyStateClass);
		});
	});
});