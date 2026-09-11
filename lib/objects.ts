import * as T from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { ProductId } from "./products";

export type Assembly = { group:T.Group; parts:Piece[]; smallPieces:T.Object3D[] };
export type Piece = { object:T.Group; base:T.Vector3; offset:T.Vector3; anchor:T.Vector3 };
const V = (x=0,y=0,z=0) => new T.Vector3(x,y,z);
const metal = (color:string,roughness=.26,metalness=1) => new T.MeshStandardMaterial({color,roughness,metalness});
function mesh(parent:T.Object3D,g:T.BufferGeometry,m:T.Material,x=0,y=0,z=0) { const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o; }
function block(parent:T.Object3D,w:number,h:number,d:number,m:T.Material,x=0,y=0,z=0,r=.03) { return mesh(parent,new RoundedBoxGeometry(w,h,d,3,Math.min(r,d/2,w/2,h/2)),m,x,y,z); }
function band(inner:number,outer:number,height:number,start=0,length=Math.PI*2) {
  const b=Math.min(.034,(outer-inner)*.3,height*.15),p:T.Vector2[]=[];
  const corners=[[outer-b,-height/2+b,-Math.PI/2],[outer-b,height/2-b,0],[inner+b,height/2-b,Math.PI/2],[inner+b,-height/2+b,Math.PI]];
  corners.forEach(([x,y,a])=>{for(let i=0;i<=6;i++){const t=a+i/6*Math.PI/2;p.push(new T.Vector2(x+Math.cos(t)*b,y+Math.sin(t)*b));}});
  p.push(p[0].clone());
  return new T.LatheGeometry(p,128,start,length);
}
function pathRounded(w:number,h:number,r:number) {
  const s=new T.Shape(),x=-w/2,y=-h/2;
  s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
}
function plate(parent:T.Object3D,w:number,h:number,d:number,r:number,m:T.Material,x=0,y=0,z=0,holes:T.Path[]=[]) {
  const s=pathRounded(w,h,r);s.holes=holes;
  const g=new T.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:Math.min(.018,d*.25),bevelThickness:Math.min(.018,d*.25),curveSegments:14});g.translate(0,0,-d/2);return mesh(parent,g,m,x,y,z);
}
function cylinder(parent:T.Object3D,r:number,h:number,m:T.Material,x=0,y=0,z=0,axis:"y"|"z"="z") { const o=mesh(parent,new T.CylinderGeometry(r,r,h,48),m,x,y,z);if(axis==="z")o.rotation.x=Math.PI/2;return o; }
function create():Assembly { return {group:new T.Group(),parts:[],smallPieces:[]}; }
function part(a:Assembly,base:number[],offset:number[],anchor=[0,0,0]) { const g=new T.Group();g.position.fromArray(base);g.userData.part=a.parts.length;a.group.add(g);a.parts.push({object:g,base:V().fromArray(base),offset:V().fromArray(offset),anchor:V().fromArray(anchor)});return g; }
function label(parent:T.Object3D,text:string,w:number,h:number,x:number,y:number,z:number,color="#b4b6b4",flip=false) {
 const c=document.createElement("canvas");c.width=512;c.height=128;const ctx=c.getContext("2d")!;ctx.clearRect(0,0,512,128);ctx.fillStyle=color;ctx.textAlign="center";ctx.textBaseline="middle";ctx.font="48px Arial";ctx.fillText(text,256,64);
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const o=mesh(parent,new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false}),x,y,z);if(flip)o.rotation.y=Math.PI;return o;
}
function chip(parent:T.Object3D,w:number,h:number,x:number,y:number,z:number,m:T.Material,gold:T.Material) {
 const o=new T.Group();o.position.set(x,y,z);parent.add(o);block(o,w,h,.085,m);for(let i=0;i<5;i++){const px=(i/4-.5)*w*.8;block(o,.023,.055,.019,gold,px,-h/2-.015,0,.003);block(o,.023,.055,.019,gold,px,h/2+.015,0,.003);}return o;
}

