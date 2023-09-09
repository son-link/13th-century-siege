(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}})();const P=""+new URL("map.png",import.meta.url).href,O=""+new URL("tower.png",import.meta.url).href,D=""+new URL("tower2.png",import.meta.url).href;class v{constructor(e={x:0,y:0,sprite:"",life:100,coins:10,speed:.4}){this.position={x:e.x,y:e.y},this.image=new Image,this.center={x:e.x+7,y:e.y+7},this.velocity={x:0,y:0},this.radius=9,this.image.src=e.sprite,this.wpIndex=0,this.life=e.life,this.lifeOri=e.life,this.coins=e.coins,this.speed=e.speed}draw(){debug&&(ctx.beginPath(),ctx.fillStyle="rgba(255,0,0,.5)",ctx.arc(this.center.x,this.center.y,this.radius,0,Math.PI*2),ctx.fill()),ctx.fillStyle="#e6482e",ctx.fillRect(this.position.x,this.position.y+18,16,6),ctx.fillStyle="#38d973",ctx.fillRect(this.position.x+1,this.position.y+19,14*this.percentLife/100,4),ctx.drawImage(this.image,this.position.x,this.position.y,16,16)}update(){this.draw();const e=waypoints[this.wpIndex],t=e.x-this.center.x,i=e.y-this.center.y,n=Math.atan2(i,t),o=this.position.x+16>=0?this.speed*speedMulti:.4*speedMulti;this.velocity.x=Math.cos(n)*o,this.velocity.y=Math.sin(n)*o,this.position.x+=this.velocity.x,this.position.y+=this.velocity.y,this.center.x=this.position.x+8,this.center.y=this.position.y+8,Math.abs(this.center.x-e.x)<Math.abs(this.velocity.x)&&Math.abs(this.center.y-e.y)<Math.abs(this.velocity.y)&&this.wpIndex<waypoints.length-1&&this.wpIndex++,this.percentLife=100*this.life/this.lifeOri}}const k=""+new URL("ene1.png",import.meta.url).href;class R extends v{constructor(e,t){const i={x:e,y:t,sprite:k,life:80,coins:10,speed:.4};super(i),this.options=i}}const T=""+new URL("ene2.png",import.meta.url).href;class U extends v{constructor(e,t){const i={x:e,y:t,sprite:T,life:160,coins:10,speed:.35};super(i),this.options=i}}const A=""+new URL("ene3.png",import.meta.url).href;class q extends v{constructor(e,t){const i={x:e,y:t,sprite:A,life:70,coins:10,speed:.8};super(i),this.options=i}}const c=[{x:0,y:208},{x:240,y:208},{x:240,y:112},{x:80,y:112},{x:80,y:48},{x:368,y:48},{x:368,y:272},{x:208,y:272},{x:208,y:336},{x:496,y:336},{x:496,y:144},{x:640,y:144}];class W{constructor(e={position:{x:0,y:0},target:{}}){this.position=e.position,this.target=e.target,this.velocity={x:0,y:0},this.radius=2}draw(){ctx.fillStyle="white",ctx.beginPath(),ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2),ctx.fill()}update(){this.draw();const e=this.target.center.x-this.position.x,t=this.target.center.y-this.position.y,i=Math.atan2(t,e);this.velocity.x=Math.cos(i)*speedMulti,this.velocity.y=Math.sin(i)*speedMulti,this.position.x+=this.velocity.x,this.position.y+=this.velocity.y}}class j{constructor(e,t,i,n,o=1){this.position={x:e,y:t},this.image=new Image,this.image.src=i,this.center={x:e+16,y:t+16},this.radius=n,this.frames=0,this.targets=[],this.proyectiles=[],this.type=o}draw(){debug&&(ctx.beginPath(),ctx.fillStyle="rgba(0,255,0,.5)",ctx.arc(this.center.x,this.center.y,this.radius,0,Math.PI*2),ctx.fill()),ctx.drawImage(this.image,this.position.x,this.position.y,32,32),this.proyectiles.forEach(e=>e.update())}update(){if(this.frames%Math.floor(60/speedMulti)==0)for(let e=0;e<enemies.length;e++){const t=enemies[e];let i=t.position.x-this.position.x,n=t.position.y-this.position.y;if(Math.hypot(n,i)<t.radius+this.radius){this.proyectiles.push(new W({position:{x:this.center.x,y:this.center.y},target:t}));break}}this.frames++,this.draw()}}const C=[[0,0,343,0,343,0,343,0,0,343,0,343,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,343,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,343,0,343,0,0,0,0,0,343,0,0,0],[0,0,343,0,0,0,343,0,0,0,0,0,343,0,0,0,0,0,0,0],[0,0,343,0,0,343,0,0,343,0,0,0,0,0,343,0,343,0,0,0],[0,0,0,0,0,0,0,0,0,0,343,0,343,0,0,0,0,0,0,0],[0,0,343,0,0,343,0,343,0,0,0,0,0,0,343,0,343,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,343,0,343,0,0,0,343,0,0,343,0,343,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,343,0,0,0,343,0,0,0,343,0,0,0,0]];window.$=s=>document.querySelector(s);window.waypoints=c;window.scale=1;window.enemies=[];window.debug=!1;window.speedMulti=1;let h=300,u=5,r=!0,M=!0,l=1,b=[],m=[],p=!1,f=26;const L=26,S=c[0],y=$("#start_wave");y.style.left=`${S.x}px`;y.style.top=`${S.y+L-16}px`;const a=$("#tower_select");let x={},g=1;const w=$("#canvas");w.width=640;w.height=384;window.ctx=w.getContext("2d");ctx.imageSmoothingEnabled=!1;C.forEach((s,e)=>{s.forEach((t,i)=>{t==343&&m.push({x:i*32,y:e*32,isOccupied:!1})})});const E=new Image;E.onload=()=>{_()};E.src=P;const _=()=>{if(ctx.drawImage(E,0,0,640,384),g==2){if(b.forEach(s=>{s.update();for(let e=s.proyectiles.length-1;e>=0;e--){const t=s.proyectiles[e],i=t.target,n=i.center.x-t.position.x,o=i.center.y-t.position.y;Math.hypot(n,o)<i.radius+t.radius&&(t.target.life-=s.type==1?20:30,s.proyectiles.splice(e,1)),Math.hypot(t.position.x-s.center.x,t.position.y-s.center.y)>=s.radius+2&&s.proyectiles.splice(e,1)}}),p){enemies.forEach(e=>e.update());const s=c[c.length-1];for(let e=enemies.length-1;e>=0;e--)enemies[e].life<=0?(h+=enemies[e].coins,enemies.splice(e,1),r=!0,M++):Math.round(enemies[e].center.x)>=s.x&&Math.round(enemies[e].center.y)>=s.y&&(enemies.splice(e,1),u-=1,r=!0,u==0&&(g=3,$("#screens").style.display="block",$("#game_over").style.display="block",$("#killed > span").innerText=M))}else y.style.display="block";enemies.length==0&&p&&(l++,p=!1)}if(r){$("#coins").innerText=h,$("#lifes").innerHTML="";for(let s=1;s<=5;s++){const e=s<=u?"heart":"heart_empty";$("#lifes").innerHTML+=`<span class="${e}" /></span>`}$("#wave").innerText=`Wave: ${l}`,$("#vel").innerText=`X${speedMulti}`,r=!1}requestAnimationFrame(_)},I=()=>{enemies=[];const s=[];for(let t=1;t<=l;t++)[...Array(4)].forEach(()=>{t>=3&&t%3==0?s.push(2):t>=5&&t%5==0?s.push(3):s.push(1)});let e=f;s.forEach((t,i)=>{e+=l>=3&&l%3==0?f-l/3:f,i>0&&i%4==0&&(e+=f),t==1?enemies.push(new R(c[0].x-e,c[0].y-8)):t==2?enemies.push(new U(c[0].x-e,c[0].y-8)):enemies.push(new q(c[0].x-e,c[0].y-8))})},N=()=>{enemies=[],b=[],h=300,M=0,u=5,l=1,p=!1,r=!0,speedMulti=1};w.addEventListener("click",s=>{s.stopPropagation();const e=Math.round(s.clientX),t=Math.round(s.clientY)-L;for(let i=0;i<m.length;i++){const n=m[i];if(e>=n.x&&e<=n.x+32&&t>=n.y&&t<=n.y+32&&!n.isOccupied){a.style.top=`${n.y+16}px`,a.style.left=`${n.x-16}px`,a.style.display="flex",x={x:n.x,y:n.y,index:i};break}else a.style.display="none"}});$("#start_game").addEventListener("click",()=>{N(),g=2,I(),$("#screens").style.display="none",$("#start_screen").style.display="none"});$("#goto_start").addEventListener("click",()=>{g=1,$("#game_over").style.display="none",$("#start_screen").style.display="block"});document.querySelectorAll(".tower_btn").forEach(s=>{s.addEventListener("click",function(e){if(e.detail>1)return;const t=this.getAttribute("data-tower"),i=t==1?100:150,n=t==1?O:D;h-i>=0&&(b.push(new j(x.x,x.y,n,49,t)),m[x.index].isOccupied=!0,h-=i,r=!0),a.style.display="none"})});y.addEventListener("click",()=>{I(),p=!0,y.style.display="none"});window.addEventListener("click",s=>{a.style.display="none"});$("#vel").addEventListener("click",()=>{speedMulti<3?speedMulti++:speedMulti=1,r=!0});
