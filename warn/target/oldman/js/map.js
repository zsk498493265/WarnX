/**
 * 本地图的数据 都是实时更新  新添加 街道、房屋标注  其他相关的统计信息都实时更新  不用刷新页面
 * 房屋状态的改变 由后台推送至前台 进行实时更新 不用刷新页面
 * Created by netlab606 on 2017/7/7.
 */

//alert
//这个方法用来启动该页面的ReverseAjax功能
dwr.engine.setActiveReverseAjax(true);
//设置在页面关闭时，通知服务端销毁会话
dwr.engine.setNotifyServerOnPageUnload(true);

/**
 * 存储新建的标注的信息
 */
//房屋信息
var indexOwn;//标注的样式的索引
var xOwn,yOwn;//标注的坐标
// var oidOwn;//老人编号
var jidOwn;//街道编号

//街道信息
var jNameOwn;//街道名称
var qidOwn;//区编号


var Sum={'sum':0,'greenSum':0,'yellowSum':0,'redSum':0,'district':[]};//存储 统计信息

var preZoom;//用于存储 上一个 地图级别  避免重复取数据


var selectStreet=[];//存储添加标注时  街道的选择  实时更新
var selectDistrict=[];//存储添加标注时  区的选择  实时更新
// var selectOldMan=[];//存储添加标注时  人员的选择  实时更新

