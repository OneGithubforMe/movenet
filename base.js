console.log("loaded base.js");
var on_focus = true;
var on_pause = false;
var go_for_animation = false;
var txt = "";
var aspectratio = screen.width / screen.height;
var canvasWidth = 1280;
var canvasHeight = 720;
var webcamElement = document.getElementById("video");
webcamElement.height = Math.min(window.innerHeight, 720);
webcamElement.width = 16 * webcamElement.height / 9;
var media = document.getElementById("media");
var defaultheight = Math.min(window.innerHeight, 720);
var count = 0;
var fnstate = 0;
var lineWidth = 2;
var minConfidencescore = .5;
var frames = 0;
var fr = 0;
var saved_length = 50;
var flipPoseHorizontal = true;
var timecounter = 0;
var lim = 0;
var lastLoop = new Date;
var fps, min_fps = 7;
var canvas2 = document.getElementById("output2");
var ctx2 = canvas2.getContext("2d");
canvas2.width = canvasWidth;
canvas2.height = canvasHeight;
var green = "#00ff00";
var white = "white";
var colour = null;
var canvas1 = document.getElementById("output1");
var ctx1 = canvas1.getContext("2d");
canvas1.width = canvasWidth;
canvas1.height = canvasHeight;
POSE_CONNECTIONS = [
    [24, 26],
    [26, 28],
    [23, 25],
    [25, 27],
    [12, 24],
    [11, 23],
    [24, 23],
    [11, 12],
    [11, 13],
    [13, 15],
    [12, 14],
    [14, 16]
];
var sampling_rate = 3;
var sampling_count = 0;
var activityLandmark = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
var saved_activity = Array(50).fill(0);
var saved_activity_iterator = 0;
var sampled_pose = null;
var total_activity = 0;
var act_sum = 0;

function find_angle(A, B, C) {
    var a = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var b = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var c = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((b * b + a * a - c * c) / (2 * b * a)) * 180 / Math.PI
}

function pause_on_too_close(a) {
    x = Math.sqrt(Math.pow(a.poseLandmarks[7].y - a.poseLandmarks[8].y, 2) + Math.pow(a.poseLandmarks[7].x - a.poseLandmarks[8].x, 2));
    if (Math.abs(a.poseLandmarks[7].y - a.poseLandmarks[8].y) < Math.abs(a.poseLandmarks[7].x - a.poseLandmarks[8].x)) {
        threshold = .06
    } else {
        threshold = .09
    }
    if (a.poseLandmarks[0].y >= 0 && a.poseLandmarks[32].y <= 1.25 && a.poseLandmarks[31].y <= 1.25 && Math.sqrt(Math.pow(a.poseLandmarks[11].y - a.poseLandmarks[12].y, 2) + Math.pow(a.poseLandmarks[11].x - a.poseLandmarks[12].x, 2)) * canvasWidth <= .2 * canvasWidth && x < threshold) {
        return true
    } else {
        return false
    }
}

function fps_is_less_then_min() {
    ctx1.beginPath();
    ctx1.globalAlpha = .5;
    ctx1.rect(0, 0, canvasWidth, canvasHeight);
    ctx1.fillStyle = "black";
    ctx1.fill();
    ctx1.globalAlpha = 1;
    ctx1.font = "50px Arial";
    ctx1.fillStyle = "white";
    ctx1.textAlign = "center";
    ctx1.fillText("Machine does not support the Model", canvasWidth / 2, .5 * canvasHeight - 50);
    console.warn("Machine does not support the Model")
}

got_button = false

function checkSquat(c) {
    let up, down, progress, a, b;
    if (c[27].visibility > .2 && c[28].visibility > .2) {
        a = find_angle(c[24], c[26], c[28]);
        b = find_angle(c[23], c[25], c[27]);
        if (a >= 170 && b >= 170) {
            up = true;
            progress = false;
        } else if (a <= 140 && b <= 140 && a >= 50 && b >= 50) {
            down = true;
            up = false;
            progress = false;
        } else {
            progress = true
        }
    }
    return [up, down, progress, a, b]
}

