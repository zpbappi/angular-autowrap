"use strict";

describe("autowrap directive", function(){
	var controller,
		linker,
		scope,
		attrs,
		ctrls;
		
	beforeEach(module("angular-autowrap"));
	
	beforeEach(function(){
		controller = {
			init: function(){}
		};
		linker = {
			init: function(){}
		};
		
		spyOn(controller, "init").and.callFake(function($scope){
			scope = $scope;
		});
		
		spyOn(linker, "init").and.callFake(function(s, e, a, c){
			attrs = a;
			ctrls = c;
		});
		
		module(function($provide){
			$provide.value("autowrapController", controller);
			$provide.value("autowrapLinker", linker);
		});
	});
	
	beforeEach(inject(function($compile, $rootScope){
		var scope = $rootScope.$new();
		scope.customValidator = function(modelVal, viewVal){};
		var html = '<input type="text" name="myName" ' +
				   'autowrap ' +
				   'autowrap-config="{amIPresent: true}" ' +
				   'autowrap-theme="amazing" ' +
				   'autowrap-template-for="select" ' +
				   'autowrap-validators="{custom: customValidator}" ' +
				   '/>';
		$compile(html)(scope);
		$rootScope.$digest();
	}));
	
	it("should call controller init", function(){
		expect(controller.init).toHaveBeenCalledWith(jasmine.any(Object));
		expect(controller.init.calls.count()).toBe(1);
	});
	
	it("should call linker init", function(){
		expect(linker.init).toHaveBeenCalled();
		expect(linker.init.calls.count()).toBe(1);
	});
	
	it("should have scope properties defined properly", function(){
		expect(scope.config).toEqual( { amIPresent: true } );
		expect(scope.theme).toBe("amazing");
		expect(scope.templateFor).toBe("select");
		expect(scope.validators).toEqual( {custom: jasmine.any(Function) } );
	});
});