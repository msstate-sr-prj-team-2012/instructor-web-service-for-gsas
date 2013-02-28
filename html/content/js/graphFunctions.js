var angles = [];
var scale;
var settings = {
    hits: "",
    holesGps: "",
    holesPx: "",
    clubs: "",
    svg: "",
    width: 0,
    height: 0,
    svgL: "",
    widthL: 0,
    heightL: 0,
    colorWheel: ["red", "green", "blue", "orange", "purple", "lightblue", "pink", "brown"]
};

function init(settings1) {
    pushSettings(settings1);

    // Draw area
    settings.svg.rect(0, 0, settings.width, settings.height, 20, 20, {
        fill: "white",
        stroke: "black",
        strokeWidth: 2
    });

    settings.svg.text((settings.width / 2) - 50, 20, 'Golf Name: Bob Jones', {
        id: "topId",
        fill: "black"
    });
    settings.svg.text((settings.width / 2) - 50, 35, '', {
        id: "txtVal",
        fill: "black"
    });

    drawGrid();
    drawLegend();
    addData();
    drawStats();
}

// Copy settings

function pushSettings(settings1) {
    if (settings1.hits != null) settings.hits = settings1.hits;
    if (settings1.holesGps != null) settings.holesGps = settings1.holesGps;
    if (settings1.holesPx != null) settings.holesPx = settings1.holesPx;
    if (settings1.clubs != null) settings.clubs = settings1.clubs;
    if (settings1.svg != null) settings.svg = settings1.svg;
    if (settings1.width != null) settings.width = settings1.width;
    if (settings1.height != null) settings.height = settings1.height;
    if (settings1.svgL != null) settings.svgL = settings1.svgL;
    if (settings1.widthL != null) settings.widthL = settings1.widthL;
    if (settings1.heightL != null) settings.heightL = settings1.heightL;
    if (settings1.colorWheel != null) settings.colorWheel = settings1.colorWheel;
}

// Draw the lined grid

function drawGrid() {

    var i;
    var h = settings.height / 10;
    for (i = 0; i < 9; i++) {
        settings.svg.line(0, (h + (h * i)), settings.width, (h + (h * i)), {
            stroke: "grey",
            strokeWidth: .5
        });
    }

    settings.svg.line(settings.width / 2, h, settings.width / 2, settings.height, {
        stroke: "black",
        strokeWidth: 3
    }); // 90  
}

function computeAngle(sLat, sLng, aLat, aLng, iLat, iLng) {
    var alat = aLat - sLat;
    var alng = aLng - sLng;
    var ilat = iLat - sLat;
    var ilng = iLng - sLng;
	
    // Comparing the 2 angles if the difference is - then its to the left and if its positive then it is to the right
    var scalar = alat * ilat + alng * ilng;
    console.log(scalar);
    var mag1 = Math.pow((alat * alat + alng * alng), .5);
    var mag2 = Math.pow((ilat * ilat + ilng * ilng), .5);
    console.log(mag1);
    console.log(mag2);
    console.log(Math.acos(scalar / (mag1 * mag2))*(180/Math.PI));
    return roundNumber(Math.acos(scalar / (mag1 * mag2))*(180/Math.PI), 2);
}

function convertGPStoYards(lat1, lng1, lat2, lng2) {
    var a, dlat, dlon;
    dlat = (lat2 - lat1) * (Math.PI / 180);
    dlon = (lng2 - lng1) * (Math.PI / 180);

    a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return roundNumber(6967420.2 * c, 2);
}
// Draw the legend and add all of the clubs

