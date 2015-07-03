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
	});
});