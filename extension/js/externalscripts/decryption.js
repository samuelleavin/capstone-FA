//////////////////////////	DECRYPTION	///////////////////////////////////
var decryptedMain = function () {
	gmail2 = new Gmail();

	console.log('Hello from decryptedMain,', gmail2.get.user_email());
	
	var regEx = /%%%%(.+)%%%%/gmi,
		sentinel = '%%%%',
		sentinelLength = sentinel.length,
		selectedCircleKey,
		selectedCircleId,
		selectedCircleName,
		userDecryptionCircles,
		matches = [],
		userLoggedIn,
		unhacked;

	// document.addEventListener('set-encryption-circle', function(e) {
	// 	selectedCircleKey = e.detail.key;
	// 	selectedCircleId = e.detail._id;
	// 	selectedCircleName = e.detail.name;
	// });
	document.addEventListener('process-logout', function (e) {
		userLoggedIn = false;
		// gmail2.observe.off();
	});

	document.addEventListener('process-login', function (e) {
		userLoggedIn = true;
		userDecryptionCircles = e.detail;
	});

	gmail2.observe.on("view_thread", function (thread) {});

	gmail2.observe.on("view_email", function (email) {

		var email, body, encryptedMsg, extractedId, matchedKey;
		
		if (userLoggedIn) {

			email = new gmail2.dom.email(email.id)
			body = email.body();

			//ELIMINATING POSSIBLE TAGS INSERTED BY CHROME
			tagsRegEx = /<{1}.+?>{1}/g
			body = body.replace(tagsRegEx, "");


			if(body.indexOf(sentinel) > -1) {

				encryptedMsg = body.match(regEx)[0].slice(sentinelLength, -sentinelLength);
				extractedId = encryptedMsg.slice(-24);
				encryptedMsg = encryptedMsg.slice(0, -24);

				// matchedKey = _.result(_.find(userDecryptionCircles, '_id', extractedId), 'key');
				try {
					matches = userDecryptionCircles.filter(function (circle) {
						return circle._id == extractedId;
					})
				}

				catch (err) {
					console.log('error; no user logged in.', err)
				}
				
				if (matches.length) {
					unhacked = decrypt(encryptedMsg, matches[0].key);
					email.body(unhacked + '<h5>' + matches[0].name +' | Decrypted by CryptoVeil</h5>');
				} else {
					email.body("<h3>Oops! You're not authorized to view this message. Error #009 StreamOverload Flux</h3><h5>Encrypted by CryptoVeil</h5>")
				}
			} 
			
		}

	
	});
};

function decrypt(text, key) {

	var decrypted, temp;
    
    decrypted = CryptoJS.AES.decrypt(text, key);
    temp = decrypted.toString(CryptoJS.enc.Utf8);

    return temp;
}
