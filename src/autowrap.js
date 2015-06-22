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

				controller: [
					"$scope",
					function($scope){
						autowrapController.init($scope);
					}
				],

				link: function(scope, element, attrs, ctrl){
					autowrapLinker.init(scope, element, attrs, ctrl);
				}
			};
		}
	]);

})(angular);
