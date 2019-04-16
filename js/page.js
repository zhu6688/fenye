;(function(){
    $.fn.pages = function(options){
        
        var defaults = {
            // 这个数据是后台传来的 数据格式
            dataes : ['1dasdas','2fsdw','3nioi','4nfsdklfsl','5fsd','6sf','7ty','8gd','9et','klnfl','efkl','enfo','dga','df','mm','m','m1','m2','m3','mp','mg','sdas'],
            currentPage : 0, // 当前页数从零开始
            pageNum : 5, // 每页显示几条数据
            dataList : [], // 整理完的数据，网页面中展示的最终数据，调用的时候不要改
        };
        return this.each(function(){
            var settings = $.extend({},defaults, options);
            var $dataList = $(this).find('.dataList'),
                $next = $(this).find('.next'),
                $prev = $(this).find('.prev'),
                $goBtn = $(this).find('.goBtn'),
                $inputNum = $(this).find('.inputNum'),
                $inputText = $(this).find('.inputText'),
                $num = $(this).find('.num'),
                $total = $(this).find('.total');
            init();
            function init(){
                // 这个是复制一份，在这里操作数据，不改变源数据
                var cloneDatas = [];
                for(var i=0;i<settings.dataes.length;i++){
                    cloneDatas.push(settings.dataes[i]);
                }
                // 把数据整理一下，每几条存到一个数组中
                settings.dataList = sliceData(cloneDatas,settings.pageNum); // 用来存放显示在页面中的数据[[],[]]二维数组
                $dataList.html(dataHtml(settings.currentPage)); // 页面中展示数据
            }
            // 处理数据得到的是二维数组形式的
            function sliceData(data,pageNum){
                var pageNum = pageNum; // 一页显示几条数据
                var dataList = [];
                var i=0;
                while(data.length>pageNum){
                    var a = data.slice(0,pageNum);
                    for(var j=0;j<a.length;j++){
                        data.shift();
                    }
                    dataList.push(a);
                    i++;
                }
                if(data.length>0){
                    dataList.push(data);
                }
                return dataList;
            }
            // 在页面中展示数据
            function dataHtml(page){
                var totalPages = settings.dataList.length;
                if(page>=totalPages) {
                    page = totalPages;
                    return;
                }
                settings.currentPage = page;
                var html = '';
                for(var i=0;i<settings.dataList[page].length;i++){
                    html+='\
                        <li>'+ settings.dataList[page][i] +'</li>\
                    ';
                }
                $num.text(page+1);
                var totalPages = settings.dataList.length;  // 总的页数
                $total.text(totalPages);
                return html;
            }
            // 下一页
            $next.click(function(){
                settings.currentPage++;
                if(settings.currentPage>=settings.dataList.length) {
                    settings.currentPage = settings.dataList.length-1;
                }
                $dataList.html(dataHtml(settings.currentPage));
            })
            // 上一页
            $prev.click(function(){
                settings.currentPage--;
                if(settings.currentPage<=0) {
                    settings.currentPage = 0;
                }
                $dataList.html(dataHtml(settings.currentPage));
            })
            // 跳转到第几页
            $goBtn.on('click',function(){
                var num = Math.floor($inputNum.val());
                if(!num) return;
                if(num>settings.dataList.length+1) return;
                var n = num-1;
                $dataList.html(dataHtml(n));
                $inputNum.val('');
            })
            // 模糊查询
            $inputText.keyup(function(){
                var reg = $(this).val();
                if(!reg){
                    init();
                    return;
                }else{
                    var newDataes = []; // 用来存储模糊匹配的数据
                    for(var i=0;i<settings.dataes.length;i++){
                        if(settings.dataes[i].match(reg)){
                            newDataes.push(settings.dataes[i]);
                        }
                    }
                    settings.dataList = sliceData(newDataes,settings.pageNum);
                    if(!settings.dataList.length){
                        $dataList.html('');
                        $num.text(0);
                        $total.text(0); 
                    }
                    $dataList.html(dataHtml(0));
                }
            })
        });
        
    }
})()