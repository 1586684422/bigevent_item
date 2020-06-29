$(function() {
    // 获取用户信息
    getUserlogin();

    // 退出登录
    $('#btnLoginout').click(function() {
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 清除token令牌
            localStorage.removeItem('token');
            // 重新获取用户信息
            getUserlogin();
            // 关闭提示框
            layer.close(index);
        });
    })
})

// 获取用户登录信息,并渲染
function getUserlogin() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res);
            if (res.status !== 1 && res.message !== "身份认证失败！") {
                // 身份认证成功

                // 渲染用户头像
                renderUserimg(res);
            }
        }
    })
}


// 渲染用户头像
function renderUserimg(option) {
    // 获取用户名
    let name = option.data.nickname || option.data.username;
    $('#user').html('欢迎&nbsp;&nbsp;' + name);
    // 渲染用户头像
    if (option.data.user_pic) {
        $('.layui-nav-img').attr('src', option.data.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.text-avatar').html(name[0].toUpperCase()).show();
        $('.layui-nav-img').hide();
    }
}