//warn
var oldName,oldId,oldAddress,oldPhone;
function warn2(data){
    // getNoReadSum();
    //紧急报警
    if(data.type=="urgency"){
        var wdid=data.id;
        var urgencyMessage="<div class='eauip'><span class='messageT'>报警设备信息：" +
            "</span><br><p>设备ID：<span class='messageD'>"+data.urgency.equip.eid+"</span></p>"+
            "<p>设备所在房间：<span class='messageD'>"+data.urgency.room.roomName+"</span></p></div>"+
            "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
            "老人ID：<span class='messageD'>"+data.urgency.oldMan.oid+"</span></p><p>" +
            "老人姓名：<span class='messageD'>"+ data.urgency.oldMan.oldName+"</span></p><p>" +
            "老人电话：<span class='messageD'>"+ data.urgency.oldMan.oldPhone+"</span></p><p>" +
            "老人住址：<span class='messageD'>"+ data.urgency.oldMan.oldAddress+"</span></p></div>";
        $.messager.alert('紧急报警！',urgencyMessage,'danger');
        playSound("urgency");
        oldId=data.urgency.oldMan.oid;
        oldName=data.urgency.oldMan.oldName;
        oldPhone=data.urgency.oldMan.oldPhone;
        oldAddress=data.urgency.oldMan.oldAddress;
    }else if(data.type=="gatewayDown"){
        var downid=data.downid;
        //网关故障
        var gatewayDownMessage="<div class='eauip'><span class='messageT'>网关故障信息：" +
            "</span><br><p>网关：<span class='messageD'>"+data.oldMan.gatewayID+"</span></p></div>"+
            "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
            "老人ID：<span class='messageD'>"+data.oldMan.oid+"</span></p><p>" +
            "老人姓名：<span class='messageD'>"+ data.oldMan.oldName+"</span></p><p>" +
            "老人电话：<span class='messageD'>"+ data.oldMan.oldPhone+"</span></p><p>" +
            "老人住址：<span class='messageD'>"+ data.oldMan.oldAddress+"</span></p></div>";
        oldId=data.oldMan.oid;
        oldName=data.oldMan.oldName;
        oldPhone=data.oldMan.oldPhone;
        oldAddress=data.oldMan.oldAddress;
        $.messager.alert('网关故障！',gatewayDownMessage,'danger',function(){
            // 该网关故障消息已读
            $.ajax({
                type: "POST",
                url: pathJs + "/downHistory/messageRead",
                dataType: "json",
                data:{
                    downid:downid
                },
                async:false,
                success: function (data) {
                    getNoReadSum();
                }
            });
        });
        playSound("urgency");
    } else if(data.type=="equipDown"){
        //设备故障
        var downid=data.downid;
        var type;
        switch(data.equipDown.type){
            case 2:
                type="温度";
                break;
            case 3:
                type="湿度";
                break;
            case 4:
                type="光强";
                break;
            default:
                break;
        }
        var gatewayDownMessage="<div class='eauip'><span class='messageT'>设备故障信息：" +
            "</span><br><p>设备ID：<span class='messageD'>"+data.equipDown.eid+"</span></p>"+
            "<p>设备种类：<span class='messageD'>"+type+"</span></p></div>"+
            "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
            "老人ID：<span class='messageD'>"+data.oldMan.oid+"</span></p><p>" +
            "老人姓名：<span class='messageD'>"+ data.oldMan.oldName+"</span></p><p>" +
            "老人电话：<span class='messageD'>"+ data.oldMan.oldPhone+"</span></p><p>" +
            "老人住址：<span class='messageD'>"+ data.oldMan.oldAddress+"</span></p></div>";
            oldId=data.oldMan.oid;
            oldName=data.oldMan.oldName;
            oldPhone=data.oldMan.oldPhone;
            oldAddress=data.oldMan.oldAddress;
        $.messager.alert('设备故障！',gatewayDownMessage,'danger',function(){
            //该网关故障消息已读
            $.ajax({
                type: "POST",
                url: pathJs + "/downHistory/messageRead",
                dataType: "json",
                data:{
                    downid:downid
                },
                async:false,
                success: function (data) {
                    getNoReadSum();
                }
            });
        });
        playSound("urgency");
    }else {
        //预警信息
        var warnMessage = "";
        var title = "";
        if (data.type == "warn_move") {
            //行为预警
            title="行为预警";
            warnMessage = "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
                "老人ID：<span class='messageD'>" + data.warn.oldMan.oid + "</span></p><p>" +
                "老人姓名：<span class='messageD'>" + data.warn.oldMan.oldName + "</span></p><p>" +
                "老人电话：<span class='messageD'>" + data.warn.oldMan.oldPhone + "</span></p><p>" +
                "老人住址：<span class='messageD'>" + data.warn.oldMan.oldAddress + "</span></p></div>" +
                "<div class='detail'><span class='messageT'>行为信息：</span><br><p>" +
                "预警级别：<span class='messageD read'>" + data.warn.warnLevel + "</span></p><p>" +
                "已经不动：<span class='messageD read'>" + data.warn.noMoveTime + " </span>分钟</p><p>" +
                "所处房间：<span class='messageD'>" + data.warn.room.roomName + "</span></p><p>" +
                "最初不动的时间：<span class='messageD'>" + data.warn.time + "</span></p><p>" +
                "是否在该房间的生活规律模型中：<span class='messageD'>" + (data.warn.inTime == 'true' ? "在<p>模型所在时间段：<span class='messageD'>" + data.warn.times + "</span></p><p>" +
                    "规律类型：<span class='messageD'>" + (data.warn.flag == "a" ? "活动" : ((data.warn.flag == "r") ? "休息" : "活动、休息")) + "</span></p>" :
                    "不在") + "</span></p></div><input name="+data.id+" type='button' value='已读' onclick='readA(event)'/>";
            oldId=data.warn.oldMan.oid;
            oldName=data.warn.oldMan.oldName;
            oldPhone=data.warn.oldMan.oldPhone;
            oldAddress=data.warn.oldMan.oldAddress;
        } else if (data.type == "warn_wendu") {
            //温度预警
            title="温度预警";
            warnMessage = "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
                "老人ID：<span class='messageD'>" + data.warn_wendu.oldMan.oid + "</span></p><p>" +
                "老人姓名：<span class='messageD'>" + data.warn_wendu.oldMan.oldName + "</span></p><p>" +
                "老人电话：<span class='messageD'>" + data.warn_wendu.oldMan.oldPhone + "</span></p><p>" +
                "老人住址：<span class='messageD'>" + data.warn_wendu.oldMan.oldAddress + "</span></p></div>" +
                "<div class='detail'><span class='messageT'>温度信息：</span><br><p>" +
                "报警房间：<span class='messageD read'>" + data.warn_wendu.threshold_wendu.room.roomName + "</span></p><p>" +
                "当前温度：<span class='messageD read'>" + data.warn_wendu.wendu + "</span></p><p>" +
                "该房间温度阈值：<span class='messageD'>" + data.warn_wendu.threshold_wendu.wThreshold + "</span></p><p></div><input name="+data.id+" type='button' value='已读' onclick='readA(event)'/>";
            oldId=data.warn_wendu.oldMan.oid;
            oldName=data.warn_wendu.oldMan.oldName;
            oldPhone=data.warn_wendu.oldMan.oldPhone;
            oldAddress=data.warn_wendu.oldMan.oldAddress;
        } else if (data.type == "warn_light") {
            //光强预警
            title="光强预警";

            warnMessage = "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
                "老人ID：<span class='messageD'>" + data.warn_light.oldMan.oid + "</span></p><p>" +
                "老人姓名：<span class='messageD'>" + data.warn_light.oldMan.oldName + "</span></p><p>" +
                "老人电话：<span class='messageD'>" + data.warn_light.oldMan.oldPhone + "</span></p><p>" +
                "老人住址：<span class='messageD'>" + data.warn_light.oldMan.oldAddress + "</span></p></div>" +
                "<div class='detail'><span class='messageT'>光强信息：</span><br><p>" +
                "报警房间：<span class='messageD read'>" + data.warn_light.threshold_light.room.roomName + "</span></p><p>" +
                "当前光强：<span class='messageD read'>" + data.warn_light.light+ "</span></p><p>" +
                "起止时间：<span class='messageD'>" + data.warn_light.time+ "</span></p><p>" +
                "当前持续时间：<span class='messageD'>" + data.warn_light.value + "</span></p><p>" +
                "该房间光强阈值：：<span class='messageD'>" + data.warn_light.threshold_light.lThreshold + "</span></p><p>" +
                "检测时间段：<span class='messageD'>" + data.warn_light.threshold_light.times + "</span></p><p></div>";
            "持续超过：<span class='messageD'>" + data.warn_light.threshold_light.continueTime + " 分钟报警</span></p><p></div><input name="+data.id+" type='button' value='已读' onclick='readA(event)'/>";
            oldId=data.warn_light.oldMan.oid;
            oldName=data.warn_light.oldMan.oldName;
            oldPhone=data.warn_light.oldMan.oldPhone;
            oldAddress=data.warn_light.oldMan.oldAddress;
        }else if(data.type=="outdoor_out"){
            //没有了  不用再进行提示了  代码先保留
            title="老人出门";
            warnMessage = "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
                "老人ID：<span class='messageD'>" + data.outdoor.oldMan.oid + "</span></p><p>" +
                "老人姓名：<span class='messageD'>" + data.outdoor.oldMan.oldName + "</span></p><p>" +
                "老人电话：<span class='messageD'>" + data.outdoor.oldMan.oldPhone + "</span></p><p>" +
                "老人住址：<span class='messageD'>" + data.outdoor.oldMan.oldAddress + "</span></p></div>" +
                "<div class='detail'><span class='messageT'>出门信息：</span><br><p>" +
                "出门时刻：<span class='messageD read'>" + data.outdoor.out + "</span></p><p>" +
                "出门阈值：超过<span class='messageD red'>" + data.outdoor.threshold_out.outThreshold+ "</span>分钟为出门</p><p></div><input name="+data.id+" type='button' value='已读' onclick='readB(event)'/>"
            oldId=data.outdoor.oldMan.oid;
            oldName=data.outdoor.oldMan.oldName;
            oldPhone=data.outdoor.oldMan.oldPhone;
            oldAddress=data.outdoor.oldMan.oldAddress;

        }else if(data.type=="outdoor_nocome"){
            title="老人出门未归预警";
            warnMessage = "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
                "老人ID：<span class='messageD'>" + data.outdoor.oldMan.oid + "</span></p><p>" +
                "老人姓名：<span class='messageD'>" + data.outdoor.oldMan.oldName + "</span></p><p>" +
                "老人电话：<span class='messageD'>" + data.outdoor.oldMan.oldPhone + "</span></p><p>" +
                "老人住址：<span class='messageD'>" + data.outdoor.oldMan.oldAddress + "</span></p></div>" +
                "<div class='detail'><span class='messageT'>未归信息：</span><br><p>" +
                "出门时刻：<span class='messageD read'>" + data.outdoor.out + "</span></p><p>" +
                "未归阈值：<span class='messageD'>" + data.outdoor.threshold_out.noComeThreshold+ "分钟</span></p><p></div><input name="+data.id+" type='button' value='已读' onclick='readA(event)'/>"
            oldId=data.outdoor.oldMan.oid;
            oldName=data.outdoor.oldMan.oldName;
            oldPhone=data.outdoor.oldMan.oldPhone;
            oldAddress=data.outdoor.oldMan.oldAddress;
        }else if(data.type=="outdoor_come"){
            //没有了  不用再进行提示了  代码先保留
            title="老人回来";
            warnMessage = "<div class='oldMan'><span class='messageT'>老人信息：</span><br><p>" +
                "老人ID：<span class='messageD'>" + data.outdoor.oldMan.oid + "</span></p><p>" +
                "老人姓名：<span class='messageD'>" + data.outdoor.oldMan.oldName + "</span></p><p>" +
                "老人电话：<span class='messageD'>" + data.outdoor.oldMan.oldPhone + "</span></p><p>" +
                "老人住址：<span class='messageD'>" + data.outdoor.oldMan.oldAddress + "</span></p></div>" +
                "<div class='detail'><span class='messageT'>回来信息：</span><br><p>" +
                "出门时间段：<span class='messageD read'>" + data.outdoor.dataD + "</span></p><p></div><input name="+data.id+" type='button' value='已读' onclick='readB(event)'/>"
            oldId=data.outdoor.oldMan.oid;
            oldName=data.outdoor.oldMan.oldName;
            oldPhone=data.outdoor.oldMan.oldPhone;
            oldAddress=data.outdoor.oldMan.oldAddress;
        }
        $.messager.show({
            title:title,
            msg:warnMessage,
            showType:'fade',
            width:"15%",
            height:'38%',
            timeout:15000,
            style:{
                right:'',
                top:document.body.scrollTop+document.documentElement.scrollTop,
                bottom:''
            }
        });
        playSound("warn");
        addWarnIcon(oldId);
    }

    document.getElementById("oldId").innerText ="老人ID："+oldId ;
    document.getElementById("oldName").innerText ="老人姓名："+oldName ;
    document.getElementById("oldPhone").innerText ="老人电话："+oldPhone ;
    document.getElementById("oldAddress").innerText ="老人地址："+oldAddress ;

}
function addWarnIcon(id) {

    console.log(oldss);
}
function mapUpdate() {

    //当前frame 是地图页面  则进行实时更新  不是的话就不用更新了
    // if($("#iframe_ifr").attr("src").indexOf("map")!=-1){
    //     //调用map.jsp 子页面的 函数
    //     document.getElementById("iframe_ifr").contentWindow.louChange();
    // }
}
function playSound(type)
{
    var borswer = window.navigator.userAgent.toLowerCase();
    if ( borswer.indexOf( "ie" ) >= 0 )
    {
        //IE内核浏览器
        var strEmbed;
        if(type=="warn") {
            strEmbed = '<embed name="embedPlay" src="' + pathJs + '/wav/warn.wav" autostart="true" hidden="true" loop="false"></embed>';
        }else{
            strEmbed = '<embed name="embedPlay" src="' + pathJs + '/wav/urgency.wav" autostart="true" hidden="true" loop="false"></embed>';
        }
        if ( $( "body" ).find( "embed" ).length <= 0 )
            $( "body" ).append( strEmbed );
        var embed = document.embedPlay;

        //浏览器不支持 audion，则使用 embed 播放
        embed.volume = 100;
        //embed.play();这个不需要
    } else
    {
        //非IE内核浏览器
        var strAudio;
        if(type=="warn") {
            strAudio = "<audio id='audioPlay' src='" + pathJs + "/wav/warn.wav' hidden='true'>";
        }else{
            strAudio = "<audio id='audioPlay' src='" + pathJs + "/wav/urgency.wav' hidden='true'>";
        }
        if ( $( "body" ).find( "audio" ).length <= 0 )
            $( "body" ).append( strAudio );
        var audio = document.getElementById( "audioPlay" );

        //浏览器支持 audion
        audio.play();
    }
}
//老人信息表格内容填充
var greenNum=0,redNum=0,yellowNum=0;
// var old_turn_green=new Array();
// $.ajax({
//     type: "GET",
//     url: "/patrol/getOldIds",
//     dataType: "json",
//     async: false,
//     success: function (data) {
//
//
//         for (var i = 0; i < data.data.length; i++) {
//             old_turn_green.push(data.data[i]);
//
//         }
//
//     }
// });
// //!!!
$.ajax({
    type: "GET",
    url: "/map/getLouMarkersAndOlds",
    dataType: "json",
    async: false,
    success: function (data) {

        for (var i = 0; i < data.data.length; i++) {
            for (var j = 0; j < data.data[i].oldMan.length; j++) {
                if (data.data[i].oldMan[j].status == 0)
                    greenNum++;
                else if (data.data[i].oldMan[j].status == 1)
                    yellowNum++;
                else if (data.data[i].oldMan[j].status == 2)
                    redNum++;
            }
        }
        var tempAll=greenNum+redNum+yellowNum;
        // document.getElementById("greenNum").innerText = "已接受服务老人数量：" + greenNum;
        // document.getElementById("redNum").innerText = "未接受服务老人数量：" + redNum;
        // document.getElementById("yellowNum").innerText = "正在接受服务老人数量：" + yellowNum;
        // document.getElementById("allNum").innerText = "老人总数：" + tempAll;
        $(".main_bar").css('width',500);
        $(".main_bar").css( 'height',200);
        var main_bar = echarts.init(document.getElementById('main_bar'));
        var option_bar = {
            // color: ['#56c078'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            label:{
                normal:{
                    show: true,
                    position: 'top'}
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['正常', '正在服务','预警'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    type:'bar',
                    barWidth: '20%',
                    data:[greenNum, yellowNum,redNum]
                }
            ]
        };
        main_bar.setOption(option_bar);
    }
});
//