function drawLegend() {

    settings.svgL.rect(0, 0, settings.widthL, settings.heightL, 20, 20, {
        fill: "white",
        stroke: "black",
        strokeWidth: 2
    });

    // Wood
    drawTriangle(settings.svgL, 21, 17, 12, {
        id: "triL1",
        fill: "black",
        stroke: "black",
        strokeWidth: .000001
    });

    settings.svgL.text(30, 15, 'Wood', {
        id: "txt1",
        fill: "black"
    });

    // Wood Clubs
    var start = addClubs(0, 0);

    // Hybrid 
    settings.svgL.rect(10, start + 20, 16, 12, 2, 2, {
        id: "rectL1",
        fill: "black",
        stroke: "black",
        strokeWidth: .000001
    });

    settings.svgL.text(30, start + 30, 'Hybrid', {
        id: "txt2",
        fill: "black"
    });

    // Hybrid Clubs
    start = addClubs(1, start + 20);

    // Iron
    settings.svgL.circle(17, start + 25, 8, {
        id: "cirL1",
        fill: "black",
        stroke: "black",
        strokeWidth: .000001
    });

    settings.svgL.text(30, start + 30, 'Iron', {
        id: "txt3",
        fill: "black"
    });

    // Iron Clubs
    start = addClubs(2, start + 25);

    // Wedge
    drawDiamond(settings.svgL, 35, 17, start + 20, {
        id: "diaL1",
        fill: "black",
        stroke: "black",
        strokeWidth: .000001
    });

    settings.svgL.text(30, start + 25, 'Wedge', {
        id: "txt4",
        fill: "black"
    });

    $(settings.svgL.getElementById("triL1")).css("cursor", "pointer");
    $(settings.svgL.getElementById("rectL1")).css("cursor", "pointer");
    $(settings.svgL.getElementById("cirL1")).css("cursor", "pointer");
    $(settings.svgL.getElementById("diaL1")).css("cursor", "pointer");

    // Wedge Clubs
    addClubs(3, start + 20);

    greyOut();
}

function addClubs(num, start) {
    var i = 0;
    var y = 0;

    if (num == 0) {

        for (i = 0; i < settings.clubs[num].length; i++) {

            var id = "triL" + (i + 2);
            var tId = "triT" + (i + 2);

            y = 30 + (i * 18);

            drawTriangle(settings.svgL, 21, 27, y, {
                id: id,
                fill: settings.colorWheel[i],
                stroke: "black",
                strokeWidth: .000001
            });

            settings.svgL.text(37, y + 6, settings.clubs[num][i], {
                id: tId,
                fill: settings.colorWheel[i]
            });

            $(settings.svgL.getElementById(id)).click((function(id) {
                return function() {
                    legend(id, 0, 2);
                };
            }(id)));

            $(settings.svgL.getElementById(tId)).click((function(id) {
                return function() {
                    legend(id, 0, 0);
                };
            }(tId)));
            $(settings.svgL.getElementById(id)).css("cursor", "pointer");
            $(settings.svgL.getElementById(tId)).css("cursor", "pointer");

            $(settings.svgL.getElementById(id)).data("data", []);
            $(settings.svgL.getElementById(tId)).data("data", []);
        }
        return y;

    } else if (num == 1) {
        for (i = 0; i < settings.clubs[num].length; i++) {

            var id = "rectL" + (i + 2);
            var tId = "rectT" + (i + 2);

            y = 18 + (i * 18) + start;

            settings.svgL.rect(18, y, 16, 12, 2, 2, {
                id: id,
                fill: settings.colorWheel[i],
                stroke: "black",
                strokeWidth: .000001
            });

            settings.svgL.text(37, y + 10, settings.clubs[num][i], {
                id: tId,
                fill: settings.colorWheel[i]
            });

            $(settings.svgL.getElementById(id)).click((function(id) {
                return function() {
                    legend(id, 1, 2);
                };
            }(id)));


            $(settings.svgL.getElementById(tId)).click((function(id) {
                return function() {
                    legend(id, 1, 0);
                };
            }(tId)));

            $(settings.svgL.getElementById(id)).data("data", []);
            $(settings.svgL.getElementById(tId)).data("data", []);

            $(settings.svgL.getElementById(id)).css("cursor", "pointer");
            $(settings.svgL.getElementById(tId)).css("cursor", "pointer");
        }

        return y;
    } else if (num == 2) {
        for (i = 0; i < settings.clubs[num].length; i++) {

            y = 20 + (i * 20) + start;

            var id = "cirL" + (i + 2);
            var tId = "cirT" + (i + 2);

            settings.svgL.circle(25, y, 8, {
                id: id,
                fill: settings.colorWheel[i],
                stroke: "black",
                strokeWidth: .000001
            });

            settings.svgL.text(37, y + 3, settings.clubs[num][i], {
                id: tId,
                fill: settings.colorWheel[i]
            });

            $(settings.svgL.getElementById(id)).click((function(id) {
                return function() {
                    legend(id, 2, 2);
                };
            }(id)));

            $(settings.svgL.getElementById(tId)).click((function(id) {
                return function() {
                    legend(id, 2, 0);
                };
            }(tId)));

            $(settings.svgL.getElementById(id)).data("data", []);
            $(settings.svgL.getElementById(tId)).data("data", []);

            $(settings.svgL.getElementById(id)).css("cursor", "pointer");
            $(settings.svgL.getElementById(tId)).css("cursor", "pointer");
        }

        return y;
    } else if (num == 3) {

        for (i = 0; i < settings.clubs[num].length; i++) {

            y = 20 + (i * 20) + start;

            var id = "diaL" + (i + 2);
            var tId = "diaT" + (i + 2);

            drawDiamond(settings.svgL, 35, 27, y, {
                id: id,
                fill: settings.colorWheel[i],
                stroke: "black",
                strokeWidth: .000001
            });

            settings.svgL.text(37, y + 6, settings.clubs[num][i], {
                id: tId,
                fill: settings.colorWheel[i]
            });

            $(settings.svgL.getElementById(id)).click((function(id) {
                return function() {
                    legend(id, 3, 2);
                };
            }(id)));

            $(settings.svgL.getElementById(tId)).click((function(id) {
                return function() {
                    legend(id, 3, 0);
                };
            }(tId)));

            $(settings.svgL.getElementById(id)).data("data", []);
            $(settings.svgL.getElementById(tId)).data("data", []);

            $(settings.svgL.getElementById(id)).css("cursor", "pointer");
            $(settings.svgL.getElementById(tId)).css("cursor", "pointer");
        }
        return y;
    }
    return 0;
}

