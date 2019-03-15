<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@page language="java" import="java.util.*" pageEncoding="utf-8" %>
<%@include file="/WEB-INF/jsp/common/easyui.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>地图</title>
  <link href="${path}/css/map.css" rel="stylesheet" type="text/css">
  <link href="${path}/css/table.css" rel="stylesheet" type="text/css">
  <script src="${path}/js/echarts/echarts.min.js" type="text/javascript"></script>
  <%--<script type="text/javascript" src="http://api.map.baidu.com/api?v=1.2"></script>--%>
  <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=q26hMcHcdSmP4RMfDKuZYBo13FAmf4j3"></script>
  <script type="text/javascript" src="http://api.map.baidu.com/library/MarkerTool/1.2/src/MarkerTool_min.js"></script>

  <script src="https://img.hcharts.cn/highcharts/highcharts.js"></script>
  <script src="https://img.hcharts.cn/highcharts/highcharts-3d.js"></script>
  <script src="https://img.hcharts.cn/highcharts/modules/exporting.js"></script>
  <script src="https://img.hcharts.cn/highcharts-plugins/highcharts-zh_CN.js"></script>

  <script type="text/javascript" src="${path}/js/table_oldman.js"></script>
  <script type="text/javascript" src="${path}/js/common.js"></script>

  <script type='text/javascript' src="${path}/dwr/engine.js"></script>
  <script type='text/javascript' src="${path}/dwr/util.js"></script>
  <script type='text/javascript' src="${path}/dwr/interface/Remote.js"></script>

  <style type="text/css">


    body{
      padding: 10px 20px 10px 20px;
    }
    #divAdd{
      background: #fff;
      margin-top: 9.1%;
      position: absolute;
      left: 8px;
      bottom: 8px;
    }
    .visual{
      width: 35%;
      margin-left: 65%;
    }
    #main_gauge{
      width: 20%;
      height:35%;
      position: absolute;
      top:64%;
      right: 16%;
      /*display: none;*/
    }
    #main_bar{
      width: 18%;
      height:35%;
      position: absolute;
      top:65%;
      right: 0%;
      /*display: none;*/
    }
    #main_pie{
      position: absolute;
      top:-11%;
      right: 18%;
      width: 15%;
      height:46%;
      /*z-index: 999;*/

    }
    #main_pie_2{
      position: absolute;
      top:-6%;
      right: 2%;
      width: 15%;
      height:40%;
      /*margin-right: -2%;*/
    }
    #main_pie_3{
      width: 15%;
      height:40%;
      position: absolute;
      top:25%;
      right: 12%;
      /*margin-right: -9%;*/
      margin-top: 1%;

    }
  </style>
</head>
<body style="overflow-x: hidden">