var map = new BMap.Map("container");
map.setMapStyle({style:'googlelite'});
if(getCookie("zoom")!=null&&getCookie("zoom")!=""){

    map.centerAndZoom(new BMap.Point(parseFloat(getCookie("center_x_y").split(",")[0]),parseFloat(getCookie("center_x_y").split(",")[1])), getCookie("zoom"));
    // map.centerAndZoom(new BMap.Point(121.481, 31.238), getCookie("zoom"));
    if(getCookie("zoom")>=16&&getCookie("zoom")<=18){
        getLouMarkers();
        getWorkerMarkers();
    }else if(getCookie("zoom")==19){
        getLouMarkers();
        getWorkerMarkers();
    }else{
        getJieDaoMarkers();
        getWorkerMarkers();
    }
}else {
    map.centerAndZoom(new BMap.Point(121.481, 31.238), 13);
}

map.addEventListener("zoomend", function(){
    //区：<=13  街道：14.15  房屋 >=16
    // alert("地图缩放至：" + this.getZoom() + "级");
    //区级别 且 上一个地图级别不是区级别
    if(this.getZoom()<=13&&preZoom!=null&&preZoom>13){
        //清空覆盖物
        map.clearOverlays();
        getQuMarkers();
        getWorkerMarkers();
    }else if((this.getZoom()==14||this.getZoom()==15||this.getZoom()==16)&&preZoom!=14&&preZoom!=15&&preZoom!=16){
        // console.log(point);
        //清空覆盖物
        map.clearOverlays();
        //街道级别 且 上一个地图级别不是街道级别
        getJieDaoMarkers();
        getWorkerMarkers();
    }else if((this.getZoom()>=17&&this.getZoom()<=18)&&(preZoom<17||preZoom>18)){
        //清空覆盖物
        map.clearOverlays();
        //房屋级别 且 上一个地图级别不是房屋级别   没有label
        getLouMarkers();
        getWorkerMarkers();
    }else if(this.getZoom()==19){
        map.clearOverlays();
        //房屋级别 且 上一个地图级别不是房屋级别   有label
        getLouMarkers();
        getWorkerMarkers();
    }
    preZoom=this.getZoom();
});
// map.addEventListener("click", function(e){
//     alert(e.point.lng + ", " + e.point.lat);
// });
map.enableScrollWheelZoom();


var infoWin;
var jInfoWin;
var curMkr = null; // 记录当前添加的Mkr

var mkrTool = new BMapLib.MarkerTool(map, {autoClose: true});


