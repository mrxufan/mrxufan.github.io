 var upOrgId; //数据表格当前点击上级机构id
 var clickOrgId; //当前点击树状id

 var reg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证




 $(function() {



     // 树状数据
     $('#tree').treeview({
         data: getTree()
     });
     // 树状数据事件
     $('#tree').on('nodeSelected', function(event, data) {
         console.log('树状菜单', data);
         clickOrgId = data.id;
         $("#tb_departments").bootstrapTable('refresh');

     });
     //1.初始化Table
     var oTable = new TableInit();
     oTable.Init();

     //2.初始化Button的点击事件
     var oButtonInit = new ButtonInit();
     oButtonInit.Init();
     var button = document.getElementsByTagName("button");
     //2、遍历这些对象找到name是“refresh”的对象
     //3、给该对象设置唯一的id然后利用js中的方法给这个id的对象设置高度、宽度即可
     for (i = 0; i < button.length; i++) {
         if (button[i].name == 'refresh') {
             button[i].id = 'toolbar_refresh';
             var btns = document.getElementById('toolbar_refresh')
             $(btns).css("background-color", "#FFFFFF").css("width", "45px").css("height", "26px").css("border", "1px solid #27aae1").css("border-radius", "2px").css("padding", "4px").css("margin-right", "10px").css("margin-bottom", "0px").css("margin-top", "15px");
             $(btns).children().css("color", "#27aae1");
         }
     }

     $(".dropdown-toggle").css("background-color", "#FFFFFF").css("width", "45px").css("height", "26px").css("border", "1px solid #27aae1").css("border-radius", "2px").css("padding", "4px")
     $(".dropdown-toggle").children().css("color", "#27aae1");
     $(".dropdown-toggle").parent().css("margin", "0").css("padding-top", "15px");



     // 点击表格树状图
     $(document).on('click', '#txt_departmentname', function() {
         var options = {
             bootstrap2: false,
             showTags: true,
             levels: 5,
             checkedIcon: "glyphicon glyphicon-check",
             data: getTree(),
             onNodeSelected: function(event, data) {
                 console.log(data);
                 $("#txt_departmentname").val(data.text);
                 $("#treeviews").hide();
                 upOrgId = data.id;
                 console.log('上级机构id:' + upOrgId);
             }
         };
         $('#treeviews').treeview(options);
         $('#treeviews').show();

     });

 });

 //查询
 function searchBtn() {
     console.log('查询');
     if ($('#orgName').val() == '' && $('#orgSimpleName').val() == '') {
         return;
     }
     $("#tb_departments").bootstrapTable('refresh');
 }
 //重置
 function resetBtn() {
     console.log('重置');
     location.reload();
 }

 // 树状菜单
 function getTree() {
     var tree = "";
     $.ajax({
         url: 'tree.json',
         type: 'get',
         async: false,
         success: function(data) {
             console.log('树状', data);
             tree = JSON.stringify(data.data);
         }
     });
     return tree;
 }





 //初始化Table
 var TableInit = function() {
     var oTableInit = new Object();
     oTableInit.Init = function() {
         $('#tb_departments').bootstrapTable({
             url: 'table.json',
             method: 'get',
             locale: 'zh-CN',
             toolbar: '#toolbar', //工具按钮用哪个容器
             striped: true, //是否显示行间隔色
             cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
             pagination: true, //是否显示分页（*）
             sortable: true, //是否启用排序
             sortOrder: "asc", //排序方式
             queryParams: oTableInit.queryParams, //查询参数
             sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
             pageNum: 1, //初始化加载第一页，默认第一页
             pageSize: 8, //每页的记录行数（*）
             pageList: [10], //可供选择的每页的行数（*）
             search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
             strictSearch: true,
             showColumns: true, //是否显示所有的列
             showRefresh: true, //是否显示刷新按钮
             minimumCountColumns: 2, //最少允许的列数
             clickToSelect: true, //是否启用点击选中行
             // height: $(window).height(), //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
             uniqueId: "areaId", //每一行的唯一标识，一般为主键列
             showToggle: false, //是否显示详细视图和列表视图的切换按钮
             cardView: false, //是否显示详细视图
             detailView: false, //是否显示父子表
             columns: [{
                 checkbox: true
             }, {
                 field: 'name1',
                 align: 'center',
                 title: '申请单号'
             }, {
                 field: 'name2',
                 align: 'center',
                 title: '申请时间'
             }, {
                 field: 'name3',
                 align: 'center',
                 title: '申请人'
             }, {
                 field: 'name4',
                 align: 'center',
                 title: '工号'
             }, {
                 field: 'name5',
                 align: 'center',
                 title: '部门'
             }, 
             {
                 field: 'name6',
                 align: 'center',
                 title: '操作',
                 events: operateEvents,
                 formatter: function(value, row, index) {
                     var result = "<a href='javascript:;' class='info'>详情</a>";
                     return result;
                 }
             }, 
             {
                 field: 'name7',
                 align: 'center',
                 title: '状态'
             }],

             //加载成功时执行
             onLoadSuccess: function(data) {
                 console.log('成功加载表格数据', data);
                 $('.fixed-table-container').css({ 'height': $(window).height() - 290 + 'px' })
                 $('.panel-body').css({ 'height': $(window).height() + 'px' });
             },
             //加载失败时执行
             onLoadError: function() {},
             onClickRow: function(row, $element) {}
         });
     };

     //得到查询的参数
     oTableInit.queryParams = function(params) {
         var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
             pageSize: params.limit, //页面大小
             pageNum: params.offset, //页码
             orgName: $('#orgName').val(),
             orgSimpleName: $('#orgSimpleName').val(),
             orgId: clickOrgId
         };
         return temp;
     };


     return oTableInit;
 };


 // 导出
 $('#btn_export').on('click', function() {
     location.href = port + '/organize/export';
 });


 // 导入
 $("#btn_import").on('click', function() {
     console.log('导入');
     layer.open({
         type: 1,
         title: '导入',
         btn: ['导入', '关闭'],
         btnAlign: 'c',
         area: ['470px', '320px'],
         yes: function(index, layero) {
             console.log('导入');
             // layer.close(index);
         },
         content: `
                <div class="modal-body" style="overflow: hidden;margin-top: 20px;">
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: center">
                                    <label for="remarks">模板：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <a href="javascript:;"><strong>点击下载模板</strong></a>
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="margin-top: 20px;">
                                <form id="importFile" name="importFile" class="form-horizontal" method="post" enctype="multipart/form-data">
                                    <div class="col-md-3" style="padding: 0;margin: 0;text-align: center">
                                        <label class="control-label">选择文件：</label>
                                    </div>
                                    <div class="col-md-8" style="padding: 0;margin: 0">
                                        <input id="importFiles" name="importFiles" type="file" class="file" data-show-preview="false" placeholder="请选择您要导入的Excel文件">
                                    </div>
                                </form>
                            </div>
                        </div>
             `

     });
 });


 // 点击当前行数据详情事件
 window.operateEvents = {
     'click .info': function(e, value, row, index) {
         layer.open({
             type: 2,
             title: '详情',
             btn: '关闭',
             btnAlign: 'c',
             area: ['800px', '500px'],
             success: function(layero, index) {
                 var body = layer.getChildFrame('body', index);
                 var iframeWin = window[layero.find('iframe')[0]['name']];
                 layero.find('.layui-layer-btn0').css('background', '#27AAE1');
             },
             content: 'detail.html'

         });
         console.log('行数据', row);
     }
 };

 // $(document).on('blur','input[name="orgName"]',function(){
 //     console.log('失去焦点')
 // })



 // 工具栏按钮事件
 var ButtonInit = function() {
     var oInit = new Object();
     var postdata = {};

     oInit.Init = function() {
         // 添加表格数据
         $("#btn_add").on('click', function() {
             console.log('添加')
             layer.open({
                 type: 2,
                 title: '添加',
                 area: ['800px', '500px'],
                 btn: ['确定', '取消'],
                 yes: function(index, layero) {
                     console.log('确定1');
                     var orgUp = layero.find('input[name="orgUp"]'); //上级机构
                     var orgNumber = layero.find('input[name="orgNumber"]'); //编号
                     var orgName = layero.find('input[name="orgName"]'); //机构名称
                     var orgSimpleName = layero.find('input[name="orgSimpleName"]'); //机构简称
                     var orgPerson = layero.find('input[name="orgPerson"]'); //负责人
                     var orgPhone = layero.find('input[name="orgPhone"]'); //联系电话
                     var remarks = layero.find('textarea[name="remarks"]'); //备注



                     if (orgUp.val() == '') {
                         layer.msg('请选择上级机构');
                         return;
                     }
                     if (orgNumber.val() == '') {
                         layer.msg('请输入编号');
                         return;
                     }
                     if (orgName.val() == '') {
                         layer.msg('请输入机构名称');
                         return;
                     }
                     if (!reg.test(orgPhone.val().trim())) {
                         layer.msg('电话号码格式不正确');
                         return;
                     }


                     $.ajax({
                         url: port + '/organize/add',
                         type: 'post',
                         data: {
                             parentCode: upOrgId,
                             orgCode: orgNumber.val(),
                             orgName: orgName.val(),
                             orgSimpleName: orgSimpleName.val(),
                             chargePerson: orgPerson.val(),
                             phone: orgPhone.val(),
                             remarks: remarks.val()
                         },
                         success: function(data) {
                             console.log('添加成功' + data);
                             $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                             $('#tree').treeview({ //刷新树状菜单
                                 data: getTree()
                             });
                             location.reload();
                         }
                     });

                     layer.msg('添加成功');
                     layer.close(index);
                 },
                 success: function(layero, index) {

                 },
                 btnAlign: 'c',
                 content: 'addIframe1.html'
             });
         });



         // 修改表格数据
         $("#btn_edit").on('click', function() {
             var a = $("#tb_departments").bootstrapTable('getSelections');
             console.log('修改', a[0]);
             if (a.length == 1) {

                 layer.open({
                     type: 1,
                     title: '修改',
                     area: ['580px', '410px'],
                     btn: ['确定', '取消'],
                     yes: function(index, layero) {
                         console.log('确定');
                         var orgUp = layero.find('input[name="orgUp"]'); //上级机构
                         var orgNumber = layero.find('input[name="orgNumber"]'); //编号
                         var orgName = layero.find('input[name="orgName"]'); //机构名称
                         var orgSimpleName = layero.find('input[name="orgSimpleName"]'); //机构简称
                         var orgPerson = layero.find('input[name="orgPerson"]'); //负责人
                         var orgPhone = layero.find('input[name="orgPhone"]'); //联系电话
                         var remarks = layero.find('textarea[name="remarks"]'); //备注
                         if (orgUp.val() == '') {
                             layer.msg('请选择上级机构');
                             return;
                         }
                         if (orgNumber.val() == '') {
                             layer.msg('请输入编号');
                             return;
                         }
                         if (orgName.val() == '') {
                             layer.msg('请输入机构名称');
                             return;
                         }
                         if (!reg.test(orgPhone.val().trim())) {
                             layer.msg('电话号码格式不正确');
                             return;
                         }



                         $.ajax({
                             url: port + '/organize/edit',
                             type: 'post',
                             data: {
                                 orgId: a[0].orgId,
                                 parentCode: upOrgId,
                                 orgCode: orgNumber.val(),
                                 orgName: orgName.val(),
                                 orgSimpleName: orgSimpleName.val(),
                                 chargePerson: orgPerson.val(),
                                 phone: orgPhone.val(),
                                 remarks: remarks.val()
                             },
                             success: function(data) {
                                 console.log('修改成功' + data);
                                 $("#tb_departments").bootstrapTable('refresh');
                                 $('#tree').treeview({
                                     data: getTree()
                                 });
                                 location.reload();
                             }
                         });

                         layer.msg('修改成功');
                         layer.close(index);
                     },
                     success: function(layero, index) {

                     },
                     btnAlign: 'c',
                     content: `
                     <div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index:999">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>上级机构：</label></div>
                                <div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;">
                                    <input autocomplete="off" name="orgUp" style="background-color: #fff;" readonly type="text" id="txt_departmentname" class="form-control" value="${a[0].orgName}">
                                    <div style="position: absolute;width: 100%;left: 0;top: 33px;" id="treeviews" style="display: none;height: 200px;">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>编号：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" name="orgNumber" type="text" class="form-control" value="${a[0].orgCode}" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>机构名称：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" value="${a[0].orgName}" name="orgName" type="text" class="form-control" />
                                </div>
                            </div>
                        
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>机构简称：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" value="${a[0].orgSimpleName}" name="orgSimpleName" type="text" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>负责人：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" value="${a[0].chargePerson}" name="orgPerson" type="text" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>联系电话：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" value="${a[0].phone}" name="orgPhone" type="text" class="form-control" />
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">
                                    <label>备注：</label>
                                </div>
                                <div class="col-md-10" style="padding: 0;margin: 0;">
                                    <textarea class="form-control" name="remarks" rows="2" style="resize: none;">${a[0].remarks}</textarea>
                                </div>
                            </div>
                        </div>
                 `
                 });


             } else {
                 layer.msg('请选择单行数据');
             }
         });


         // 删除表格数据
         $("#btn_delete").on('click', function() {
             console.log('删除')
             var a = $("#tb_departments").bootstrapTable('getSelections');
             var delData = []; //要删除的数据

             if (a.length == 0) {
                 layer.msg('请选择要删除的数据');
             } else {
                 //获取选中的ID
                 for (var i = 0; i < a.length; i++) {
                     delData[i] = a[i].orgId;
                 }
                 console.log('删除的数据', delData);

                 layer.open({
                     type: 1,
                     title: '提示',
                     area: ['300px', '200px'],
                     btn: ['确定', '取消'],
                     yes: function(index, layero) {
                         $.ajax({
                             url: port + '/organize/delete',
                             type: 'post',
                             data: {
                                 orgId: delData
                             },
                             success: function(data) {
                                 if (data.rescode == '0000') {
                                     $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                     $('#tree').treeview({ //刷新树状菜单
                                         data: getTree()
                                     });
                                     layer.msg('删除成功');
                                     location.reload();
                                 }
                                 if (data.rescode == '0001') {
                                     layer.msg(data.data);
                                 }
                             }
                         });
                         console.log('确定');
                         layer.close(index);
                     },
                     btnAlign: 'c',
                     content: '<div style="margin:20px">确定要删除选中的数据（如果存在子节点，将会一并删除）?</div>'
                 });

             }
         });


     };
     return oInit;
 };