$(function() {
    let form = layui.form;
    // 表单验证
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newpass: function(value) {
            if ($('#pwd').val() === value) return '新密码不得与原密码一致!';
        },
        aganewpwd: function(value) {
            if ($('#newpwd').val() !== value) return '请保持与新密码一致!';
        }
    });
    // 修改密码
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交事件
        e.preventDefault();
        $.ajax({
            type: "post",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layui.layer.msg('修改密码失败!');
                layui.layer.msg('修改密码成功!');
                $('.layui-form')[0].reset();
            }
        });
    })
})