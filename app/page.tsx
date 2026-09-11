"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Box, ChevronRight, Circle, GitFork, Layers3, Minus, MousePointer2, Plus, RotateCcw, Rotate3D, Smartphone, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { products, type ProductId } from "@/lib/products";
import ProductStage, { type StageHandle } from "./product-stage";

const GITHUB_REPO_URL = "https://github.com/freddyuniverse/inside-objects";

export default function Home() {
  const [productId, setProductId] = useState<ProductId>("oura");
  const [separation, setSeparation] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const stage = useRef<StageHandle>(null);
  const product = products[productId];
  const part = selected === null ? null : product.parts[selected];
  function pickPart(index: number) { setSelected(index); setSeparation(100); setAutoRotate(false); }
  function changeProduct(id: string) { setProductId(id as ProductId); setSelected(null); setSeparation(0); setAutoRotate(false); }
  function toggle() { setSeparation(separation > 0 ? 0 : 100); setSelected(null); }
  return (
    <main className="museum">
      <header className="masthead">
        <a className="wordmark" href="/" aria-label="Inside Objects home"><Box strokeWidth={1.5} size={24}/><span>inside<span className="wordmark-light">objects</span><span className="brand-period">.</span></span></a>
        <span className="masthead-note">Every object has a story inside.</span>
        <span className="edition">THE INTERACTIVE COLLECTION <span>VOL. 01</span></span>
      </header>
      <Tabs className="collection" value={productId} onValueChange={changeProduct}>
        <div className="collection-bar">
          <div className="collection-label">EXPLORE AN OBJECT</div>
          <TabsList className="product-tabs">
            <TabsTrigger value="oura"><Circle size={17}/><span>Oura Ring 4</span><span className="tab-number">01</span></TabsTrigger>
            <TabsTrigger value="iphone"><Smartphone size={17}/><span>iPhone 16 Pro</span><span className="tab-number">02</span></TabsTrigger>
          </TabsList>
          <span className="collection-count">02 OBJECTS / ENDLESS CURIOSITY</span>
        </div>
        <TabsContent value={productId} className="exhibit" key={productId}>
          <section className="object-workspace" aria-label={`${product.name} interactive teardown`}>
            <div className="object-heading"><p className="eyebrow"><span className="orange-line"/>OBJECT {product.number} <span className="slash">/</span> {product.category}</p><h1>{product.name}</h1><p className="object-subtitle">{product.subtitle}</p></div>
            <div className="view-tag"><span className={separation > 0 ? "view-dot open" : "view-dot"}/>{separation > 0 ? "EXPLODED VIEW" : "ASSEMBLED VIEW"}</div>
            <div className="canvas-area"><ProductStage ref={stage} productId={productId} separation={separation} selected={selected} autoRotate={autoRotate} onPick={pickPart} onExplode={() => setSeparation(100)}/></div>
            <div className="specimen-caption"><span>{product.finish}</span><span>INTERACTIVE 3D STUDY</span></div>
            <div className="interaction-hint"><MousePointer2 size={14}/><span>{separation > 0 ? "Tap a component to look closer" : "Tap the object to see inside"}</span><span className="hint-divider"/>Drag to rotate</div>
            <div className="view-tools" aria-label="3D view controls">
              <button className={autoRotate ? "active" : ""} onClick={() => setAutoRotate(!autoRotate)} aria-label={autoRotate ? "Stop rotation" : "Auto rotate"} aria-pressed={autoRotate} title="Auto rotate"><Rotate3D size={19}/></button><span/>
              <button onClick={() => stage.current?.zoom(0.85)} aria-label="Zoom in" title="Zoom in"><Plus size={18}/></button><button onClick={() => stage.current?.zoom(1.18)} aria-label="Zoom out" title="Zoom out"><Minus size={18}/></button><span/>
              <button onClick={() => { stage.current?.reset(); setAutoRotate(false); }} aria-label="Reset camera" title="Reset camera"><RotateCcw size={17}/></button>
            </div>
          </section>
          <aside className="inspector" aria-label="Component explorer">
            <div className="inspector-heading"><span>UNDER THE SURFACE</span><span>{String(product.parts.length).padStart(2,"0")}</span></div>
            {part === null && <div className="inspector-intro"><h2>A little engineering.<br/>A lot of possibility.</h2><p>Select a component to discover its part in the whole.</p></div>}
            {part ? <div className="part-detail" aria-live="polite"><div className="part-detail-top"><span>COMPONENT {String((selected ?? 0)+1).padStart(2,"0")}</span><button onClick={()=>setSelected(null)} aria-label="Clear component selection"><X size={16}/></button></div><h3>{part.name}</h3><p>{part.description}</p><div className="material-label">{part.material}</div></div> : null}
            <div className="component-list">{product.parts.map((p, i) => <button className={`component-row ${selected === i ? "selected" : ""}`} key={p.name} onClick={() => pickPart(i)} aria-pressed={selected === i}><span className="component-index">{String(i+1).padStart(2,"0")}</span><span className="component-swatch" style={{background:p.color}}/><span>{p.name}</span><ChevronRight size={15}/></button>)}</div>
            {part === null && <div className="inspector-footnote"><Layers3 size={21} strokeWidth={1.3}/><p>{product.description}</p></div>}
          </aside>
        </TabsContent>
      </Tabs>
      <section className="explosion-bar" aria-label="Teardown controls">
        <div className="explosion-label"><Layers3 size={19}/><div><span>PIECE BY PIECE</span><p>{separation > 0 ? "The whole, unfolded." : "There’s more beneath the surface."}</p></div></div>
        <div className="depth-control"><div className="slider-labels"><label id="separation-label">Separation</label><span>{separation}%</span></div><Slider aria-labelledby="separation-label" value={[separation]} onValueChange={([v])=>{setSeparation(v);if(v===0)setSelected(null);}} max={100} step={1} className="separation-slider"/><div className="slider-extents"><span>Assembled</span><span>Exploded</span></div></div>
        <button className="explode-button" onClick={toggle}><Layers3 size={18}/>{separation > 0 ? "Put it back together" : "See what’s inside"}<span>{separation > 0 ? "−" : "+"}</span></button>
      </section>
      <footer className="site-footer"><span>A STUDY IN EVERYDAY INGENUITY</span><details><summary>About these models <Plus size={12}/></summary><div><strong>Made for curiosity.</strong><p>These are original, illustrative 3D models of major components, not manufacturer CAD or a complete inventory of every fastener and circuit element. Shapes, positions, and separation are simplified for exploration.</p><a href={product.source} target="_blank" rel="noreferrer">{product.sourceLabel}<ArrowUpRight size={14}/></a><a href="https://x.com/ashebytes/status/2096221988763173186" target="_blank" rel="noreferrer">Interaction inspiration: @ashebytes<ArrowUpRight size={14}/></a></div></details><a className="source-link" href={GITHUB_REPO_URL} target="_blank" rel="noreferrer"><GitFork size={14}/><span>STAR + FORK ON GITHUB</span><ArrowUpRight size={14}/></a></footer>
    </main>
  );
}
