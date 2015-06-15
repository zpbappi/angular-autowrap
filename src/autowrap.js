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
