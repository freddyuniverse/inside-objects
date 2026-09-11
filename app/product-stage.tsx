"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { products, type ProductId } from "@/lib/products";
import type { ObjectEngine } from "@/lib/object-engine";
export type StageHandle={reset:()=>void;zoom:(factor:number)=>void};
type Props={productId:ProductId;separation:number;selected:number|null;autoRotate:boolean;onPick:(index:number)=>void;onExplode:()=>void};
const ProductStage=forwardRef<StageHandle,Props>(function ProductStage(props,ref){
 const container=useRef<HTMLDivElement>(null),pins=useRef<(HTMLButtonElement|null)[]>([]),engine=useRef<ObjectEngine|null>(null),current=useRef(props);
 current.current=props;
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0);
 useImperativeHandle(ref,()=>({reset:()=>engine.current?.reset(),zoom:f=>engine.current?.zoom(f)}),[]);
 useEffect(()=>{
  let cancelled=false;setReady(false);setFailed(false);
  import("@/lib/object-engine").then(({ObjectEngine})=>{
   if(cancelled||!container.current)return;
   engine.current=new ObjectEngine(container.current,props.productId,()=>current.current,pins.current,()=>{if(!cancelled)setFailed(true);});setReady(true);
  }).catch(()=>{if(!cancelled)setFailed(true);});
  return()=>{cancelled=true;engine.current?.dispose();engine.current=null;};
 },[props.productId,retry]);
 return <div className="stage" ref={container}>
  {!ready&&!failed&&<div className="stage-loading" role="status"><span className="loading-pulse"/>Preparing your object…</div>}
  {failed&&<div className="stage-error" role="status"><strong>The 3D view couldn’t start.</strong><span>Try reloading the view. You can still explore the component list.</span><button onClick={()=>setRetry(v=>v+1)}>Reload 3D view</button></div>}
  {products[props.productId].parts.map((p,i)=><button key={p.name} ref={el=>{pins.current[i]=el;}} className={`part-pin ${props.selected===i?"selected":""}`} style={{display:"none"}} onClick={()=>props.onPick(i)} title={p.name} aria-label={`Inspect ${p.name}`} tabIndex={props.separation>15?0:-1}>{String(i+1).padStart(2,"0")}</button>)}
 </div>;
});
export default ProductStage;
