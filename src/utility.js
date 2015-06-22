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

				getCamelCasedAttributeName: function(dashedAttributeName, prefix){
					var prop = dashedAttributeName.split("-").map(function(x){
						return ng.uppercase(x.substring(0, 1)) + x.substring(1);
					}).join("");
					return prefix + prop;
				},

				isUpperCase: function(str){
					return ng.uppercase(str) === str;
				}
			};
		}
	]);

})(angular);