<div class="map" id="container" ></div>
<div>
  <%--<div id="main_gauge"></div>--%>

  <%--<div id="main_pie"></div>--%>
  <%--<div id="main_pie_2"></div>--%>
  <%--<div id="main_pie_3"></div>--%>
  <%--<div id='test' style='width:500px;height:200px;background:#00F;'>--%>
  <%--测试的div1--%>
  <%--</div>--%>
  <div id='test' style='width:600px;height:200px;background:#aa00aa;position: relative;bottom:16px;'>
    <p id="warnMessage" style="font-size: 15px;float: left">报警信息&nbsp;&nbsp;&nbsp;&nbsp;</p>
    <p id="warn_instant" style="font-size: 15px;float: left">实时报警：0</p>
    <p id="warn_sum" style="font-size: 15px;float: left" onclick="alertOldman()">累计报警:5</p>
    <p id="oldId" style="font-size: 15px;clear: both">老人ID：</p>
    <p id="oldName" style="font-size: 15px">老人姓名：</p>
    <p id="oldPhone" style="font-size: 15px">老人电话：</p>
    <p id="oldAddress" style="font-size: 15px">老人地址：</p>

  </div>
  <div id="main_bar" style='width:500px;height:150px;position: relative;bottom:25px'></div>
  <div id="main_pie" style='width:500px;height:150px;position: relative;top:30px;left:0px'></div>
    <div id="main_pie2" style='width:500px;height:150px;position: relative;top:30px'></div>
    <div id="main_pie3" style='width:500px;height:150px;position: relative;top:30px'></div>

    <%--测试的div2<br>--%>
    <%--<p id="greenNum" style="font-size: 20px">已接受服务老人数量：1</p>--%>
    <%--<p id="yellowNum" style="font-size: 20px">正在接受服务老人数量：0</p>--%>
    <%--<p id="redNum" style="font-size: 20px">未接受服务老人数量：1</p>--%>
    <%--<p id="allNum" style="font-size: 20px">老人总数：1</p>--%>
  <table id="datagrid2" class="easyui-datagrid"  style='width:200px;height:150px;position: relative;'fit="true" url="${path}/data/datagrid" title=""
           toolbar="#toolbar"
           pagination="true"
           fitColumns="true"
           singleSelect="true"
           rownumbers="true"
           striped="true"
           border="false"
           nowrap="false"
           pageList="[5]"
         pageSize="5"
         pagePosition="top">
      <thead>
      <tr>
        <th data-options="field:'oldName',width:fixWidth(0.05),align:'center'" rowspan="2">姓名</th>
        <th data-options="field:'oldPhone',width:fixWidth(0.08),align:'center'" rowspan="2">电话</th>
        <th data-options="field:'oldAddress',width:fixWidth(0.11),align:'center'" rowspan="2">住址</th>
      </tr>
      <tr>
        <th data-options="field:'rName',width:fixWidth(0.08),align:'center',
      formatter: function(value,row,index){
                if (row.relatives.rName){
                    return row.relatives.rName;
                } else {
                    return '';
                }
           }"></th>
        <th data-options="field:'rPhone',width:fixWidth(0.08),align:'center',
      formatter: function(value,row,index){
                if (row.relatives.rPhone){
                    return row.relatives.rPhone;
                } else {
                    return '';
                }
           }"></th>
        <th data-options="field:'rAddress',width:fixWidth(0.11),align:'center',
      formatter: function(value,row,index){
                if (row.relatives.rAddress){
                    return row.relatives.rAddress;
                } else {
                    return '';
                }
           }"></th>
      </tr>
      </thead>
    </table>

</div>
<%--弹出信息框--%>
<div id="dlg_addOldMan" class="easyui-dialog"
     style="width:400px;height:200px;padding:10px 20px" closed="true"
     buttons="#dlg_addOldMan_buttons">
  <form id="addOldMan" method="post">
    <table>
      <tr>
        <td><span class="addButton">老人信息</span></td>
      </tr>
      <tr>
        <td><span class="addButton">姓名：</span></td>
      </tr>
      <%--<tr>--%>
      <%--<td><span class="addButton">网关：</span></td>--%>
      <%--<td><input name="gatewayTwo_Ten" value="2" type="radio"/>二进制<input name="gatewayTwo_Ten" value="10" type="radio">十进制</td>--%>
      <%--</tr>--%>
      <tr>
        <td><span class="addButton">性别：</span></td>
      </tr>
      <tr>
        <td><span class="addButton">年龄：</span></td>
      </tr>
      <tr>
        <td><span class="addButton">电话：</span></td>
      </tr>
      <tr>
        <td><span class="addButton">住址：</span></td>
      </tr>
    </table>
    <input type="hidden" name="oid"/>
  </form>
