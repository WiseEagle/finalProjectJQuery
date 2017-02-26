(function($){
    function next() {
		var width = $(".allImgs img").width();
        if($(".allImgs").css("left")!=-(width*($(".allImgs img").length-1))+"px"){
            $(".allImgs").animate({left:"-="+width+"px"},"slow" ); 
        }else{
            $(".allImgs").animate({left:"0px"}, 500);
        }
    }
	function prev() {
        var width = $(".allImgs img").width();
        if($(".allImgs").css("left")!="0px"){
            $(".allImgs").animate({left:"+="+width+"px"},"slow" ); 
        }else{
            $(".allImgs").animate({left:-(width*($(".allImgs img").length-1))+"px"}, 500);
        }
    }
	
    function Stop() {
        clearInterval(myVar);
    }
    var myVar;
	//width - number
	jQuery.fn.makeSlider = function(width){
		var images = this.find("img");
		var height = 0;
		images.each(function(){
			$(this).css({width:width+"px",display:"inline","float":"left"});
			height = (($(this).height() < height) || (height == 0)) ? $(this).height() : height;
		});
		/*all images block*/
		var imgsBlock = $("<div class='allImgs'></div>");
		imgsBlock.append(images);//block with all images, height - min image height and width all images
		imgsBlock.width(width*images.length).height(height);
		imgsBlock.css({position:'relative',left:"0px"});
		/*slider window block*/
		var sliderWindowBlock = $("<div class='sliderWindow'></div>");
		sliderWindowBlock.append(imgsBlock);
		sliderWindowBlock.css({'overflow':'hidden',width:width, height:height,position:"relative"});
		/*next button*/
		var nextButton = $("<span class='nextSlide'></span>");
		nextButton.css({position: "absolute",top: "50%",right: "5px"});
		/*previous button*/
		var prevButton = $("<span class='prevSlide'></span>");
		prevButton.css({position: "absolute",top: "50%",left: "5px"});
				
		/*start slider*/
		sliderWindowBlock.prepend(prevButton);
		sliderWindowBlock.append(nextButton);
		
                myVar = setInterval(function(){ next(); }, 3000);
		$(".allImgs").on("mouseenter",Stop);
		$(".allImgs").on("mouseleave",function(){
			myVar = setInterval(function(){ next() }, 3000);
		});
		$("#next").on("click", function(){
                    next();clearInterval(myVar);
                });
                $("#prev").on("click", function(){
                    prev();clearInterval(myVar);
                });
		/*if(nextBtn||prevBtn){
			$(".nextSlide").css({content: nextBtn,fontFamily: "fontawesome",fontSize: "28px",color: "white",textShadow: "2px 2px 5px black"});
			$(".prevSlide").css({content: prevBtn,fontFamily: "fontawesome",fontSize: "28px",color: "white",textShadow: "2px 2px 5px black"});
		}else{
			
		}*/
                this.css("width" , width);
		this.prepend(sliderWindowBlock);
		return this; 
	};
})(jQuery);