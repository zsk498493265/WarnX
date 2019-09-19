<%@page language="java" import="java.util.*" pageEncoding="utf-8" %>
<%@include file="/WEB-INF/jsp/common/easyui.jsp" %>
<html>
<head>
  <title>人员信息</title>

    <link rel="stylesheet" type="text/css" href="${path}/css/data.css"/>
    <!--
      themes/insdep/easyui_plus.css
      Insdep对easyui的额外增强样式,内涵所有 insdep_xxx.css 的所有组件样式
      根据需求可单独引入insdep_xxx.css或不引入，此样式不会对easyui产生影响
  -->
    <%--<link href="${path}/easyUI_insdep/themes/insdep/easyui_plus.css" rel="stylesheet" type="text/css">--%>

    <!--
        themes/insdep/insdep_theme_default.css
        Insdep官方默认主题样式,更新需要自行引入，此样式不会对easyui产生影响
    -->
    <%--<link href="${path}/easyUI_insdep/themes/insdep/insdep_theme_default.css" rel="stylesheet" type="text/css">--%>

    <!--
        themes/insdep/icon.css
        美化过的easyui官方icons样式，根据需要自行引入
    -->
    <%--<link href="${path}/easyUI_insdep/themes/insdep/icon.css" rel="stylesheet" type="text/css">--%>
  <script type="text/javascript" src="${path}/js/data_js.js"></script>
    <script type="text/javascript" src="${path}/js/common.js"></script>
    <%--百度地图--%>
    <script type="text/javascript" src="http://api.map.baidu.com/api?v=1.3"></script>
  <%--<script type="text/javascript" src="${path}/js/paper_author.js"></script>--%>
