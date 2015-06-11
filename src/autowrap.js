(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap")
	.directive("autowrap", [
		"$compile",
		"$filter",
		"autowrapTemplateProvider",
		"autowrapConfig",
		function($compile, $filter, autowrapTemplateProvider, providedConfig){
			
			var filter = $filter("filter");
			
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
					$scope._message = "";
					
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
						return $scope._message;
					};
				},
				
				link: function(scope, element, attrs, ctrl, transclude){
					
					var getErrorTypes = function(field){
						var props = [];
						ng.forEach(field.$error, function(value, key){
							if(value === true){
								props[props.length] = key;
							}
						});
						
						return props;
					};
					
					var getCamelCasedAttributeNameFromDashed = function(dashedAttributeName){
						var prop = dashedAttributeName.split('-').map(function(x){
							return ng.uppercase(x.substring(0,1)) + x.substring(1);
						}).join('');
						
						return "autowrapMsg" + prop;
					};
					
					var config = ng.extend({}, providedConfig, scope.config);
					var template = autowrapTemplateProvider.get(scope.templateFor || element[0].tagName, scope.theme);
					var compiledTemplate = ng.element($compile(template)(scope));
					element.after(compiledTemplate);
					var inputPlaceHolder = compiledTemplate.find("placeholder"); 
					inputPlaceHolder.after(element);
					inputPlaceHolder.remove();	
					
					// set watches
					var setWatch = function(controller, elementName, propertyToWatch, scopeProperty, additionalCallback, callbackContext){
						scope[scopeProperty] = controller[elementName][propertyToWatch];
						scope.$watch(
							function(){
								return controller[elementName][propertyToWatch];
							}, 
							function(newVal, oldVal){
								scope[scopeProperty] = newVal;
								if(typeof additionalCallback === "function"){
									additionalCallback.apply(callbackContext || null, [newVal, oldVal]);
								}
							}
						);
					};
					
					var elementName = element[0].name;
					setWatch(ctrl, elementName, "$dirty", "_dirty");
					setWatch(ctrl, elementName, "$valid", "_valid", function(valid){
						if(valid){
							scope._message = "";
						}
					});
					setWatch(ctrl, elementName, "$invalid", "_invalid", function(invalid){
						if(invalid){
							var errorMessages = filter(
								getErrorTypes(ctrl[elementName])
								.map(getCamelCasedAttributeNameFromDashed), 
								function(attributeName){
									return ng.isDefined(attrs[attributeName]);
								}
							)
							.map(function(attributeName){
								return attrs[attributeName];
							});
							
							scope._message = errorMessages.length ? errorMessages[0] : "Invalid.";
						}
					});
					
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
