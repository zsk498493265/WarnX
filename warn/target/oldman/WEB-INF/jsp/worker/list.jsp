<%@page language="java" import="java.util.*" pageEncoding="utf-8" %>
<%@include file="/WEB-INF/jsp/common/easyui.jsp" %>
<html>
<head>
  <title>服务人员信息</title>

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
  <script type="text/javascript" src="${path}/js/worker_js.js"></script>
    <script type="text/javascript" src="${path}/js/common.js"></script>
  <%--<script type="text/javascript" src="${path}/js/paper_author.js"></script>--%>
</head>
<body class="easyui-layout" fit="true">
<div region="center" border="false" style="overflow: hidden; width: 90%;height: 80%">
  <table  id="datagrid" class="easyui-datagrid" fit="true" url="${path}/data/datagrid_worker"
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
      <th data-options="field:'id',width:fixWidth(0.05),align:'center'" rowspan="2">人员ID</th>
      <th data-options="field:'name',width:fixWidth(0.05),align:'center'" rowspan="2">姓名</th>
      <th data-options="field:'phone',width:fixWidth(0.08),align:'center'" rowspan="2">电话</th>
      <th data-options="field:'qq',width:fixWidth(0.14),align:'center'" rowspan="2">QQ号</th>
        <th data-options="field:'password',width:fixWidth(0.14),align:'center'" rowspan="2">密码</th>
    </tr>
    <tr>

    </tr>
    </thead>
  </table>

  <!-- 总控按钮 -->
  <div id="toolbar">
      <div id="buttonTool">
    <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-plus-square"
        plain="true" onclick="addWorkerDialog();"><span>新增</span></a>
    <a style="display: none;" href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-pencil"
       plain="true" onclick="alt();"><span>修改</span></a>
    <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-trash"
       plain="true" onclick="del();"><span>删除</span></a>
      </div>
    <form id="search" method="post" action="${paht}/data/datagrid" novalidate>
        <%--<label>ID：</label>--%>
        <input class="easyui-searchbox" data-options="prompt:'人员ID'"  style="width:10%" name="id" />
        <input class="easyui-searchbox" data-options="prompt:'姓名'" style="width:10%" name="name" />
        <input class="easyui-searchbox" data-options="prompt:'电话'" style="width:10%" name="phone" />
        <input class="easyui-searchbox" data-options="prompt:'QQ'" style="width:15%" name="qq"/>
        <a href="javascript:void(0);" class="easyui-linkbutton fa fa-search aaa toolB"
           plain="true" id="searchB" onclick="formSearch()"><span>查询</span></a>
            <a href="javascript:void(0);" class="easyui-linkbutton aaa toolB fa fa-refresh"
               plain="true" onclick="refresh();"><span>刷新</span></a>
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
            <tr>
                <td><span class="addButton">人员ID：</span></td>
                <td><input name="gatewayID" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">电话：</span></td>
                <td><input name="gatewayID" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">密码：</span></td>
                <td><input name="oldAddress" class="auto" type="text"/></td>
            </tr>
            <tr>
                <td><span class="addButton">QQ：</span></td>
                <td><input name="oldAddress" class="auto" type="text"/></td>
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
  <div id="dlg_addWorker" class="easyui-dialog"
       style="width:400px;height:400px;padding:10px 20px" closed="true"
       buttons="#dlg_addOldMan_buttons">
    <form id="addWorker" method="post">
      <table>
        <tr>
            <td><span class="addButton">人员信息：</span></td>
        </tr>
          <tr>
              <td><span class="addButton">人员姓名：</span></td>
              <td><input name="name" class="easyui-textbox" type="text"></td>
          </tr>
          <tr>
              <td><span class="addButton">人员id：</span></td>
              <td><input name="id" class="easyui-textbox" type="text"></td>
          </tr>
        <tr>
            <td><span class="addButton">人员电话：</span></td>
          <td><input name="phone" class="easyui-textbox" type="text"></td>
        </tr>
          <tr>
              <td><span class="addButton">QQ：</span></td>
              <td><input name="qq" class="easyui-textbox" type="text"></td>
          </tr>
        <tr>
            <td><span class="addButton">密码：</span></td>
          <td><input name="password" class="easyui-textbox" type="text"></td>
        </tr>
      </table>
        <input type="hidden" name="oid"/>
    </form>
  </div>

  <!-- 新增人员对话框按钮 -->
  <div id="dlg_addOldMan_buttons">
    <a href="javascript:void(0)" class="easyui-linkbutton c6"
       iconCls="icon-ok" onclick="saveWorker()" style="width:90px"><span class="addButton">保存</span></a>
    <a href="javascript:void(0)" class="easyui-linkbutton"
       iconCls="icon-cancel" onclick="javascript:$('#dlg_addWorker').dialog('close')"
       style="width:90px"><span class="addButton">取消</span></a>
  </div>


</div>

</body>
</html>