mkrTool.addEventListener("markend", function(e){
    var mkr = e.marker;
    if(map.getZoom()==14||map.getZoom()==15) {
        //街道的添加
        //拼接街道infowindow内容字串
        var jhtml = [];
        jhtml.push('<span style="font-size:12px">街道信息: </span><br/>');
        jhtml.push('<table border="0" cellpadding="1" cellspacing="1" >');
        jhtml.push('  <tr>');
        jhtml.push('      <td align="left" class="common">街道名称：</td>');
        jhtml.push('      <td colspan="2"><input type="text" maxlength="50" size="18"  id="jName"></td>');
        jhtml.push('      <td valign="top"><span class="star">*</span></td>');
        jhtml.push('  </tr>');
        jhtml.push('  <tr>');
        jhtml.push('      <td align="left" class="common">区：</td>');
        jhtml.push('      <td valign="top"><select id="selectQ_street">');
        for (var i = 0; i < selectDistrict.length; i++) {
            jhtml.push('<option value="' + selectDistrict[i].qid + ":" + selectDistrict[i].qName + '">' + selectDistrict[i].qName + '</option>');
        }
        jhtml.push('</select></td>');
        jhtml.push('      <td valign="top"><span class="star">*</span></td>');
        jhtml.push('  </tr>');
        jhtml.push('  <tr>');
        jhtml.push('      <td  align="center" colspan="3">');
        jhtml.push('          <input type="button" name="btnOK"  onclick="fnOK(1)" value="确定">&nbsp;&nbsp;');
        jhtml.push('          <input type="button" name="btnClear" onclick="fnClear(1);" value="重填">');
        jhtml.push('      </td>');
        jhtml.push('  </tr>');
        jhtml.push('</table>');

        jInfoWin = new BMap.InfoWindow(jhtml.join(""), {offset: new BMap.Size(0, -10)});

        mkr.openInfoWindow(jInfoWin);
        curMkr = mkr;
        xOwn = mkr.point.lng;
        yOwn = mkr.point.lat;
    }else if(map.getZoom()>=16) {
        //拼接楼infowindow内容字串
        var html = [];
        html.push('<span style="font-size:12px">楼信息: </span><br/>');
        html.push('<table border="0" cellpadding="1" cellspacing="1" >');
        html.push('  <tr>');
        html.push('      <td align="left" class="common">楼号：</td>');
        html.push('      <td valign="top"><input type="text" id="lou">');
        // for(var i=0;i<selectOldMan.length;i++){
        //     html.push('<option value="'+selectOldMan[i].oid+"#"+selectOldMan[i].oldName+'">'+selectOldMan[i].oid+"："+selectOldMan[i].oldName+'</option>');
        // }
        html.push('</select></td>');
        html.push('      <td valign="top"><span class="star">*</span></td>');
        html.push('  </tr>');
        html.push('  <tr>');
        html.push('      <td align="left" class="common">区：</td>');
        html.push('      <td valign="top"><select id="selectQ_house" onchange="selectDistrict_house(this.options[this.options.selectedIndex].value)">');
        html.push('<option></option>');
        for(var i=0;i<selectDistrict.length;i++){
            html.push('<option value="'+selectDistrict[i].qid+":"+selectDistrict[i].qName+'">'+selectDistrict[i].qName+'</option>');
        }
        html.push('</select></td>');
        html.push('      <td valign="top"><span class="star">*</span></td>');
        html.push('  </tr>');
        html.push('  <tr>');
        html.push('      <td align="left" class="common">街道：</td>');
        html.push('      <td colspan="2"><select id="selectJ_house">');
        html.push('</select></td>');
        html.push('  </tr>');
        html.push('  <tr>');
        html.push('      <td  align="center" colspan="3">');
        html.push('          <input type="button" name="btnOK"  onclick="fnOK(2)" value="确定">&nbsp;&nbsp;');
        // html.push('          <input type="button" name="btnClear" onclick="fnClear(2);" value="重填">');
        html.push('      </td>');
        html.push('  </tr>');
        html.push('</table>');



        infoWin = new BMap.InfoWindow(html.join(""), {offset: new BMap.Size(0, -10)});
        //房屋的添加
        mkr.openInfoWindow(infoWin);
        curMkr = mkr;
        xOwn = mkr.point.lng;
        yOwn = mkr.point.lat;



    }

});
init();




//初始化
function init(){
    /**
     * 地图级别判断
     * @type {[type]}
     */
    //默认地图级别12  显示区 统计信息
    getQuMarkers();//区
    getSums();//统计信息
    getWorkerMarkers();//服务人员位置
    // divInit();
}


//打开样式面板
function openStylePnl(){
    document.getElementById("divStyle").style.display = "block";
}

//选择样式
function selectStyle(index){
    indexOwn=index;

    mkrTool.open(); //打开工具
    var icon = BMapLib.MarkerTool.SYS_ICONS[index]; //设置工具样式，使用系统提供的样式BMapLib.MarkerTool.SYS_ICONS[0] -- BMapLib.MarkerTool.SYS_ICONS[23]
    mkrTool.setIcon(icon);
    document.getElementById("divStyle").style.display = "none";
}

//提交数据
function fnOK(index){

    //楼添加
    if(index==2) {
        var lou_info = encodeHTML(document.getElementById("lou").value);
        var jid = encodeHTML(document.getElementById("selectJ_house").value).split(":")[0];
        // var jName_top=encodeHTML(document.getElementById("selectJ_house").value).split(":")[1];
        // var qName_top=encodeHTML(document.getElementById("selectQ_house").value).split(":")[1];

        // var qidTxt = encodeHTML(document.getElementById("txtQid").value);
        // var jidTxt = encodeHTML(document.getElementById("txtSid").value);

        // oidOwn = oid;
        jidOwn = jid;

        if (!lou_info) {
            alert("*字段必须填写");
            return;
        }

        if (curMkr) {
            curMkr.setTitle(lou_info + "：0");
            if(map.getZoom()==19) {
                var label = new BMap.Label("0", {offset: new BMap.Size(3, -18)});
                label.setStyle({
                    color: "red",
                    font: "8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    border: "none"
                });
                curMkr.setLabel(label);
            }
        }
        if (infoWin.isOpen()) {
            map.closeInfoWindow();
        }
        /**
         *往后台发送数据
         *
         *
         */
        $.ajax({
            type: "POST",
            url: pathJs + "/map/addLouMarker",
            dataType: "json",
            data: {
                xG: xOwn,
                yG: yOwn,
                info: lou_info,
                jid: jidOwn
            },
            async: false,
            success: function (data) {
            }
        });
    }else{
        //街道添加   添加好后
        var jName = encodeHTML(document.getElementById("jName").value);
        var qid = encodeHTML(document.getElementById("selectQ_street").value).split(":")[0];

        var qName=encodeHTML(document.getElementById("selectQ_street").value).split(":")[1];

        qidOwn = qid;
        jNameOwn = jName;

        if (!qid||!jName) {
            alert("*字段必须填写");
            return;
        }
        if (curMkr) {
            //设置点击事件
            curMkr.addEventListener("click", function (e) {
                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 100,     // 信息窗口高度
                    title : this.getTitle()  // 信息窗口标题
                };
                var infoWindow = new BMap.InfoWindow("所属区："+qName+"<br/>购买服务总人数："+0+"<br/>正常（绿）："+0+"<br/>正在接受服务（黄）："+0+"<br/>预警（红）："+0,opts);  // 创建信息窗口对象
                this.openInfoWindow(infoWindow,new BMap.Point(this.point.lng,this.point.lat));
            });

            // curMkr.setAnimation(BMAP_ANIMATION_BOUNCE);
            //设置label
            // var lbl = new BMap.Label(name, {offset: new BMap.Size(1, 1)});
            // lbl.setStyle({border: "solid 1px gray"});
            // curMkr.setLabel(lbl);

            //设置title
            var title = "街道名称：" + jNameOwn;
            curMkr.setTitle(title);
            var label = new BMap.Label(jNameOwn+"：0",{offset:new BMap.Size(20,-10)});
            label.setStyle({
                color:"red",
                font:"16px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                backgroundColor:"white",
                fontWeight:"bold",
                padding:"4px 8px"
            });
            curMkr.setLabel(label);
        }
        if (jInfoWin.isOpen()) {
            map.closeInfoWindow();
        }

        // 在此用户可将数据提交到后台数据库中
        // alert("样式索引：" + indexOwn + "\nx坐标：" + xOwn + "\ny坐标：" + yOwn + "\n区编号：" + qidOwn + "\n街道名称：" + jNameOwn);

        /**
         *往后台发送数据
         *
         *
         */
        $.ajax({
            type: "POST",
            url: pathJs + "/map/addStreetMarker",
            dataType: "json",
            data: {
                jX: xOwn,
                jY: yOwn,
                qid: qidOwn,
                jName: jNameOwn,
                styleIndex: indexOwn
            },
            async: false,
            success: function (data) {
                //将新添加的 街道标注 更新到统计信息  以及街道的select
                var street={"name":jName,"sum":0,"greenSum":0,"yellowSum":0,"redSum":0};
                for(var i=0;i<Sum.district.length;i++){
                    if(Sum.district[i].name==qName) {
                        Sum.district[i].street.push(street);
                    }
                }
                var select={"jid":data.data,"jName":jName,"qid":qidOwn};
                selectStreet.push(select);
                divInit();
            }
        });
    }
}

