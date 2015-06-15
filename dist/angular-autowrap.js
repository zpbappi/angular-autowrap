(function(){
	"use strict";
	
	// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Polyfill
	if (!Array.prototype.map) {
	  Array.prototype.map = function(callback, thisArg) {

		var T, A, k;

		if (this == null) {
		  throw new TypeError(" this is null or not defined");
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if (typeof callback !== "function") {
		  throw new TypeError(callback + " is not a function");
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (thisArg) {
		  T = thisArg;
		}

		// 6. Let A be a new array created as if by the expression new Array(len) where Array is
		// the standard built-in constructor with that name and len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while(k < len) {

		  var kValue, mappedValue;

		  // a. Let Pk be ToString(k).
		  //   This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
		  //   This step can be combined with c
		  // c. If kPresent is true, then
		  if (k in O) {

			// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
			kValue = O[ k ];

			// ii. Let mappedValue be the result of calling the Call internal method of callback
			// with T as the this value and argument list containing kValue, k, and O.
			mappedValue = callback.call(T, kValue, k, O);

			// iii. Call the DefineOwnProperty internal method of A with arguments
			// Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
			// and false.

			// In browsers that support Object.defineProperty, use the following:
			// Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

			// For best browser support, use the following:
			A[ k ] = mappedValue;
		  }
		  // d. Increase k by 1.
		  k++;
		}

		// 9. return A
		return A;
	  };      
	}
})();

(function(ng){
	"use strict";
	ng.module("angular-autowrap-internal", []);
	ng.module("angular-autowrap", ["angular-autowrap-internal"]);
	
})(angular);

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap")
	.directive("autowrap", [
		"autowrapController",
		"autowrapLinker",
		function(autowrapController, autowrapLinker){
			
			return {
				restrict: "A",
				require: "^form",
				scope: {
					config: "=autowrapConfig",
					theme: "@autowrapTheme",
					templateFor: "@autowrapTemplateFor"
				},
				
				controller: function($scope, $element, $attrs, $transclude){
					autowrapController.init($scope);
				},
				
				link: function(scope, element, attrs, ctrl, transclude){
					autowrapLinker.init(scope, element, attrs, ctrl, transclude);
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
	.module("angular-autowrap-internal")
	.factory("autowrapController", [
		"autowrapConfig",
		function(providedConfig){
			
			return {
				init: function($scope){
					var config = {};
					ng.extend(config, providedConfig, $scope.config);
					
					$scope._dirty = false;
					$scope._valid = false;
					$scope._invalid = false;
					$scope._message = "";
					$scope.custom = {};
					
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
				}
			};
		}
	]);
	
})(angular);

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap-internal")
	.factory("autowrapCustomPropertyHelper", [
		"autowrapUtility",
		function(utility){
			
			var customObjectPropertyPrefix = "autowrapCustom";
			
			return {
				isCustomProperty: function(attrName){
					if(!attrName){
						return false;
					}
					
					return 	attrName.indexOf(customObjectPropertyPrefix) === 0 &&
							attrName.length > customObjectPropertyPrefix.length &&
							utility.isUpperCase(attrName.substr(customObjectPropertyPrefix.length, 1)); 
				},
				
				getCustomPropertyName: function(attributeName){
					var prefixLen = customObjectPropertyPrefix.length;
					return ng.lowercase(attributeName[prefixLen]) + attributeName.substr(prefixLen+1);
				},
			};
		}
	]);
	
})(angular);

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap-internal")
	.factory("autowrapLinkerHelper", [
		"autowrapUtility",
		function(utility) {
			
			return {
				getErrorTypes: function(field){
					var props = [];
					ng.forEach(field.$error, function(value, key){
						if(value === true){
							props[props.length] = key;
						}
					});
					
					return props;
				},
				
				setWatch: function(scope, controller, elementName, propertyToWatch, scopeProperty, additionalCallback, callbackContext){
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
				},
				
				enableAddingStateClassesToInputElement: function(scope, element, config){
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
			};
		}
	]);
	
})(angular);

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap-internal")
	.factory("autowrapLinker", [
		"$compile",
		"autowrapConfig",
		"autowrapLinkerHelper",
		"autowrapCustomPropertyHelper",
		"autowrapTemplateProvider",
		"autowrapUtility",
		function($compile, providedConfig, linkerHelper, customPropertyHelper, templateProvider, utility){
			
			var validationMessagePropertyPrefix = "autowrapMsg";
			
			return {
				init: function(scope, element, attrs, ctrl, transclude){
					// set custom object properties
					var injectedCustomProperties = {};
					ng.forEach(attrs, function(val, key){
						if(customPropertyHelper.isCustomProperty(key)){
							injectedCustomProperties[customPropertyHelper.getCustomPropertyName(key)] = val;
						}
					});
					ng.extend(scope.custom, injectedCustomProperties);

					// transcluding(!)...
					var config = ng.extend({}, providedConfig, scope.config);
					var template = templateProvider.get(scope.templateFor || element[0].tagName, scope.theme);
					var compiledTemplate = ng.element($compile(template)(scope));
					element.after(compiledTemplate);
					var inputPlaceHolder = compiledTemplate.find("placeholder"); 
					inputPlaceHolder.after(element);
					inputPlaceHolder.remove();	
					
					// set watches
					var elementName = element[0].name;
					
					linkerHelper.setWatch(scope, ctrl, elementName, "$dirty", "_dirty");
					
					linkerHelper.setWatch(scope, ctrl, elementName, "$valid", "_valid", function(valid){
						if(valid){
							scope._message = "";
						}
					});
					
					linkerHelper.setWatch(scope, ctrl, elementName, "$invalid", "_invalid", function(invalid) {
						if(invalid) {
							var errorTypes = 
								linkerHelper.getErrorTypes(ctrl[elementName])
								.map(function(a){ 
									return utility.getCamelCasedAttributeName(a, validationMessagePropertyPrefix); 
								});
								
							var availableErrorMessages = 
								utility.filter(errorTypes, function(attributeName){
									return ng.isDefined(attrs[attributeName]);
								})
								.map(function(attributeName){
									return attrs[attributeName];
								});
							
							scope._message = availableErrorMessages.length ? availableErrorMessages[0] : "Invalid.";
						}
					});
					
					if(config.applyStatesToInput === true){
						linkerHelper.enableAddingStateClassesToInputElement(scope, element, config);
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

(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap-internal")
	.factory("autowrapUtility", [
		"$filter",
		function($filter){
			return {
				
				filter: function(array, expression, comparator){
					return $filter("filter")(array, expression, comparator);
				},
				
				getCamelCasedAttributeName : function(dashedAttributeName, prefix){
					var prop = dashedAttributeName.split('-').map(function(x){
						return ng.uppercase(x.substring(0,1)) + x.substring(1);
					}).join('');
					return prefix + prop;
				},
				
				isUpperCase: function(str){
					return ng.uppercase(str) === str;
				}
			};
		}
	]);
	
})(angular);

//# sourceMappingURL=angular-autowrap.js.map