</div>
<div id="dlg_alertOldMan" class="easyui-dialog"
     style="width:400px;height:400px;padding:10px 20px" closed="true"
     buttons="#dlg_addOldMan_buttons">
  <form id="alertOldMan" method="post">
    <table>
      <tr>
        <td><span class="addButton">老人报警信息</span></td>
      </tr>
      <tr>
        <td><span class="addButton">姓名：老人1</span></td>
      </tr>
      <tr>
        <td><span class="addButton">电话：</span></td>
      </tr>
      <tr>
        <td><span class="addButton">住址：</span></td>
      </tr>
      <tr>
        <td><span class="addButton">姓名：老人2</span></td>
      </tr>
      <tr>
        <td><span class="addButton">电话：</span></td>
      </tr>
      <tr>
        <td><span class="addButton">住址：</span></td>
      </tr>
    </table>
    <input type="hidden" name="oid"/>
  </form>
</div>

<%--<div id="divAdd">--%>
  <%--&lt;%&ndash;<input type="button" class="btn" value="选择标注样式" onclick="openStylePnl()" />&ndash;%&gt;--%>
  <%--&lt;%&ndash;<input type="button" class="btn" value="关闭" onclick="mkrTool.close();document.getElementById('divStyle').style.display = 'none'" />&ndash;%&gt;--%>
  <%--<div id="divStyle" >--%>
    <%--<ul>--%>
      <%--&lt;%&ndash;<li>&ndash;%&gt;--%>
      <%--&lt;%&ndash;<a onclick="selectStyle(0)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:12px;height:21px;background-position: 0 0" /></a>&ndash;%&gt;--%>
      <%--&lt;%&ndash;<a onclick="selectStyle(1)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:12px;height:21px;background-position: -23px 0" /></a>&ndash;%&gt;--%>
      <%--&lt;%&ndash;<a onclick="selectStyle(2)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:12px;height:21px;background-position: -46px 0" /></a>&ndash;%&gt;--%>
      <%--&lt;%&ndash;<a onclick="selectStyle(3)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:12px;height:21px;background-position: -69px 0" /></a>&ndash;%&gt;--%>
      <%--&lt;%&ndash;<a onclick="selectStyle(4)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:12px;height:21px;background-position: -92px 0" /></a>&ndash;%&gt;--%>
      <%--&lt;%&ndash;<a onclick="selectStyle(5)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:12px;height:21px;background-position: -115px 0" /></a>&ndash;%&gt;--%>
      <%--&lt;%&ndash;</li>&ndash;%&gt;--%>
      <%--<li>--%>
        <%--<a onclick="selectStyle(6)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:19px;height:25px;background-position: 0 -21px" /></a>--%>
      <%--</li>--%>
      <%--<li>--%>
        <%--<a onclick="selectStyle(12)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:17px;height:21px;background-position: 0 -46px " /></a>--%>
        <%--<a onclick="selectStyle(13)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:17px;height:21px;background-position: -23px  -46px " /></a>--%>
        <%--<a onclick="selectStyle(14)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:17px;height:21px;background-position: -46px  -46px " /></a>--%>
        <%--<a onclick="selectStyle(15)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:17px;height:21px;background-position: -69px  -46px " /></a>--%>
        <%--<a onclick="selectStyle(16)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:17px;height:21px;background-position: -92px  -46px " /></a>--%>
        <%--<a onclick="selectStyle(17)" href = 'javascript:void(0)'><img src="http://api.map.baidu.com/library/MarkerTool/1.2/examples/images/transparent.gif" style="width:17px;height:21px;background-position: -115px  -46px " /></a>--%>
      <%--</li>--%>
    <%--</ul>--%>
  <%--</div>--%>
<%--</div>--%>
</body>
<script type="text/javascript">
  $("#datagrid2").datagrid({onClickRow : function(index, row){
      $('#dlg_addOldMan').dialog('open').dialog('setTitle', '老人信息');
    }});
  function alertOldman(){
    $('#dlg_alertOldMan').dialog('open').dialog('setTitle', '老人报警信息');
  }
    $(function(){
        $(".active",parent.document).removeClass("active");
        $("#index + li + li",parent.document).addClass("active");
    });
</script>
<style>
  .BMap_cpyCtrl{
    display:none;
  }
  .anchorBL{
    display:none;
  }
</style>
<script type="text/javascript" src="${path}/js/map.js"></script>


</html>