export function buildOura():Assembly {
 const a=create();const silver=metal("#c4c6c8",.19),innerMetal=metal("#bcc0c3",.23),gold=metal("#caa66c",.32),pcb=metal("#705b33",.44,.5),black=metal("#262c30",.5,.35),solder=metal("#afb4b3",.22),glass=new T.MeshPhysicalMaterial({color:"#273e3c",metalness:.5,roughness:.12,clearcoat:1});
 const outer=part(a,[0,0,0],[0,2.1,0],[1.36,.1,0]);mesh(outer,band(1.34,1.5,.76),silver);
 // Two edge bands keep the polished rim distinct from the satin exterior.
 mesh(outer,band(1.347,1.491,.028),metal("#ececea",.11),0,.354,0);mesh(outer,band(1.347,1.491,.028),metal("#ececea",.11),0,-.354,0);
 const inside=part(a,[0,0,0],[0,-2.1,0],[1.25,-.1,0]);mesh(inside,band(1.11,1.2,.69),innerMetal);
 for(let i=0;i<6;i++){const ang=i*Math.PI/3+.23;const window=block(inside,.16,.13,.024,glass,Math.sin(ang)*1.105,0,Math.cos(ang)*1.105,.012);window.rotation.y=ang;}
 const flex=part(a,[0,0,0],[0,.75,0],[1.28,.02,0]);mesh(flex,band(1.22,1.255,.49),pcb);
 for(let j=0;j<5;j++)mesh(flex,band(1.257,1.262,.014,.06,Math.PI*1.92),gold,0,(j-2)*.07,0);
 for(let i=0;i<24;i++){const ang=i/24*Math.PI*2;const node=block(flex,.043,.13,.019,gold,Math.sin(ang)*1.267,.03,Math.cos(ang)*1.267,.004);node.rotation.y=ang;}
 const battery=part(a,[0,0,0],[0,-.75,-.05],[1.32,0,0]);mesh(battery,band(1.27,1.33,.5,.15,Math.PI*1.08),metal("#50535a",.37,.65));
 for(let i=0;i<12;i++){const ang=.25+i/11*Math.PI*.95;const seam=block(battery,.015,.46,.008,solder,Math.sin(ang)*1.334,0,Math.cos(ang)*1.334,.003);seam.rotation.y=ang;}
 const optics=part(a,[0,0,0],[2.25,-1,.5],[0,0,1.1]);
 for(let i=0;i<3;i++){const ang=-.5+i*.5;const pack=new T.Group();pack.position.set(Math.sin(ang)*1.21,0,Math.cos(ang)*1.21);pack.rotation.y=ang;optics.add(pack);block(pack,.25,.26,.06,black);const sensor=cylinder(pack,.064,.033,glass,0,0,.052);sensor.rotation.x=Math.PI/2;
   const led=new T.MeshStandardMaterial({color:i===1?"#ad3430":"#5a9767",emissive:i===1?"#a32919":"#328844",emissiveIntensity:.5,roughness:.17,metalness:.2});cylinder(pack,.029,.013,led,0,0,.075);
   for(let j=0;j<4;j++)block(pack,.025,.035,.017,gold,(j%2?1:-1)*.11,(j<2?-1:1)*.08,.034,.003);
   pack.userData.microOffset=V((i-1)*.1,0,.12);a.smallPieces.push(pack);
 }
 const motion=part(a,[-1.25,0,0],[-1.18,.65,.1],[0,.13,0]);chip(motion,.27,.28,0,0,0,black,gold);label(motion,"MEMS",.22,.06,0,0,.045);
 const temp=part(a,[.8,0,-.98],[1.1,.7,-.2],[0,.13,0]);chip(temp,.23,.2,0,0,0,metal("#b58a68",.35),gold);cylinder(temp,.043,.03,solder,0,0,.06);
 const radio=part(a,[-.5,0,-1.12],[-1.5,-1,.05],[0,.16,0]);chip(radio,.42,.36,0,0,0,black,gold);label(radio,"BLE",.22,.07,0,0,.047);block(radio,.58,.06,.022,pcb,0,-.3,0,.008);for(let i=0;i<6;i++)block(radio,.055,.12,.009,gold,-.25+i*.1,-.3,.019,.003);
 a.parts.forEach((p,index)=>p.object.traverse(o=>o.userData.part=index));a.smallPieces.forEach(o=>o.userData.microBase=o.position.clone());return a;
}

