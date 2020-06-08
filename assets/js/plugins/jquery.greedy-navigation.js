/*
GreedyNav.js - http://lukejacksonn.com/actuate
Licensed under the MIT license - http://opensource.org/licenses/MIT
Copyright (c) 2015 Luke Jackson
*/
$(function(){function n(){e=a.width()-10,i=a.children().length,d=u[i-1],e<d?(a.children().last().prependTo(l),i-=1,n()):e>u[i]&&(l.children().first().appendTo(a),i+=1,n()),t.attr("count",r-i),i===r?t.addClass("hidden"):t.removeClass("hidden")}var e,i,d,o,t=$("nav.greedy-nav .greedy-nav__toggle"),a=$("nav.greedy-nav .visible-links"),l=$("nav.greedy-nav .hidden-links"),r=0,s=0,c=1e3,u=[];a.children().outerWidth(function(n,e){s+=e,r+=1,u.push(s)}),$(window).resize(function(){n()}),t.on("click",function(){l.toggleClass("hidden"),clearTimeout(o)}),l.on("mouseleave",function(){o=setTimeout(function(){l.addClass("hidden")},c)}).on("mouseenter",function(){clearTimeout(o)}),n()});