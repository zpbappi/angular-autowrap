"use strict";

describe("template provider", function(){
	var templatePathBase,
		defaultTemplateName,
		config,
		$templateCache,
		templateProvider;
		
	beforeEach(module("angular-autowrap"));
	
	beforeEach(inject(function(_$templateCache_, autowrapTemplateProvider, autowrapConfig, _templatePathBase_, _defaultTemplateName_){
		templatePathBase = _templatePathBase_;
		defaultTemplateName = _defaultTemplateName_;
		config = autowrapConfig;
		$templateCache = _$templateCache_;
		templateProvider = autowrapTemplateProvider;
		
		spyOn($templateCache, "put").and.callThrough();
	}));
	
	describe("trivial cases", function(){
		it("should not be able to put any falsy template", function(){
			templateProvider.put(null);
			templateProvider.put(false, "input");
			templateProvider.put("", "input", "theme");
			expect($templateCache.put).not.toHaveBeenCalled();
		});
		
		it("should have default template in template cache", function(){
			var template = templateProvider.get();
			expect($templateCache.get(templatePathBase + defaultTemplateName + ".html")).toBe(template);
		});
		
		it("should return default template even if the template is not found in templateCache", function(){
			var defaultTemplate = $templateCache.get(templatePathBase + defaultTemplateName + ".html");
			$templateCache.put(templatePathBase + defaultTemplateName + ".html", null);
			expect($templateCache.get(templatePathBase + defaultTemplateName + ".html")).toBe(null);
			expect(templateProvider.get()).toBe(defaultTemplate);
		});
	});
	
	describe("when putting templates", function(){
		it("should store default template path without any element or theme", function(){
			templateProvider.put("<default>");
			expect($templateCache.get(templatePathBase + defaultTemplateName + ".html")).toBe("<default>");
		});
		
		it("should store template for element in default theme", function(){
			templateProvider.put("<input>", "input");
			expect($templateCache.get(templatePathBase + "input.html")).toBe("<input>");
		});
		
		it("should store template for element of a specific theme", function(){
			templateProvider.put("<themed-input>", "input", "mytheme");
			expect($templateCache.get(templatePathBase + "mytheme/input.html")).toBe("<themed-input>");
		});
		
		it("should be able to store separate themes for same element", function(){
			templateProvider.put("<default>");
			templateProvider.put("<input>", "input");
			templateProvider.put("<themed-input>", "input", "mytheme");
			templateProvider.put("<bootstrap-input>", "input", "bootstrap");
			expect($templateCache.get(templatePathBase + defaultTemplateName + ".html")).toBe("<default>");
			expect($templateCache.get(templatePathBase + "input.html")).toBe("<input>");
			expect($templateCache.get(templatePathBase + "mytheme/input.html")).toBe("<themed-input>");
			expect($templateCache.get(templatePathBase + "bootstrap/input.html")).toBe("<bootstrap-input>");
		});	
		
		it("should be able to store separate themes(case insensitive) for same element(case insensitive)", function(){
			templateProvider.put("<default>");
			templateProvider.put("<input>", "iNpuT");
			templateProvider.put("<themed-input>", "INPUT", "mythEme");
			templateProvider.put("<bootstrap-input>", "input", "BootStrap");
			expect($templateCache.get(templatePathBase + defaultTemplateName + ".html")).toBe("<default>");
			expect($templateCache.get(templatePathBase + "input.html")).toBe("<input>");
			expect($templateCache.get(templatePathBase + "mytheme/input.html")).toBe("<themed-input>");
			expect($templateCache.get(templatePathBase + "bootstrap/input.html")).toBe("<bootstrap-input>");
		});		
	});
	
	describe("when getting template", function(){
		beforeEach(function(){
			$templateCache.put(templatePathBase + defaultTemplateName + ".html", "<default>");
			$templateCache.put(templatePathBase + "input.html", "<input>");
			$templateCache.put(templatePathBase + "mytheme/input.html", "<themed-input>");
			$templateCache.put(templatePathBase + "mytheme/" + defaultTemplateName + ".html", "<themed-default>");
		});
		
		it("should be able to get default template", function(){
			expect(templateProvider.get()).toBe("<default>");
		});
		
		it("should be able to get default element template", function(){
			expect(templateProvider.get("input")).toBe("<input>");
		});
		
		it("should be able to get element template for a specific theme", function(){
			expect(templateProvider.get("input", "mytheme")).toBe("<themed-input>");
		});
		
		it("should get template for an element from default theme when theme is not present", function(){
			expect(templateProvider.get("input", "non-existing-theme")).toBe("<input>");
		});
		
		it("should get default template for the given theme when element template is missing for the theme", function(){
			expect(templateProvider.get("select", "mytheme")).toBe("<themed-default>");
		});
		
		it("should get default template from default theme when both theme and element template are missing", function(){
			expect(templateProvider.get("select", "non-existing-theme")).toBe("<default>");
		});
	});
});