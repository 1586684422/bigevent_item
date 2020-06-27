$(function() {
    let form = layui.form;
    // 表单验证规则
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1 ~ 6之间!'
            }
        }
    });
    // 获取用户的基本信息
    getUserinfo();

    // 获取用户的基本信息
    function getUserinfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return '获取用户信息失败!';
                form.val('form_userinfo', res.data);
                console.log(res.data)
            }
        });
    }

    // 表单的重置效果
    $('#btnReset').on('click', function(e) {
        // 阻止默认重置事件
        e.preventDefault();
        // 获取用户的基本信息
        getUserinfo();
    })

    // 更新用户的基本信息
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交事件
        e.preventDefault();
        console.log(123)
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg("修改用户信息失败!");
                layui.layer.msg(res.message);
            }
        });
    })
})