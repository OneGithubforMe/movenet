gradient_color = [
    ["#063F57", "#345477"],
    ["#B00000", "#AB0044"]
];
gif_disappear = true;

function shuffleArray(a) {
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var b = a[i];
        a[i] = a[j];
        a[j] = b
    }
}
var level = 1;
var redcount = 0;
var bluecount = 0;
var l1y = .9 * canvasHeight - .025 * canvasWidth;
var l1 = [
    ["w", .275, l1y],
    ["y", .325, l1y],
    ["w", .375, l1y],
    ["y", .425, l1y],
    ["w", .475, l1y],
    ["y", .525, l1y],
    ["w", .575, l1y],
    ["y", .625, l1y],
    ["w", .675, l1y],
    ["y", .725, l1y]
];
var randomizer = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var removeballindex = null;
var layer1 = null;
layer1 = Array(10);
for (let index = 0; index < 10; index++) {
    layer1[index] = l1[index].slice()
}
shuffleArray(randomizer);
for (let index = 0; index < randomizer.length; index++) {
    if (index % 2 == 0) {
        layer1[randomizer[index]][0] = "r"
    } else {
        layer1[randomizer[index]][0] = "b"
    }
}
var balldxdy = [
    [10, 10],
    [-10, 10],
    [10, -10],
    [-10, -10],
    [-10, 10],
    [10, 10],
    [10, -10],
    [-10, 10],
    [-10, -10],
    [10, 10]
];

function getStaticFile(e) {
	return "https://static.justmove.fun/"+e
}
var layer1velocity = balldxdy.slice();
var ballradius = .025 * canvasWidth;
var radius = .05 * canvasWidth;
var holdleft = null;
var holdright = null;
var lefthandradius = 15;
var righthandradius = 15;
var ballrst = 0;
var countplayed = 0;
var instructplayed = 0;
var outlinecolor = "black";
var ballcolor = null;
var t0 = null;
var arrowup = new Image;
arrowup.src = getStaticFile("media/icon/arrow-up.png");
var arrowsize = canvasWidth * 80 / 720;
var arrowdown = new Image;
arrowdown.src = getStaticFile("media/icon/arrow-down.png");