//输入校验
function encodeHTML(a){
    return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

//重填数据
function fnClear(index){
    if(index==2) {
        //房屋
        // document.getElementById("txtOid").value = "";
    }else{
        //街道
        document.getElementById("jName").value = "";
    }
}

//初始化 统计信息
function getSums() {
    $.ajax({
        type: "GET",
        url: pathJs + "/map/getSums",
        dataType: "json",
        success: function (data) {
            //数据持久化
            Sum.sum=data.data.sum;
            Sum.greenSum=data.data.greenSum;
            Sum.yellowSum=data.data.yellowSum;
            Sum.redSum=data.data.redSum;

            for(var i=0;i<data.data.quMarkerList.length;i++){
                var district={"id":0,"name":"","sum":0,"greenSum":0,"yellowSum":0,"redSum":0,"street":[]};
                district.id=data.data.quMarkerList[i].id;
                district.name=data.data.quMarkerList[i].qName;
                district.sum=data.data.quMarkerList[i].sum;
                district.greenSum=data.data.quMarkerList[i].greenSum;
                district.yellowSum=data.data.quMarkerList[i].yellowSum;
                district.redSum=data.data.quMarkerList[i].redSum;
                for(var j=0;j<data.data.quMarkerList[i].jieDaoMarkerList.length;j++){
                    var street={"id":0,"name":"","sum":0,"greenSum":0,"yellowSum":0,"redSum":0};
                    street.id=data.data.quMarkerList[i].jieDaoMarkerList[j].id;
                    street.name=data.data.quMarkerList[i].jieDaoMarkerList[j].jName;
                    street.sum=data.data.quMarkerList[i].jieDaoMarkerList[j].sum;
                    street.greenSum=data.data.quMarkerList[i].jieDaoMarkerList[j].greenSum;
                    street.yellowSum=data.data.quMarkerList[i].jieDaoMarkerList[j].yellowSum;
                    street.redSum=data.data.quMarkerList[i].jieDaoMarkerList[j].redSum;
                    district.street.push(street);
                }
                Sum.district.push(district);
            }
            // alert(JSON.stringify(Sum));
            divInit();
        }
    });
}

function getWorkerMarkers() {
    $.ajax({
        type: "GET",
        url: pathJs + "/map/getWorkerMarkers",
        dataType: "json",
        async: false,
        success: function (data) {
            for(var i=0;i<data.data.length;i++) {
                var icon = BMapLib.MarkerTool.SYS_ICONS[6];
                var json={icon:{w:21,h:21,l:0,t:0,x:6,lb:5}};
                var icon = new BMap.Icon("http://i2.bvimg.com/647748/f79715aed233ae84.png", new BMap.Size(60,30),{imageOffset: new BMap.Size(0,0),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(0,0)});

                var point = new BMap.Point(data.data[i].cx, data.data[i].cy);
                var marker = new BMap.Marker(point, {icon: icon});
                marker.setTitle(data.data[i].id);
                map.addOverlay(marker);
                marker.addEventListener("click", function (){
                    // now_id = this.getTitle();
                    // draw_path();
                    $.ajax({
                        type: "GET",
                        url: pathJs + "/map/" + this.getTitle() + "/getWorkerPosition",
                        dataType: "json",
                        async: false,
                        success: function (data1) {
                            var runLine = [];
                            for(var j = 0; j < data1.data.length; j++)
                                runLine.push(new BMap.Point(data1.data[j].cx, data1.data[j].cy));
                            var path = new BMap.Polyline(runLine,{
                                strokeColor : "#009933", //线路颜色
                                strokeWeight : 4,//线路大小
                                //线路类型(虚线)
                                strokeStyle : "dashed"});
                            map.addOverlay(path);
                            var icon = new BMap.Icon("http://i2.bvimg.com/647748/f79715aed233ae84.png", new BMap.Size(512,256),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)});
                            var point = new BMap.Point(data1.data[data1.data.length-1].cx, data1.data[data1.data.length-1].cy);
                            var marker = new BMap.Marker(point, {icon: icon});
                            // marker.setTitle(data1.data[data1.data.length-1].time);
                            map.addOverlay(marker);
                            setInterval(getWorkerMarkers, 60000);      //每60s刷新一次
                            // setInterval("draw_path()", 100);
                        }
                    });

                });

            }
        }
    });
}

//获得区数据
function getQuMarkers() {
    $.ajax({
        type: "GET",
        url: pathJs + "/map/getQuMarkers",
        dataType: "json",
        async:false, //一定要加 不然 渲染不了
        success: function (data) {
            //填充 区select
            if(selectDistrict.length==0){
                for(var i=0;i<data.data.length;i++) {
                    var district = {"qid": data.data[i].id, "qName": data.data[i].qName};
                    selectDistrict.push(district);
                }
            }

            for(var i=0;i<data.data.length;i++) {
                var icon = BMapLib.MarkerTool.SYS_ICONS[data.data[i].styleIndex];
                // icon.setSize(200);
                // icon.setImageSize(50);
                var point = new BMap.Point(data.data[i].qX, data.data[i].qY);
                var marker = new BMap.Marker(point, {icon: icon});
                marker.setTitle("区名称："+data.data[i].qName);
                // var sum=data.data[i].sum+"@"+data.data[i].greenSum+"@"+data.data[i].yellowSum+"@"+data.data[i].redSum;

                // marker.setAttribute("sum",sum);
                // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                marker.addEventListener("click", function (e) {
                    /**
                     *
                     * 获得该区的统计信息
                     */
                        // alert(this.getTitle());
                    var qName=this.getTitle().split("：")[1];

                    var opts = {
                        width : 200,     // 信息窗口宽度
                        height: 100,     // 信息窗口高度
                        title : this.getTitle()  // 信息窗口标题
                    };
                    //该区的统计情况  不能用data.data[i] 因为只有触发的时候才会渲染  触发时 data.data[i]是null
                    // var sums=this.getAttribute("sum").split("@");
                    // alert(JSON.stringify(Sum));
                    // alert(qName);
                    for(var i=0;i<Sum.district.length;i++) {
                        if(Sum.district[i].name==qName) {
                            varSum =Sum.district[i].sum;
                            varGreenSum =Sum.district[i].greenSum;
                            varYellowSum =Sum.district[i].yellowSum;
                            varRedSum =Sum.district[i].redSum;
                        }
                    }
                    var infoWindow = new BMap.InfoWindow("购买服务总人数："+varSum+"<br/>正常："+varGreenSum+"<br/>正在服务："+varYellowSum+"<br/>预警："+varRedSum,opts);  // 创建信息窗口对象
                    this.openInfoWindow(infoWindow,new BMap.Point(this.point.lng,this.point.lat));
                });
                map.addOverlay(marker);

                // var lHtml=[];
                // lHtml.push('<span style="font-size:12px;background-color: #00b5ad">'+data.data[i].qName+":"+data.data[i].sum +'</span><br/>');

                var label = new BMap.Label(data.data[i].qName+"："+data.data[i].sum,{offset:new BMap.Size(20,-10)});
                label.setStyle({
                    color:"red",
                    font:"16px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                    backgroundColor:"white",
                    fontWeight:"bold",
                    padding:"4px 8px"
                });
                marker.setLabel(label);
            }
        }
    });
}

