(function(ng){
	"use strict";

	ng
	.module("angular-autowrap-internal")
	.factory("autowrapController", [
		function(){

			return {
				init: function($scope){

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