function Exercise(a) {
    ctx2.beginPath();
    if (!instructplayed) {
        instructplayed = 1;
        t0 = timecounter
    }
    if (!ballrst) {
        ballradius = .025 * canvasWidth;
        l1y = .9 * canvasHeight - .025 * canvasWidth;
        radius = .05 * canvasWidth;
        ctx2.font = Math.floor(canvasWidth * 36 / 720) + "px russon one regular";
        ctx2.textAlign = "center";
        if (holdleft == null && holdright == null) {
            ctx2.globalAlpha = .6;
            ctx2.fillStyle = "black";
            ctx2.fillRect(.44 * canvasWidth, canvasHeight * .6, .12 * canvasWidth, canvasHeight * .1);
            ctx2.globalAlpha = 1;
            ctx2.fillStyle = "#F7EF16";
            ctx2.fillText("Pick", .5 * canvasWidth, .68 * canvasHeight);
            ctx2.drawImage(arrowdown, .5 * canvasWidth - arrowsize / 2, .67 * canvasHeight, arrowsize, arrowsize);
            for (let index = 0; index < layer1.length; index++) {
                if (layer1[index][0] == "r") {
                    righthand = Math.pow(layer1[index][1] * canvasWidth - a.poseLandmarks[19].x * canvasWidth, 2) + Math.pow(layer1[index][2] - a.poseLandmarks[19].y * canvasHeight, 2);
                    if (righthand <= ballradius * ballradius) {
                        holdright = 1;
                        layer1.splice(index, 1);
                        layer1velocity.splice(index, 1);
                        if (index == removeballindex) {
                            removeballindex = Math.floor(Math.random() * layer1.length);
                            t0 = timecounter
                        }
                        break
                    }
                } else if (layer1[index][0] == "b") {
                    lefthand = Math.pow(layer1[index][1] * canvasWidth - a.poseLandmarks[20].x * canvasWidth, 2) + Math.pow(layer1[index][2] - a.poseLandmarks[20].y * canvasHeight, 2);
                    if (lefthand <= ballradius * ballradius) {
                        holdleft = 1;
                        layer1.splice(index, 1);
                        layer1velocity.splice(index, 1);
                        if (index == removeballindex) {
                            removeballindex = Math.floor(Math.random() * layer1.length);
                            t0 = timecounter
                        }
                        break
                    }
                }
            }
        }
        if (holdleft) {
            ctx2.globalAlpha = .6;
            ctx2.fillStyle = "black";
            ctx2.fillRect(.78 * canvasWidth, canvasHeight * .42, .14 * canvasWidth, canvasHeight * .1);
            ctx2.globalAlpha = 1;
            ctx2.fillStyle = "#F7EF16";
            ctx2.fillText("Drop", .85 * canvasWidth, .5 * canvasHeight);
            ctx2.drawImage(arrowup, .85 * canvasWidth - arrowsize / 2, .45 * canvasHeight - arrowsize, arrowsize, arrowsize);
            hoopdist = Math.pow(.85 * canvasWidth - a.poseLandmarks[20].x * canvasWidth, 2) + Math.pow(.2 * canvasHeight - a.poseLandmarks[20].y * canvasHeight, 2);
            if (hoopdist <= radius * radius) {
                holdleft = null;
                lefthandradius = 15;
                bluecount += 1;
                count += 1;
            }
        } else if (holdright) {
            ctx2.globalAlpha = .6;
            ctx2.fillStyle = "black";
            ctx2.fillRect(.08 * canvasWidth, canvasHeight * .42, .14 * canvasWidth, canvasHeight * .1);
            ctx2.globalAlpha = 1;
            ctx2.fillStyle = "#F7EF16";
            ctx2.fillText("Drop", .15 * canvasWidth, .5 * canvasHeight);
            ctx2.drawImage(arrowup, .15 * canvasWidth - arrowsize / 2, .45 * canvasHeight - arrowsize, arrowsize, arrowsize);
            hoopdist = Math.pow(.15 * canvasWidth - a.poseLandmarks[19].x * canvasWidth, 2) + Math.pow(.2 * canvasHeight - a.poseLandmarks[19].y * canvasHeight, 2);
            if (hoopdist <= radius * radius) {
                holdright = null;
                righthandradius = 15;
                redcount += 1;
                count += 1;
            }
        }
        if (holdleft == null && holdright == null && layer1.length == 0) {
            ballrst = 1
        }
    } else {
        layer1 = Array(10);
        for (let index = 0; index < 10; index++) {
            layer1[index] = l1[index].slice()
        }
        shuffleArray(randomizer);
        for (let index = 0; index < randomizer.length; index++) {
            if (index % 2 == 0) {
                layer1[randomizer[index]][0] = "r"
            } else {
                layer1[randomizer[index]][0] = "b"
            }
        }
        ballrst = 0
    }
    ctx2.beginPath();
    ctx2.globalAlpha = .4;
    ctx2.arc(.15 * canvasWidth, .2 * canvasHeight, radius, 0, 2 * Math.PI);
    var b = ctx2.createLinearGradient(.15 * canvasWidth - radius, .2 * canvasHeight - radius, .15 * canvasWidth + radius, .2 * canvasHeight + radius);
    b.addColorStop(0, gradient_color[1][0]);
    b.addColorStop(1, gradient_color[1][1]);
    ctx2.shadowBlur = 20;
    ctx2.shadowColor = "rgb(0,0,0,0.7)";
    ctx2.fillStyle = b;
    ctx2.fill();
    ctx2.beginPath();
    ctx2.strokeStyle = "white";
    ctx2.lineWidth = 5;
    ctx2.arc(.15 * canvasWidth, .2 * canvasHeight, radius, 0, 2 * Math.PI);
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.arc(.85 * canvasWidth, .2 * canvasHeight, radius, 0, 2 * Math.PI);
    var c = ctx2.createLinearGradient(.85 * canvasWidth - radius, .2 * canvasHeight - radius, .85 * canvasWidth + radius, .2 * canvasHeight + radius);
    c.addColorStop(0, gradient_color[0][0]);
    c.addColorStop(1, gradient_color[0][1]);
    ctx2.shadowBlur = 20;
    ctx2.shadowColor = "rgb(0,0,0,0.7)";
    ctx2.fillStyle = c;
    ctx2.fill();
    ctx2.beginPath();
    ctx2.strokeStyle = "white";
    ctx2.lineWidth = 5;
    ctx2.arc(.85 * canvasWidth, .2 * canvasHeight, radius, 0, 2 * Math.PI);
    ctx2.stroke();
    ctx2.globalAlpha = 1;
    ctx2.fillStyle = "#F7EF16";
    ctx2.font = "1200 " + canvasHeight * .05 + "px russon one regular";
    ctx2.textAlign = "center";
    ctx2.fillText(bluecount, .85 * canvasWidth, .23 * canvasHeight);
    ctx2.fillText(redcount, .15 * canvasWidth, .23 * canvasHeight);
    for (let index = 0; index < layer1.length; index++) {
        ctx2.beginPath();
        grad = ctx2.createLinearGradient(layer1[index][1] * canvasWidth - ballradius, layer1[index][2] - ballradius, layer1[index][1] * canvasWidth + ballradius, layer1[index][2] + ballradius);
        if (layer1[index][0] == "r") {
            grad.addColorStop(0, gradient_color[1][0]);
            grad.addColorStop(1, gradient_color[1][1]);
            ctx2.fillStyle = grad
        } else if (layer1[index][0] == "b") {
            grad.addColorStop(0, gradient_color[0][0]);
            grad.addColorStop(1, gradient_color[0][1]);
            ctx2.fillStyle = grad
        } else if (layer1[index][0] == "y") {
            ctx2.fillStyle = "#F7EF16"
        } else if (layer1[index][0] == "w") {
            ctx2.fillStyle = "white"
        }
        ctx2.arc(layer1[index][1] * canvasWidth, layer1[index][2], ballradius, 0, 2 * Math.PI);
        ctx2.fill();
        ctx2.strokeStyle = "black";
        ctx2.lineWidth = 3;
        ctx2.stroke()
    }
    b = ctx2.createLinearGradient(a.poseLandmarks[19].x - righthandradius, a.poseLandmarks[19].y - righthandradius, a.poseLandmarks[19].x + righthandradius, a.poseLandmarks[19].y + righthandradius);
    b.addColorStop(0, gradient_color[1][0]);
    b.addColorStop(1, gradient_color[1][1]);
    outlinecolor = "rgb(255,255,255)";
    ballcolor = b;
    if (holdright) {
        outlinecolor = green;
        ballcolor = green;
        righthandradius = ballradius
    }
    drawLandmarks(ctx2, [a.poseLandmarks[19]], {
        color: outlinecolor,
        fillColor: ballcolor,
        lineWidth: 4,
        radius: righthandradius
    });
    var c = ctx2.createLinearGradient(a.poseLandmarks[20].x - lefthandradius, a.poseLandmarks[20].y - lefthandradius, a.poseLandmarks[20].x + lefthandradius, a.poseLandmarks[20].y + lefthandradius);
    c.addColorStop(0, gradient_color[0][0]);
    c.addColorStop(1, gradient_color[0][1]);
    outlinecolor = "rgb(255,255,255)";
    ballcolor = "#191970";
    if (holdleft) {
        outlinecolor = green;
        ballcolor = green;
        lefthandradius = ballradius
    }
    drawLandmarks(ctx2, [a.poseLandmarks[20]], {
        color: outlinecolor,
        fillColor: ballcolor,
        lineWidth: 4,
        radius: lefthandradius
    })
}