"use client";
import {useEffect,useRef,useState} from "react";

export default function CategoryDropdown({options,value,onChange}){
  const [open,setOpen]=useState(false);
  const root=useRef(null),trigger=useRef(null),list=useRef(null);
  useEffect(()=>{
    if(!open)return;
    list.current?.querySelector('[aria-selected="true"]')?.focus();
    const outside=e=>{if(!root.current?.contains(e.target))setOpen(false);};
    document.addEventListener("pointerdown",outside);
    return ()=>document.removeEventListener("pointerdown",outside);
  },[open]);
  const close=()=>{setOpen(false);trigger.current?.focus();};
  const keys=e=>{
    if(e.key==="Escape"){e.preventDefault();close();return;}
    const buttons=Array.from(list.current.querySelectorAll('[role="option"]'));
    const index=buttons.indexOf(document.activeElement);
    let next;
    if(e.key==="ArrowDown")next=(index+1)%buttons.length;
    if(e.key==="ArrowUp")next=(index-1+buttons.length)%buttons.length;
    if(e.key==="Home")next=0;
    if(e.key==="End")next=buttons.length-1;
    if(next!==undefined){e.preventDefault();buttons[next].focus();}
    if(e.key==="Tab")setOpen(false);
  };
  return <div className="category-filter" ref={root}><span id="category-label">Category</span><div className="category-dropdown"><button ref={trigger} type="button" className="category-trigger" aria-haspopup="listbox" aria-expanded={open} aria-controls="category-options" aria-label={`Category: ${value}`} onClick={()=>setOpen(o=>!o)} onKeyDown={e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();setOpen(true);}}}>{value}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
    {open&&<div id="category-options" role="listbox" aria-labelledby="category-label" ref={list} className="category-options" onKeyDown={keys}>{options.map(option=><button key={option} type="button" role="option" aria-selected={option===value} onClick={()=>{onChange(option);close();}}><span>{option}</span>{option===value&&<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}</button>)}</div>}
  </div></div>;
}
