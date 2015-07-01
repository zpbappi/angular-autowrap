(function(ng){
	"use strict";

	ng
	.module("angular-autowrap-internal")
	.factory("autowrapLinkerHelper", [
		function() {

			return {
				getErrorTypes: function(field){
					if(!field){
						return [];
					}

					var props = [];
					ng.forEach(field.$error, function(value, key){
						if(value){
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
