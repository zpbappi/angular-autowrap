(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap-internal")
	.constant("customObjectPropertyPrefix", "autowrapCustom")
	.constant("validationMessagePropertyPrefix", "autowrapMsg")
	.constant("templatePathBase", "autowrap-templates/")
	.constant("defaultTemplateName", "default")
	;
	
})(angular);
