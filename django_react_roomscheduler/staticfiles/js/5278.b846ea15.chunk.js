(self.webpackChunkdjangofrontend=self.webpackChunkdjangofrontend||[]).push([[5278],{446:function(t){t.exports=function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",a="hour",u="day",o="week",c="month",f="quarter",d="year",h="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,_=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},M=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},y={s:M,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+M(r,2,"0")+":"+M(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,a=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:d,w:o,d:u,D:h,h:a,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},p="en",w={};w[p]=m;var g="$isDayjsObject",v=function(t){return t instanceof Y||!(!t||!t[g])},D=function t(e,n,r){var i;if(!e)return p;if("string"==typeof e){var s=e.toLowerCase();w[s]&&(i=s),n&&(w[s]=n,i=s);var a=e.split("-");if(!i&&a.length>1)return t(a[0])}else{var u=e.name;w[u]=e,i=u}return!r&&i&&(p=i),i||!r&&p},S=function(t,e){if(v(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new Y(n)},k=y;k.l=D,k.i=v,k.w=function(t,e){return S(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var Y=function(){function m(t){this.$L=D(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[g]=!0}var M=m.prototype;return M.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(k.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},M.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},M.$utils=function(){return k},M.isValid=function(){return!(this.$d.toString()===l)},M.isSame=function(t,e){var n=S(t);return this.startOf(e)<=n&&n<=this.endOf(e)},M.isAfter=function(t,e){return S(t)<this.startOf(e)},M.isBefore=function(t,e){return this.endOf(e)<S(t)},M.$g=function(t,e,n){return k.u(t)?this[e]:this.set(n,t)},M.unix=function(){return Math.floor(this.valueOf()/1e3)},M.valueOf=function(){return this.$d.getTime()},M.startOf=function(t,e){var n=this,r=!!k.u(e)||e,f=k.p(t),l=function(t,e){var i=k.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(u)},$=function(t,e){return k.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},_=this.$W,m=this.$M,M=this.$D,y="set"+(this.$u?"UTC":"");switch(f){case d:return r?l(1,0):l(31,11);case c:return r?l(1,m):l(0,m+1);case o:var p=this.$locale().weekStart||0,w=(_<p?_+7:_)-p;return l(r?M-w:M+(6-w),m);case u:case h:return $(y+"Hours",0);case a:return $(y+"Minutes",1);case s:return $(y+"Seconds",2);case i:return $(y+"Milliseconds",3);default:return this.clone()}},M.endOf=function(t){return this.startOf(t,!1)},M.$set=function(t,e){var n,o=k.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[u]=f+"Date",n[h]=f+"Date",n[c]=f+"Month",n[d]=f+"FullYear",n[a]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===u?this.$D+(e-this.$W):e;if(o===c||o===d){var _=this.clone().set(h,1);_.$d[l]($),_.init(),this.$d=_.set(h,Math.min(this.$D,_.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},M.set=function(t,e){return this.clone().$set(t,e)},M.get=function(t){return this[k.p(t)]()},M.add=function(r,f){var h,l=this;r=Number(r);var $=k.p(f),_=function(t){var e=S(l);return k.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===d)return this.set(d,this.$y+r);if($===u)return _(1);if($===o)return _(7);var m=(h={},h[s]=e,h[a]=n,h[i]=t,h)[$]||1,M=this.$d.getTime()+r*m;return k.w(M,this)},M.subtract=function(t,e){return this.add(-1*t,e)},M.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=k.z(this),s=this.$H,a=this.$m,u=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,d=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},h=function(t){return k.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(_,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return k.s(e.$y,4,"0");case"M":return u+1;case"MM":return k.s(u+1,2,"0");case"MMM":return d(n.monthsShort,u,c,3);case"MMMM":return d(c,u);case"D":return e.$D;case"DD":return k.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return d(n.weekdaysMin,e.$W,o,2);case"ddd":return d(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return k.s(s,2,"0");case"h":return h(1);case"hh":return h(2);case"a":return $(s,a,!0);case"A":return $(s,a,!1);case"m":return String(a);case"mm":return k.s(a,2,"0");case"s":return String(e.$s);case"ss":return k.s(e.$s,2,"0");case"SSS":return k.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},M.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},M.diff=function(r,h,l){var $,_=this,m=k.p(h),M=S(r),y=(M.utcOffset()-this.utcOffset())*e,p=this-M,w=function(){return k.m(_,M)};switch(m){case d:$=w()/12;break;case c:$=w();break;case f:$=w()/3;break;case o:$=(p-y)/6048e5;break;case u:$=(p-y)/864e5;break;case a:$=p/n;break;case s:$=p/e;break;case i:$=p/t;break;default:$=p}return l?$:k.a($)},M.daysInMonth=function(){return this.endOf(c).$D},M.$locale=function(){return w[this.$L]},M.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=D(t,e,!0);return r&&(n.$L=r),n},M.clone=function(){return k.w(this.$d,this)},M.toDate=function(){return new Date(this.valueOf())},M.toJSON=function(){return this.isValid()?this.toISOString():null},M.toISOString=function(){return this.$d.toISOString()},M.toString=function(){return this.$d.toUTCString()},m}(),z=Y.prototype;return S.prototype=z,[["$ms",r],["$s",i],["$m",s],["$H",a],["$W",u],["$M",c],["$y",d],["$D",h]].forEach((function(t){z[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),S.extend=function(t,e){return t.$i||(t(e,Y,S),t.$i=!0),S},S.locale=D,S.isDayjs=v,S.unix=function(t){return S(1e3*t)},S.en=w[p],S.Ls=w,S.p={},S}()},5278:function(t,e,n){t.exports=function(t){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var n=e(t);function r(t){return t%10<5&&t%10>1&&~~(t/10)%10!=1}function i(t,e,n){var i=t+" ";switch(n){case"m":return e?"minuta":"minut\u0119";case"mm":return i+(r(t)?"minuty":"minut");case"h":return e?"godzina":"godzin\u0119";case"hh":return i+(r(t)?"godziny":"godzin");case"MM":return i+(r(t)?"miesi\u0105ce":"miesi\u0119cy");case"yy":return i+(r(t)?"lata":"lat")}}var s="stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_wrze\u015bnia_pa\u017adziernika_listopada_grudnia".split("_"),a="stycze\u0144_luty_marzec_kwiecie\u0144_maj_czerwiec_lipiec_sierpie\u0144_wrzesie\u0144_pa\u017adziernik_listopad_grudzie\u0144".split("_"),u=/D MMMM/,o=function(t,e){return u.test(e)?s[t.month()]:a[t.month()]};o.s=a,o.f=s;var c={name:"pl",weekdays:"niedziela_poniedzia\u0142ek_wtorek_\u015broda_czwartek_pi\u0105tek_sobota".split("_"),weekdaysShort:"ndz_pon_wt_\u015br_czw_pt_sob".split("_"),weekdaysMin:"Nd_Pn_Wt_\u015ar_Cz_Pt_So".split("_"),months:o,monthsShort:"sty_lut_mar_kwi_maj_cze_lip_sie_wrz_pa\u017a_lis_gru".split("_"),ordinal:function(t){return t+"."},weekStart:1,yearStart:4,relativeTime:{future:"za %s",past:"%s temu",s:"kilka sekund",m:i,mm:i,h:i,hh:i,d:"1 dzie\u0144",dd:"%d dni",M:"miesi\u0105c",MM:i,y:"rok",yy:i},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"}};return n.default.locale(c,null,!0),c}(n(446))}}]);
//# sourceMappingURL=5278.b846ea15.chunk.js.map