</head>
<body class="easyui-layout" fit="true">
<div region="center" border="false" style="overflow: hidden; width: 90%;height: 80%">
  <table id="datagrid" class="easyui-datagrid" fit="true" url="${path}/data/datagrid"
         toolbar="#toolbar"
         pagination="true"
         fitColumns="true"
         singleSelect="true"
         rownumbers="true"
         striped="true"
         border="false"
         nowrap="false">
    <thead>
    <tr>
      <th data-options="field:'oid',width:fixWidth(0.05),align:'center'" rowspan="2">人员ID</th>
      <th data-options="field:'oldName',width:fixWidth(0.05),align:'center'" rowspan="2">姓名</th>
        <%--<th data-options="field:'gatewayID',width:fixWidth(0.09),align:'center'" rowspan="2">网关</th>--%>
        <%--<th data-options="field:'segment',width:fixWidth(0.09),align:'center',formatter:formatActionSegment" rowspan="2">网段标识</th>--%>
      <th data-options="field:'oldPhone',width:fixWidth(0.08),align:'center'" rowspan="2">电话</th>
      <th data-options="field:'oldAddress',width:fixWidth(0.14),align:'center'" rowspan="2">住址</th>
      <%--<th data-options="field:'oldRegtime',width:fixWidth(0.08),align:'center'" rowspan="2">注册时间</th>--%>
      <%--<th data-options="field:'rooms',width:fixWidth(0.052),align:'center',formatter:formatActionRoom" rowspan="2">房间</th>--%>
        <%--<th data-options="field:'equips',width:fixWidth(0.052),align:'center',formatter:formatActionEquip" rowspan="2">设备</th>--%>
        <th data-options="field:'familyService',width:fixWidth(0.052),align:'center'" rowspan="2">居家服务</th>
        <th data-options="field:'careSystem',width:fixWidth(0.052),align:'center'" rowspan="2">关怀系统</th>
        <th data-options="field:'camera',width:fixWidth(0.052),align:'center'" rowspan="2">摄像头</th>
        <th data-options="field:'oldQQ',width:fixWidth(0.052),align:'center'" rowspan="2">QQ号</th>
        <th data-options="field:'oldPwd',width:fixWidth(0.052),align:'center'" rowspan="2">QQ密码</th>

        <th data-options="field:'relid',hidden:true,formatter: function(value,row,index){if (row.relatives.relid){return row.relatives.relid;} else {return '';}}">紧急联系人ID</th>
    </tr>
    <tr style="display: none">
      <th data-options="field:'gatewayID',width:fixWidth(0.08),align:'center',hidden:true,
      formatter: function(value,row,index){

                    return '';

           }">姓名</th>
      <th data-options="field:'gatewayID',width:fixWidth(0.08),align:'center',hidden:true,
      formatter: function(value,row,index){
              return '';
           }">电话</th>
      <th data-options="field:'gatewayID',width:fixWidth(0.13),align:'center',hidden:true,
      formatter: function(value,row,index){
               return '';

           }">住址</th>
        <th data-options="field:'gatewayID',hidden:true,
      formatter: function(value,row,index){

               return '';
           }">紧急联系人对应人员ID</th>
    </tr>
    </thead>
  </table>

  <!-- 总控按钮 -->
  <div id="toolbar">
      <div id="buttonTool">
    <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-plus-square"
        plain="true" onclick="addDialog();"><span>新增</span></a>
    <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-pencil"
       plain="true" onclick="alt();"><span>修改</span></a>
    <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-trash"
       plain="true" onclick="del();"><span>删除</span></a>
          <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-download"
             plain="true" onclick="exportfile();"><span>导出</span></a>
          <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-refresh"
             plain="true" onclick="refresh();"><span>刷新</span></a>
      </div>
    <form id="search" method="post" action="${paht}/data/datagrid" novalidate>
        <%--<label>ID：</label>--%>
        <input class="easyui-searchbox" data-options="prompt:'人员ID'"  style="width:10%" name="oid" />
            <input class="easyui-searchbox" data-options="prompt:'姓名'" style="width:10%" name="oldName" />
            <input class="easyui-searchbox" data-options="prompt:'网关',validType:'length[1,4]'" style="width:10%" name="gatewayID" />
            <input class="easyui-searchbox" data-options="prompt:'网段标识',validType:'length[1,4]'" style="width:10%" name="segment" />
        <input class="easyui-searchbox" data-options="prompt:'电话'" style="width:10%" name="oldPhone" />
        <input class="easyui-searchbox" data-options="prompt:'地址'" style="width:15%" name="oldAddress"/>
        <input  data-options="prompt:'注册日期'" style="width:10%" name="oldRegtime" class="easyui-datebox" />
        <a href="javascript:void(0);" class="easyui-linkbutton fa fa-search aaa toolB"
           plain="true" id="searchB" onclick="formSearch()"><span>查询</span></a>
    </form>
  </div>



  <!-- 删除对话框 -->
  <div id="dlg_del" class="easyui-dialog"
       style="width:300px;height:200px;padding:10px 20px" closed="true"
       buttons="#dlg_del_buttons">
    <form id="delOldMan" method="post" novalidate>
      <label>确定删除吗？</label>
    </form>
  </div>

  <!-- 删除对话框按钮 -->
  <div id="dlg_del_buttons">
    <a href="javascript:void(0)" class="easyui-linkbutton c6"
       iconCls="icon-ok" onclick="conf_del()" style="width:90px"><span class="addButton">删除</span></a>
    <a href="javascript:void(0)" class="easyui-linkbutton"
       iconCls="icon-cancel" onclick="javascript:$('#dlg_del').dialog('close')"
       style="width:90px"><span class="addButton">取消</span></a>
  </div>



  <!-- 修改对话框 -->
  <div id="dlg_altOldMan" class="easyui-dialog"
       style="width:400px;height:400px;padding:10px 20px" closed="true"
       buttons="#dlg_altOldMan_buttons">
    <form id="altOldMan" method="post" novalidate>
        <table>
            <tr>
                <td><span class="addButton">人员信息：</span></td>
            </tr>
            <tr>
                <td><span class="addButton">人员姓名：</span></td>
                <td><input name="oldName" class="auto" type="text"/></td>
            </tr>
            <%--<tr>--%>
                <%--<td><span class="addButton">网关：</span></td>--%>
                <%--<td><input name="gatewayTwo_TenE" value="2" type="radio"/>二进制<input name="gatewayTwo_TenE" value="10" type="radio">十进制</td>--%>
            <%--</tr>--%>
            <tr>
                <td><span class="addButton">网关：</span></td>
                <td><input name="gatewayID" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">网段标识：</span></td>
                <td><input name="segmentTwo_TenE" value="2" type="radio"/>二进制<input name="segmentTwo_TenE" value="10" type="radio">十进制</td>
            </tr>
            <tr>
                <td><span class="addButton"></span></td>
                <td><input name="segment" class="auto" type="text" maxlength="4"/></td>
            </tr>
            <tr>
                <td><span class="addButton">人员电话：</span></td>
                <td><input name="oldPhone" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">人员住址：</span></td>
                <td><input name="oldAddress" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><input name="oldRegtime" class="auto" type="hidden"/></td>
            </tr>
            <tr>
                <td><span class="addButton">紧急联系人信息：</span></td>
                <input type="hidden" name="relatives.relid" class="auto"/>
            </tr>
            <tr>
                <td><span class="addButton">姓名：</span></td>
                <td><input name="relatives.rName" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">电话：</span></td>
                <td><input name="relatives.rPhone" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">住址：</span></td>
                <td><input name="relatives.rAddress" class="auto" type="text"/></td>
            </tr>
        </table>
        <input type="hidden" name="oid" class="auto"/>
    </form>
  </div>

  <!-- 修改对话框按钮 -->
  <div id="dlg_altOldMan_buttons">
    <a href="javascript:void(0)" class="easyui-linkbutton c6"
       iconCls="icon-ok" onclick="alt_save()" style="width:90px"><span class="addButton">修改</span></a>
    <a href="javascript:void(0)" class="easyui-linkbutton"
       iconCls="icon-cancel" onclick="javascript:$('#dlg_altOldMan').dialog('close')"
       style="width:90px"><span class="addButton">取消</span></a>
  </div>


  <!-- 新增人员对话框 -->
  <div id="dlg_addOldMan" class="easyui-dialog"
       style="width:400px;height:400px;padding:10px 20px" closed="true"
       buttons="#dlg_addOldMan_buttons">

    <form id="addOldMan" method="post">
      <table>
        <tr>
            <td><span class="addButton">人员信息：</span></td>
        </tr>
          <tr>
              <td><span class="addButton">人员姓名：</span></td>
              <td><input name="oldName" class="easyui-textbox" type="text"></td>
          </tr>
          <%--<tr>--%>
              <%--<td><span class="addButton">网关：</span></td>--%>
              <%--<td><input name="gatewayTwo_Ten" value="2" type="radio"/>二进制<input name="gatewayTwo_Ten" value="10" type="radio">十进制</td>--%>
          <%--</tr>--%>
          <tr>
              <td><span class="addButton">网关：</span></td>
              <td><input name="gatewayID" class="easyui-textbox" type="text"></td>
          </tr>
          <tr>
              <td><span class="addButton">网段标识：</span></td>
              <td><input name="segmentTwo_Ten" value="2" type="radio"/>二进制<input name="segmentTwo_Ten" value="10" type="radio">十进制</td>
          </tr>
          <tr>
              <td><span class="addButton"></span></td>
              <td><input name="segment" class="easyui-textbox" type="text" data-options="validType:'length[1,4]'"></td>
          </tr>
        <tr>
            <td><span class="addButton">人员电话：</span></td>
          <td><input name="oldPhone" class="easyui-textbox" type="text"></td>
        </tr>
        <tr>
            <td><span class="addButton">人员住址：</span></td>
          <td><input name="oldAddress" class="easyui-textbox" type="text"></td>
        </tr>
          <tr style="display: none">
              <td><span class="addButton">经度：</span></td>
              <td><input name="jd" id="jd" type="text"/></td>
          </tr>
          <tr style="display: none">
              <td><span class="addButton">纬度：</span></td>
              <td><input name="wd" id="wd" type="text"/></td>
          </tr>
          <tr>
              <td><span class="addButton">QQ号：</span></td>
              <td><input name="oldQQ" class="easyui-textbox" type="text"></td>
          </tr>
          <tr>
              <td><span class="addButton">QQ密码：</span></td>
              <td><input name="oldPwd" class="easyui-textbox" type="text"></td>
          </tr>
          <tr>
              <td><span class="addButton">是否参与居家养老系统（参加填1,不参加填0）：</span></td>
              <td><input name="family_service" class="easyui-textbox" type="text"></td>
          </tr>
          <tr>
              <td><span class="addButton">是否参与关怀系统（参加填1,不参加填0）：</span></td>
              <td><input name="care_system" class="easyui-textbox" type="text"></td>
          </tr>
          <tr>
              <td><span class="addButton">是否安装摄像头（安装填1,未安装填0）：</span></td>
              <td><input name="camera" class="easyui-textbox" type="text"></td>
          </tr>
        <tr style="display: none">
            <td><span class="addButton">姓名：</span></td>
          <td><input name="relatives.rName" class="easyui-textbox" type="text"></td>
        </tr>
        <tr style="display: none">
            <td><span class="addButton">电话：</span></td>
          <td><input name="relatives.rPhone" class="easyui-textbox" type="text"></td>
        </tr>
        <tr style="display: none">
            <td><span class="addButton">住址：</span></td>
          <td><input name="relatives.rAddress" class="easyui-textbox" type="text"></td>
        </tr>
          <%--经纬度--%>

      </table>

        <input type="hidden" name="oid"/>
    </form>
      <div style="width:100px;margin:auto;">
          要查询的地址：<input id="text_" type="text" value="宁波天一广场" style="margin-right:100px;"/>
          查询结果(经纬度)：<input id="result_" type="text" />
          <input type="button" value="查询" onclick="searchByStationName();"/>
          <div id="container"
               style="position: absolute;
                margin-top:30px;
                width: 730px;
                height: 590px;
                top: 50px;
                border: 1px solid gray;
                display: none;
                overflow:hidden;">
          </div>
      </div>
  </div>

  <!-- 新增人员对话框按钮 -->
  <div id="dlg_addOldMan_buttons">
    <a href="javascript:void(0)" class="easyui-linkbutton c6"
       iconCls="icon-ok" onclick="saveOldMan()" style="width:90px"><span class="addButton">保存</span></a>
    <a href="javascript:void(0)" class="easyui-linkbutton"
       iconCls="icon-cancel" onclick="javascript:$('#dlg_addOldMan').dialog('close')"
       style="width:90px"><span class="addButton">取消</span></a>
  </div>


</div>
<script type="text/javascript">
    var map = new BMap.Map("container");
    map.centerAndZoom("宁波", 12);
    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
    map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开

    var localSearch = new BMap.LocalSearch(map);
    localSearch.enableAutoViewport(); //允许自动调节窗体大小
    function searchByStationName() {
        map.clearOverlays();//清空原来的标注
        var keyword = document.getElementById("text_").value;
        localSearch.setSearchCompleteCallback(function (searchResult) {
            var poi = searchResult.getPoi(0);
            document.getElementById("result_").value = poi.point.lng + "," + poi.point.lat;
            document.getElementById("jd").value = poi.point.lng;
            document.getElementById("wd").value = poi.point.lat;
            alert(document.getElementById("wd").value);
            //alert(document.getElementById("jwd").value);
            map.centerAndZoom(poi.point, 13);
            var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
            map.addOverlay(marker);
            var content = document.getElementById("text_").value + "<br/><br/>经度：" + poi.point.lng + "<br/>纬度：" + poi.point.lat;
            var infoWindow = new BMap.InfoWindow("<p style='font-size:14px;'>" + content + "</p>");
            marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
            // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        });
        localSearch.search(keyword);
    }
</script>
</body>
</html>
