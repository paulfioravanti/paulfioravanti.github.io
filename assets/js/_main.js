$(document).ready(function(){$("#main").fitVids();var e=function(){(0===$(".author__urls-wrapper button").length?1024<$(window).width():!$(".author__urls-wrapper button").is(":visible"))?$(".sidebar").addClass("sticky"):$(".sidebar").removeClass("sticky")};e(),$(window).resize(function(){e()}),$(".author__urls-wrapper button").on("click",function(){$(".author__urls").toggleClass("is--visible"),$(".author__urls-wrapper button").toggleClass("open")}),$(document).keyup(function(e){27===e.keyCode&&$(".initial-content").hasClass("is--hidden")&&($(".search-content").toggleClass("is--visible"),$(".initial-content").toggleClass("is--hidden"))}),$(".search__toggle").on("click",function(){$(".search-content").toggleClass("is--visible"),$(".initial-content").toggleClass("is--hidden"),setTimeout(function(){$(".search-content input").focus()},400)});new SmoothScroll('a[href*="#"]',{offset:20,speed:400,speedAsDuration:!0,durationMax:500});if(0<$("nav.toc").length)new Gumshoe("nav.toc a",{navClass:"active",contentClass:"active",nested:!1,nestedClass:"active",offset:20,reflow:!0,events:!0});$("a[href$='.jpg'],a[href$='.jpeg'],a[href$='.JPG'],a[href$='.png'],a[href$='.gif'],a[href$='.webp']").addClass("image-popup"),$(".image-popup").magnificPopup({type:"image",tLoading:"Loading image #%curr%...",gallery:{enabled:!0,navigateByImgClick:!0,preload:[0,1]},image:{tError:'<a href="%url%">Image #%curr%</a> could not be loaded.'},removalDelay:500,mainClass:"mfp-zoom-in",callbacks:{beforeOpen:function(){this.st.image.markup=this.st.image.markup.replace("mfp-figure","mfp-figure mfp-with-anim")}},closeOnContentClick:!0,midClick:!0}),$(".page__content").find("h1, h2, h3, h4, h5, h6").each(function(){var e=$(this).attr("id");if(e){var a=document.createElement("a");a.className="header-link",a.href="#"+e,a.innerHTML='<span class="sr-only">Permalink</span><i class="fas fa-link"></i>',a.title="Permalink",$(this).append(a)}})});