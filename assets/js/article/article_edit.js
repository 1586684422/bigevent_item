$(function() {

    // 获取文章详细信息
    getArtDet();



    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);


    // 点击选择封面
    $('#btnCover').on('click', function() {
        $('#file').click();
    });
    // 文件选择状态发生变化
    $('#file').change(function(e) {
        // console.log(e.target.files);
        if (e.target.files.length === 0) return layui.layer.msg('请选择文章封面!');
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(e.target.files[0]);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    })

    // 发布状态
    let state = '已发布';

    $('#btnDrafts').on('click', function() {
        state = '草稿';
    })

    // 发布修改后的文章
    $('#form_artEdit').on('submit', function(e) {
        // 阻止默认提交事件
        e.preventDefault();
        // 创建FormData对象
        let fd = new FormData($(this)[0]);
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // 发起请求
                sendReq(fd);
                console.log(fd);
            })
    })


    // 发送请求
    function sendReq(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            // 若要传递FormData对象,必须设置以下两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg('更新文章失败!');
                layui.layer.msg('更新文章成功!');
                // 跳转到文章列表页
                location.href = '../../../article/article_list.html';
            }
        })
    }


    // 获取文章详情
    function getArtDet() {
        let id = getUrlParam("id");
        $.ajax({
            type: 'get',
            url: '/my/article/' + id,
            success: function(res) {
                // console.log(res);
                layui.form.val('artEdit', res.data);
                // 初始化富文本编辑器
                initEditor();
                // 初始化文章分类列表
                initArtSort(res.data.cate_id);
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', 'http://ajax.frontend.itheima.net' + res.data.cover_img) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }
        })
    }


    // 初始化文章分类列表
    function initArtSort(cate_id) {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('获取文章分类失败!');
                res.cate_id = cate_id;
                let htmlStr = template('tpl_artSort', res);
                $('#artSort').html(htmlStr);
                layui.form.render();
            }
        });
    }

    //获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
})