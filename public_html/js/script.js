/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**blocked screen**/
$(document).ready(function(){
    function digitalWatch() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        $("#block").html(hours + ":" + minutes + ":" + seconds+"<br/><span class='weather'>\n\
            temperature: "+parseInt((weather.results.channel.item.condition.temp-32)/1.8)+"°C \n\
            humidity:"+weather.results.channel.atmosphere.humidity+"%\
            wind:"+parseInt(weather.results.channel.wind.speed*0.44704)+"м/с</span>\n\
            <span class='center'>Press to unlock</span>");
    }
    var weather;
    var photo;
    function getWeather(){
        
        $.ajax({
            url:"https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22kyiv%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
            dataType:"json", 
        }).done(function(data){
            weather = data.query; 
            $.ajax({
                url:"https://pixabay.com/api/?key=4659039-516258049045ec3b1232a8917&q="+weather.results.channel.item.condition.text.replace(/\s/ig, '+')+"&image_type=photo",
                dataType:"json", 
            }).done(function(data){
                photo = data; 
                $("#block").css({background:"url("+photo.hits[0 + Math.floor(Math.random() * (photo.hits.length + 1 - 0))].webformatURL+")",backgroundSize:"100%"});
            });
            

        });
    }
    getWeather();
    var weth = setInterval(function(){getWeather()},3600000);
    var bsi = setInterval(function(){digitalWatch()},1000); 
    var blockTimer;
    $("#block").on("click",function(){
        $(this).slideUp("slow");
        blockTimer = setInterval(function(){blockTimers();
        },1000);
        clearInterval(bsi);
        clearInterval(weth);
    });
    function blockTimers(){
        if(timer==60){
            $("#block").slideDown("slow");
            clearInterval(blockTimer);
            bsi = setInterval(function(){digitalWatch()},1000);
            weth = setInterval(function(){getWeather()},3600000);
        }
        timer++;
    }
    var timer = 0;
    $("*").on("click",function(){
        timer =0;
    });
});
/**end blocked screen**/
/***************************users block*********************************/
 $(document).ready(function(){   
    
     
     if(JSON.parse(localStorage.getItem("Users1"))){
        user = (JSON.parse(localStorage.getItem("Users1")));//!!!!
        perm = (JSON.parse(localStorage.getItem("UserPermisions")));
        $.each(user, function(index, val){
            var usrBlock = $(".anyUser:first").clone().appendTo("#users").fadeIn("slow");
            usrBlock.find(".uname").append(val);
            usrBlock.find(".userPerm").append(perm[val]);
        
            
        });
        //$("#users").append(user.Admin);
        
    }
});
/*************************End users block*****************************/
/***********************Chat************************************/
$(document).ready(function(){
    if(localStorage.getItem("chatMessages")){
        $("#chatMessages").html(JSON.parse(localStorage.getItem("chatMessages")));
        $("#chatMessages p span").each(function(){
            if($(this).data("user")===localStorage.getItem("logined")){
                $(this).parent().addClass("activeUser");
            }
        });
    }
    $("#chatInput").on("keypress", function(e){
	if(e.charCode==13){
            $("#chatMessages").html($("#chatMessages").html()+"<p><span data-user=\""+localStorage.getItem("logined")+"\">"+localStorage.getItem("logined")+":</span>"+$(this).val()+"</p>");
            localStorage.setItem("chatMessages",JSON.stringify(JSON.parse(localStorage.getItem("chatMessages"))+"<p><span data-user=\""+localStorage.getItem("logined")+"\">"+localStorage.getItem("logined")+":</span>"+$(this).val()+"</p>"));
            $("#chatMessages p span").each(function(){
                if($(this).data("user")===localStorage.getItem("logined")){
                    $(this).parent().addClass("activeUser");
                }
            });
        }
        
        
    });
    $("#chatBox a").on("click",function(){
        if($("#chatBox").css('top')=="40px"){$("#chatBox").animate({top:"-188px"}, 1000);}
        else{$("#chatBox").animate({top:"40px"},1000);}
        $("#chatBox").toggleClass("hiddenBox");
        $("#chatBox div, #chatBox input").toggleClass("hiddenBoxElements");
        return false;
    });
    $("#loginBlock a").on("click", function(e){
        $("#loginBlock div").hide();
	$("#"+$(this).attr("href")).show();
        return false;
    });
    /**registration**/
    $( "#regForm" ).submit(function( event ) {
        var user = '';
        var passwords = '';
        var permisions = '';
        if(JSON.parse(localStorage.getItem("Users1"))){
            user = (JSON.parse(localStorage.getItem("Users1")));//!!!!
            passwords = (JSON.parse(localStorage.getItem("UserPasswords")));
            permisions = (JSON.parse(localStorage.getItem("UserPermisions")));
            var usname = $(this).children("#name").val();//login
            var uspwd = $(this).children("#password").val();//pass
            var uspms = "user";//permision
            if(!user[usname]){
                user[usname] = usname;
                passwords[usname] = uspwd;
                permisions[usname] = uspms;
                localStorage.setItem("Users1", JSON.stringify(user));
                localStorage.setItem("UserPasswords", JSON.stringify(passwords));
                localStorage.setItem("UserPermisions", JSON.stringify(permisions));
            }
            else{alert("user exist!");}
        }else{
            user = "{\""+$(this).children("#name").val()+"\":\""+$(this).children("#name").val()+"\"}";
            passwords = "{\""+$(this).children("#name").val()+"\":\""+$(this).children("#password").val()+"\"}";
            permisions = "{\""+$(this).children("#name").val()+"\":\"user\"}";
            localStorage.setItem("Users1", user);
            localStorage.setItem("UserPasswords", passwords);
            localStorage.setItem("UserPermisions", permisions);
        }
        $("#register").hide();
        event.preventDefault();
    });
    /***end registration***/
    /****login****/
    $( "#logForm" ).submit(function( event ) {
        var user = (JSON.parse(localStorage.getItem("Users1")));
        var pwd = (JSON.parse(localStorage.getItem("UserPasswords")));
        var logined = (localStorage.getItem("logined"));
        if(!logined){ localStorage.setItem("logined", "free");}
        var usname = $(this).children("#name").val();
        var userLogin = $(this).children("#name").val();
        var userPassw = $(this).children("#password").val();
        if(logined=="free"&&user[usname]==userLogin&&pwd[usname]==userPassw){
            localStorage.setItem("logined", usname);
            
        }else if(logined!="free"){
            alert("Some user logined");
        }else if(pwd[usname]!=userPassw){
            alert("Your password or login is wrong!");
        }
        
        
        $("#login").hide();
        event.preventDefault();
    });
    /****end login*****/
});
/*********************End chat**********************************/
/***********************slider**********************************/
                    /*rewrited in plugin*/
