(self.webpackChunkdjangofrontend=self.webpackChunkdjangofrontend||[]).push([[8517],{446:function(t){t.exports=function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",s="second",i="minute",a="hour",u="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,M=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,y={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},_=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},m={s:_,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),s=n%60;return(e<=0?"+":"-")+_(r,2,"0")+":"+_(s,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),s=e.clone().add(r,c),i=n-s<0,a=e.clone().add(r+(i?-1:1),c);return+(-(r+(n-s)/(i?s-a:a-s))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:o,d:u,D:d,h:a,m:i,s:s,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},S="en",D={};D[S]=y;var p="$isDayjsObject",v=function(t){return t instanceof b||!(!t||!t[p])},g=function t(e,n,r){var s;if(!e)return S;if("string"==typeof e){var i=e.toLowerCase();D[i]&&(s=i),n&&(D[i]=n,s=i);var a=e.split("-");if(!s&&a.length>1)return t(a[0])}else{var u=e.name;D[u]=e,s=u}return!r&&s&&(S=s),s||!r&&S},w=function(t,e){if(v(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new b(n)},Y=m;Y.l=g,Y.i=v,Y.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var b=function(){function y(t){this.$L=g(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0}var _=y.prototype;return _.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(Y.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var s=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)}(t),this.init()},_.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},_.$utils=function(){return Y},_.isValid=function(){return!(this.$d.toString()===l)},_.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},_.isAfter=function(t,e){return w(t)<this.startOf(e)},_.isBefore=function(t,e){return this.endOf(e)<w(t)},_.$g=function(t,e,n){return Y.u(t)?this[e]:this.set(n,t)},_.unix=function(){return Math.floor(this.valueOf()/1e3)},_.valueOf=function(){return this.$d.getTime()},_.startOf=function(t,e){var n=this,r=!!Y.u(e)||e,f=Y.p(t),l=function(t,e){var s=Y.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?s:s.endOf(u)},$=function(t,e){return Y.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},M=this.$W,y=this.$M,_=this.$D,m="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,y):l(0,y+1);case o:var S=this.$locale().weekStart||0,D=(M<S?M+7:M)-S;return l(r?_-D:_+(6-D),y);case u:case d:return $(m+"Hours",0);case a:return $(m+"Minutes",1);case i:return $(m+"Seconds",2);case s:return $(m+"Milliseconds",3);default:return this.clone()}},_.endOf=function(t){return this.startOf(t,!1)},_.$set=function(t,e){var n,o=Y.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[u]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[a]=f+"Hours",n[i]=f+"Minutes",n[s]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===u?this.$D+(e-this.$W):e;if(o===c||o===h){var M=this.clone().set(d,1);M.$d[l]($),M.init(),this.$d=M.set(d,Math.min(this.$D,M.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},_.set=function(t,e){return this.clone().$set(t,e)},_.get=function(t){return this[Y.p(t)]()},_.add=function(r,f){var d,l=this;r=Number(r);var $=Y.p(f),M=function(t){var e=w(l);return Y.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===u)return M(1);if($===o)return M(7);var y=(d={},d[i]=e,d[a]=n,d[s]=t,d)[$]||1,_=this.$d.getTime()+r*y;return Y.w(_,this)},_.subtract=function(t,e){return this.add(-1*t,e)},_.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",s=Y.z(this),i=this.$H,a=this.$m,u=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,s,i){return t&&(t[n]||t(e,r))||s[n].slice(0,i)},d=function(t){return Y.s(i%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(M,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return Y.s(e.$y,4,"0");case"M":return u+1;case"MM":return Y.s(u+1,2,"0");case"MMM":return h(n.monthsShort,u,c,3);case"MMMM":return h(c,u);case"D":return e.$D;case"DD":return Y.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(i);case"HH":return Y.s(i,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(i,a,!0);case"A":return $(i,a,!1);case"m":return String(a);case"mm":return Y.s(a,2,"0");case"s":return String(e.$s);case"ss":return Y.s(e.$s,2,"0");case"SSS":return Y.s(e.$ms,3,"0");case"Z":return s}return null}(t)||s.replace(":","")}))},_.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},_.diff=function(r,d,l){var $,M=this,y=Y.p(d),_=w(r),m=(_.utcOffset()-this.utcOffset())*e,S=this-_,D=function(){return Y.m(M,_)};switch(y){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(S-m)/6048e5;break;case u:$=(S-m)/864e5;break;case a:$=S/n;break;case i:$=S/e;break;case s:$=S/t;break;default:$=S}return l?$:Y.a($)},_.daysInMonth=function(){return this.endOf(c).$D},_.$locale=function(){return D[this.$L]},_.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=g(t,e,!0);return r&&(n.$L=r),n},_.clone=function(){return Y.w(this.$d,this)},_.toDate=function(){return new Date(this.valueOf())},_.toJSON=function(){return this.isValid()?this.toISOString():null},_.toISOString=function(){return this.$d.toISOString()},_.toString=function(){return this.$d.toUTCString()},y}(),O=b.prototype;return w.prototype=O,[["$ms",r],["$s",s],["$m",i],["$H",a],["$W",u],["$M",c],["$y",h],["$D",d]].forEach((function(t){O[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),w.extend=function(t,e){return t.$i||(t(e,b,w),t.$i=!0),w},w.locale=g,w.isDayjs=v,w.unix=function(t){return w(1e3*t)},w.en=D[S],w.Ls=D,w.p={},w}()},8517:function(t,e,n){t.exports=function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var n=e(t),r={name:"en-in",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),weekdaysMin:"Su_Mo_Tu_We_Th_Fr_Sa".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekStart:1,yearStart:4,relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}};return n.default.locale(r,null,!0),r}(n(446))}}]);
//# sourceMappingURL=8517.fe8a52bf.chunk.js.map