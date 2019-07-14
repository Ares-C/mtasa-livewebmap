/*
----------------------------------------->>
-- IGC: International Gaming Community
-- Date: 06 Feb 2017
-- Project: Online Live Map
-- Type: Client Side
-- Author: tcaram
----------------------------------------->>
*/

var count = 1;

function init () {
	blips = [];
	hasbeenupdated = [];
	
	turfs = [];
	
	mapX = 700; mapY = 700;
	scale = 700/6000;
	
	updateData();
	flashingEffect();
}


function updateData() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			returnServerData(this.responseText);
		}
	};
	
	xhttp.open("GET", "webmap.php?count="+count, true);
	xhttp.send();
  
	returnServerData = function(data) {
		hasbeenupdated = [];
		count = count + 1
		var playersData = JSON.parse(data).players;
		for (var i = 0; i < playersData.length; i++) {
			var name = playersData[i].name;
			var account = playersData[i].account;
			var [x, y] = playersData[i].pos;
			var [r, g, b] = playersData[i].color;
				
			x = x + 3000;
			y = y + 3000;
			
			y = 6000-y;
				
			x = x * scale;
			y = y * scale;
				
			if (blips[account]) {
				blips[account].style.left = x+"px";
				blips[account].style.top = y+"px";
				blips[account].style["background-color"] = "rgb("+r+", "+g+", "+b+")";
				
				blips[account].setAttribute("name", name);

				hasbeenupdated[account] = true;
			} else {
				blip = document.createElement("div");
				blip.id = "blip"

				blip.style.left = x+"px";
				blip.style.top = y+"px";
				blip.style["background-color"] = "rgb("+r+", "+g+", "+b+")";
				
				blip.setAttribute("name", name);
				blip.addEventListener("mouseenter", onClientBlipInteract);
				blip.addEventListener("mouseleave", onClientBlipInteract);

				map.appendChild(blip);
				blips[account] = blip;
				
				hasbeenupdated[account] = true;
			}
			
		}
		
		for (var key in blips) {
			if (!(key in hasbeenupdated)) {
				blips[key].parentElement.removeChild(blips[key]);
				delete blips[key];
			}
		}
		
		var turfsData = JSON.parse(data).turfs;
		if (turfsData) {
			for (var i = 0; i < turfsData.length; i++) {
				var owner = turfsData[i].owner;
				var [x, y, wx, wy] = turfsData[i].radararea;
				var [r, g, b] = turfsData[i].color;
				var isFlashing = turfsData[i].flashing;
				
				x = parseFloat(x) + 3000;
				y = parseFloat(y) + 3000;
				
				y = 6000-y;
					
				x = x * scale;
				y = y * scale;
				
				wx = parseFloat(wx) * scale;
				wy = parseFloat(wy) * scale;	
				
				if (turfs[i]) {
					radararea = turfs[i];
					
					if (radararea.getAttribute("owner") != owner) {
						radararea.style["background-color"] = "rgba("+r+", "+g+", "+b+", 0.7)";
						radararea.setAttribute("owner", owner);	
					}
					
					if (isFlashing === "true") {
						if (!(radararea.getAttribute("flashing") == "true")) {
							radararea.setAttribute("flashing", "true")
						}
					} else {
						if (radararea.getAttribute("flashing") === "true") {
							radararea.setAttribute("flashing", "false");
						}
					}		
					
				} else {
					radararea = document.createElement("div");
					radararea.id = "radararea";
					radararea.style.left = x+"px";
					radararea.style.top = y-wy+"px";
					radararea.style.width = wx+"px";
					radararea.style.height = wy+"px";
					
					radararea.style["background-color"] = "rgba("+r+", "+g+", "+b+", 0.7)";
					
					radararea.setAttribute("background-color", radararea.style["background-color"])
					radararea.setAttribute("owner", owner);
					radararea.addEventListener("mouseenter", onClientRadarareaInteract);
					radararea.addEventListener("mouseleave", onClientRadarareaInteract);
					
					if (isFlashing === "true") {
						if (!(radararea.getAttribute("flashing") == "true")) {
							radararea.setAttribute("flashing", "true")
						}
					} else {
						if (radararea.getAttribute("flashing") === "true") {
							radararea.setAttribute("flashing", "false");
						}
					}
					
					map.appendChild(radararea);
					
					turfs[i] = radararea;
				}
			}
		}
	}
	
	setTimeout(updateData, 5000)
}

function flashingEffect () {
	for (var i = 0; i < turfs.length; i++) { 
		if (turfs[i].getAttribute("flashing") === "true") {
			if (turfs[i].style["background-color"] == turfs[i].getAttribute("background-color")) {	
				turfs[i].style["background-color"] = turfs[i].getAttribute("background-color").replace("0.7", "0.3");	
			} else { 
				turfs[i].style["background-color"] = turfs[i].getAttribute("background-color");
			} 
		}
	}
	setTimeout(flashingEffect, 700);
}

function onClientBlipInteract() {
	if (event.type == "mouseenter") {		
		namebox = document.createElement("div");
		namebox.id = "name";
		namebox.innerText = this.getAttribute("name");

		namebox.style.left = 7+getOffset(this).left+"px"; 
		namebox.style.top = (getOffset(this).top-25)+"px";
		
		var color = this.style['background-color'];
		var color = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/);
		var [r, g, b] = color;
		
		var hex = invertColor(rgb2hex(r, g, b), true)
		if (hex == "#000000") { 
			namebox.style.color = "#000000";
			namebox.style["text-shadow"] = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
		}
		
		namebox.style.background = "rgb("+r+","+g+","+b+")";
		document.body.appendChild(namebox);
	} else {
		document.getElementById("name").parentElement.removeChild(document.getElementById("name"));
	}
}

function onClientRadarareaInteract() {
	if (event.type == "mouseenter") {		
		namebox = document.createElement("div");
		namebox.id = "name";
		namebox.innerText = this.getAttribute("owner");

		namebox.style.left = 7+getOffset(this).left+"px"; 
		namebox.style.top = (getOffset(this).top-25)+"px";
		
		var color = this.style['background-color'];
		var color = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/);
		var [r, g, b] = color;
		
		var hex = invertColor(rgb2hex(r, g, b), true)
		if (hex == "#000000") { 
			namebox.style.color = "#000000";
			namebox.style["text-shadow"] = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
		}
		
		namebox.style.background = "rgba("+r+","+g+","+b+", 0.8)";
		document.body.appendChild(namebox);
		
		for (var i = 0; i < turfs.length; i++) { 
			if (turfs[i].getAttribute("owner") === namebox.innerText && !(turfs[i].getAttribute("flashing")) ) {
				turfs[i].style["background-color"] = turfs[i].getAttribute("background-color").replace("0.7", "1");	
				turfs[i].setAttribute("highlighted", "true");
			}
		}
	} else {
		document.getElementById("name").parentElement.removeChild(document.getElementById("name"));
		for (var i = 0; i < turfs.length; i++) { 
			if (turfs[i].getAttribute("highlighted") === "true") {
				turfs[i].removeAttribute("highlighted");
				turfs[i].style["background-color"] = turfs[i].getAttribute("background-color");	
			}
		}
	}
}


function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

function rgb2hex(red, green, blue) {
	var rgb = blue | (green << 8) | (red << 16);
	return '#' + (0x1000000 + rgb).toString(16).slice(1)
}

init();
