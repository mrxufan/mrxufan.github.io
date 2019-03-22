 //$('#tree').treeview(options);
    $(function() {
        $('#tree').treeview({
            data: getTree()//节点数据
        });
        $('#tree').on('nodeSelected', function(event, data) {
            //console.log(data.id);
            //alert(data.id);
            //重载表格事件
        });
        //1.初始化Table
        var oTable = new TableInit();
        oTable.Init();



        //2.初始化Button的点击事件
        var oButtonInit = new ButtonInit();
        oButtonInit.Init();
         console.log("窗口高度>>>:"+$(window).parent().height())
        //panel_organize
        //1、获取所有button对象
        var button = document.getElementsByTagName("button");
        //2、遍历这些对象找到name是“refresh”的对象
        //3、给该对象设置唯一的id然后利用js中的方法给这个id的对象设置高度、宽度即可
        for(i=0;i<button.length;i++){
            if(button[i].name=='refresh'){
                button[i].id = 'toolbar_refresh';
                var btns = document.getElementById('toolbar_refresh')
                $(btns).css("background-color","#FFFFFF").css("width","45px").css("height","26px").css("border","1px solid #27aae1").css("border-radius","2px").css("padding","4px").css("margin-right","10px").css("margin-bottom","0px").css("margin-top","15px");
                $(btns).children().css("color","#27aae1");
                console.log("init success!")
            }
        }

        $(".dropdown-toggle").css("background-color","#FFFFFF").css("width","45px").css("height","26px").css("border","1px solid #27aae1").css("border-radius","2px").css("padding","4px")
        $(".dropdown-toggle").children().css("color","#27aae1");
        $(".dropdown-toggle").parent().css("margin","0").css("padding-top","15px");

        $("#selectdemo").select2();

        $('#startTime').datetimepicker({
            format: 'YYYY-MM-DD hh:mm:ss',
            locale: moment.locale('zh-cn')
        });


        $("#txt_departmentname").click(function() {
            var options = {
                bootstrap2 : false,
                showTags : true,
                levels : 5,
                showCheckbox : true,
                checkedIcon : "glyphicon glyphicon-check",
                data : getTree(),
                onNodeSelected : function(event, data) {
                    $("#txt_departmentname").val(data.text+"/"+data.id);
                    $("#treeviews").hide();
                }
            };
            $('#treeviews').treeview(options);
        });

        $("#addOrganize").on('click',function () {
            var pd =  $("#addModalLabel").html();
            if(pd == "添加模态窗"){
                //获取数据
                $.ajax({
                    url:"#",
                    type:'POST',
                    async:false,
                    data:{},
                    success:function (data) {

                            $("#addModal").modal('hide');
                            $("#tb_departments").bootstrapTable('refresh');
                            $('#tree').treeview({
                                data: getTree()//节点数据
                            });
                            swal({
                                title: "添加成功!",
                                text: "",
                                icon: "success",
                                button: "关闭",
                            });

                    },
                    error:function (a,b,c) {
                        $("#addModal").modal('hide');
                        swal({
                            title: "添加成功!",
                            text: "",
                            icon: "success",
                            button: "关闭",
                        });
                    }
                })
            }else{
                $.ajax({
                    url:"#",
                    type:"POST",
                    async:false,
                    data:{},
                    success:function (data) {
                        $("#addModal").modal('hide');
                        $("#tb_departments").bootstrapTable('refresh');
                        $('#tree').treeview({
                            data: getTree()//节点数据
                        });
                        swal({
                            title: "更新成功!",
                            text: "",
                            icon: "success",
                            button: "关闭",
                        });
                    },
                    error:function (a,b,c) {
                        $("#addModal").modal('hide');
                        $("#tb_departments").bootstrapTable('refresh');
                        $('#tree').treeview({
                            data: getTree()//节点数据
                        });
                        swal({
                            title: "更新成功!",
                            text: "",
                            icon: "success",
                            button: "关闭",
                        });
                    }
                })
            }
             $('.swal-modal').prepend('<div class="tip">'+'<h4 class="tip-item">'+'提示</h4></div>');
        })

    })

    //查询
    function search(){
        $("#tb_departments").bootstrapTable('refresh');
    }
    //重置
    function reset(){
        $("#txt_search_departmentname").val("");
        $("#txt_search_statu").val("");
    }
    function getTree() {
        //节点上的数据遵循如下的格式：
        var tree="";
        $.ajax({
            url:"tree.json",
            async:false,
            success:function (data) {
                tree = JSON.stringify(data.data);
                console.log(tree);
            }
        });
        return tree;
    }


    var TableInit = function () {
        var oTableInit = new Object();
        //初始化Table
        oTableInit.Init = function () {
            $('#tb_departments').bootstrapTable({
                url: 'demo.json',         //请求后台的URL（*）
                method: 'get',                      //请求方式（*）
                locale:'zh-CN',
                toolbar: '#toolbar',                //工具按钮用哪个容器
                striped: true,                      //是否显示行间隔色
                cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true,                   //是否显示分页（*）
                sortable: true,                     //是否启用排序
                sortOrder: "asc",                   //排序方式
                queryParams: oTableInit.queryParams,//传递参数（*）
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                pageNumber:1,                       //初始化加载第一页，默认第一页
                pageSize: 13,                       //每页的记录行数（*）
                pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
                search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
                strictSearch: true,
                showColumns: true,                  //是否显示所有的列
                showRefresh: true,                  //是否显示刷新按钮
                minimumCountColumns: 2,             //最少允许的列数
                clickToSelect: true,                //是否启用点击选中行
                //height: 650,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
                uniqueId: "sid",                     //每一行的唯一标识，一般为主键列
                showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
                cardView: false,                    //是否显示详细视图
                detailView: false,                   //是否显示父子表
                columns: [{
                    checkbox: true
                }, {
                    field: 'sCode',
                    align:'center',
                    title: '字段编码'
                }, {
                    field: 'sCode1',
                    align:'center',
                    title: '字段编码1'
                }, {
                    field: 'sCode2',
                    align:'center',
                    title: '字段编码2'
                }, {
                    field: 'sCode3',
                    align:'center',
                    title: '字段编码3'
                },{
                    field: 'sCode4',
                    align:'center',
                    title: '字段编码4'
                }, {
                    field: 'times',
                    align:'center',
                    title: '时间'
                }],
                onLoadSuccess: function () {

                },
                onLoadError: function () {
                    //数据加载失败
                },
                onDblClickRow: function (row, $element) {
                    alert("您双击了行"+row.sid);
                },
            });
        };

        //得到查询的参数
        oTableInit.queryParams = function (params) {
            var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.limit,   //页面大小
                offset: params.offset,  //页码
            };
            return temp;
        };
        return oTableInit;
    };


    var ButtonInit = function () {
        var oInit = new Object();
        var postdata = {};

        oInit.Init = function () {
            $("#btn_add").on('click',function () {
                $("#addModalLabel").html("添加模态窗");
                $("#addOrganize").html("添加");
                $("#addModal").modal('show');
            });
            $("#btn_edit").on('click',function () {
                var a = $("#tb_departments").bootstrapTable('getSelections');
                if(a.length==1){
                    $("#addOrganize").html("更新");
                    $("#addModalLabel").html("修改模态窗");
                    $("#addModal").modal('show');

                }else{
                    swal("请选择单行数据!","","warning");
                     $('.swal-modal').prepend('<div class="tip">'+'<h4 class="tip-item">'+'提示</h4></div>');
                }
            });

            $("#btn_delete").on('click',function () {
                var a = $("#tb_departments").bootstrapTable('getSelections');
                if(a.length<1){
                    swal("请选择您要删除的数据!","","warning");
                }else{
                    var length = [];
                    //获取选中的ID
                    for(var i =0;i<a.length;i++){
                        length[i] = a[i].orgId;
                    }
                    swal({
                        title: "你确定要删除选中数据吗?",
                        text: "执行删除操作后，该级别下如果存在子集将不会被删除！",
                        icon: "warning",
                        buttons: ["取消", "删除"],
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            //执行删除操作
                            $.ajax({
                                url:"#",
                                async:false,
                                type:"POST",
                                data:{orgIds:length},
                                success:function (data) {
                                    if(data.rescode == "0000"){
                                        $("#tb_departments").bootstrapTable('refresh');
                                        $('#tree').treeview({
                                            data: getTree()//节点数据
                                        });
                                        swal("删除成功！", {
                                            icon: "success",
                                            button:"确定"
                                        });
                                    }else{
                                        $("#tb_departments").bootstrapTable('refresh');
                                        $('#tree').treeview({
                                            data: getTree()//节点数据
                                        });
                                        swal(data.data, {
                                            icon: "error",
                                            button:"确定"
                                        });
                                    }
                                },
                                error:function (a,b,c) {
                                    swal({
                                        title: "删除成功!",
                                        text: "",
                                        icon: "success",
                                        button: "关闭",
                                    });
                                }
                            });

                        } else {
                            console.log("取消删除！");
                        }
                });

              }
                 $('.swal-modal').prepend('<div class="tip">'+'<h4 class="tip-item">'+'提示</h4></div>');
            });

            $("#btn_import").on('click',function () {
                $("#importModal").modal('show');
            })
        };
        return oInit;
    };