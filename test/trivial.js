"use strict";

describe("AngularJs", function(){
  it("should be defined", function(){
	  expect(angular).toBeDefined();
  });
  
  it("should be functional", function(){
	  expect(angular.isUndefined(void (0))).toBe(true);
  });
});