function greyOut() {
    var i, j;
    for (i = 0; i < settings.clubs.length; i++) {
        if (i == 0) {
            settings.svgL.change(settings.svgL.getElementById("triL1"), {
                fill: "grey"
            });
            settings.svgL.change(settings.svgL.getElementById("txtL1"), {
                fill: "grey"
            });
            allClubs("tri", settings.clubs[i])
        } else if (i == 1) {
            settings.svgL.change(settings.svgL.getElementById("rectL1"), {
                fill: "grey"
            });
            settings.svgL.change(settings.svgL.getElementById("txt2"), {
                fill: "grey"
            });
            allClubs("rect", settings.clubs[i])
        } else if (i == 2) {
            settings.svgL.change(settings.svgL.getElementById("cirL1"), {
                fill: "grey"
            });
            settings.svgL.change(settings.svgL.getElementById("txt3"), {
                fill: "grey"
            });
            allClubs("cir", settings.clubs[i])
        } else if (i == 3) {
            settings.svgL.change(settings.svgL.getElementById("diaL1"), {
                fill: "grey"
            });
            settings.svgL.change(settings.svgL.getElementById("txt4"), {
                fill: "grey"
            });
            allClubs("dia", settings.clubs[i])
        }
    }
}

function allClubs(str, club) {
    for (j = 0; j < club.length; j++) {
        settings.svgL.change(settings.svgL.getElementById(str + "L" + (j + 2)), {
            fill: "grey"
        });
        settings.svgL.change(settings.svgL.getElementById(str + "T" + (j + 2)), {
            fill: "grey"
        });
    }
}

