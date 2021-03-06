<%@page language="java" import="java.util.*" pageEncoding="utf-8" %>
<%@include file="/WEB-INF/jsp/common/easyui.jsp" %>
<html>
<head>
  <title>楼管理</title>
  <link rel="stylesheet" type="text/css" href="${path}/css/data_css.css"/>
  <script type="text/javascript" src="${path}/js/street.js"></script>
  <script type="text/javascript" src="${path}/js/common.js"></script>
</head>
<body class="easyui-layout" fit="true">
<div region="center" border="false" style="overflow: hidden;">
  <table id="datagrid" class="easyui-datagrid" fit="true" url="${path}/map/getJieDaoMarkers"
         toolbar="#toolbar"
         pagination="true"
         fitColumns="true"
         singleSelect="true"
         rownumbers="true"
         striped="true"
         border="false"
         nowrap="false" style="overflow: hidden;">
    <thead>
    <tr>
      <th data-options="field:'id',width:fixWidth(0.1),align:'center'">ID</th>
        <th data-options="field:'jName',width:fixWidth(0.2),align:'center'" >街道名</th>
      <th data-options="field:'qid',width:fixWidth(0.1),align:'center'" >对应区ID</th>
        <th data-options="field:'styleIndex',width:fixWidth(0.1),align:'center'" >样式索引</th>
        <th data-options="field:'jX',width:fixWidth(0.1),align:'center'">X坐标</th>
        <th data-options="field:'jY',width:fixWidth(0.1),align:'center'">Y坐标</th>
    </tr>
    </thead>
  </table>

  <!-- 总控按钮 -->
  <div id="toolbar">
      <div id="buttonTool">
          <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-pencil"
             plain="true" onclick="alt();"><span>修改</span></a>
          <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-trash"
             plain="true" onclick="del();"><span>删除</span></a>
          <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-refresh"
             plain="true" onclick="refresh();"><span>刷新</span></a>
      </div>
    <form id="search" method="post" action="${paht}/map/getJieDaoMarkers" novalidate>
        <input class="easyui-searchbox" data-options="prompt:'ID'"  style="width:10%" name="id" />
        <input class="easyui-searchbox" data-options="prompt:'街道名'"  style="width:10%" name="jName" />
        <input class="easyui-searchbox" data-options="prompt:'对应区ID'"  style="width:10%" name="qid" />
        <a href="javascript:void(0);" class="easyui-linkbutton fa fa-search aaa toolB"
           plain="true" onclick="formSearch()"><span>查询</span></a>
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
            <input type="hidden" class="auto" name="id">
            <table>
                <tr>
                    <td><span class="addButton">街道名：</span></td>
                    <td><input name="jName" class="auto" type="text"/></td>
                </tr>
                <tr>
                    <td><span class="addButton">对应区ID：</span></td>
                    <td><input name="qid" class="auto" type="text"/>
                </tr>
                <tr>
                    <td><span class="addButton">样式索引：</span></td>
                    <td><input name="styleIndex" class="auto" type="text"/>
                </tr>
            </table>
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


</div>


</body>
</html>
