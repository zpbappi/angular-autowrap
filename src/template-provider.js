(function(ng){
	"use strict";
	
	ng
	.module("angular-autowrap")
	.factory('autowrapTemplateProvider', [
		'$templateCache', 
		"autowrapConfig", 
		"templatePathBase",
		"defaultTemplateName",
		function($templateCache, config, templatePathBase, defaultTemplateName){
				
			var isValidIdentifier = function(identifier){
				return (ng.isDefined(identifier) && typeof(identifier)==="string" && identifier.length);
			};
			
			var hasTemplate = function(key){
				var tpl = $templateCache.get(key);
				return isValidIdentifier(tpl);
			};
				
			var constructTemplateKey = function(fieldType, theme){
				var path = templatePathBase;
				if(isValidIdentifier(theme)){
					path += theme.toLowerCase() + "/";
				}
				
				if(isValidIdentifier(fieldType)){
					path += fieldType.toLowerCase();
				}
				else{
					path += defaultTemplateName;
				}
				
				return path + ".html";
			};
				
			var defaultTemplateKey = constructTemplateKey(void(0), void(0));
			var stateClasses = "data-ng-class=\"{'" + config.dirtyStateClass + "': isDirty(), '" + config.validStateClass + "': isValid(), '" + config.invalidStateClass + "': isInvalid()}\"";
			var defaultTemplate = 
				'<div class="' + config.auto.wrapperClass + '" ' + (config.auto.applyStatesToWrapper ? stateClasses : "") + '>' + 
					'<placeholder />' + 
					'<span class="' + config.auto.messageClass + '">{{validationMessage()}}</span>' + 
				'</div>';
				
			$templateCache.put(defaultTemplateKey, defaultTemplate);
			
			return{
				get: function(fieldType, theme){
					var field = isValidIdentifier(fieldType) ? fieldType : void(0);
					var themeName = isValidIdentifier(theme) ? theme : void(0);
					
					var keys = [
						constructTemplateKey(field, themeName), // check for field template of the theme
						constructTemplateKey(void(0), themeName), // check for default template of the theme
						constructTemplateKey(field, void(0)), // check for field template of the default theme
						constructTemplateKey(void(0), void(0)) // check for default template of default theme
					];
					
					for(var i=0; i<keys.length; i++){
						if(hasTemplate(keys[i])){
							return $templateCache.get(keys[i]);
						}
					}
					
					return null;
				},
							
				put: function(template, fieldType, theme){
					if(!template){
						return;
					}
					
					var key = constructTemplateKey(fieldType, theme);
					$templateCache.put(key, template);
				}
			};
	}]);
	
})(angular);