export function buildIPhone():Assembly {
 const a=create();const titanium=metal("#b5b2a9",.3),silver=metal("#b7bcc1",.26),black=metal("#20252b",.45,.3),pcb=metal("#254b3e",.45,.4),gold=metal("#bb9656",.29),glass=new T.MeshPhysicalMaterial({color:"#161d2c",roughness:.08,metalness:.35,clearcoat:1});
 const display=part(a,[0,0,.21],[-2.75,.25,1.9],[1.2,1.8,0]);plate(display,2.76,5.77,.075,.34,black);
 const c=document.createElement("canvas");c.width=512;c.height=1024;const ctx=c.getContext("2d")!;const gradient=ctx.createLinearGradient(0,0,512,1024);gradient.addColorStop(0,"#152c3c");gradient.addColorStop(.55,"#497d85");gradient.addColorStop(1,"#bed1cb");ctx.fillStyle=gradient;ctx.fillRect(0,0,512,1024);const glow=ctx.createRadialGradient(430,640,10,430,640,460);glow.addColorStop(0,"#b4dfdcbb");glow.addColorStop(1,"#779e9f00");ctx.fillStyle=glow;ctx.fillRect(0,0,512,1024);ctx.fillStyle="#ecf3ef";ctx.textAlign="center";ctx.font="32px Arial";ctx.fillText("Friday, September 20",256,145);ctx.font="110px Arial";ctx.fillText("9:41",256,255);ctx.fillStyle="#0d1520";ctx.beginPath();ctx.roundRect(180,30,152,42,21);ctx.fill();ctx.fillStyle="#f2f8f4";ctx.beginPath();ctx.roundRect(173,979,166,6,3);ctx.fill();
 const screenShape=pathRounded(2.65,5.65,.29);const sg=new T.ShapeGeometry(screenShape,20);const uvs=sg.getAttribute("uv"),pos=sg.getAttribute("position");for(let i=0;i<uvs.count;i++)uvs.setXY(i,pos.getX(i)/2.65+.5,pos.getY(i)/5.65+.5);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;mesh(display,sg,new T.MeshBasicMaterial({map:texture}),0,0,.044);
 const frame=part(a,[0,0,0],[0,0,0],[1.42,-.8,0]);const hole=pathRounded(2.55,5.52,.28);plate(frame,2.9,5.93,.33,.38,titanium,0,0,0,[hole]);
 // Internal rails, antenna breaks, side controls, and mounting screws.
 for(const side of [-1,1]){block(frame,.08,5.13,.055,silver,side*1.29,0,-.01);for(const y of [-2.1,1.9])block(frame,.03,.06,.31,black,side*1.451,y,0,.005);}
 for(const y of [.25,.95,1.68])block(frame,.07,y===1.68?.26:.53,.16,titanium,-1.48,y,0,.023);block(frame,.07,.68,.16,titanium,1.48,.73,0,.022);block(frame,.07,.58,.15,black,1.48,-1.1,0,.02);
 for(const x of [-1.22,1.22])for(const y of [-2.63,2.63]){cylinder(frame,.042,.04,silver,x,y,-.1);block(frame,.052,.009,.008,black,x,y,-.125,.003);}
 const rear=part(a,[0,0,-.22],[2.45,-.2,-1.8],[-1.2,-1.8,0]);const rearMat=new T.MeshPhysicalMaterial({color:"#b5b3ac",metalness:.35,roughness:.35,clearcoat:.65});plate(rear,2.76,5.77,.064,.33,rearMat);
 const island=plate(rear,1.46,1.58,.1,.27,metal("#a8a69e",.3),-.6,1.88,-.08);
 // A discreet wordmark keeps the rear panel readable without a traced logo.
 label(rear,"iPhone",.49,.12,0,-.25,-.037,"#81817e",true);
 cylinder(island,.085,.01,new T.MeshStandardMaterial({color:"#f1e9d4",roughness:.5}),.37,.4,-.061);cylinder(island,.071,.01,black,.39,-.41,-.061);
 const battery=part(a,[-.34,-.53,.005],[.3,-.25,1.03],[-.5,-.85,0]);plate(battery,1.72,3.34,.19,.14,metal("#3e4249",.42,.5));label(battery,"Li-ion",.56,.16,0,.42,-.103,"#a7aaac",true);label(battery,"RECHARGEABLE",1.18,.12,0,.12,-.104,"#9a9e9f",true);label(battery,"+",.15,.13,.57,1.37,-.104,"#a7aaac",true);block(battery,.3,.33,.025,gold,.6,1.75,0,.01);
 const logic=part(a,[.95,.2,.02],[1.65,.2,.95],[.3,1.2,0]);plate(logic,.49,3.9,.09,.07,pcb);block(logic,.75,.9,.08,pcb,-.38,1.48,0);
 for(let i=0;i<14;i++){const y=-1.68+i*.245;chip(logic,.26,i%3===0?.19:.12,0,y,-.092,black,gold);block(logic,.045,.063,.035,silver,.185,y+.05,-.079,.004);}
 chip(logic,.67,.65,-.34,1.4,-.11,black,gold);label(logic,"A18 PRO",.54,.1,-.34,1.4,-.161,"#b6b9b9",true);
 for(let i=0;i<16;i++){const trace=block(logic,.018,.08,.012,gold,-.43+(i%4)*.12,1.93+Math.floor(i/4)*.01,-.06,.003);a.smallPieces.push(trace);trace.userData.microOffset=V(0,0,-.06);}
 const cameraPositions=[[-.99,2.26,-.37],[-.99,1.55,-.37],[-.26,1.88,-.37]];
 const cameraOffsets=[[-1.2,1.05,-.95],[.0,1.75,-.95],[1.3,1.1,-.95]];
 cameraPositions.forEach((base,i)=>{
   const cam=part(a,base,cameraOffsets[i],[.28,.3,0]);plate(cam,.64,.64,.27,.12,silver);cylinder(cam,.30,.12,black,0,0,-.17);cylinder(cam,.258,.02,titanium,0,0,-.238);cylinder(cam,.232,.026,black,0,0,-.257);cylinder(cam,.19,.025,glass,0,0,-.28);
   const lens=mesh(cam,new T.SphereGeometry(.14,32,16),new T.MeshPhysicalMaterial({color:i===2?"#455574":"#326778",roughness:.08,metalness:.5,clearcoat:1}),0,0,-.28);lens.scale.z=.22;
   for(let j=0;j<3;j++){const ring=mesh(cam,new T.TorusGeometry(.197-j*.031,.004,6,48),metal("#73818a",.18),0,0,-.287-j*.002);a.smallPieces.push(ring);ring.userData.microOffset=V(0,0,-.07*j);}
   block(cam,.14,.3,.015,gold,.21,-.38,.01,.005);
 });
 const trueDepth=part(a,[0,2.58,.1],[-.1,1.2,.8],[.55,.12,0]);plate(trueDepth,1.0,.21,.14,.075,black);for(let i=0;i<3;i++)cylinder(trueDepth,.065,.03,glass,-.29+i*.29,0,-.086);block(trueDepth,.13,.3,.016,gold,.39,-.2,.01,.008);
 const taptic=part(a,[-.68,-2.45,.015],[-1.15,-.7,-.95],[-.38,0,0]);plate(taptic,1.0,.34,.21,.07,silver);label(taptic,"TAPTIC",.74,.085,0,0,-.12,"#626970",true);for(let i=0;i<6;i++)block(taptic,.022,.25,.022,black,-.4+i*.05,0,-.112,.002);
 const speaker=part(a,[.65,-2.45,.02],[1.4,-.85,-.9],[.38,0,0]);plate(speaker,.82,.4,.23,.08,black);for(let i=0;i<8;i++)cylinder(speaker,.016,.02,silver,-.27+i*.075,-.075,-.131);
 const coil=part(a,[0,-.42,-.13],[1.55,0,-.7],[.83,.5,0]);mesh(coil,new T.RingGeometry(.52,.91,80),black);for(let i=0;i<12;i++)mesh(coil,new T.TorusGeometry(.51+i*.024,.008,5,80),metal("#b18352",.33),0,0,-.03);
 for(let i=0;i<26;i++){const t=i/26*Math.PI*2;const magnet=block(coil,.11,.17,.026,silver,Math.cos(t)*1.04,Math.sin(t)*1.04,-.035,.005);magnet.rotation.z=t-Math.PI/2;magnet.userData.microOffset=V(Math.cos(t)*.045,Math.sin(t)*.045,0);a.smallPieces.push(magnet);}block(coil,.14,.46,.018,gold,0,-1.15,0,.006);
 const port=part(a,[0,-2.89,0],[0,-1.45,-.4],[.3,0,0]);const portShell=plate(port,.42,.19,.19,.08,silver);portShell.rotation.x=Math.PI/2;block(port,.32,.017,.095,black,0,-.105,0,.005);block(port,.46,.38,.027,pcb,0,.25,0,.007);for(let i=0;i<8;i++)block(port,.026,.17,.015,gold,-.15+i*.044,.31,-.018,.002);
 a.parts.forEach((p,index)=>p.object.traverse(o=>o.userData.part=index));a.smallPieces.forEach(o=>o.userData.microBase=o.position.clone());return a;
}
export function buildObject(id:ProductId) { return id==="oura"?buildOura():buildIPhone(); }