/*$(document).ready(function(){
    var width = 0; $("#slides img").each(function(){width = width +  $(this).width();});$("#slides").width(width);
    var height = $("#slides img").height(); $("#slider").height(height); $("body > header").height($("#slides img").height());
    var myVar = setInterval(function(){ next(); }, 3000);

    function next() {
        var imgWidth = $("#slides img").width();
        if($("#slides").css("left")!=-(imgWidth*2)+"px"){
            $("#slides").animate({left:"-="+imgWidth+"px"},"slow" ); 
        }else{
            $("#slides").animate({left:"0px"}, 500);
        }
    }
    function prev() {
        var imgWidth = $("#slides img").width();
        if($("#slides").css("left")!="0px"){
            $("#slides").animate({left:"+="+imgWidth+"px"},"slow" ); 
        }else{
            $("#slides").animate({left:-(imgWidth*2)+"px"}, 500);
        }
    }
    function Stop() {
        clearInterval(myVar);
    }
    
    $("#slides").on("mouseenter",Stop);
    $("#slides").on("mouseleave",function(){
        myVar = setInterval(function(){ next() }, 3000);
    });
    $("#next").on("click", function(){
        next();clearInterval(myVar);
    });
    $("#prev").on("click", function(){
        prev();clearInterval(myVar);
    });
});*/
/**************************end slider**************************/
/*isotope sorter*/
function choose(selector){
    var topPos = 0;
    var leftPos = 0;
    $('.cards').filter(function(index){
            
        if($(this).css("display")=="block"){
        return index+1;
        };
    }).children("div").show();
    $('.cards').filter(function(index){
            if($(this).css("display")=="block"){
                return index+1;
            };
        }).children("div").not('.'+selector).hide();
    $('.cards').filter(function(index){
            if($(this).css("display")=="block"){
                return index+1;
            };
        }).children("div."+selector).each(function(){
       if(leftPos == 360){
            $(this).animate({left:leftPos+"px",top:topPos+"px"},500);leftPos=0; topPos=topPos+120;
        } else{
            $(this).animate({left:leftPos+"px",top:topPos+"px"},500);leftPos=leftPos+120;
        }
    });
}
function sort(sortValue){
    $('.cards').hide();
    $("."+sortValue).show();
    
    
}
$(document).ready(function(){
    $('.cards').hide();
    sort("develop");
    choose("all");
    
    
    $("#control-panel2 a").each(function(){
	$(this).click(function(){
            choose($(this).attr("rel"));
            return false;
	});
    });
    
    $("#control-panel a").each(function(){
	$(this).click(function(){
            sort($(this).attr("rel"));
            choose("all");
            return false;
	});
    });
    
    $('#cards div').filter(function(index){
            $(this).on("click",function(){
                $(".wrap").fadeIn("1000");
                $(".popup").hide();
                $(".item"+$(this).data("blockId")).show();
            
            });
        });
    $(".wrap a").on("click",function(){$(".wrap").fadeOut("1000");return false;});
    
    /**********************draggable task components*********************************/
    $(".cards div").draggable({
        revert: "invalid", //back if not  find droppable block
        containment: "document",//dragging in this region
        helper: "clone",
        cursor: "move"
    });
    
    $("#task").droppable({
      accept: ".cards div",
      classes: {"ui-droppable-active": "ui-state-highlight"},
      drop: function( event, ui ) {
          $("#task").prepend("<div class=\"cartItem\">"+$(".ui-draggable-dragging").html()+"</div>");
          var total = 0;
            $(".cartItem").each(function(){
                    total += (+$(this).children(".price").text());

            });
            $("#totalPrice").text(total);
      }
    });
    
    $(".cards div").droppable({
      accept: "#task div",
      classes: {"ui-droppable-active": "custom-state-active"},
      drop: function( event, ui ) {recycleImage( ui.draggable );}
    });
    
    
    $("#addTask").on("click", function(){
        $("#isotopeSorter").show();
        $("#cancelAddTask").show();
    });
    $("#cancelAddTask").on("click", function(){
        $("#isotopeSorter").hide();
        $("#cancelAddTask").hide();
    });
    /***********************End draggable task components********************************/
    /**/
    /**/
});
/*end isotope sorter*/
/**********************************tasks***************************************/
$(document).ready(function(){
    $("#tasks").on("click",function(){$("#tasksBlock").slideToggle(1000);return false;});
    
    var tasksCount = localStorage.getItem("tasksCount")|| 1;
    var task;
    task = (JSON.parse(localStorage.getItem("tasks")));
    var counter = 1;
    
    $.each(task, function(key, value){
        var taskItem = $(".taskEaxamplePBL:first-child").clone().appendTo("#tasksBlock").fadeIn("slow");
        taskItem.find("h2").append(" "+key);
        taskItem.find("ul").append(value);
        taskItem.attr('id', key);
    });  
    $("#add").on("click", function(){
        if(tasksCount==1){
            localStorage.setItem("tasksCount", 1);
        }
        var taskInner;
        $("#task .cartItem").each(function(){
            taskInner += "<li>"+$(this).html()+"</li>";
        });
        if(!(localStorage.getItem("tasks"))){
            
            task = "{\"item"+tasksCount+"\":"+JSON.stringify(taskInner)+"}";
            localStorage.setItem("tasksCount", ++tasksCount);
            localStorage.setItem("tasks", task);
            
        }else{
            task = (JSON.parse(localStorage.getItem("tasks")));
            task["item"+tasksCount]=taskInner;
            localStorage.setItem("tasks", JSON.stringify(task));
            localStorage.setItem("tasksCount", ++tasksCount);
        }
        $("#task .cartItem").remove();
    });
    $(".checkImportant").on("change",function(){
        if($(this).prop( "checked")){
            $(this).parent().parent().css('background',"red");
        }else{
            $(this).parent().parent().css('background',"#eeeeee");
        }
    });
});
/****************************End tasks*****************************************/