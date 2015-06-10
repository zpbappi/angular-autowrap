(function(ng){
	"use strict";
	
	ng.module("angular-autowrap", []);
	
})(angular);

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

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap")
	.value('autowrapConfig', {
		auto: {
			wrapperClass: "auto-wrapper",
			messageClass: "auto-wrapper-message",
			applyStatesToWrapper: true
		},
		dirtyStateClass: "dirty",
		validStateClass: "valid",
		invalidStateClass: "invalid",
		applyStatesToInput: false
	});
	
})(angular);

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap")
	.factory('autowrapTemplateProvider', ['$templateCache', "autowrapConfig", function($templateCache, config){
		var	templatePathBase = "autowrap-templates/",
			defaultField = "default";
			
		var isValidIdentifier = function(identifier){
			return (ng.isDefined(identifier) && typeof(identifier)==="string" && identifier.length);
		};
		
		var hasTemplate = function(key){
			var tpl = $templateCache.get(key);
			return isValidIdentifier(tpl);
		};
			
		var constructTemplateKey = function(fieldType, theme){
			var path = templatePathBase;
			if(isValidIdentifier(theme)){
				path += theme.toLowerCase() + "/";
			}
			
			if(isValidIdentifier(fieldType)){
				path += fieldType.toLowerCase();
			}
			else{
				path += defaultField;
			}
			
			return path + ".html";
		};
			
		var defaultTemplateKey = constructTemplateKey(void(0), void(0));
		var stateClasses = "data-ng-class=\"{'" + config.dirtyStateClass + "': isDirty(), '" + config.validStateClass + "': isValid(), '" + config.invalidStateClass + "': isInvalid()}\"";
		var defaultTemplate = 
			'<div class="' + config.auto.wrapperClass + '" ' + (config.auto.applyStatesToWrapper ? stateClasses : "") + '>' + 
				'<placeholder />' + 
				'<span class="' + config.auto.messageClass + '">{{validationMessage()}}</span>' + 
			'</div>';
			
		$templateCache.put(defaultTemplateKey, defaultTemplate);
		
		return{
			get: function(fieldType, theme){
				var field = isValidIdentifier(fieldType) ? fieldType : void(0);
				var themeName = isValidIdentifier(theme) ? theme : void(0);
				
				var keys = [
					constructTemplateKey(field, themeName), // check for field template of the theme
					constructTemplateKey(void(0), themeName), // check for default template of the theme
					constructTemplateKey(field, void(0)), // check for field template of the default theme
					constructTemplateKey(void(0), void(0)) // check for default template of default theme
				];
				
				for(var i=0; i<keys.length; i++){
					if(hasTemplate(keys[i])){
						return $templateCache.get(keys[i]);
					}
				}
				
				return null;
			},
						
			put: function(template, fieldType, theme){
				if(!template){
					return;
				}
				
				var key = constructTemplateKey(fieldType, theme);
				$templateCache.put(key, template);
			}
		};
	}]);
	
})(angular);

//# sourceMappingURL=angular-autowrap.js.map