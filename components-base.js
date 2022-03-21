var canvas1 = document.getElementById("output1");
var ctx1 = canvas1.getContext("2d");
var canvas2 = document.getElementById("output2");
var ctx2 = canvas2.getContext("2d");
var time, intensity;
var reverse_time;
var last_time = 0;
var last_activity = 0;
var last_count = 0;
var timer = 0;
var count_before_pause = 0,
    activity_before_pause = 0;
var audio_gbbtl = true;
var audio_gbbtl_again = true;
var audio_comeon = true,
    audio_great_start = true;
var start_counting = 0;
next_beep_at = 0;
first_beep = true;

function align_div_sizes_with_canvas() {
    $("#id_display_data").css({
        // top: $("#output2").position().top,
        // left: $("#output2").position().left,
        position: "absolute",
        width: ctx1.canvas.width,
        height:ctx1.canvas.height,
        display: "block"
    }).removeClass("d-none");
    $("#id_canvas_img").css({
        // top: $("#output2").position().top,
        // left: $("#output2").position().left,
        position: "absolute",
        width: ctx1.canvas.width,
        height: ctx1.canvas.height,
        display: "block"
    });
    $("#id_top_data").css({
        height: ctx1.canvas.width * .08
    });
    $("#id_bottom_data").css({
        height: ctx1.canvas.width * .08
    })
}
var modal_loaded = false;

function get_between_the_lines() {
    if (audio_gbbtl) {
        send_model_loading_time();
        console.log("send_model_loading_time");
        audio_gbbtl = false;
        modal_loaded = true;
        get_between_the_line_audio();
        $("#id_get_between_line_img").show();
        $("#id_loading_icon").hide();
        $("#id_full_screen_model").modal()
    }
}
var blue_box_timer;

function get_between_the_line_audio() {
}
var line_gradient_left = true;
var gradient_position = 0;

function the_yellow_lines(a) {
    var b = ctx2.createLinearGradient(0, 0, canvasWidth, 0);
    if (line_gradient_left) {
        gradient_position += .01;
        if (gradient_position > 1) {
            gradient_position = 1;
            line_gradient_left = false
        }
    } else {
        gradient_position -= .01;
        if (gradient_position < 0) {
            gradient_position = 0;
            line_gradient_left = true
        }
    }
    b.addColorStop(0, "#83FF78");
    b.addColorStop(gradient_position, "#A8EB12");
    b.addColorStop(1, "#83FF78");
    ctx2.beginPath();
    ctx2.moveTo(0, canvasHeight * .9);
    ctx2.lineTo(canvasWidth, canvasHeight * .9);
    ctx2.lineWidth = a;
    ctx2.strokeStyle = b;
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.moveTo(0, canvasHeight * .1);
    ctx2.lineTo(canvasWidth, canvasHeight * .1);
    ctx2.lineWidth = a;
    ctx2.strokeStyle = b;
    ctx2.stroke()
}

function user_is_between_the_lines() {
    clearTimeout(blue_box_timer);
    $("#id_exercise_detail").addClass("data_display").html("").animate({
        top: "50%",
        left: "50%",
        opacity: "1",
        width: "60%",
        height: "60%"
    }, 0);
    load_next_exercise();
    pause_all_audios();
    update_session_status();
    $("#id_get_between_line_img").hide();
    $("#id_display_data").removeClass("d-none");
    $(".data_display").show();
    timer = 1
}

show_loading_for_timer = false
function calculate_time() {
    if (timer == 1) {
    	if(!exercise_duration) {
    		if(!show_loading_for_timer) {
	    		$("#id_show_exercise_duration").html("<span class='spinner-border'></span>")
	    		show_loading_for_timer = true;
                total_loading_timer_count = new Date().getTime();
    		}
    		return ;
    	}
        if (start_counting == 0) {
            var d = new Date;
            initial_time = d.getTime();
            start_counting = 1
            try {
                var x = (initial_time - total_loading_timer_count)/1000
                console.error("First exercise Files loaded in = "+x+"s")
            } catch(e) {}
        } else {
            if (on_focus && !on_pause) {
                var d = new Date;
                if(total_pause_time == undefined) {
                    total_pause_time = 0
                }
                time = d.getTime() - initial_time - total_pause_time;
                time = Math.floor(time / 1e3);
                $("#id_show_workout_timer").html(time % 60 < 10 ? Math.floor(time / 60) + ":0" + time % 60 : Math.floor(time / 60) + ":" + time % 60);
                if(last_time == undefined) {
                    last_time = time;
                }
                if (exercise_duration != 0) {
                    exerciser_reverse_time = exercise_duration - time + last_time;
                    $("#id_show_exercise_duration").html(exerciser_reverse_time % 60 < 10 ? Math.floor(exerciser_reverse_time / 60) + ":0" + exerciser_reverse_time % 60 : Math.floor(exerciser_reverse_time / 60) + ":" + exerciser_reverse_time % 60);
                    exerciser_reverse_time_percent = exerciser_reverse_time / exercise_duration * 100;
                    $("#id_exercise_time").css("width", exerciser_reverse_time_percent + "%")
                } else {
                    $("#id_show_exercise_duration").html("Target: " + next_exercise_target)
                }
                play_bg_music();
                if (show_rest_sign || exercise_duration == 0 || !show_rest_sign && rest % 2 != 0) {} else if (exerciser_reverse_time <= 5) {
                    if (first_beep) {
                        next_beep_at = exerciser_reverse_time - 1;
                        first_beep = false
                    } else if (next_beep_at == exerciser_reverse_time) {
                        next_beep_at = exerciser_reverse_time - 1
                    }
                } else if (exerciser_reverse_time == 10 && document.getElementById("id_audio_last_10_seconds").paused) {
                }
            } else {
                count = count_before_pause;
                total_activity = activity_before_pause;
                rest_sign()
            }
        }
    }
}

