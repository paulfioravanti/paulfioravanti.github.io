/*
GreedyNav.js - https://github.com/lukejacksonn/GreedyNav
Licensed under the MIT license - http://opensource.org/licenses/MIT
Copyright (c) 2015 Luke Jackson
*/
$(document).ready(function(){function n(){e=l.width()-t.width(),d=l.children().length,i=r[d-1],e<i?(l.children().last().prependTo(a),d-=1,n()):e>r[d]&&(a.children().first().appendTo(l),d+=1,n()),t.attr("count",o-d),d===o?t.addClass("hidden"):t.removeClass("hidden")}var e,d,i,t=$("nav.greedy-nav .greedy-nav__toggle"),l=$("nav.greedy-nav .visible-links"),a=$("nav.greedy-nav .hidden-links"),o=0,s=0,r=[];l.children().outerWidth(function(n,e){s+=e,o+=1,r.push(s)}),$(window).resize(function(){n()}),t.on("click",function(){a.toggleClass("hidden"),$(this).toggleClass("close")}),n()});