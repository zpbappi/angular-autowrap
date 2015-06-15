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
		"validationMessagePropertyPrefix",
		function($compile, providedConfig, linkerHelper, customPropertyHelper, templateProvider, utility, validationMessagePropertyPrefix){
			
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
					if(ng.isDefined(attrs.autowrapNoTrack)){
						config.noTrack = true;
					}
					var template = templateProvider.get(scope.templateFor || element[0].tagName, scope.theme);
					var compiledTemplate = ng.element($compile(template)(scope));
					element.after(compiledTemplate);
					var inputPlaceHolder = compiledTemplate.find("placeholder"); 
					inputPlaceHolder.after(element);
					inputPlaceHolder.remove();	
					
					if(config.noTrack === true){
						return;
					}
					
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
