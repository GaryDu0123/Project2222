$(function(){
    $(".selectBox .imitationSelect").on("click",function(){
        $(this).parent().next().toggle();//ul弹窗展开
        $(this).next().toggleClass("fa-caret-up")//点击input选择适合，小图标动态切换
        if (event.stopPropagation) {
            // 针对 Mozilla 和 Opera
            event.stopPropagation();
        }else if (window.event) {
            // 针对 IE
            window.event.cancelBubble = true;
        }   /*阻止事件传播，事件从点击的元素出发，向外（window）传播，
            如果不写个阻止事件，会导致下面的document点击函数一起执行，导致显示失败*/

    });
    $(".selectUl li").click(function(event){
        $(this).addClass("actived_li").siblings().removeClass("actived_li");//点击当前的添加。actived_li这个类；其他的移除这个类名
        var data_val = $(this).data("val");//定义一个data-val属性，获取点击的元素属性赋值到当前，方便动态化传值
        var data_id = $(this).data("id");//定义一个id属性，获取点击的元素属性赋值到当前，方便动态化传值
        $(this).parent().prev().children().val(data_val); //把当前点击的data-val赋值到显示的input的val里面
        $(this).parent().prev().children().data("val",data_val);//把当前点击的data-val赋值到显示的input的data-val里面
        $(this).parent().prev().children().data("id",data_id);//把当前点击的data-id赋值到显示的input的data-id里面
    });
    $(document).click(function(event){
        $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down")//当点隐藏ul弹窗时候，把小图标恢复原状
        $(".selectUl").hide();//当点击空白处，隐藏ul弹窗
    });
})