//获得街道数据
function getJieDaoMarkers() {
    $.ajax({
        type: "GET",
        url: pathJs + "/map/getJieDaoMarkers",
        dataType: "json",
        async:false,
        success: function (data) {
            //填充 街道select
            if(selectStreet.length==0){
                for(var i=0;i<data.data.length;i++) {
                    var street = {"jid": data.data[i].id, "jName": data.data[i].jName, "qid": data.data[i].qid};
                    selectStreet.push(street);
                }
            }

            for(var i=0;i<data.data.length;i++) {

                var icon = BMapLib.MarkerTool.SYS_ICONS[data.data[i].styleIndex];
                // icon.setSize(200);
                var point = new BMap.Point(data.data[i].jX, data.data[i].jY);
                var marker = new BMap.Marker(point, {icon: icon});
                marker.setTitle("街道名称："+data.data[i].jName);
                // marker.setAnimation(BMAP_ANIMATION_BOUNCE);
                // var sum=data.data[i].qName+"@"+data.data[i].sum+"@"+data.data[i].greenSum+"@"+data.data[i].yellowSum+"@"+data.data[i].redSum;
                // marker.setAttribute("sum",sum);
                marker.addEventListener("click", function (e) {
                    /**
                     *
                     * 获得该街道的统计信息
                     */
                        // alert(this.getTitle());
                    var opts = {
                            width : 200,     // 信息窗口宽度
                            height: 130,     // 信息窗口高度
                            title : this.getTitle()  // 信息窗口标题
                        };
                    var jName=this.getTitle().split("：")[1];
                    var varQname;
                    var varSum;
                    var varGreenSum;
                    var varYellowSum;
                    var varRedSum;
                    for(var i=0;i<Sum.district.length;i++) {
                        for(var j=0;j<Sum.district[i].street.length;j++) {
                            if (Sum.district[i].street[j].name == jName) {
                                varSum = Sum.district[i].street[j].sum;
                                varGreenSum = Sum.district[i].street[j].greenSum;
                                varYellowSum = Sum.district[i].street[j].yellowSum;
                                varRedSum = Sum.district[i].street[j].redSum;
                                varQname=Sum.district[i].name;
                            }
                        }
                    }
                    //该街道的统计情况
                    var infoWindow = new BMap.InfoWindow("所属区："+varQname+"<br/>购买服务总人数："+varSum+"<br/>正常："+varGreenSum+"<br/>正在接受服务："+varYellowSum+"<br/>预警："+varRedSum,opts);  // 创建信息窗口对象
                    this.openInfoWindow(infoWindow,new BMap.Point(this.point.lng,this.point.lat));
                });
                map.addOverlay(marker);

                // var lHtml=[];
                // lHtml.push('<span style="font-size:12px;background-color: #00b5ad">'+data.data[i].qName+":"+data.data[i].sum +'</span><br/>');

                var label = new BMap.Label(data.data[i].jName+"："+data.data[i].sum,{offset:new BMap.Size(20,-10)});
                label.setStyle({
                    color:"red",
                    font:"16px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                    backgroundColor:"white",
                    fontWeight:"bold",
                    padding:"4px 8px"
                });
                marker.setLabel(label);
            }
        }
    });
}

