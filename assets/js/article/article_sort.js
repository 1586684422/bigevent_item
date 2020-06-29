$(function() {
    // 获取文章分类列表
    getArticleSort();


    // 添加文章类别
    let indexAdd = null;
    $('#btnAddSort').on('click', function() {
        indexAdd = layui.layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#tpl-addArtSort').html()
        });
    })
    $('body').on('submit', '#addArtSort', function(e) {
        // 阻止默认提交事件
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('新增文章分类失败!');
                layui.layer.close(indexAdd);
                // 重新获取文章分类列表
                getArticleSort();
                layui.layer.msg('新增文章分类成功!');
            }
        });
    })


    // 删除文章类别
    let indexDel = null;
    $('body').on('click', '#btnDelete', function() {
        let id = $(this).attr('data-id');
        indexDel = layui.layer.confirm('确认删除此分类?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layui.layer.msg('删除文章分类失败!');
                    layui.layer.msg('删除文章分类成功!');
                    // 获取文章分类列表
                    getArticleSort();
                    layer.close(indexDel);
                }
            });
        });
    })


    // 更新文章分类数据
    let indexEdit = null;
    $('body').on('click', '#btnEdit', function() {
        indexEdit = layui.layer.open({
            type: '1',
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#tpl-editArtSort').html()
        });
        let id = $(this).attr('data-id');
        // 发送请求获取相应信息
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function(res) {
                layui.form.val("form_editSort", res.data);
            }
        });
    })
    $('body').on('submit', '#editArtSort', function(e) {
        // 阻止默认提交事件
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('更新文章分类失败!');
                layui.layer.close(indexEdit);
                // 刷新文章分类列表
                getArticleSort();
                layui.layer.msg('更新文章分类成功!');
            }
        })
    })



    // 获取文章分类列表
    function getArticleSort() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取文章分类列表失败!');
                // layui.layer.msg('获取文章分类列表成功!');
                // console.log(res);
                let htmlStr = template('tpl_artSort', res);
                $('.layui-table tbody').html(htmlStr);
            }
        });
    }
})