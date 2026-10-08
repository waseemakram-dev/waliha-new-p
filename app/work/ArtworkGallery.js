"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "../components/Arrow";

export default function ArtworkGallery({project,story}) {
  const [selected,setSelected] = useState(null);
  const [zoom,setZoom] = useState(false);
  const viewer=useRef(null);
  useEffect(()=>{
    if(selected===null)return;
    const dialog=viewer.current;
    if(!dialog.open)dialog.showModal();
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const keys=e=>{
      if(e.key==="ArrowRight"){setSelected(i=>(i+1)%project.images.length);setZoom(false);}
      if(e.key==="ArrowLeft"){setSelected(i=>(i-1+project.images.length)%project.images.length);setZoom(false);}
    };
    document.addEventListener("keydown",keys);
    return ()=>{document.body.style.overflow=previous;document.removeEventListener("keydown",keys);};
  },[selected,project.images.length]);
  const close=()=>{viewer.current.close();setSelected(null);setZoom(false);};
  const move=delta=>{setSelected(i=>(i+delta+project.images.length)%project.images.length);setZoom(false);};
  const image=selected===null?null:project.images[selected];
  return <><div className={`artwork-layout ${project.images.length===1?"single-artwork":""}`}><div className="project-images">{project.images.map((im,i)=><button type="button" key={im.src} onClick={()=>{setSelected(i);setZoom(false);}} className="artwork-card" aria-label={`View ${project.title} artwork ${i+1}`}><img src={im.src} alt={`${project.title} original design ${i+1}`} loading="lazy" width={im.width} height={im.height}/><span>{String(i+1).padStart(2,"0")} / View artwork <Arrow size={16}/></span></button>)}</div>
    {project.images.length===1&&<aside className="artwork-notes"><p className="portfolio-eyebrow">Inside the design</p><h3>One identity.<br/>Different expressions.</h3><p>{project.description}</p><div>{story.focus.map((focus,i)=><div className="artwork-note" key={focus}><span>0{i+1}</span><h4>{focus}</h4></div>)}</div><p className="artwork-view-tip">Select the artwork for a closer look. The viewer stays right here on the page.</p></aside>}
  </div><dialog ref={viewer} className="artwork-viewer" aria-label={`${project.title} artwork viewer`} onClose={()=>{setSelected(null);setZoom(false);}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
    <div className="viewer-toolbar"><div><strong>{project.title}</strong><span>{selected===null?0:selected+1} / {project.images.length}</span></div><div><button type="button" onClick={()=>setZoom(z=>!z)} aria-label={zoom?"Fit artwork":"Enlarge artwork"}>{zoom?"Fit view":"Enlarge"}</button><button type="button" onClick={close} aria-label="Close artwork viewer"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round"/></svg></button></div></div>
    <div className={`viewer-stage ${zoom?"is-enlarged":""}`}>{image&&<img src={image.src} alt={`${project.title} artwork ${(selected??0)+1}`} width={image.width} height={image.height}/>}</div>
    {project.images.length>1&&<div className="viewer-navigation"><button type="button" onClick={()=>move(-1)} aria-label="Previous artwork"><Arrow direction="left"/>Previous</button><button type="button" onClick={()=>move(1)} aria-label="Next artwork">Next<Arrow direction="right"/></button></div>}
  </dialog></>;
}
