
var progress = {};
var a = {};
var b = {};
var s = true;
bump = new Audio(getStaticFile("media/gamebump.mp3"));

one = new Audio(getStaticFile("media/1.mp3" ));
two = new Audio(getStaticFile("media/2.mp3" ));
three = new Audio(getStaticFile("media/3.mp3" ));
great = [
    new Audio(getStaticFile("media/motivation/1.mp3" )),
    new Audio(getStaticFile("media/motivation/2.mp3" )),
    new Audio(getStaticFile("media/motivation/3.mp3" )),
    new Audio(getStaticFile("media/motivation/4.mp3" )),
    new Audio(getStaticFile("media/motivation/5.mp3" )),
    new Audio(getStaticFile("media/motivation/6.mp3" )),
    new Audio(getStaticFile("media/motivation/7.mp3" )),
    new Audio(getStaticFile("media/motivation/8.mp3" )),
    new Audio(getStaticFile("media/motivation/9.mp3" )),
    new Audio(getStaticFile("media/motivation/10.mp3" )),
]
var user_count = {}
count = 0

function play(count) {
    if(count == 1) {
        one.play();
    } else if (count == 2) {
        two.play();
    } else if (count == 3) {
        three.play();
    } else if(count % 6 == 0) {
        great[Math.floor(Math.random()*great.length)].play();
    } 
}

up = {}
down = {}
function Exercise(c, skeleton_id) {
    if(down[skeleton_id] == undefined) {
        down[skeleton_id] = false;             
        up[skeleton_id] = false;  
        a[skeleton_id] = 0           
        b[skeleton_id] = 0     
        progress[skeleton_id] = true;     
        user_count[skeleton_id] = 0; 
    }
    var poses = c.poseLandmarks;
    if (up[skeleton_id] && down[skeleton_id]) {
        user_count[skeleton_id]++; 
        bump.play();
        play(user_count[skeleton_id]);
        up[skeleton_id] = false;
        down[skeleton_id] = false
    }

    let color = progress[skeleton_id] ? "red" : up[skeleton_id] ? "white" : down[skeleton_id] ? "#00ff00" : "red";
    draw(color, ctx2, poses);
    var res = checkSquat(poses);
    up[skeleton_id] = res[0] == undefined ? up[skeleton_id] : res[0];
    down[skeleton_id] = res[1] == undefined ? down[skeleton_id] : res[1];
    progress[skeleton_id] = res[2] == undefined ? down[skeleton_id] : res[2];
    a[skeleton_id] = res[3] == undefined ? down[skeleton_id] : res[3];
    b[skeleton_id] = res[4] == undefined ? down[skeleton_id] : res[4];
    let arru = new Image;
    arru.src = getStaticFile("media/arrow-up.png");
    let size = canvasWidth * 80 / 720;
    ctx2.beginPath();
    ctx2.rect(.72 * canvasWidth, .25 * canvasHeight, .2 * canvasWidth, .14 * canvasHeight);
    ctx2.globalAlpha = up[skeleton_id] ? 0 : .6;
    ctx2.fillStyle = "black";
    ctx2.fill();
    ctx2.closePath();
    ctx2.beginPath();
    ctx2.globalAlpha = up[skeleton_id] ? .1 : 1;
    ctx2.fillStyle = up[skeleton_id] ? "black" : "#F7EF16";
    ctx2.drawImage(arru, .76 * canvasWidth, .05 * canvasHeight, size, size);
    ctx2.font = Math.floor(canvasWidth * 40 / 720) + "px russon one regular";
    ctx2.fillText("UP", .78 * canvasWidth, .35 * canvasHeight);
    ctx2.closePath();
    let arrd = new Image;
    arrd.src = getStaticFile("media/arrow-down.png");
    ctx2.rect(.72 * canvasWidth, .43 * canvasHeight, .2 * canvasWidth, .14 * canvasHeight);
    ctx2.globalAlpha = up[skeleton_id] ? .6 : 0;
    ctx2.fillStyle = "black";
    ctx2.fill();
    ctx2.closePath();
    ctx2.font = Math.floor(canvasWidth * 40 / 720) + "px russon one regular";
    ctx2.globalAlpha = up[skeleton_id] ? 1 : .1;
    ctx2.fillStyle = up[skeleton_id] ? "#F7EF16" : "black";
    ctx2.fillText("SQUAT", .74 * canvasWidth, .53 * canvasHeight);
    ctx2.globalAlpha = 1;
    ctx2.fillStyle = "#F7EF16";
    ctx2.font = Math.floor(canvasWidth * 50 / 720) + "px russon one regular";
    ctx2.fillText(user_count[skeleton_id], show_score_at[skeleton_id][0], show_score_at[skeleton_id][1]);        
    ctx2.drawImage(arrd, .76 * canvasWidth, .54 * canvasHeight, size, size)
}