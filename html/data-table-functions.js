
	function computeAngle(sLat, sLng, aLat, aLng, iLat, iLng)
	{
		alat = aLat- sLat;
		alng = aLng - sLng;
		ilat = iLat - sLat;
		ilng = iLng - sLng;
										
		// Comparing the 2 angles if the difference is - then its to the left and if its positive then it is to the right
		var scalar = alat * ilat + alng * ilng;
		var mag1 = Math.pow((alat * alat + alng * alng), .5);
		var mag2 = Math.pow((ilat * ilat + ilng * ilng), .5);
		return Math.round(Math.acos(scalar / (mag1 * mag2))*(180/Math.PI), 2);
	}

	function convertGPStoYards(lat1, lng1, lat2, lng2)
	{
		var dlat = (lat2 - lat1)*(Math.PI/180);
		var dlon = (lng2 - lng1)*(Math.PI/180);                          
		var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return Math.round(6967420.2 * c, 2);
	}
	function makeDivs(rs)
	{
		for(var i =0; i < rs.length; i++)
		{
			var rh = rs[i]["round"]["holes"];
			var str +=  '<div id="tableHoles' + rh[0]["hole"]["id"] + 'div" class="tab2">';
			str += '<table cellpadding="0" cellspacing="0" border="0" class="display" id="tableHoles' + rh[0]["hole"]["id"] + '"></table>';
			str += '</div>';
			
			for(var j = 0; j < rh.length; j++)
			{
				var ra = rh[j]["hole"]["shots"];
				str += '<div id="tableShots' + ra[0]["shot"]["id"] + 'div" class="tab2">';
				str += '<table cellpadding="0" cellspacing="0" border="0" class="display" id="tableShots' + ra[0]["shot"]["id"] + '"></table>';
				str += '</div>';
			}
		}
		return str;
	}
	function createShot(rs, cel)
	{
		data = "";
		holes = "";
		cell = "";
		if(rs.length > 0)
		{
			for(var i = 0; i < rs.length; i++)
			{
				var r = rs[i]["shot"];
				var angle = computeAngle(r["startLatitude"], r["startLongitude"], r["aimLatitude"], r["aimLongitude"], r["endLatitude"], r["endLongitude"]);
				var distance = convertGPStoYards(r["startLatitude"], r["startLongitude"], r["endLatitude"], r["endLongitude"]);
				var data += '[' + $r["id"] + ',' + r["holeID"] + ",\"" + r["club"] + "\"," + r["shotNumber"] + ',' + distance + ',' + angle + "],";
			}
			data = data.substr(0, data.length);
			
			var cell += "#tableShots" + rs[0]["shot"]["id"] + "div\").show(); history[2]=\"tableShots" + $rs[0]["shot"]["id"] + "div\"; });";
			cell += "cell.css(\"cursor\",\"pointer\");";
			
			var str =  "$(\"#tableShots" + rs[0]["shot"]["id"] + "\").dataTable({";
			str 	+= "\"iDisplayLength\": 25,";
			str 	+= "\"aaData\": [" + data + "],";
			str 	+= "\"aoColumns\": [{";
			str 	+= "\"sTitle\": \"Shot Id\"";
			str 	+= "}, {";
			str 	+= \"sTitle\": \"Hole ID\"";
			str 	+= "}, {";
			str 	+= "\"sTitle\": \"Club\"";
			str 	+= "}, {"
			str 	+= "\"sTitle\": \"Shot Number\"";
			str 	+= "}, {";
			str 	+= "\"sTitle\": \"Distance(yards)\"";
			str 	+= "}, {"
			str 	+= "\"sTitle\": \"Angle (Degrees)\"";
			str 	+= "}],"
			str 	+= "\"sDom\": \'C<\"clear\">lfrtip\',";
			str 	+= "\"oColVis\": {";
			str 	+= "\"activate\": \"mouseover\"";
			str 	+= "}});";
			str 	+= "$(\"#tableShots" + rs[0]["shot"]["id"] + "div\").hide();" + "\n" + cell;
		}
		else
		{
			str = "";
		}
		return str;
	}
	function createHole(rs, cel)
	{
		var data = "";
		var shots = "";
		var cell = "";
		if(rs.length > 0)
		{
			for(var i = 0; i < rs.length; i++)
			{
				var r = rs[i]["hole"];
				data += '[' + r["id"] + ',' + r["roundID"] + ',' + r["holeNumber"] + ',' + r["putts"] + ',' + r["shots"].length + "],";
				cell = "cell = $($($(\"#tableHoles" + rs[0]["hole"]["id"] + "\").children().eq(1)).children().eq(" + i + ")).children().eq(0);" + "\n" + "cell.click(function(){$(\"#tableHoles" + rs[0]["hole"]["id"] + "div\").hide();$(\"";
				
				shots += createShot(r["shots"], cell);
			}
			data = data.substr(0, data.length);
			var cel += "#tableHoles" + rs[0]["hole"]["id"] + "div\").show();$(\"#larrow\").show(); history[1]=\"tableHoles" + rs[0]["hole"]["id"] + "div\";});";
			cel += "cell.css(\"cursor\", \"pointer\");";

			var str += "$(\"#tableHoles" + rs[0]["hole"]["id"] + "\").dataTable({";
			str += "\"iDisplayLength\": 25,";
			str += "\"aaData\": [" + data + "],";
			str += "\"aoColumns\": [{";
			str += "\"sTitle\": \"Hole Id\"";
			str += "}, {";
			str += "\"sTitle\": \"Round ID\"";
			str += "}, {";
			str += "\"sTitle\": \"Hole Number\"";
			str += "}, {";
			str += "\"sTitle\": \"Putts\"";
			str += "}, {";
			str += "\"sTitle\": \"Shots\"";
			str += "}],";
			str += "\"sDom\": \'C<\"clear\">lfrtip\',";
			str += "\"oColVis\": {";
			str += "\"activate\": \"mouseover\"";
			str += "}});"
			str += "$(\"#tableHoles" + rs[0]["hole"]["id"] + "div\").hide();" + "\n" + cel;
		}
		else
		{
			str = "";
		}        
		return str + shots;
	}                           
	function createRound(rs)
	{
		var data = "";
		var holes = "";
		var cell = "";
		for(var i = 0; i < rs.length; i++)
		{
			var r = rs[i]["round"];
			data += '[' + r["id"] + ',' + r["totalScore"] + ",\"" + r["startTime"] + "\"," + r["teeID"] + "],";
			cell = "cell = $($($(\"#tableRounds\").children().eq(1)).children().eq(" + i + ")).children().eq(0);" + "\n" + "cell.click(function(){$(\"#tableRoundsdiv\").hide();$(\"";
			holes += createHole(r["holes"], cell);
		}
		data = data.substr(0, data.length);
		var str = "$(\"#tableRounds\").dataTable({";
		str    += "\"iDisplayLength\": 25,";
		str    += "\"aaData\": [" + data + "],";
		str    += "\"aoColumns\": [{";
		str    += "\"sTitle\": \"Round ID\"";
		str    += "}, {";
		str    += "\"sTitle\": \"Total Score\"";
		str    += "}, {";
		str    += "\"sTitle\": \"Round Time\"";
		str    += "}, {";
		str    += "\"sTitle\": \"Tee ID\"";
		str    += "}],";
		str    += "\"sDom\": \'C<\"clear\">lfrtip\',";
		str    += "\"oColVis\": {";
		str    += "\"activate\": \"mouseover\"";
		str    += "}});";
				
		return str + holes;
	}