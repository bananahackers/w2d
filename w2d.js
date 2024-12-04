/* document.addEventListener("click", (e) => { 
	var id = e.target.id; 
	if (id) openMenu(id); 
}, true); */

/** Invoke configure mozActivity/webActivity and redirect user to a Settings page
 * 
 * @author Tom Barrasso <tom@barrasso.me>
 * @author Luxferre
 * @author the Gaia Team at Mozilla
 * @author KaiOS Technologies
 * @param section: section ID for the page in the Settings app
 * @implements mozActivity (KaiOS 2.5)
 * @implements webActivity (KaiOS 3 and later)
 * @see https://gitlab.com/project-pris/system/-/blob/master/src/system/b2g/webapps/settings.gaiamobile.org/src/index.html?ref_type=heads
 * @see https://gitlab.com/project-pris/system/-/tree/master/src/system/b2g/webapps/settings.gaiamobile.org/src/elements?ref_type=heads
 */
function openMenu(section) {
	// KaiOS 2.5
	if (window.MozActivity) {
		var act = new MozActivity({
			name: "configure",
			data: {
				target: "device",
				section: section,
			},
		});
		act.onerror = function (e) {
			console.error(act, e);
			window.alert("Error:", JSON.stringify(act), e);
		};
	}
	// KaiOS 3 and later
	else if (window.WebActivity) {
		var act = new WebActivity("configure", {
			target: "device",
			section: section,
		});
		act.start().catch(function (e) {
			console.error(e, act);
			window.alert("Error: " + e);
		});
	}
	// Not a KaiOS device?
	else {
		window.alert('It appears your device doesn\'t support the mozActivity or webActivity API. Please open this page on a KaiOS device for this function to work.');
	}
};

/** Configure adbd port to 5555 for wireless ADB connection
 * 
 * @requires navigator.engmodeExtension
 * @requires navigator.jrdExtension
 * @requires navigator.kaiosExtension
 */
function wadb() {
	var masterExt = navigator.engmodeExtension || navigator.jrdExtension || navigator.kaiosExtension;
	if (!masterExt) {
		window.alert('No supported extension found for configuring adbd.');
		return;
	}
	var propSet = {
		'service.adb.tcp.port': 5555,
		'ctl.stop': 'adbd',
		'ctl.start': 'adbd'
	};
	try {
		for (var key in propSet) {
			masterExt.setPropertyValue(key, propSet[key]);
		}
		window.alert('ADB port has been set to 5555.');
	} catch (e) {
		console.error('Error setting adbd properties:', e);
		window.alert('Failed to set adbd properties. Please try again.');
	}
}