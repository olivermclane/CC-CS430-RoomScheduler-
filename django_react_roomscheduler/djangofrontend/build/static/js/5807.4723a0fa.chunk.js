(self.webpackChunkdjangofrontend=self.webpackChunkdjangofrontend||[]).push([[5807],{446:function(t){t.exports=function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",s="second",i="minute",a="hour",u="day",o="week",c="month",h="quarter",f="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,M=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,_={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},y=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},m={s:y,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),s=n%60;return(e<=0?"+":"-")+y(r,2,"0")+":"+y(s,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),s=e.clone().add(r,c),i=n-s<0,a=e.clone().add(r+(i?-1:1),c);return+(-(r+(n-s)/(i?s-a:a-s))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:f,w:o,d:u,D:d,h:a,m:i,s:s,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},D="en",v={};v[D]=_;var S="$isDayjsObject",p=function(t){return t instanceof w||!(!t||!t[S])},g=function t(e,n,r){var s;if(!e)return D;if("string"==typeof e){var i=e.toLowerCase();v[i]&&(s=i),n&&(v[i]=n,s=i);var a=e.split("-");if(!s&&a.length>1)return t(a[0])}else{var u=e.name;v[u]=e,s=u}return!r&&s&&(D=s),s||!r&&D},b=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new w(n)},Y=m;Y.l=g,Y.i=p,Y.w=function(t,e){return b(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var w=function(){function _(t){this.$L=g(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[S]=!0}var y=_.prototype;return y.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(Y.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var s=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],s,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)}(t),this.init()},y.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},y.$utils=function(){return Y},y.isValid=function(){return!(this.$d.toString()===l)},y.isSame=function(t,e){var n=b(t);return this.startOf(e)<=n&&n<=this.endOf(e)},y.isAfter=function(t,e){return b(t)<this.startOf(e)},y.isBefore=function(t,e){return this.endOf(e)<b(t)},y.$g=function(t,e,n){return Y.u(t)?this[e]:this.set(n,t)},y.unix=function(){return Math.floor(this.valueOf()/1e3)},y.valueOf=function(){return this.$d.getTime()},y.startOf=function(t,e){var n=this,r=!!Y.u(e)||e,h=Y.p(t),l=function(t,e){var s=Y.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?s:s.endOf(u)},$=function(t,e){return Y.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},M=this.$W,_=this.$M,y=this.$D,m="set"+(this.$u?"UTC":"");switch(h){case f:return r?l(1,0):l(31,11);case c:return r?l(1,_):l(0,_+1);case o:var D=this.$locale().weekStart||0,v=(M<D?M+7:M)-D;return l(r?y-v:y+(6-v),_);case u:case d:return $(m+"Hours",0);case a:return $(m+"Minutes",1);case i:return $(m+"Seconds",2);case s:return $(m+"Milliseconds",3);default:return this.clone()}},y.endOf=function(t){return this.startOf(t,!1)},y.$set=function(t,e){var n,o=Y.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[u]=h+"Date",n[d]=h+"Date",n[c]=h+"Month",n[f]=h+"FullYear",n[a]=h+"Hours",n[i]=h+"Minutes",n[s]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===u?this.$D+(e-this.$W):e;if(o===c||o===f){var M=this.clone().set(d,1);M.$d[l]($),M.init(),this.$d=M.set(d,Math.min(this.$D,M.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},y.set=function(t,e){return this.clone().$set(t,e)},y.get=function(t){return this[Y.p(t)]()},y.add=function(r,h){var d,l=this;r=Number(r);var $=Y.p(h),M=function(t){var e=b(l);return Y.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===f)return this.set(f,this.$y+r);if($===u)return M(1);if($===o)return M(7);var _=(d={},d[i]=e,d[a]=n,d[s]=t,d)[$]||1,y=this.$d.getTime()+r*_;return Y.w(y,this)},y.subtract=function(t,e){return this.add(-1*t,e)},y.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",s=Y.z(this),i=this.$H,a=this.$m,u=this.$M,o=n.weekdays,c=n.months,h=n.meridiem,f=function(t,n,s,i){return t&&(t[n]||t(e,r))||s[n].slice(0,i)},d=function(t){return Y.s(i%12||12,t,"0")},$=h||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(M,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return Y.s(e.$y,4,"0");case"M":return u+1;case"MM":return Y.s(u+1,2,"0");case"MMM":return f(n.monthsShort,u,c,3);case"MMMM":return f(c,u);case"D":return e.$D;case"DD":return Y.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return f(n.weekdaysMin,e.$W,o,2);case"ddd":return f(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(i);case"HH":return Y.s(i,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(i,a,!0);case"A":return $(i,a,!1);case"m":return String(a);case"mm":return Y.s(a,2,"0");case"s":return String(e.$s);case"ss":return Y.s(e.$s,2,"0");case"SSS":return Y.s(e.$ms,3,"0");case"Z":return s}return null}(t)||s.replace(":","")}))},y.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},y.diff=function(r,d,l){var $,M=this,_=Y.p(d),y=b(r),m=(y.utcOffset()-this.utcOffset())*e,D=this-y,v=function(){return Y.m(M,y)};switch(_){case f:$=v()/12;break;case c:$=v();break;case h:$=v()/3;break;case o:$=(D-m)/6048e5;break;case u:$=(D-m)/864e5;break;case a:$=D/n;break;case i:$=D/e;break;case s:$=D/t;break;default:$=D}return l?$:Y.a($)},y.daysInMonth=function(){return this.endOf(c).$D},y.$locale=function(){return v[this.$L]},y.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=g(t,e,!0);return r&&(n.$L=r),n},y.clone=function(){return Y.w(this.$d,this)},y.toDate=function(){return new Date(this.valueOf())},y.toJSON=function(){return this.isValid()?this.toISOString():null},y.toISOString=function(){return this.$d.toISOString()},y.toString=function(){return this.$d.toUTCString()},_}(),k=w.prototype;return b.prototype=k,[["$ms",r],["$s",s],["$m",i],["$H",a],["$W",u],["$M",c],["$y",f],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),b.extend=function(t,e){return t.$i||(t(e,w,b),t.$i=!0),b},b.locale=g,b.isDayjs=p,b.unix=function(t){return b(1e3*t)},b.en=v[D],b.Ls=v,b.p={},b}()},5807:function(t,e,n){t.exports=function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var n=e(t),r={name:"uz-latn",weekdays:"Yakshanba_Dushanba_Seshanba_Chorshanba_Payshanba_Juma_Shanba".split("_"),months:"Yanvar_Fevral_Mart_Aprel_May_Iyun_Iyul_Avgust_Sentabr_Oktabr_Noyabr_Dekabr".split("_"),weekStart:1,weekdaysShort:"Yak_Dush_Sesh_Chor_Pay_Jum_Shan".split("_"),monthsShort:"Yan_Fev_Mar_Apr_May_Iyun_Iyul_Avg_Sen_Okt_Noy_Dek".split("_"),weekdaysMin:"Ya_Du_Se_Cho_Pa_Ju_Sha".split("_"),ordinal:function(t){return t},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"D MMMM YYYY, dddd HH:mm"},relativeTime:{future:"Yaqin %s ichida",past:"%s oldin",s:"soniya",m:"bir daqiqa",mm:"%d daqiqa",h:"bir soat",hh:"%d soat",d:"bir kun",dd:"%d kun",M:"bir oy",MM:"%d oy",y:"bir yil",yy:"%d yil"}};return n.default.locale(r,null,!0),r}(n(446))}}]);
//# sourceMappingURL=5807.4723a0fa.chunk.js.map