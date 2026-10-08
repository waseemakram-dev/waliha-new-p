"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Arrow from "../components/Arrow";
import CategoryDropdown from "../components/CategoryDropdown";
import { PORTFOLIO, ARTWORK_COUNT } from "../data/portfolio";

export default function WorkGallery() {
  const [category,setCategory] = useState("All Projects");
  const [search,setSearch] = useState("");
  const grid = useRef(null);
  const projects = PORTFOLIO.filter(p => (category === "All Projects" || p.category === category) && `${p.title} ${p.category}`.toLowerCase().includes(search.trim().toLowerCase()));
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
    }), {threshold:0.08});
    grid.current?.querySelectorAll(".portfolio-card").forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [category,search]);
  return <section className="real-work" aria-labelledby="work-gallery-title">
    <div className="real-work-heading"><div><p className="portfolio-eyebrow">Waliha Idrees / Selected work</p><h2 id="work-gallery-title">Ideas made visible.</h2></div><p>{PORTFOLIO.length} collections. {ARTWORK_COUNT} original designs.<br/>Brand identities, campaigns and visual stories.</p></div>
    <div className="portfolio-toolbar"><CategoryDropdown value={category} onChange={setCategory} options={["All Projects",...new Set(PORTFOLIO.map(p=>p.category))]}/><label className="portfolio-search">Search<input type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a project..."/></label></div>
    <div className="real-work-grid" ref={grid}>{projects.map(p=><Link className="portfolio-card" href={`/work/${p.slug}`} key={p.slug}><div className="portfolio-cover">{ }<img src={p.cover} alt={`${p.title} design presentation`} loading="lazy" width={1200} height={900}/></div><div className="portfolio-caption"><div><h3>{p.title}</h3><p>{p.category} · {p.images.length} {p.images.length===1?"design":"designs"}</p></div><span className="portfolio-arrow"><Arrow/></span></div></Link>)}</div>
    {!projects.length&&<p className="portfolio-empty">No projects match your search. Try another category.</p>}
  </section>;
}
