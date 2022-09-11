function get_id(idlist){ 
    return idlist.split(',');
}

function check_radio(sid, tid){ //选择单选题某一选项时触发
    document.getElementById(sid).checked = true;
    var oid = get_id(document.getElementById(tid).getAttribute("idlist"));
    for(var id of oid){
        iid = document.getElementById(id).getAttribute("in_id");
        if(iid !== sid){
            document.getElementById(iid).checked = false;
        }
    }
}
/*
 * 选择题文本示例：
 * "id=abc,type=radio,body=[Who is the most beautiful woman?],options=[A.Queen][B.Snowwhite],checked=abc_a"
 * 选项id表示为 选择题id+"_"+选项序号(A,B,C,...)
 */

// tid、body、type已预先在总函数中执行
function unparse_radio(tid){ //将单选题结果处理成文本
    var oid = get_id(document.getElementById(tid).getAttribute("idlist"));
    var checked = "";
    var opt_body = "options=";
    for(var id of oid){ //oid内包含：input与text(选项内容)
        var in_id = document.getElementById(id).getAttribute("in_id");
        var ob_id = document.getElementById(id).getAttribute("ob_id");
        opt_body += "["+document.getElementById(ob_id).innerHTML + "]";
        if(document.getElementById(in_id).checked == true){
            checked = "checked="+id;
        }
    }
    return opt_body+","+checked;
}

function check_checkbox(sid){
    document.getElementById(sid).checked = true;
}

function unparse_checkbox(tid){
    var oid = get_id(document.getElementById(tid).getAttribute("idlist"));
    var checked = "checked=";
    var opt_body = "options=";
    for(var id of oid){
        var in_id = document.getElementById(id).getAttribute("in_id");
        var ob_id = document.getElementById(id).getAttribute("ob_id");
        opt_body += "["+document.getElementById(ob_id).innerHTML + "]";
        if(document.getElementById(in_id).checked == true){
            checked += "["+id+"]"
        }
    }
    return opt_body+","+checked;
}

function addListener(sid, wid){
    var sliderEl = document.querySelector("#"+sid);
    var selectedEl = document.querySelector("#"+wid);
    
    sliderEl.addEventListener("change", () => { //根据滑块值修改填写值
        selectedEl.value = sliderEl.value;
    });
    selectedEl.addEventListener("change", () =>{ //根据输入修改滑块值
        sliderEl.value = selectedEl.value;  
    })
}
/*
function send(){
    var aa = selectedEl;
    window.location.href="reviewfield.php?data="+aa;
}
*/
/*
oid: list
*/
function get_sum(oid, tid){ //得到除了tid以外的所有选项的值
    var sum = 0;
    for(var id of oid){
        id = document.getElementById(id).getAttribute("sid");
        if(id !== tid){
            var weight = parseInt(document.getElementById(id).value);
            sum += weight;
        }
    }
    if(sum > 100) {
        console.error("Error: The total weight must be 100");
        return false;
    }
    return sum;
}

function set_max(oid, tid){  //控制每个滑动条的最大值
    return 100 - get_sum(oid, tid);
}

/*
tid: textspace id（滑动条左侧显示数据） 
*/
function keep_value(tid, maxval){ //控制滑动条不超过最大值 
    if(document.getElementById(tid).value > maxval){
        document.getElementById(tid).value = maxval;
        var wid = document.getElementById(tid).getAttribute("wid");
        document.getElementById(wid).value = maxval;
    }
}

/*
新项目
*/
function keep_value_weight(tid, maxval){ //控制填空不超过最大值 
    if(document.getElementById(tid).value > maxval){
        document.getElementById(tid).value = maxval;
        var sid = document.getElementById(tid).getAttribute("sid");
        document.getElementById(sid).value = maxval;
    }
}

function auto_selected(oid){ //剩余一项未填时，自动获取该项值
    var cnt_zero = 0;
    var zero_id;
    for(var id of oid){
        id = document.getElementById(id).getAttribute("sid");
        if(document.getElementById(id).value == 0){
            cnt_zero += 1;
            zero_id = id;
        }
    }
    if(cnt_zero == 1){
        var autoval = set_max(oid, zero_id);
        document.getElementById(zero_id).value = autoval;
        var wid = document.getElementById(zero_id).getAttribute("wid");
        document.getElementById(wid).value = autoval;
    }
}

function check_sum(oid){ //检查总和是否为100
    var sum = 0;
    for(var id of oid){
        id = document.getElementById(id).getAttribute("sid");
        sum += parseInt(document.getElementById(id).value);
    }
    if(sum !== 100){
        return false;
    }
    return true;
}

/*
tid: 问题id
lid: slider下方一行显示报错log
*/
function check(tid){  //提交前/作答完成后检查
    var oid = get_id(document.getElementById(tid).getAttribute("idlist"));
    var lid = document.getElementById(tid).getAttribute("logid");
    if(!check_sum(oid)){
        document.getElementById(lid).innerHTML = "Error: sum of weight must be 100.";
        document.getElementById(lid).style.color = "#f53b57";
        return false;
    }
    document.getElementById(lid).innerHTML = "OK.";
    document.getElementById(lid).style.color = "#00c957";
    return true;
}

function process_slider(idlist, tid){
    var oid = get_id(idlist);
    keep_value(tid, set_max(oid, tid));
    auto_selected(oid);
}

function process_weight(idlist, tid){
    var oid = get_id(idlist);
    keep_value_weight(tid, set_max(oid, tid));
}