//获得楼数据
var len,louName=new Array(),oldss=new Array(),marker=new Array(),marker2=new Array(),marker3=new Array();
function getLouMarkers() {
    $.ajax({
        type: "GET",
        // url: pathJs + "/map/getLouMarkersAndOlds",
        url: "/map/getLouMarkersAndOlds",
        dataType: "json",
        async:false,
        success: function (data) {

            for(var i=0;i<data.data.length;i++) {
                var dataR=data.data;
                // if(data.data[i].greenSum!=0){
                var louNumG,louNumR,louNumY;
                louNumG=dataR[i].greenSum+dataR[i].redSum+dataR[i].yellowSum,louNumR=dataR[i].redSum,louNumY=dataR[i].yellowSum;
                var icon = BMapLib.MarkerTool.SYS_ICONS[6];
                var point = new BMap.Point(data.data[i].xG, data.data[i].yG);
                marker[i] = new BMap.Marker(point, {icon: icon});
                var oldNum=data.data[i].greenSum+data.data[i].yellowSum+data.data[i].redSum;
                marker[i].setTitle(data.data[i].info);

                //newPoint
                var icon2 = BMapLib.MarkerTool.SYS_ICONS[8];
                var icon3 = BMapLib.MarkerTool.SYS_ICONS[9];
                var point2 = new BMap.Point(data.data[i].xR, data.data[i].yR);
                var point3 = new BMap.Point(data.data[i].xY, data.data[i].yY);
                marker2[i] = new BMap.Marker(point2, {icon: icon2});
                marker3[i] = new BMap.Marker(point3, {icon: icon3});
                marker2[i].setTitle(data.data[i].info);
                marker3[i].setTitle(data.data[i].info);
                // if(typeof(data.data[i].oldMan)=="undefined")continue;

                louName[i]=dataR[i].info;
                oldss[i]=new Array();
                oldss[i]=dataR[i].oldMan;
                //new remove listener

                if(dataR[i].greenSum)
                map.addOverlay(marker[i]);
                if(dataR[i].redSum)
                map.addOverlay(marker2[i]);
                if(dataR[i].yellowSum)
                map.addOverlay(marker3[i]);

                // var lHtml=[];
                // lHtml.push('<span style="font-size:12px;background-color: #00b5ad">'+data.data[i].qName+":"+data.data[i].sum +'</span><br/>');

                // var label = new BMap.Label(data.data[i].jName+"："+data.data[i].sum,{offset:new BMap.Size(20,-10)});
                var label = new BMap.Label(louNumG,{offset:new BMap.Size(5,-20)});
                label.setStyle({
                    color: "red",
                    font: "8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    border: "none"
                });
                var label2 = new BMap.Label(louNumR,{offset:new BMap.Size(5,-20)});
                label2.setStyle({
                    color: "red",
                    font: "8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    border: "none"
                });
                var label3 = new BMap.Label(louNumY,{offset:new BMap.Size(5,-20)});
                label3.setStyle({
                    color: "red",
                    font: "8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
                    backgroundColor: "transparent",
                    fontWeight: "bold",
                    border: "none"
                });
                marker[i].setLabel(label);
                marker2[i].setLabel(label2);
                marker3[i].setLabel(label3);

                // }



            }
            //move out
            var tempOlds;
            for(var i=0;i<dataR.length;i++)
            {
                marker[i].oldsInfo=oldss[i];
                marker2[i].oldsInfo=oldss[i];
                marker3[i].oldsInfo=oldss[i];
                marker[i].addEventListener("click", function (e) {

                    /**
                     *
                     * 获得该楼道的统计信息
                     */
                        // alert(this.getTitle());
                    var opts = {
                            width : 200,     // 信息窗口宽度
                            height: 500,     // 信息窗口高度
                            title : this.getTitle()  // 信息窗口标题
                        };
                    var infostr="";

                    for(var j=0;j<this.oldsInfo.length;j++)
                    {
                        // if(this.oldsInfo[j].status!=0)continue;
                        infostr+=this.oldsInfo[j].oldName;
                        infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#00ee00;'></div>";
                        // if(isGreen(olds[j].oid)){
                        //     infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#00ee00;'></div>";
                        //
                        // }
                        // else
                        // {
                        //     if(olds[j].status==0)
                        //         infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#00ee00;'></div>";
                        //     else if(olds[j].status==1)
                        //         infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#FFFF00;'></div>";
                        //     else if(olds[j].status==2)
                        //         infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#dd1144;'></div>";
                        // }
                        infostr=infostr+"手机："+this.oldsInfo[j].oldPhone+",";
                        infostr=infostr+"密码："+this.oldsInfo[j].oldPwd+"<br/>";
                        infostr+="<Button onclick='f1()'>实时通讯</Button>";
                        infostr+="<button onclick='exec()'>查看室内情况</button>";
                        infostr+="<br/>"
                    }
                    //alert(infostr);
                    //alert(olds.length);
                    // for(var i=0;i<Sum.district.length;i++) {
                    //     for(var j=0;j<Sum.district[i].street.length;j++) {
                    //         if (Sum.district[i].street[j].name == jName) {
                    //             varSum = Sum.district[i].street[j].sum;
                    //             varGreenSum = Sum.district[i].street[j].greenSum;
                    //             varYellowSum = Sum.district[i].street[j].yellowSum;
                    //             varRedSum = Sum.district[i].street[j].redSum;
                    //             varQname=Sum.district[i].name;
                    //         }
                    //     }
                    // }
                    //该街道的统计情况
                    //var infoWindow = new BMap.InfoWindow("所属区："+varQname+"<br/>购买服务总人数："+varSum+"<br/>正常："+varGreenSum+"<br/>正在接受服务："+varYellowSum+"<br/>预警："+varRedSum,opts);  // 创建信息窗口对象
                    // var infoWindow = new BMap.InfoWindow("楼名："+varQname+"<br/>购买服务总人数：1<br/>老人1:<div id='test' style='width:10px;height:10px;background:#00ee00;'></div><button onclick='exec()'>btn1</button><Button onclick='f1()'>btn2</Button><br/>老人2:<div id='test' style='width:10px;height:10px;background:#dd1144;'></div><br/>",opts);  // 创建信息窗口对象

                    var infoWindow = new BMap.InfoWindow(infostr,opts);  // 创建信息窗口对象

                    this.openInfoWindow(infoWindow,new BMap.Point(this.point.lng,this.point.lat));
                });
                marker2[i].addEventListener("click", function (e) {
                    /**
                     *
                     * 获得该楼道的统计信息
                     */
                        // alert(this.getTitle());
                    var opts = {
                            width : 200,     // 信息窗口宽度
                            height: 500,     // 信息窗口高度
                            title : this.getTitle()  // 信息窗口标题
                        };
                    var infostr="";

                    for(var j=0;j<this.oldsInfo.length;j++)
                    {
                        if(this.oldsInfo[j].status!=2)continue;

                        infostr+=this.oldsInfo[j].oldName;
                        infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#dd1144;'></div>";
                        infostr=infostr+"手机："+this.oldsInfo[j].oldPhone+",";
                        infostr=infostr+"密码："+this.oldsInfo[j].oldPwd+"<br/>";
                        infostr+="<Button onclick='f1()'>实时通讯</Button>";
                        infostr+="<button onclick='exec()'>查看室内情况</button>";
                        infostr+="<br/>"
                    }

                    var infoWindow = new BMap.InfoWindow(infostr,opts);  // 创建信息窗口对象

                    this.openInfoWindow(infoWindow,new BMap.Point(this.point.lng,this.point.lat));
                });
                marker3[i].addEventListener("click", function (e) {

                    /**
                     *
                     * 获得该楼道的统计信息
                     */
                        // alert(this.getTitle());
                    var opts = {
                            width : 200,     // 信息窗口宽度
                            height: 500,     // 信息窗口高度
                            title : this.getTitle()  // 信息窗口标题
                        };
                    var infostr="";

                    for(var j=0;j<this.oldsInfo.length;j++)
                    {
                        if(this.oldsInfo[j].status!=1)continue;
                        infostr+=this.oldsInfo[j].oldName;
                        infostr=infostr+":"+"<div id='test' style='width:10px;height:10px;background:#FFFF00;'></div>";
                        infostr=infostr+"手机："+this.oldsInfo[j].oldPhone+",";
                        infostr=infostr+"密码："+this.oldsInfo[j].oldPwd+"<br/>";
                        infostr+="<Button onclick='f1()'>实时通讯</Button>";
                        infostr+="<button onclick='exec()'>查看室内情况</button>";
                        infostr+="<br/>"
                    }

                    var infoWindow = new BMap.InfoWindow(infostr,opts);  // 创建信息窗口对象

                    this.openInfoWindow(infoWindow,new BMap.Point(this.point.lng,this.point.lat));
                });
            }

        }
    });
}
function f1(){
    window.location.href='tencent://Message/?uin=1091793549';
}
function isGreen(oid){
    for(var i=0;i<old_turn_green.length;i++){
        if(oid==old_turn_green[i]){
            return 1;
        }
    }
    return 0;
}
function getLouMarkers_label() {
    // $.ajax({
    //     type: "GET",
    //     url: pathJs + "/map/getLouMarkers",
    //     dataType: "json",
    //     async:false,
    //     success: function (data) {
    //
    //
    //         for(var i=0;i<data.data.length;i++) {
    //             // if(data.data[i].greenSum!=0){
    //             var icon = BMapLib.MarkerTool.SYS_ICONS[6];
    //             var point = new BMap.Point(data.data[i].xG, data.data[i].yG);
    //             var marker = new BMap.Marker(point, {icon: icon});
    //             marker.setTitle(data.data[i].info + "："+data.data[i].greenSum);
    //             map.addOverlay(marker);
    //             var label = new BMap.Label(data.data[i].greenSum,{offset:new BMap.Size(3,-18)});
    //             label.setStyle({
    //                 color:"red",
    //                 font:"8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
    //                 backgroundColor:"transparent",
    //                 fontWeight:"bold",
    //                 border:"none"
    //             });
    //             marker.setLabel(label);
    //             // }
    //             if(data.data[i].yellowSum!=0){
    //                 var icon = BMapLib.MarkerTool.SYS_ICONS[9];
    //                 var point = new BMap.Point(data.data[i].xY, data.data[i].yY);
    //                 var marker = new BMap.Marker(point, {icon: icon});
    //                 marker.setTitle(data.data[i].info + "："+data.data[i].yellowSum);
    //                 map.addOverlay(marker);
    //                 var label = new BMap.Label(data.data[i].yellowSum,{offset:new BMap.Size(3,-18)});
    //                 label.setStyle({
    //                     color:"red",
    //                     font:"8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
    //                     backgroundColor:"transparent",
    //                     fontWeight:"bold",
    //                     border:"none"
    //                 });
    //                 marker.setLabel(label);
    //             }
    //             if(data.data[i].redSum!=0){
    //                 var icon = BMapLib.MarkerTool.SYS_ICONS[8];
    //                 var point = new BMap.Point(data.data[i].xR, data.data[i].yR);
    //                 var marker = new BMap.Marker(point, {icon: icon});
    //                 marker.setTitle(data.data[i].info + "："+data.data[i].redSum);
    //                 map.addOverlay(marker);
    //                 var label = new BMap.Label(data.data[i].redSum,{offset:new BMap.Size(3,-18)});
    //                 label.setStyle({
    //                     color:"red",
    //                     font:"8px Tahoma,Helvetica,Arial,'宋体',sans-serif;",
    //                     backgroundColor:"transparent",
    //                     fontWeight:"bold",
    //                     border:"none"
    //                 });
    //                 marker.setLabel(label);
    //             }
    //         }
    //     }
    // });
}