function draw(a, b, c) {
    let connections = [
        [0, 1],
        [1, 3],
        [2, 3],
        [3, 5],
        [5, 7],
        [0, 2],
        [2, 4],
        [4, 6]
    ];
    drawConnectors(b, [c[11], c[12], c[23], c[24], c[25], c[26], c[27], c[28]], connections, {
        color: a
    });
    drawLandmarks(b, [c[11], c[12], c[23], c[24], c[25], c[26], c[27], c[28]], {
        color: a,
        fillColor: a,
        lineWidth: 4,
        radius: 6
    })
}
var minConfidence = .5;
var initialized = 0;
functionVar = 1;
fps_popup = true;
lim_limit = 20;

once =false

function send_points_in_base_file(poses) {
    start_once_in_every_loop();
    for (const pose of poses) {
        adjust_the_points(pose)
    }
    end_once_in_every_loop();
}

var show_score_at = {}

function adjust_the_points(result) {
    x_ = ctx1.canvas.width
    y_ = ctx1.canvas.height    
    converted_points = {}
    poseLandmarks = {}
    var points = result['keypoints']
    try {
        skeleton_id = result['id']
        show_score_at[skeleton_id] = [(1-(result['box']['xMax']+result['box']['xMin'])/2)*x_, ((result['box']['yMax']+result['box']['yMin'])/2)*y_]
    } catch(e) {
        skeleton_id = 1
        show_score_at[skeleton_id] = [.1 * canvasWidth, .53 * canvasHeight]
    }
    // points[i]
    poseLandmarks[0] = {
        "x" : x_ - points[0]['x'],
        "y" : points[0]['y'],
        "z" : 1,
        "visibility": 0.8
    }
    poseLandmarks[1] = {
        "x" : x_ - points[2]['x'],
        "y" : points[2]['y'],
        "z" : 1,
        "visibility":  0.8
    }//1
    poseLandmarks[2] = poseLandmarks[1]
    poseLandmarks[3] = poseLandmarks[1]
    poseLandmarks[4] = {
        "x" : x_ - points[1]['x'],
        "y" : points[1]['y'],
        "z" : 1,
        "visibility":  0.8
    }//4
    poseLandmarks[5] = poseLandmarks[4]
    poseLandmarks[6] = poseLandmarks[4]

    poseLandmarks[7] = {
        "x" : x_ - points[4]['x'],
        "y" : points[4]['y'],
        "z" : 1,
        "visibility":  0.8
    }//7
    poseLandmarks[8] = {
        "x" : x_ - points[3]['x'],
        "y" : points[3]['y'],
        "z" : 1,
        "visibility": 0.8
    }//8

    poseLandmarks[9] = poseLandmarks[0]
    poseLandmarks[10] = poseLandmarks[0]

    poseLandmarks[11] = {
        "x" : x_ - points[6]['x'],
        "y" : points[6]['y'],
        "z" : 1,
        "visibility": 0.8
    }//11
    poseLandmarks[12] = {
        "x" : x_ - points[5]['x'],
        "y" : points[5]['y'],
        "z" : 1,
        "visibility": 0.8
    }//12

    poseLandmarks[13] = {
        "x" : x_ - points[8]['x'],
        "y" : points[8]['y'],
        "z" : 1,
        "visibility": 0.8
    }//13
    poseLandmarks[14] = {
        "x" : x_ - points[7]['x'],
        "y" : points[7]['y'],
        "z" : 1,
        "visibility": 0.8
    }//14


    poseLandmarks[15] = {
        "x" : x_ - points[10]['x'],
        "y" : points[10]['y'],
        "z" : 1,
        "visibility": 0.8
    }//15
    poseLandmarks[16] = {
        "x" : x_ - points[9]['x'],
        "y" : points[9]['y'],
        "z" : 1,
        "visibility": 0.8
    }//16

    poseLandmarks[17] =poseLandmarks[15]
    poseLandmarks[18] = poseLandmarks[16]
    poseLandmarks[19] = poseLandmarks[15]
    poseLandmarks[20] = poseLandmarks[16]
    poseLandmarks[21] = poseLandmarks[15]
    poseLandmarks[22] = poseLandmarks[16]
    poseLandmarks[23] = {
        "x" : x_ - points[12]['x'],
        "y" : points[12]['y'],
        "z" : 1,
        "visibility":  0.8
    }//23
    poseLandmarks[24] = {
        "x" : x_ - points[11]['x'],
        "y" : points[11]['y'],
        "z" : 1,
        "visibility":  0.8
    }//24
    poseLandmarks[25] = {
        "x" : x_ - points[14]['x'],
        "y" : points[14]['y'],
        "z" : 1,
        "visibility":  0.8
    }//25
    poseLandmarks[26] = {
        "x" : x_ - points[13]['x'],
        "y" : points[13]['y'],
        "z" : 1,
        "visibility":  0.8
    }//26
    poseLandmarks[27] = {
        "x" : x_ - points[16]['x'],
        "y" : points[16]['y'],
        "z" : 1,
        "visibility": 0.8
    }//27
    poseLandmarks[28] = {
        "x" : x_ - points[15]['x'],
        "y" : points[15]['y'],
        "z" : 1,
        "visibility": 0.8
    }//28

    poseLandmarks[29] = poseLandmarks[27]
    poseLandmarks[30] = poseLandmarks[28]
    poseLandmarks[31] = poseLandmarks[27]
    poseLandmarks[32] = poseLandmarks[28]

    converted_points['poseLandmarks'] = poseLandmarks
    onResults(converted_points, skeleton_id)    
}

