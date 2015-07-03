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
					if(!dashedAttributeName){
						return dashedAttributeName;
					}

					var prop = dashedAttributeName.split("-").map(function(x){
						return ng.uppercase(x.substring(0, 1)) + x.substring(1);
					}).join("");

					if(prefix){
						return prefix + prop;
					}

					return ng.lowercase(prop[0]) + prop.substring(1);
				},

				isUpperCase: function(str){
					if(!str){
						return false;
					}

					return ng.uppercase(str) === str;
				},

				hasAnyProperty: function(obj){
					if(!obj){
						return false;
					}

					for(var prop in obj){
						if(obj.hasOwnProperty(prop)){
							return true;
						}
					}

					return false;
				}
			};
		}
	]);

})(angular);
