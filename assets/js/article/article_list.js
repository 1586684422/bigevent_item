$(function() {
    // 定义q保存需要传递的参数
    let q = {
        pagenum: 1, // 页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的ID
        state: '', //文章发布状态
    }


    // 时间过滤器formatting
    template.defaults.imports.formatting = function(time) {
        let newTime = new Date(time);

        let y = newTime.getFullYear();
        y = y < 10 ? '0' + y : y;

        let m = newTime.getMonth() + 1;
        m = m < 10 ? '0' + m : m;

        let s = newTime.getDate();
        s = s < 10 ? '0' + s : s;

        let hh = newTime.getHours();
        hh = hh < 10 ? '0' + hh : hh;

        let mm = newTime.getMinutes();
        mm = mm < 10 ? '0' + mm : mm;

        let ss = newTime.getSeconds();
        ss = ss < 10 ? '0' + ss : ss;

        return y + '-' + m + '-' + s + ' ' + hh + ':' + mm + ':' + ss;
    }


    // 获取文章分类列表
    getArtSort();
    // 获取文章列表
    getArtList();


    // 筛选
    $('#form_filter').on('submit', function(e) {
        // 阻止默认提交事件
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        q.cate_id = cate_id;
        q.state = state;
        console.log(cate_id, state);
        // 获取文章列表
        getArtList();
    })


    // 删除文章
    let indexDel = null;
    $('body').on('click', '.btnDelete', function() {
        let id = $(this).attr('data-id');
        indexDel = layui.layer.confirm('确认删除此文章?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg('删除文章失败!');
                    // 删除时判断还有几个按钮,如果只剩一个,则删完页码值-1
                    if ($('.btnDelete').length === 1 && q.pagenum !== 1) {
                        q.pagenum -= 1;
                    }
                    layui.layer.msg('删除文章成功!');
                    // 获取文章列表
                    getArtList();
                    layer.close(indexDel);
                }
            });
        });
    })


    // 修改文章
    let indexEdit = null;
    $('body').on('click', '.btnEdit', function() {

        let id = $(this).attr('data-id');
        // 发送请求获取相应信息
        $.ajax({
            type: 'get',
            url: '/my/article/' + id,
            success: function(res) {
                console.log(res)
                layui.form.val("form-pub", res.data);
            }
        });

    })


    // 获取文章分类列表
    function getArtSort() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) return layui.layer.msg('获取文章分类列表失败!');
                let htmlStr = template('tpl_select', res);
                $('[name=cate_id]').empty().html(htmlStr);
                layui.form.render('select');
            }
        })
    }


    // 获取文章列表
    function getArtList() {
        $.ajax({
            type: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res)
                if (res.status !== 0) return layui.layer.msg('获取文章列表失败!');
                // 拼接文章列表模板
                let htmlStr = template('tpl_artList', res);
                $('.layui-table tbody').empty().html(htmlStr);
                // 渲染分页
                renderPage(res.total);
            }
        })
    }


    // 渲染分页
    function renderPage(total) {
        layui.laypage.render({
            elem: 'artPage', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示数据条数
            curr: q.pagenum, // 默认页码
            limits: [2, 3, 5, 10], //每页条数的选择项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                // console.log(obj);
                // 页面加载时会执行一次jump,此时first的值是true   
                // 当切换分页时已经不是第一次执行jump了,此时first的值是undefined
                q.pagenum = obj.curr; // 页码值
                q.pagesize = obj.limit; // 每页显示条数
                // 将页码值给q,重新获取文章列表
                $.ajax({
                    type: 'get',
                    url: '/my/article/list',
                    data: q,
                    success: function(res) {
                        // console.log(res);
                        if (!first) {
                            // 只有点击切换分页时first的值才是undefined
                            // 此时刷新列表
                            getArtList();
                        }
                    }
                })
            }
        });
    }
})