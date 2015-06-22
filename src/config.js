(function(ng){
	"use strict";

	ng
	.module("angular-autowrap")
	.value("autowrapConfig", {
		auto: {
			wrapperClass: "auto-wrapper",
			messageClass: "auto-wrapper-message",
			applyStatesToWrapper: true
		},
		dirtyStateClass: "dirty",
		validStateClass: "valid",
		invalidStateClass: "invalid",
		applyStatesToInput: false,
		noTrack: false
	});

})(angular);