function start_once_in_every_loop() {
    fr += 1;
    var b = new Date;
    fps = 1e3 / (b - lastLoop);
    console.log("this is fps: " + fps);
    lastLoop = b;
    lim++
    $("#id_display_data").css({
        width: ctx1.canvas.width,
        height:ctx1.canvas.height,
        display: "block",
        top: 0,
        left: 0,
    }).removeClass("d-none");
    $("#id_canvas_img").css({
        position: "absolute",
        width: ctx1.canvas.width,
        height: ctx1.canvas.height,
        display: "block",
        top: 0,
        left: 0,
    });
    // $("#id_top_data").css({
    //     height: ctx1.canvas.width * .08
    // });
    // $("#id_bottom_data").css({
    //     height: ctx1.canvas.width * .08
    // })
    if (fps < min_fps && lim >= lim_limit && fps_popup) {
        $("#id_show_fps").html(fps.toFixed(2));
        $("#id_show_min_fps").html(min_fps.toFixed(2));
        $("#id_show_low_fps_warning").trigger("click");
        fps_popup = false
    }
    ctx1.save();
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.save();
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    the_yellow_lines(5);
}


function end_once_in_every_loop() {
    calculate_time()
    // intensity = Math.round(m / l);
    if (isNaN(intensity)) {
        intensity = 0
    }
    show_data_and_load_next_exercise();
    rest_sign();
    ctx1.restore();
    ctx2.restore();
}

function onResults(a, skeleton_id) {
    x_value = 0.2
    drawLandmarks(ctx2, [a.poseLandmarks[11], a.poseLandmarks[12], a.poseLandmarks[13], a.poseLandmarks[14], a.poseLandmarks[15], a.poseLandmarks[16], a.poseLandmarks[23], a.poseLandmarks[24], a.poseLandmarks[25], a.poseLandmarks[26], a.poseLandmarks[27], a.poseLandmarks[28]], {
        color: "white",
        fillColor: "red",
        lineWidth: 20 * x_value,
        radius: 21 * x_value
    })
    try {
        var c = a.poseLandmarks[0].x;
        var d = a.poseLandmarks[0].y - 2 * Math.abs(a.poseLandmarks[7].x - a.poseLandmarks[8].x);
        var e = (a.poseLandmarks[23].x + a.poseLandmarks[24].x) / 2;
        var f = a.poseLandmarks[23].y;
        a.poseLandmarks.push({
            x: c,
            y: d
        });
        a.poseLandmarks.push({
            x: e,
            y: f
        })
    } catch (err) {}
    try {
        Exercise(a, skeleton_id)
    } catch(e) {
        console.info(e)
    }
}

