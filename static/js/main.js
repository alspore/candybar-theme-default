var $,show,hide,pad,mergeRecursive,WidgetStorage;$=function(a,b){return b||(b=document),b.querySelector(a)},show=function(){for(var a=0;a<arguments.length;a+=1)arguments[a].parentNode.style.display="inline-block"},hide=function(){for(var a=0;a<arguments.length;a+=1)arguments[a].parentNode.style.display="none"},pad=function(a,b,c){return c=c||"0",a+="",a.length>=b?a:new Array(b-a.length+1).join(c)+a},mergeRecursive=function(a,b){for(var c in b)try{a[c]=b[c].constructor===Object?merge_recursive(a[c],b[c]):b[c]}catch(d){a[c]=b[c]}return a},WidgetStorage=function(){this.widgets={},this.register=function(a,b){this.widgets[a]=new window["widget_"+a](b),this.widgets[a].hasOwnProperty("init")&&this.widgets[a].init()},this.update=function(a,b){this.widgets[a].update(b)}};var widgets=new WidgetStorage,widget_battery,widget_datetime,widget_desktops,widget_external_ip,widget_now_playing,widget_volume,widget_weather,widget_window_title;widget_battery=function(a){var b,c,d={0:"unknown",1:"charging",2:"discharging",3:"empty",4:"full",5:"charging",6:"discharging"};a=mergeRecursive({},a),b=$("#widget_battery"),c={icon:$(".contents .icon",b),percentage:$(".contents .percentage",b),time_left:$(".contents .time_left",b)},this.update=function(a){var e,f,g,h,i="";show($(".contents",b)),a.time_to_empty&&(e=a.time_to_empty),a.time_to_full&&(e=a.time_to_full),e&&(f=parseInt(e/3600,10)%24,g=parseInt(e/60,10)%60,h=parseInt(e%60,10),f&&(i+=pad(f,2)+":"),g&&(i+=pad(g,2)+":"),i+=pad(h,2)),b.classList.remove("state-unknown","state-charging","state-discharging","state-empty","state-full"),b.classList.add("state-"+d[a.state]),b.classList.remove("percentage-critical","percentage-low","percentage-medium","percentage-high"),a.percentage>=70?b.classList.add("percentage-high"):a.percentage>=40?b.classList.add("percentage-medium"):a.percentage>=5?b.classList.add("percentage-low"):b.classList.add("percentage-critical"),c.percentage.textContent=Math.round(a.percentage)+"%",c.time_left.textContent=i}},widget_datetime=function(a){var b,c;a=mergeRecursive({interval:1e3,showSeconds:!0},a),b=$("#widget_datetime .contents"),c={date:$(".date",b),time:$(".time",b)},this.init=function(){show(b),setInterval(this.update.bind(this),a.interval),this.update()},this.update=function(){var b=new Date,d=b.getFullYear()+"-"+pad(b.getMonth()+1,2)+"-"+pad(b.getDate(),2),e=pad(b.getHours(),2)+":"+pad(b.getMinutes(),2);a.showSeconds&&(e+=":"+pad(b.getSeconds(),2)),c.date.textContent=d,c.time.textContent=e}},widget_desktops=function(a){var b;a=mergeRecursive({},a),b=$("#widget_desktops .contents"),this.data={},this.update=function(a){if(show(b),this.data.desktopsLen!==a.desktops.length){for(this.data.desktopsLen=a.desktops.length;b.firstChild;)b.removeChild(b.firstChild);for(var c=0;c<a.desktops.length;c+=1){var d=document.createElement("li"),e=(c+1).toString();d.textContent=e,d.classList.add("desktop-"+e,"desktop"),b.appendChild(d)}}a.desktops.forEach(function(b,c){var d=$(".desktop-"+(c+1));d.classList.remove("selected","has-windows","urgent"),b.clients_len>0&&d.classList.add("has-windows"),b.is_urgent&&d.classList.add("urgent"),c===a.current_desktop&&d.classList.add("selected")})}},widget_external_ip=function(a){var b;a=mergeRecursive({},a),b=$("#widget_external_ip .contents"),this.field=$(".ip",b),this.update=function(a){show(b),this.field.textContent=a.ip}},widget_now_playing=function(a){var b,c,d,e;a=mergeRecursive({interval:1e3},a),b=$("#widget_now_playing .contents"),c={elapsed_time:$(".elapsed_time",b),total_time:$(".total_time",b),elapsed_percent_bar:$(".bar.elapsed_percent",b),artist:$(".artist",b),title:$(".title",b),status_icon:$(".status-icon",b)},this.data={},d=null,e=function(){this.data.elapsed_sec+=1;var a=Math.floor(this.data.elapsed_sec/60),b=this.data.elapsed_sec%60;c.elapsed_time.textContent=a+":"+pad(b,2),c.elapsed_percent_bar.style.width=this.data.elapsed_sec/this.data.total_sec*100+"%"},this.update=function(f){if(!f.artist||!f.title)return hide(b),void 0;this.data=f,show(b);var g=Math.floor(f.elapsed_sec/60),h=f.elapsed_sec%60,i=Math.floor(f.total_sec/60),j=f.total_sec%60;c.elapsed_time.textContent=g+":"+pad(h,2),c.total_time.textContent=i+":"+pad(j,2),c.elapsed_percent_bar.style.width=f.elapsed_sec/f.total_sec*100+"%",c.artist.textContent=f.artist,c.title.textContent=f.title,f.playing?c.status_icon.classList.add("playing"):c.status_icon.classList.remove("playing"),clearInterval(d),f.playing&&(d=setInterval(e.bind(this),a.interval))}},widget_volume=function(a){var b,c;a=mergeRecursive({},a),b=$("#widget_volume .contents"),c={icon:$(".icon",b),percent_bar:$(".bar.volume_percent",b)},this.update=function(a){show(b),c.percent_bar.style.width=a.percent+"%",c.icon.classList.remove("off","low","medium","high"),a.percent>75?c.icon.classList.add("high"):a.percent>30?c.icon.classList.add("medium"):a.percent>0?c.icon.classList.add("low"):c.icon.classList.add("off")}},widget_weather=function(a){var b,c;a=mergeRecursive({},a),b=$("#widget_weather .contents"),c={icon:$(".icon",b),temp:$(".temp",b)},this.tempConversions={c:function(a){return a},f:function(a){return 9*a/5+32},k:function(a){return a+273.15}},this.update=function(a){var d=document.createElement("img");for(show(b),c.temp.classList.remove("c","f","k");c.icon.firstChild;)c.icon.removeChild(c.icon.firstChild);d.src="static/img/weather/"+a.icon+".svg",c.icon.appendChild(d),c.temp.textContent=this.tempConversions[a.unit.toLowerCase()](a.temp),c.temp.classList.add(a.unit)}},widget_window_title=function(a){var b;a=mergeRecursive({},a),b=$("#widget_window_title .contents"),this.data={},this.update=function(a){show(b),b.textContent=a.window_title}},widgets.register("battery"),widgets.register("datetime"),widgets.register("desktops"),widgets.register("external_ip"),widgets.register("now_playing"),widgets.register("volume"),widgets.register("weather"),widgets.register("window_title");