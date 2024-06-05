const { Fido2Lib } = require("../");

function bufferToArrayBuffer(b) {
	return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function base64StringToArrayBuffer(string) {
	const b = Buffer.from(string, "base64");
	return bufferToArrayBuffer(b);
}

(async function() {

	const optionGeneratorFn = (extName, type, value) => {
		console.log("optionGeneratorFn for " + extName + " during " + type);
		return value;
	};
	const resultParserFn = (extName, clientThing, authnrThing) => {
		console.log("resultParserFn for " + extName, clientThing, authnrThing);
	};
	const resultValidatorFn = () => {
		console.log("resultValidatorFn for " + extName, this.clientDataJSON, this.authnrData, this.expectations);
	};
	
	Fido2Lib.addExtension("credProtect", optionGeneratorFn, resultParserFn, resultValidatorFn);

	const challenge = "JpUTPEwIl7o12YAmsNdYKG5AaXnEN5A2ckR3ktmKELw=";

	const origin_url = new URL("https://webauthn.io");

	const attestation_expectations = {
		challenge,
		origin: origin_url.origin,
		/*"first" | "second" | "either" ->
		 * If "first", this requires that the authenticator performed user verification (e.g. - biometric authentication, PIN authentication, etc.).
		 * If "second", this requires that the authenticator performed user presence (e.g. - user pressed a button).
		 * If "either", then either "first" or "second" is acceptable
		 * */
		factor: "first",
		rpId: origin_url.origin.split("://")[1].split(":")[0],
	};

	const f2l = new Fido2Lib({
		timeout: 60000,
		rpId: origin_url.origin
			.split("://")[1]
			.split(":")[0],
		rpName: origin_url.origin
			.split("://")[1]
			.split(":")[0],
		challengeSize: 64,
		attestation: "none",
		cryptoParams: [
			-7 - 35 - 36, -257, -258, -259, -37, -38, -39, -8,

		],
		authenticatorAttachment: "cross-platform",
		authenticatorRequireResidentKey: true,
		authenticatorUserVerification: "required",
	});
	f2l.enableExtension("credProtect");


	const attestation_options = await f2l.attestationOptions({ extensionOptions: { credProtect: 2 } });

	console.log(attestation_options);

	const reg_result = await f2l.attestationResult(
		{
			"id": base64StringToArrayBuffer("YQJdbny5y64Wx1ERfFCcLw"),
			"rawId": base64StringToArrayBuffer("YQJdbny5y64Wx1ERfFCcLw"),
			"type": "public-key",
			"response": {
				"attestationObject": base64StringToArrayBuffer("o2NmbXRmcGFja2VkZ2F0dFN0bXSjY2FsZyZjc2lnWEcwRQIgGjJDvBvQCo7ihLOPCvmWX4Ct0FtyEagnh0wPh66GNNACIQCk0ITUIxYLMHaJapA6d6ZHSBO3Zu1LcLX3ArMf7cLwnWN4NWOBWQLBMIICvTCCAaWgAwIBAgIECwXNUzANBgkqhkiG9w0BAQsFADAuMSwwKgYDVQQDEyNZdWJpY28gVTJGIFJvb3QgQ0EgU2VyaWFsIDQ1NzIwMDYzMTAgFw0xNDA4MDEwMDAwMDBaGA8yMDUwMDkwNDAwMDAwMFowbjELMAkGA1UEBhMCU0UxEjAQBgNVBAoMCVl1YmljbyBBQjEiMCAGA1UECwwZQXV0aGVudGljYXRvciBBdHRlc3RhdGlvbjEnMCUGA1UEAwweWXViaWNvIFUyRiBFRSBTZXJpYWwgMTg0OTI5NjE5MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEIRpvsbWJJcsKwRhffCrjqLSIEBR5sR7_9VXgfZdRvSsXaiUt7lns44WZIFuz6ii_j9f8fadcBUJyrkhY5ZH8WqNsMGowIgYJKwYBBAGCxAoCBBUxLjMuNi4xLjQuMS40MTQ4Mi4xLjEwEwYLKwYBBAGC5RwCAQEEBAMCBDAwIQYLKwYBBAGC5RwBAQQEEgQQFJogIY72QTOWuIH41bfx9TAMBgNVHRMBAf8EAjAAMA0GCSqGSIb3DQEBCwUAA4IBAQA-_qPfPSrgclePfgTQ3VpLaNsBr-hjLhi04LhzQxiRGWwYS-vB1TOiPXeLsQQIwbmqQU51doVbCTaXGLNIr1zvbLAwhnLWH7i9m4ahCqaCzowtTvCQ7VBUGP5T1M4eYnoo83IDCVjQj_pZG8QYgOGOigztGoWAf5CWcUF6C0UyFbONwUcqJEl2QLToa_7E8VRjm4W46IAUljYkODVZASv8h3wLROx9p5TSBlSymtwdulxQe_DKbfNSvM3edA0up-EIJKLOOU-QTR2ZQV46fEW1_ih6m8vcaY6L3NW0eYpc7TXeijUJAgoUtya_vzmnRAecuY9bncoJt8PrvL2ir2kDaGF1dGhEYXRhWKJ0puqSE8mcL3SyJJKzIM9AJiqUwalQoDl_KSULYIQe8MUAAAAEFJogIY72QTOWuIH41bfx9QAQYQJdbny5y64Wx1ERfFCcL6UBAgMmIAEhWCChzaob9LC78B0I7WVtwsUxI85BBsbmOniBrLISyrC1OyJYIKl1KdCgnf1Z8oaHVBU0l-YbXoDyuHW2C_9EgtmFaTmVoWtjcmVkUHJvdGVjdAI"),
				"clientDataJSON": base64StringToArrayBuffer("eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiSnBVVFBFd0lsN28xMllBbXNOZFlLRzVBYVhuRU41QTJja1Iza3RtS0VMdyIsIm9yaWdpbiI6Imh0dHBzOi8vd2ViYXV0aG4uaW8iLCJjcm9zc09yaWdpbiI6ZmFsc2V9"),
			},
		},
		attestation_expectations,
	);
})();