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
