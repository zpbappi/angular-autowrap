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
				require: ["?^form", "?ngModel"],
				scope: {
					config: "=autowrapConfig",
					theme: "@autowrapTheme",
					templateFor: "@autowrapTemplateFor",
					validators: "=autowrapValidators"
				},

				controller: [
					"$scope",
					function($scope){
						autowrapController.init($scope);
					}
				],

				link: function(scope, element, attrs, ctrls){
					autowrapLinker.init(scope, element, attrs, ctrls[0], ctrls[1]);
				}
			};
		}
	]);

})(angular);
