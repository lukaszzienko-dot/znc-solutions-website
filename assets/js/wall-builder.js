(function(){var cv=document.getElementById('cv'),x=cv.getContext('2d'),G=24,W=40,H=24,P=[],sel=-1,q=5,TH=0.5;cv.width=W*G;cv.height=H*G;
function sz(p){return p.r%2?{w:TH,h:4}:{w:4,h:TH}}
function row(){P=P.map(function(p,i){return{x:2+i*4,y:4+Math.floor(i/9)*3,r:0}});P.forEach(function(p,i){p.x=2+(i%9)*4;p.y=4+Math.floor(i/9)*3});draw()}
function draw(){x.clearRect(0,0,cv.width,cv.height);x.strokeStyle='#eceeed';for(var i=0;i<=W;i++){x.beginPath();x.moveTo(i*G,0);x.lineTo(i*G,cv.height);x.stroke()}for(i=0;i<=H;i++){x.beginPath();x.moveTo(0,i*G);x.lineTo(cv.width,i*G);x.stroke()}
P.forEach(function(p,i){var s=sz(p);x.fillStyle=i==sel?'#0d4a34':'#5f8f7a';x.beginPath();x.roundRect(p.x*G,p.y*G,s.w*G,s.h*G,4);x.fill()});
document.getElementById('sc').textContent=P.length;var b=bb();document.getElementById('sd').textContent=b?fmt(b.w)+' × '+fmt(b.h):'–'}
function fmt(n){return(Math.round(n*2)/2)+''}
function bb(){if(!P.length)return null;var a=1e9,b=1e9,c=-1e9,d=-1e9;P.forEach(function(p){var s=sz(p);a=Math.min(a,p.x);b=Math.min(b,p.y);c=Math.max(c,p.x+s.w);d=Math.max(d,p.y+s.h)});return{w:c-a,h:d-b}}
WTdrag(cv,function(pt){for(var i=P.length-1;i>=0;i--){var p=P[i],s=sz(p),m=.4;if(pt.x/G>=p.x-m&&pt.x/G<=p.x+s.w+m&&pt.y/G>=p.y-m&&pt.y/G<=p.y+s.h+m){sel=i;draw();return{i:i,dx:pt.x/G-p.x,dy:pt.y/G-p.y}}}sel=-1;draw();return null},
function(d,pt){var p=P[d.i],s=sz(p);p.x=Math.max(0,Math.min(W-s.w,Math.round(pt.x/G-d.dx)));p.y=Math.max(0,Math.min(H-s.h,Math.round(pt.y/G-d.dy)));draw()});
function on(id,f){document.getElementById(id).onclick=f}
on('minus',function(){q=Math.max(1,q-1);qn.textContent=q});on('plus',function(){q=Math.min(60,q+1);qn.textContent=q});
on('add',function(){P.push({x:2,y:1,r:0});sel=P.length-1;draw()});on('rot',function(){if(sel>-1){P[sel].r=(P[sel].r+1)%4;var s=sz(P[sel]);P[sel].x=Math.min(P[sel].x,W-s.w);P[sel].y=Math.min(P[sel].y,H-s.h);draw()}});
on('del',function(){if(sel>-1){P.splice(sel,1);sel=-1;draw()}});on('line',row);
var qn=document.getElementById('qn');
function summary(){var b=bb(),h=P.filter(function(p){return p.r%2==0}).length;return P.length+' x 4ft W x 7ft H panels; footprint about '+(b?fmt(b.w)+' ft x '+fmt(b.h)+' ft':'n/a')+'; '+h+' running left-right, '+(P.length-h)+' front-back (plan view, 1-ft grid)'}
var send=WT('builder',function(i){if(i==1&&P.length!=q){P=new Array(q).fill(0).map(function(){return{r:0}});row()}if(i==2)document.getElementById('sum').textContent='Your layout: '+summary()+'.'});send('builder',summary);})();
