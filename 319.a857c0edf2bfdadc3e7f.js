(()=>{"use strict";var r,e,t={4319:(r,e,t)=>{var n=t(6695),o=t(360);function a(r){const e=(0,o.Z)(r.map((([r,e])=>[r,e]))),t=[1/0,-1/0],n=[1/0,-1/0],a=[1/0,-1/0];return r.forEach((([r,e,o])=>{n[0]=Math.min(n[0],r),n[1]=Math.max(n[1],r),a[0]=Math.min(a[0],e),a[1]=Math.max(a[1],e),t[0]=Math.min(t[0],o),t[1]=Math.max(t[1],o)})),{xyContour:e,xyCenter:[(n[1]+n[0])/2,(a[1]+a[0])/2],zRange:t}}onmessage=r=>{const{points:e}=r.data,t=function(r){const e=r.array,t=r.itemSize,o=new Array(e.length/t);for(let r=0;r<e.length;r+=t){const n=new Array(t);for(let o=0;o<t;o++)n[o]=e[r+o];o[r/t]=n}const i=(0,n.r)(o,{epsilon:.8,minPts:4}).map(((e,t)=>{const n=function(r,e){const t=e.array,n=e.itemSize,o=new Array(r.length);for(let e=0;e<r.length;e++){const a=r[e],i=[];for(let r=0;r<n;r++)i[r]=t[a*n+r];o[e]=i}return o}(e,r);return{pIndices:e,cId:t,buffer:new Float32Array(n.flat()),contour:a(n)}}));return i}(e);self.postMessage(t)}}},n={};function o(r){var e=n[r];if(void 0!==e)return e.exports;var a=n[r]={exports:{}};return t[r](a,a.exports,o),a.exports}o.m=t,o.x=()=>{var r=o.O(void 0,[883],(()=>o(4319)));return o.O(r)},r=[],o.O=(e,t,n,a)=>{if(!t){var i=1/0;for(f=0;f<r.length;f++){for(var[t,n,a]=r[f],s=!0,c=0;c<t.length;c++)(!1&a||i>=a)&&Object.keys(o.O).every((r=>o.O[r](t[c])))?t.splice(c--,1):(s=!1,a<i&&(i=a));if(s){r.splice(f--,1);var p=n();void 0!==p&&(e=p)}}return e}a=a||0;for(var f=r.length;f>0&&r[f-1][2]>a;f--)r[f]=r[f-1];r[f]=[t,n,a]},o.d=(r,e)=>{for(var t in e)o.o(e,t)&&!o.o(r,t)&&Object.defineProperty(r,t,{enumerable:!0,get:e[t]})},o.f={},o.e=r=>Promise.all(Object.keys(o.f).reduce(((e,t)=>(o.f[t](r,e),e)),[])),o.u=r=>r+".902c853892e43b32b42b.js",o.miniCssF=r=>{},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(r){if("object"==typeof window)return window}}(),o.o=(r,e)=>Object.prototype.hasOwnProperty.call(r,e),(()=>{var r;o.g.importScripts&&(r=o.g.location+"");var e=o.g.document;if(!r&&e&&(e.currentScript&&(r=e.currentScript.src),!r)){var t=e.getElementsByTagName("script");if(t.length)for(var n=t.length-1;n>-1&&!r;)r=t[n--].src}if(!r)throw new Error("Automatic publicPath is not supported in this browser");r=r.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),o.p=r})(),(()=>{var r={319:1};o.f.i=(e,t)=>{r[e]||importScripts(o.p+o.u(e))};var e=self.webpackChunkzheyangsong_github_io=self.webpackChunkzheyangsong_github_io||[],t=e.push.bind(e);e.push=e=>{var[n,a,i]=e;for(var s in a)o.o(a,s)&&(o.m[s]=a[s]);for(i&&i(o);n.length;)r[n.pop()]=1;t(e)}})(),e=o.x,o.x=()=>o.e(883).then(e),o.x()})();