function addData() {
    var i, j;

    var holesGps = settings.holesGps
    var holesPx = settings.holesPx;
    var hits = settings.hits;

    // Hole
    for (i = 0; i < holesGps.length; i++) {
        var start = holesGps[i][0];
        var end = holesGps[i][1];
        var center = holesGps[i][2];

        var startpx = holesPx[i][0];
        var endpx = holesPx[i][1];
        var centerpx = holesPx[i][2];

        var a = Math.abs(end[0] - start[0]);
        var ab = Math.abs(end[1] - start[1]);

        var b = Math.abs(center[0] - end[0]);
        var bb = Math.abs(center[1] - end[1]);

        var c = Math.abs(center[0] - start[0]);
        var cb = Math.abs(center[1] - start[1]);

        var a1 = Math.abs(endpx[0] - startpx[0]);
        var ab1 = Math.abs(endpx[1] - startpx[1]);

        var b1 = Math.abs(centerpx[0] - endpx[0]);
        var bb1 = Math.abs(centerpx[1] - endpx[1]);

        var c1 = Math.abs(centerpx[0] - startpx[0]);
        var cb1 = Math.abs(centerpx[1] - startpx[1]);

        var scaleXa = (a1 / a);
        var scaleXb = (b1 / b);
        var scaleXc = (c1 / c);

        var scaleYa = (ab1 / ab);
        var scaleYb = (bb1 / bb);
        var scaleYc = (cb1 / cb);

        var scaleX = (scaleXa + scaleXb + scaleXc) / 3;
        var scaleY = (scaleYa + scaleYb + scaleYc) / 3;

        if (hits[i] != null) {
            // Hit
            for (j = 0; j < hits[i].length; j++) {
                var hit = hits[i][j];
                var slat = hit[0];
                var slng = hit[1];
                var ilat = hit[2];
                var ilng = hit[3];
                var alat = hit[4];
                var alng = hit[5];
                if ((alat - slat) != 0 || (alng - slng) != 0) {
                    // Compareing the 2 angles if the difference is - then its to the left and if its positive then it is to the right
                    var angle = computeAngle(slat, slng, alat, alng, ilat, ilng);
                    var dist = convertGPStoYards(slat, slng, ilat, ilng);
                    if (dist > 0) {
                        
                        var lng = Math.atan(angle)*(dist * 1.5);
                        
                        console.log(angle + " " + dist + " " + lng + " " + (Math.cos(angle)));
                        if (angle > 0) lng = (settings.width / 2) + lng;
                        drawShape((settings.height - (dist * 1.5)), lng, hit[6], j + 1, angle , i);

                        angles.push(angle);
                    }
                }
            }
        }
    }
}