function reset(tid){ //重设问题值
    var oid = get_id(idlist);
    var log_id = document.getElementById(tid).getAttribute("logid");
    for(var id of oid){
        id = document.getElementById(id).getAttribute("sid");
        document.getElementById(id).value = 0;
        var wid = document.getElementById(id).getAttribute("wid");
        document.getElementById(wid).value = 0;
    }
    document.getElementById(log_id).innerHTML = "";
}

function unparse_slider(tid){
    var oid = get_id(document.getElementById(tid).getAttribute("idlist"));
    var opt_body = "options=";
    var score = "scores=";
    for (var id of oid){
        var body_id = document.getElementById(id).getAttribute("bid");
        var slider_id = document.getElementById(id).getAttribute("sid");
        opt_body += "[" + document.getElementById(body_id).innerHTML + "]";
        score += "[" + document.getElementById(slider_id).value + "]";
    }
    return opt_body + "," + score;
}

function unparse_text(tid){
    var sid = document.getElementById(tid).getAttribute("text_id");
    var text = "["+document.getElementById(sid).value+"]";
    return "text="+text;
}

/* 检查必填题 */
function check_nec(id, type, nec){
    if(nec == "false"){
        return true;
    }
    switch(type){
        case "radio": {
            let cnt = 0;
            oid = get_id(document.getElementById(id).getAttribute("idlist"));
            for(var sid of oid){
                if(document.getElementById(document.getElementById(sid).getAttribute("in_id")).checked == true){
                    cnt += 1;
                }
            }
            if(cnt == 1) return true;
            return false;
        }
        case "slider": {
            return true;
        }
        case "checkbox": {
            let cnt = 0;
            oid = get_id(document.getElementById(id).getAttribute("idlist"));
            for(var sid of oid){
                if(document.getElementById(document.getElementById(sid).getAttribute("in_id")).checked == true){
                    cnt += 1;
                }
            }
            if(cnt > 0) return true;
            return false;
        }
        case "text": {
            var sid = document.getElementById(id).getAttribute("text_id");
            if(document.getElementById(sid).value == "")
                return false;
            return true;
        }
        default: {
            return true;
        }
    }
}

function unparse(subid){ //总unparse函数
    var listid = get_id(document.getElementById(subid).getAttribute("idlist"));
    var quest = "";
    for(var id of listid){
        if(!check_nec(id, document.getElementById(id).getAttribute("qtype")), document.getElementById(id).getAttribute("nec")){
            console.error("Please complete the form before you submit it.");
        }
        var qbody = "body=" + "[" + document.getElementById(id).innerHTML + "]";
        var qtype = "type=" + document.getElementById(id).getAttribute("qtype"); 
        switch(qtype){
            case "type=radio":{ //对应get不同题型
                qdetail = unparse_radio(id);
                break;
            }
            case "type=checkbox":{
                qdetail = unparse_checkbox(id);
                break;
            }
            case "type=slider":{
                if(!check(id)){
                    qdetail = null;
                    if(document.getElementById(id).getAttribute("nec") == "true")
                        console.error("Sum of sliders must be 100. Please check your answer.");
                }
                else
                    qdetail = unparse_slider(id);
                break;
            }
            case "type=text":{
                qdetail = unparse_text(id);
                break;
            }
            default:{
                qdetail = "default";
            }
        } // "###"标识着一个问题的开始
        quest += "###" + qbody + "," + qtype + "," + qdetail + "\n";
    }
    return quest;
}

// Implements on demo

document.getElementById("radio_1_a_in").onclick = function(){
    check_radio("radio_1_a_in", "radio_1");
}

document.getElementById("radio_1_b_in").onclick = function(){
    check_radio("radio_1_b_in", "radio_1");
}

document.getElementById("radio_1_c_in").onclick = function(){
    check_radio("radio_1_c_in", "radio_1");
}

addListener("slider_1_a_slider", "slider_1_a_weight");
addListener("slider_1_b_slider", "slider_1_b_weight");
addListener("slider_1_c_slider", "slider_1_c_weight");

var idlist = document.getElementById("slider_1").getAttribute("idlist");

document.getElementById("slider_1_a_slider").onchange = function(){
    process_slider(idlist,"slider_1_a_slider");
}

document.getElementById("slider_1_b_slider").onchange = function(){
    process_slider(idlist,"slider_1_b_slider");
}

document.getElementById("slider_1_c_slider").onchange = function(){
    process_slider(idlist,"slider_1_c_slider");
}

document.getElementById("slider_1_a_weight").onchange = function(){
    process_weight(idlist,"slider_1_a_weight");
}

document.getElementById("slider_1_b_weight").onchange = function(){
    process_weight(idlist,"slider_1_b_weight");
}

document.getElementById("slider_1_c_weight").onchange = function(){
    process_weight(idlist,"slider_1_c_weight");
}

document.getElementById("check").onclick = function(){
    check("slider_1");
}

document.getElementById("reset").onclick = function(){
    reset("slider_1");
}

document.getElementById("checkbox_1_a_in").onclick = function(){
    check_checkbox("checkbox_1_a_in");
}

document.getElementById("checkbox_1_b_in").onclick = function(){
    check_checkbox("checkbox_1_b_in");
}

document.getElementById("checkbox_1_c_in").onclick = function(){
    check_checkbox("checkbox_1_c_in");
}

document.getElementById("submit").onclick = function(){
    console.log(unparse("submit"));
}
