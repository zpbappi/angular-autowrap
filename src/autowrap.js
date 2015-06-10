(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap")
	.directive("autowrap", [
		"$compile",
		"autowrapTemplateProvider",
		"autowrapConfig",
		function($compile, autowrapTemplateProvider, providedConfig){
			return {
				restrict: "A",
				require: "^form",
				scope: {
					config: "=autowrapConfig",
					theme: "@autowrapTheme",
					templateFor: "@autowrapTemplateFor"
				},
				
				controller: function($scope, $element, $attrs, $transclude){
					var config = {};
					ng.extend(config, providedConfig, $scope.config);
					
					$scope._dirty = false;
					$scope._valid = false;
					$scope._invalid = false;
					
					$scope.isDirty = function(){
						return $scope._dirty;
					};
					
					$scope.isValid = function(){
						return $scope._valid;
					};
					
					$scope.isInvalid = function(){
						return $scope._invalid;
					};
					
					$scope.validationMessage = function(){
						return "[TODO] Invalid.";
					};
				},
				
				link: function(scope, element, attrs, ctrl, transclude){
					var config = ng.extend({}, providedConfig, scope.config);
					var template = autowrapTemplateProvider.get(scope.templateFor || element[0].tagName, scope.theme);
					var compiledTemplate = ng.element($compile(template)(scope));
					element.after(compiledTemplate);
					var inputPlaceHolder = compiledTemplate.find("placeholder"); 
					inputPlaceHolder.after(element);
					inputPlaceHolder.remove();	
					
					// set watches
					var setWatch = function(controller, elementName, propertyToWatch, scopeProperty){
						scope[scopeProperty] = controller[elementName][propertyToWatch];
						scope.$watch(
							function(){
								return controller[elementName][propertyToWatch];
							}, 
							function(newVal, oldVal){
								scope[scopeProperty] = newVal;
							}
						);
					};
					
					var elementName = element[0].name;
					setWatch(ctrl, elementName, "$dirty", "_dirty");
					setWatch(ctrl, elementName, "$valid", "_valid");
					setWatch(ctrl, elementName, "$invalid", "_invalid");
					
					if(config.applyStatesToInput === true){
						scope.$watch(function(){
							if(scope.isDirty()){
								element.addClass(config.dirtyStateClass);
							}
							else{
								element.removeClass(config.dirtyStateClass);
							}
							
							if(scope.isValid()){
								element.addClass(config.validStateClass);
							}
							else{
								element.removeClass(config.validStateClass);
							}
							
							if(scope.isInvalid()){
								element.addClass(config.invalidStateClass);
							}
							else{
								element.removeClass(config.invalidStateClass);
							}
							
							return true;
						});
					}
				}
			};
		}
	]);
	
})(angular);