function drawShape(length, lng, club, hit, angle, block) {
    var i, j, index;

    j = 0;
    index = -1;
    for (i = 0; i < settings.clubs.length; i++) {
        index = jQuery.inArray(club, settings.clubs[i]);
        if (index != -1) {
            j = i;
            break;
        }
    }

    if (j == 0) {

        hollowShape(0, "triL");

        drawTriangle(settings.svg, 21, lng, length, {
            id: "tri" + +block + "-" + hit,
            fill: settings.colorWheel[index],
            stroke: "black",
            strokeWidth: .000001
        });

        addTooltip("tri" + +block + "-" + hit, "Length: " + roundNumber((settings.height - length) / 1.5, 2) + " Angle: " + roundNumber(angle, 2));

        settings.svgL.change(settings.svgL.getElementById("triL" + (index + 2)), {
            fill: settings.colorWheel[index]
        });
        settings.svgL.change(settings.svgL.getElementById("triT" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        var map = $(settings.svgL.getElementById("triL" + (index + 2))).data("data");
        map.push("tri" + +block + "-" + hit);

        $(settings.svgL.getElementById("triL" + (index + 2))).data("data", map);
        $(settings.svgL.getElementById("triT" + (index + 2))).data("data", map);


    } else if (j == 1) {
        hollowShape(1, "rectL");
        settings.svg.rect(lng, length, 16, 12, 2, 2, {
            id: "rect" + +block + "-" + hit,
            fill: settings.colorWheel[index],
            stroke: "black",
            strokeWidth: .000001
        });

        addTooltip("rect" + +block + "-" + hit, "Length: " + roundNumber((settings.height - length) / 1.5, 2) + " Angle: " + roundNumber(angle, 2));

        settings.svgL.change(settings.svgL.getElementById("rectL" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        settings.svgL.change(settings.svgL.getElementById("rectT" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        var map = $(settings.svgL.getElementById("rectL" + (index + 2))).data("data");
        map.push("rect" + +block + "-" + hit);


        $(settings.svgL.getElementById("rectL" + (index + 2))).data("data", map);
        $(settings.svgL.getElementById("rectT" + (index + 2))).data("data", map);

    } else if (j == 2) {
        hollowShape(2, "cirL");
        settings.svg.circle(lng, length, 8, {
            id: "cir" + +block + "-" + hit,
            fill: settings.colorWheel[index],
            stroke: "black",
            strokeWidth: .000001
        });

        addTooltip("cir" + +block + "-" + hit, "Length: " + roundNumber((settings.height - length) / 1.5, 2) + " Angle: " + roundNumber(angle, 2));

        settings.svg.change(settings.svg.getElementById("cirL" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        settings.svg.change(settings.svg.getElementById("cirT" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        var map = $(settings.svgL.getElementById("cirL" + (index + 2))).data("data");
        map.push("cir" + +block + "-" + hit);

        $(settings.svgL.getElementById("cirL" + (index + 2))).data("data", map);
        $(settings.svgL.getElementById("cirT" + (index + 2))).data("data", map);

    } else if (j == 3) {
        hollowShape(3, "diaL");
        drawDiamond(settings.svg, 35, lng, length, {
            id: "dia" + +block + "-" + hit,
            fill: settings.colorWheel[index],
            stroke: "black",
            strokeWidth: .000001
        });

        addTooltip("dia" + +block + "-" + hit, "Length: " + roundNumber((settings.height - length) / 1.5, 2) + " Angle: " + roundNumber(angle, 2));

        settings.svg.change(settings.svg.getElementById("diaL" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        settings.svg.change(settings.svg.getElementById("diaT" + (index + 2)), {
            fill: settings.colorWheel[index]
        });

        var map = $(settings.svgL.getElementById("diaL" + (index + 2))).data("data");
        map.push("dia" + +block + "-" + hit);

        $(settings.svgL.getElementById("diaL" + (index + 2))).data("data", map);
        $(settings.svgL.getElementById("diaT" + (index + 2))).data("data", map);
    }


}

function addTooltip(item, msg) {

    $(settings.svg.getElementById(item)).qtip({
        content: msg,
        show: 'mouseover',
        hide: 'mouseout',
        position: {
            corner: {
                target: 'topRight',
                tooltip: 'bottomLeft'
            }
        },
        style: {
            name: 'dark',
            padding: '4px 8px',
            width: {
                max: 210,
                min: 0
            },
            tip: true
        }
    });

}

function drawTriangle(draw, size, x, y, settings) {
    draw.polygon([
        [x, y - (size / 3)],
        [x - (size / 3), y + (size / 3)],
        [x + (size / 3), y + (size / 3)]
    ], settings);
}

function drawDiamond(draw, size, x, y, settings) {
    draw.polygon([
        [x, y - (size / 4)],
        [x - (size / 4), y],
        [x, y + (size / 4)],
        [x + (size / 4), y]
    ], settings);
}

function hollowShape(index, item) {

    var i, j;
    j = 0;

    for (i = 0; i < settings.clubs[index].length; i++) {
        if ($(settings.svg.getElementById(item + (i + 2))).attr("fill") != "grey") {
            j++;
        }
    }
    if (settings.clubs[index].length == j) {
        settings.svg.change(settings.svg.getElementById(item + "1"), {
            fill: "black",
            strokeWidth: .000001
        });
    } else if (j > 0) {
        settings.svg.change(settings.svg.getElementById(item + "1"), {
            fill: "white",
            strokeWidth: 3
        });
    } else if (j == 0) {
        settings.svg.change(settings.svg.getElementById(item + "1"), {
            fill: "grey",
            strokeWidth: .00001
        });
    }
}

function legend(item, index) {
    var shape = $(settings.svg.getElementById(item));
    var i = item.substring(item.length - 1, item.length);
    var it = item.substring(item.length - 2, item.length - 1);
    var data = $(settings.svg.getElementById(item)).data("data");
    var item1;

    if (it == "T") {
        item1 = item.substring(0, item.length - 2) + "L" + i;
    } else {
        item1 = item.substring(0, item.length - 2) + "T" + i;
    }
    if (shape.attr("fill") == "grey") {
        settings.svg.change(settings.svg.getElementById(item), {
            fill: settings.colorWheel[i - 2],
            strokeWidth: .000001
        });

        settings.svg.change(settings.svg.getElementById(item1), {
            fill: settings.colorWheel[i - 2],
            strokeWidth: .000001
        });

        var k;
        for (k = 0; k < data.length; k++) {
            $(settings.svg.getElementById(data[k])).show();
        }
    } else {
        settings.svg.change(settings.svg.getElementById(item), {
            fill: "grey",
            strokeWidth: .000001
        })

        settings.svg.change(settings.svg.getElementById(item1), {
            fill: "grey",
            strokeWidth: .000001
        });

        var k;
        for (k = 0; k < data.length; k++) {
            $(settings.svg.getElementById(data[k])).hide();
        }
    }

    hollowShape(index, item.substring(0, item.length - 1));
}

function roundNumber(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

function drawStats() {
    if (angles.length > 0) {
        var q10, q25, q50, q75, q90;
        angles.sort();
        q10x = Math.abs(Math.sin(angles[Math.round((angles.length - 1) * .1)]) * (settings.height / 2));
        q25x = Math.abs(Math.sin(angles[Math.round((angles.length - 1) * .25)]) * (settings.height / 2));
        q50x = Math.abs(Math.sin(angles[Math.round((angles.length - 1) * .5)]) * (settings.height / 2));
        q75x = Math.abs(Math.sin(angles[Math.round((angles.length - 1) * .75)]) * (settings.height / 2));
        q90x = Math.abs(Math.sin(angles[Math.round((angles.length - 1) * .9)]) * (settings.height / 2));
        q10y = Math.abs(Math.cos(angles[Math.round((angles.length - 1) * .1)]) * (settings.height / 2));
        q25y = Math.abs(Math.cos(angles[Math.round((angles.length - 1) * .25)]) * (settings.height / 2));
        q50y = Math.abs(Math.cos(angles[Math.round((angles.length - 1) * .5)]) * (settings.height / 2));
        q75y = Math.abs(Math.cos(angles[Math.round((angles.length - 1) * .75)]) * (settings.height / 2));
        q90y = Math.abs(Math.cos(angles[Math.round((angles.length - 1) * .9)]) * (settings.height / 2));

        console.log(q10x + " " + q25x + " " + q50x + " " + q75x + " " + q90x);
        console.log(q10y + " " + q25y + " " + q50y + " " + q75y + " " + q90y);

        svg.line(settings.width / 2, settings.height, q10x + settings.width / 2, settings.height - q10y, {
            strokeWidth: 2,
            id: "q10",
            stroke: "grey"
        });
        svg.line(settings.width / 2, settings.height, q25x + settings.width / 2, settings.height - q25y, {
            strokeWidth: 2,
            id: "q25",
            stroke: "grey"
        });
        svg.line(settings.width / 2, settings.height, q50x + settings.width / 2, settings.height - q50y, {
            strokeWidth: 2,
            id: "q50",
            stroke: "grey"
        });
        svg.line(settings.width / 2, settings.height, q75x + settings.width / 2, settings.height - q75y, {
            strokeWidth: 2,
            id: "q75",
            stroke: "grey"
        });
        svg.line(settings.width / 2, settings.height, q90x + settings.width / 2, settings.height - q90y, {
            strokeWidth: 2,
            id: "q95",
            stroke: "grey"
        });
        addTooltip("q10", "Quartile: 10" + " Angle: " + angles[Math.round((angles.length - 1) * .1)]);
        addTooltip("q25", "Quartile: 25" + " Angle: " + angles[Math.round((angles.length - 1) * .25)]);
        addTooltip("q50", "Quartile: 50" + " Angle: " + angles[Math.round((angles.length - 1) * .5)]);
        addTooltip("q75", "Quartile: 75" + " Angle: " + angles[Math.round((angles.length - 1) * .75)]);
        addTooltip("q95", "Quartile: 95" + " Angle: " + angles[Math.round((angles.length - 1) * .9)]);
    }
}
