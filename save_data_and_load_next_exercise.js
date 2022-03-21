var loaded_exercise = 0,
    sequence, rest = 2,
    show_rest_sign = false;
var rest_duration = 10;
var exercise_gif_disappear = false;
var save_data_on_unload = true;
var go_for_dashboard = false,
    go_to_workout_list = false;
var next_exercise_duration, next_exercise_name, next_exercise_target;
var next_exercise_rest = rest_duration;
$("#full_screen_popup").trigger("click");
$(window).bind("beforeunload", function () {
    if (save_data_on_unload) {
        update_session_status();
        save_data_for_exercise(true)
    }
});

function end_workout() {
    $(":button").prop("disabled", true);
    save_data_on_unload = false;
    save_data_for_exercise(false);
    go_for_dashboard = true;
    update_session_status()
}

function go_back() {
    $(":button").prop("disabled", true);
    save_data_on_unload = false;
    go_to_workout_list = true;
    save_data_for_exercise(false);
    update_session_status()
}


function load_first_exercise() {
}




function load_first_exercise_() {
    $("#id_exercise_detail").load(url = "/solo/next_workout_exercise", data = {
        workout_id: workout_id,
        sequence: first_exercise_sequence - 1,
        csrfmiddlewaretoken: csrf
    }, function (a, b, c) {
        if (b == "success") {
 	        console.log("first exercise is loaded");
	        load_rest();
	    }
	    if (b == "error") {
		    console.error("Error while loading the first exercise")
	        console.error("Error: " + c.status + ": " + c.statusText)
	        console.log("load first exercise again")
	        load_first_exercise()
	    }
    })
}

function load_next_exercise() {
    if (rest % 2 == 0) {
        if (loaded_exercise == 0) {
            load_first_exercise();
            rest++
        } else {
            save_data_for_exercise(false);
            if (loaded_exercise == total_exercise_in_workout) {
                count = 0;
                count_before_pause = 0;
                $("body").append("<script> function Exercise(results) {return 1}<\/script>");
                workout_end_content()
            } else {
                load_rest();
                rest++;
                show_rest_sign = true
            }
        }
    } else {
        rest++;
        show_rest_sign = false;
        last_time = time;
        exercise_duration = next_exercise_duration;
        if (exercise_duration == 0) {
            first_beep = false
        } else {
            $("#id_show_exercise_duration").show();
            first_beep = true
        }
        $("#id_exercise_name").html(next_exercise_name);
        $("#id_show_exercise_duration").html(next_exercise_duration);
        try {
            rest_duration = next_exercise_rest;
            console.log("Next exercise rest duration: " + rest_duration);
            var a = document.createElement("script");
            a.type = "application/javascript";
            a.src = exercise_js;
            document.getElementById("id_add_script_here").appendChild(a);
            a.onload = function () {
                if (exercise_gif_disappear) {
                    $("#id_exercise_gif").hide();
                    $("#id_exercise_detail").css("border-width", "0")
                } else {
                    $("#id_exercise_detail").animate({
                        top: "32%",
                        left: "10%",
                        opacity: "0.9",
                        width: "20%",
                        height: "30%",
                        "border-width": "2px"
                    }, 500)
                }
                start_exercise_audio()
            }
        } catch (err) {
            if (exercise_gif_disappear) {
                $("#id_exercise_gif").hide();
                $("#id_exercise_detail").css("border-width", "0")
            } else {
                $("#id_exercise_detail").animate({
                    top: "32%",
                    left: "10%",
                    opacity: "0.9",
                    width: "20%",
                    height: "30%",
                    "border-width": "2px"
                }, 500)
            }
            start_exercise_audio()
        }
        go_for_animation = store_the_animation_value;
        console.log("Update the go for go_for_animation: " + go_for_animation)
    }
}

function save_data_for_exercise(b) {
    exercise_gif_disappear = false;
    console.log("gif_disappear is: " + exercise_gif_disappear);
    if (typeof time === "undefined") {
        time = 0
    }
    if (typeof count === "undefined") {
        count = 0
    }
    if (typeof total_activity === "undefined") {
        total_activity = 0
    }
    user_duration = time - last_time;
    user_count = count;
    user_activity = total_activity - last_activity;
    last_activity = total_activity;
    last_time = time;
    count = 0;
    last_count = count;
   
}

function load_rest() {
    if (loaded_exercise != 0) {
        $("body").append("<script> function Exercise(results) {return }<\/script>");
        load_next_js();
        document.getElementById("id_audio_5_seconds_rest").play();
        console.log("5 sec rest.");
        pause_bg_music()
    }
    exercise_duration = rest_duration;
    go_for_animation = false;
    console.log(exercise_duration);
    loaded_exercise++;
    if (loaded_exercise == total_exercise_in_workout) {
        $("#id_repeat_workout_btn").show()
    } else {
        $("#id_repeat_workout_btn").hide()
    }
    if (loaded_exercise > 1) {
        $("#id_prev_exercise_btn").show()
    } else {
        $("#id_prev_exercise_btn").hide()
    }
}
var loading_time = 0;

function send_model_loading_time() {

}
doning_recommended_exercise = true;

function update_session_status() {
    
}