//html 显示 初始化
function divInit() {
    $(".main_bar").css('width',500);
    $(".main_bar").css( 'height',200);
    var main_bar = echarts.init(document.getElementById('main_bar'));
    var option_bar = {
        // color: ['#56c078'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        label:{
            normal:{
                show: true,
                position: 'top'}
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['正常', '正在服务','预警'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                type:'bar',
                barWidth: '20%',
                data:[greenNum, yellowNum,redNum]
            }
        ]
    };
    main_bar.setOption(option_bar);
    //alert(greenNum,yellowNum,redNum);
}




function louChange() {
    /**
     * 统计信息的更新
     */
    var point=map.getCenter();
    var center=JSON.stringify(point);
    //将当前的 地图级别  中心坐标存到 cookie中 时间1分钟
    setCookie("zoom",map.getZoom().toString(),60*1000);
    setCookie("center_x_y",center.split(",")[0].split(":")[1]+","+center.split(",")[1].split(":")[1].substring(0,center.split(",")[1].split(":")[1].length-1),60*1000);
    location.reload();
}

//按秒
function setCookie(name, value, time){
    var exp = new Date();
    exp.setTime(exp.getTime() + time);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+"path=/";
}

function getCookie(c_name){
    if (document.cookie.length>0){
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1){
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function selectDistrict_house(value) {
    $('#selectJ_house').html("");
    var qid=value.split(":")[0];
    for(var i=0;i<selectStreet.length;i++){
        if(selectStreet[i].qid==qid){
            var $option=$('<option value="'+selectStreet[i].jid+":"+selectStreet[i].jName+'">'+selectStreet[i].jName+'</option>');
            $('#selectJ_house').append($option);
        }
    }

}
function exec () {
    var command="d:\\EzvizStudio\\EzvizStudio.exe";
    window.oldOnError = window.onerror;
    window._command = command;
    window.onerror = function (err) {
        if (err.indexOf('automation' ) != -1) {
            alert('命令已经被用户禁止！');
            return true;
        }
        else return false;
    };
    var wsh = new ActiveXObject('WScript.Shell');
    if (wsh)
        wsh.Run(command);
    window.onerror = window.oldOnError;
}
function quChange() {
    var $tbody=$("#tableSum tbody");
    $tbody.html("");
    for(var i=0;i<Sum.district.length;i++) {
        if(Sum.district[i].id==$("option:selected").val()) {
            var $tr = $("<tr onclick='tuChange("+Sum.district[i].id+",1,null)' class='district'></tr>");
            var $tdName = $("<td>" + Sum.district[i].name + "</td>");
            var $tdSum = $("<td>" + Sum.district[i].sum + "</td>");
            var $tdGreenSum = $("<td>" + Sum.district[i].greenSum + "</td>");
            var $tdYellowSum = $("<td>" + Sum.district[i].yellowSum + "</td>");
            var $tdRedSum = $("<td>" + Sum.district[i].redSum + "</td>");
            $tr.append($tdName);
            $tr.append($tdSum);
            $tr.append($tdGreenSum);
            $tr.append($tdYellowSum);
            $tr.append($tdRedSum);
            $tbody.append($tr);
            for (var j = 0; j < Sum.district[i].street.length; j++) {
                var $tr_s = $("<tr class='street'></tr>");
                var $tdName_s = $("<td onclick='tuChange("+Sum.district[i].street[j].id+",2,"+Sum.district[i].id+")'>" + Sum.district[i].street[j].name + "</td>");
                var $tdSum_s = $("<td>" + Sum.district[i].street[j].sum + "</td>");
                var $tdGreenSum_s = $("<td>" + Sum.district[i].street[j].greenSum + "</td>");
                var $tdYellowSum_s = $("<td>" + Sum.district[i].street[j].yellowSum + "</td>");
                var $tdRedSum_s = $("<td>" + Sum.district[i].street[j].redSum + "</td>");
                $tr_s.append($tdName_s);
                $tr_s.append($tdSum_s);
                $tr_s.append($tdGreenSum_s);
                $tr_s.append($tdYellowSum_s);
                $tr_s.append($tdRedSum_s);
                $tbody.append($tr_s);
            }
        }
    }

    tuChange($("option:selected").val(),1,null);
}


function tuChange(id,type,qid) {
    var redSum;
    var greenSum;
    var yellowSum;
    var title_text;
    var title_text_2;
    var data=[];

    if(id==0){
        redSum=Sum.redSum;
        greenSum=Sum.greenSum;
        yellowSum=Sum.yellowSum;
        title_text="上海市状态比例图  （总人数:"+Sum.sum+"）";
        title_text_2="上海市区域分布图  （总人数:"+Sum.sum+"）";

        for(var i=0;i<Sum.district.length;i++){
            var val;
            if(Sum.district[i].id==1){
                //闵行区
                val={
                    name: Sum.district[i].name,
                    y:Sum.district[i].sum,
                    sliced: true,
                    selected: true
                }
            }else {
                val = [Sum.district[i].name, Sum.district[i].sum];
            }
            data.push(val);
        }
        $('#main_2').highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: title_text_2
            },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}（{point.y}）: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}：'+'{point.percentage:.1f}%'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '人数占比',
                data: data,
                center:["50%","35%"]
            }]
        });
    }else if(type==1){
        //区
        for(var i=0;i<Sum.district.length;i++) {
            if(Sum.district[i].id==id){
                redSum=Sum.district[i].redSum;
                greenSum=Sum.district[i].greenSum;
                yellowSum=Sum.district[i].yellowSum;
                title_text=Sum.district[i].name+"状态比例图  （总人数:"+Sum.district[i].sum+"）";

                title_text_2=Sum.district[i].name+"区域分布图  （总人数:"+Sum.district[i].sum+"）";
                for(var j=0;j<Sum.district[i].street.length;j++){
                    var val;
                    if(Sum.district[i].street[j].id==1){
                        //古美街道
                        val={
                            name: Sum.district[i].street[j].name,
                            y:Sum.district[i].street[j].sum,
                            sliced: true,
                            selected: true
                        }
                    }else {
                        val = [Sum.district[i].street[j].name, Sum.district[i].street[j].sum];
                    }
                    data.push(val);
                }
                break;
            }
        }
        $('#main_2').highcharts({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text:title_text_2
            },
            tooltip: {
                pointFormat: '{series.name}（{point.y}）: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}：'+'{point.percentage:.1f}%'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: '人数占比',
                data: data,
                center:["50%","35%"]
            }]
        });
    }else{
        //街道
        for(var i=0;i<Sum.district.length;i++) {
            if (Sum.district[i].id == qid) {
                for (var j = 0; j < Sum.district[i].street.length; j++) {
                    if(id==Sum.district[i].street[j].id){
                        redSum=Sum.district[i].street[j].redSum;
                        greenSum=Sum.district[i].street[j].greenSum;
                        yellowSum=Sum.district[i].street[j].yellowSum;
                        title_text=Sum.district[i].street[j].name+"状态比例图  （总人数:"+Sum.district[i].street[j].sum+"）";
                        break;
                    }
                }
            }
        }
    }

    $('#main').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        colors:[
            '#56c078',//第一个颜色，欢迎加入Highcharts学习交流群294191384
            '#EEEE00',//第二个颜色
            '#d53a35'//第三个颜色
        ],
        credits: {
            enabled: false
        },
        title: {
            text:title_text
        },
        tooltip: {
            pointFormat: '{series.name}（{point.y}）: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}：'+'{point.percentage:.1f}%'
                }
            }
        },
        series: [{
            type: 'pie',
            name: '人数占比',
            data: [
                {
                    name: '正常',
                    y:greenSum,
                    sliced: true,
                    selected: true
                },
                ['正在服务',yellowSum],
                ['预警',redSum]
            ],
            center:["50%","18%"]
        }]
    });

}


