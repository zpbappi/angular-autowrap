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
				init: function(scope, element, attrs, formCtrl, modelCtrl){
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

					// defense
					if(formCtrl === null){
						throw "The element, applied 'autowrap' directive, must be placed inside form (or, ngForm) to work for validation messages." +
                              "\nIf this is not a form element that needs tracking of validation status, just add 'autowrap-no-track' property to the element.";
					}

					if(typeof scope.validators === "object" && utility.hasAnyProperty(scope.validators)){
						if(modelCtrl === null){
							throw "To use custom validators with 'autowrap', the element must have ngModel directive applied to it.";
						}
						else{
							ng.forEach(scope.validators, function(validationFunction, validationName){
								modelCtrl.$validators[validationName] = validationFunction;
							});
						}
					}

					// set watches
					var elementName = element[0].name;

					linkerHelper.setWatch(scope, formCtrl, elementName, "$dirty", "_dirty");

					linkerHelper.setWatch(scope, formCtrl, elementName, "$valid", "_valid", function(valid){
						if(valid){
							scope._message = "";
						}
					});

					linkerHelper.setWatch(scope, formCtrl, elementName, "$invalid", "_invalid", function(invalid) {
						if(invalid) {
							var errorTypes =
								linkerHelper.getErrorTypes(formCtrl[elementName])
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
