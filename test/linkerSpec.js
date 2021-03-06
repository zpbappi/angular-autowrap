"use strict";

describe("linker service", function(){
	var linker,
		scope,
		attrs,
		config,
		validationMsgPrefix,
		customPropertyPrefix,
		element;
	
	beforeEach(module("angular-autowrap"));
	
	beforeEach(inject(function(autowrapLinker, $rootScope, autowrapConfig, validationMessagePropertyPrefix, customObjectPropertyPrefix){
		linker = autowrapLinker;
		attrs = {};
		scope = $rootScope.$new();
		scope.custom = {};
		validationMsgPrefix = validationMessagePropertyPrefix;
		config = autowrapConfig;
		customPropertyPrefix = customObjectPropertyPrefix;
	}));
	
	beforeEach(function(){
		element = angular.element('<intput name="testElement" angular-autowrap />');
	});
	
	describe("custom property for templates", function(){
		beforeEach(function(){
			config.noTrack = true;
		});
		
		it("should be empty by default", function(){
			linker.init(scope, element, attrs, null, null);
			expect(scope.custom).toEqual({});
		});
		
		it("should set custom properties from attributes", function(){
			attrs[customPropertyPrefix + "MyFirstProperty"] = "first";
			attrs[customPropertyPrefix + "MySecondProperty"] = "second";
			linker.init(scope, element, attrs, null, null);
			
			expect(scope.custom.myFirstProperty).toBe("first");
			expect(scope.custom.mySecondProperty).toBe("second");
		});
	});
	
	describe("when transcluding", function(){
		var templateProvider;
		
		beforeEach(function(){
			config.noTrack = true;
			
			inject(function(autowrapTemplateProvider){
				templateProvider = autowrapTemplateProvider;
			});
			
			spyOn(templateProvider, "get").and.returnValue("<the-template>");
		});
		
		it("should get template for the control name by default", function(){
			linker.init(scope, element, attrs, null, null);
			
			expect(templateProvider.get).toHaveBeenCalledWith(element[0].tagName, void(0));
		});
		
		it("should be possible to override the control name to use for template", function(){
			scope.templateFor = "select";
			linker.init(scope, element, attrs, null, null);
			
			expect(templateProvider.get).toHaveBeenCalledWith("select", void (0));
		});
	});
	
	describe("directive requirements", function(){
		
		var linkerHelper;
		
		beforeEach(function(){
			config.noTrack = false;
			inject(function(autowrapLinkerHelper){
				linkerHelper = autowrapLinkerHelper;
				spyOn(linkerHelper, "setWatch").and.returnValue(void (0));
			});
		});
		
		it("may not have name and controllers in noTrack mode", function(){
			config.noTrack = true;
			var linkerInit = function(){
				element = angular.element('<input angular-autowrap />');
				linker.init(scope, element, attrs, {}, null);
			};
			
			expect(linkerInit).not.toThrow();
		});
		
		it("should be possible to override noTrack config via attrs", function(){
			config.noTrack = false;
			var linkerInit = function(){
				element = angular.element('<input angular-autowrap />');
				attrs.autowrapNoTrack = true;
				linker.init(scope, element, attrs, null, null);
			};
			
			expect(linkerInit).not.toThrow();
			
			linkerInit = function(){
				element = angular.element('<input angular-autowrap />');
				config.noTrack = false;
				delete attrs.autowrapNoTrack;
				linker.init(scope, element, attrs, null, null);
			};
			expect(linkerInit).toThrow();
		});
		
		it("must have name defined for validation", function(){
			
			var linkerInit = function(){
				element = angular.element('<input angular-autowrap />');
				linker.init(scope, element, attrs, {}, null);
			};
			expect(linkerInit).toThrow();
			
			linkerInit = function(){
				element = angular.element('<input name="myName" angular-autowrap />');
				linker.init(scope, element, attrs, {}, null);
			};
			expect(linkerInit).not.toThrow();
		});
		
		it("must have form controller defined for validation", function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			
			var linkerInit = function(){
				linker.init(scope, element, attrs, null, null);
			};
			expect(linkerInit).toThrow();
			
			linkerInit = function(){
				linker.init(scope, element, attrs, {}, null);
			};
			expect(linkerInit).not.toThrow();
		});
		
		it("must have model controller defined for custom validators to work", function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			scope.validators = {
				key: "value"
			};
			var linkerInit = function(){
				linker.init(scope, element, attrs, {}, null);	
			};
			expect(linkerInit).toThrow();
			
			var modelCtrl = {
				$validators: {}
			};
			linkerInit = function(){
				linker.init(scope, element, attrs, {}, modelCtrl);
			};
			expect(linkerInit).not.toThrow();
		});
		
		it("should add custom validators in model controllers $validators collection", function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			scope.validators = {
				validation: "consider-me-a-custom-validation-function"
			};
			var modelCtrl = {
				$validators: {}
			};

			linker.init(scope, element, attrs, {}, modelCtrl);
			
			expect(modelCtrl.$validators.validation).toBe("consider-me-a-custom-validation-function");			
		});
		
		it("should set watches for $valid, $invalid and $dirty for validation", function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			var formCtrl = {};
			
			linker.init(scope, element, attrs, formCtrl, null);
			
			expect(linkerHelper.setWatch).toHaveBeenCalledWith(scope, formCtrl, "myName", "$dirty", "_dirty");
			expect(linkerHelper.setWatch).toHaveBeenCalledWith(scope, formCtrl, "myName", "$valid", "_valid", jasmine.any(Function));
			expect(linkerHelper.setWatch).toHaveBeenCalledWith(scope, formCtrl, "myName", "$invalid", "_invalid", jasmine.any(Function));
		});
		
		it("should apply state classes to input if config was on", function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			scope.config = {
				applyStatesToInput: true
			};
			spyOn(linkerHelper, "enableAddingStateClassesToInputElement").and.returnValue(void (0));
			
			linker.init(scope, element, attrs, {}, null);
			
			expect(linkerHelper.enableAddingStateClassesToInputElement).toHaveBeenCalledWith(scope, element, jasmine.objectContaining({applyStatesToInput: true}));
		});
		
		it("should not apply state classes to input if config was off", function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			scope.config = {
				applyStatesToInput: false
			};
			spyOn(linkerHelper, "enableAddingStateClassesToInputElement").and.returnValue(void (0));

			linker.init(scope, element, attrs, {}, null);

			expect(linkerHelper.enableAddingStateClassesToInputElement).not.toHaveBeenCalled();
		});
	});
	
	describe("when input element is being updated", function(){
		var formCtrl,
			modelCtrl,
			linkerHelper;
			
		beforeEach(inject(function(autowrapLinkerHelper){
			linkerHelper = autowrapLinkerHelper;
		}))

		beforeEach(function(){
			element = angular.element('<input name="myName" angular-autowrap />');
			scope.validators = {
				validation: "consider-me-a-custom-validation-function"
			};
			
			modelCtrl = {
				$validators: {}
			};
			
			formCtrl = {};
			formCtrl.myName = {
				$valid: false,
				$dirty: false,
				$invalid: false
			};
			
			attrs[validationMsgPrefix + "Required"] = "Required validation message";
			
			linker.init(scope, element, attrs, formCtrl, modelCtrl);
		});
		
		it("should set _message to empty when valid", function(){
			scope._mesage = "something";
			formCtrl.myName.$valid = true;
			scope.$apply();
			
			expect(scope._message).toBe("");
		});
		
		it("should set _message from attrs when invalid", function(){
			spyOn(linkerHelper, "getErrorTypes").and.returnValue(["required"]);
			formCtrl.myName.$invalid = true;
			scope.$apply();
			
			expect(scope._message).toBe("Required validation message");
		});
		
		it("should set _message to default message when validation message is not available in attrs", function(){
			spyOn(linkerHelper, "getErrorTypes").and.returnValue(["missing"]);
			formCtrl.myName.$invalid = true;
			scope.$apply();
			
			expect(scope._message).toBe("Invalid.");
		});
	});
});