function show_data_and_load_next_exercise() {
    $("#id_show_count").html(count);
    $("#id_show_activity_meter").html(total_activity);
    if (intensity >= 0 && intensity <= 4) {
        $("#id_power").css("width", intensity * 10 + "%").removeClass("bg-success").removeClass("bg-warning").addClass("bg-danger")
    } else if (intensity > 4 && intensity <= 7) {
        $("#id_power").css("width", intensity * 10 + "%").removeClass("bg-success").addClass("bg-warning").removeClass("bg-danger")
    } else {
        $("#id_power").css("width", intensity * 10 + "%").addClass("bg-success").removeClass("bg-warning").removeClass("bg-danger")
    }
    
}

function rest_sign() {
    if (show_rest_sign) {
        ctx1.beginPath();
        ctx1.globalAlpha = .5;
        ctx1.rect(0, 0, canvasWidth, canvasHeight);
        ctx1.fillStyle = "black";
        ctx1.globalAlpha = .5;
        ctx1.rect(0, 0, canvasWidth, .09 * canvasHeight);
        ctx1.fillStyle = "black";
        ctx1.fill();
        ctx1.globalAlpha = 1;
        ctx1.font = "50px Arial";
        ctx1.fillStyle = "white";
        ctx1.textAlign = "center";
        ctx1.fillText("Continue to be within lines", canvasWidth / 2, .07 * canvasHeight);
        $("#id_power").css("width", "0");
        $("#id_show_count").html("-");
        last_activity = total_activity;
        last_count = count;
        pause_bg_music_without_animation()
    } else if (!show_rest_sign && rest % 2 != 0) {
        ctx1.beginPath();
        ctx1.globalAlpha = .5;
        ctx1.rect(0, 0, canvasWidth, canvasHeight);
        ctx1.fillStyle = "black";
        $("#id_power").css("width", "0");
        $("#id_show_count").html("-");
        last_activity = total_activity;
        last_count = count;
        ctx1.fill();
        pause_bg_music_without_animation()
    } else if (!(on_focus && !on_pause)) {
        ctx1.beginPath();
        ctx1.globalAlpha = .8;
        ctx1.rect(0, 0, canvasWidth, canvasHeight);
        ctx1.fillStyle = "black";
        ctx1.fill();
        ctx1.globalAlpha = 1;
        ctx1.font = "50px Arial";
        ctx1.fillStyle = "white";
        ctx1.textAlign = "center";
        ctx1.fillText("PAUSED...", canvasWidth / 2, .2 * canvasHeight);
        ctx1.font = "40px Arial";
        ctx1.fillText("To RESUME, click on the play button at bottom of screen.", canvasWidth / 2, .3 * canvasHeight);
        pause_bg_music_without_animation()
    }
}
skelton_info_saving = true;

function save_skelton_info(b) {
    skelton = b.poseLandmarks[0].x + "," + b.poseLandmarks[0].y + "@" + b.poseLandmarks[11].x + "," + b.poseLandmarks[11].y + "@" + b.poseLandmarks[12].x + "," + b.poseLandmarks[12].y + "@" + b.poseLandmarks[23].x + "," + b.poseLandmarks[23].y + "@" + b.poseLandmarks[24].x + "," + b.poseLandmarks[24].y + "@" + b.poseLandmarks[27].x + "," + b.poseLandmarks[27].y + "@" + b.poseLandmarks[28].x + "," + b.poseLandmarks[28].y;
    $.ajax({
        type: "post",
        url: "/solo/save_skelton_info",
        data: {
            session_id: session_id,
            skelton: skelton,
            csrfmiddlewaretoken: csrf
        },
        success: function (a) {
            if (a == "1") {
                if (skelton_info_saving) {
                    // console.log("S1");
                    skelton_info_saving = false
                }
            } else {
                // console.error("S0")
            }
        }
    })
}