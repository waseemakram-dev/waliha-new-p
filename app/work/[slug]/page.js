import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "../../SiteChrome";
import { PORTFOLIO } from "../../data/portfolio";
import { getProjectStory } from "../../data/project-stories";
import Arrow from "../../components/Arrow";
import ArtworkGallery from "../ArtworkGallery";
import "../portfolio.css";

export function generateStaticParams(){return PORTFOLIO.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}){const {slug}=await params;const p=PORTFOLIO.find(p=>p.slug===slug);return {title:p?`${p.title} | Waliha Idrees`:"Project not found",description:p?.description};}

export default async function ProjectPage({params}){
  const {slug}=await params;const project=PORTFOLIO.find(p=>p.slug===slug);if(!project)notFound();
  const next=PORTFOLIO[(PORTFOLIO.indexOf(project)+1)%PORTFOLIO.length];
  const story=getProjectStory(slug);
  return <><SiteHeader/><main className="project-page"><header className="project-hero" id="heroSection"><div className="project-heading"><Link href="/work" className="project-back"><Arrow direction="left" size={18}/>All projects</Link><p className="portfolio-eyebrow">{project.category} / Selected collection</p><h1>{project.title}</h1><p className="project-intro">{story.headline}</p><a className="project-explore" href="#artwork-title">Explore the work <Arrow direction="down" size={18}/></a><div className="project-meta"><span>Design / Waliha Idrees</span><span>{project.images.length} artwork {project.images.length===1?"file":"files"}</span></div></div>
    <figure className="project-cover"><img src={project.cover} alt={`${project.title} presentation`} width={1600} height={1100}/><figcaption>{project.generatedMockup ? "AI-assisted presentation mockup" : "Design presentation"}</figcaption></figure></header>
    <section className="project-overview" aria-labelledby="overview-title"><div><p className="portfolio-eyebrow">01 / The collection</p><h2 id="overview-title">A closer look.</h2></div><div className="project-overview-copy"><p>{story.overview}</p><div className="project-focus">{story.focus.map(tag=><span key={tag}>{tag}</span>)}</div><dl><div><dt>Creative field</dt><dd>{project.category}</dd></div><div><dt>Designer</dt><dd>Waliha Idrees</dd></div><div><dt>Included</dt><dd>Original artwork & presentations</dd></div></dl></div></section>
    <section className="project-artwork" aria-labelledby="artwork-title"><div className="project-gallery-heading"><div><p className="portfolio-eyebrow">02 / Design archive</p><h2 id="artwork-title">The work, in full.</h2></div><p>{story.approach}</p></div><ArtworkGallery project={project} story={story}/></section>
    <aside className="project-conversation"><p className="portfolio-eyebrow">Have something in mind?</p><h2>Let’s give your idea<br/>a visual direction.</h2><a href="#contactSection">Start a conversation <Arrow size={18}/></a></aside>
    <Link className="next-project next-project-preview" href={`/work/${next.slug}`}><img src={next.cover} alt={`${next.title} project preview`} loading="lazy" width={600} height={400}/><div><span>Next collection / {next.category}</span><strong>{next.title}</strong><p>{next.description}</p></div><span className="portfolio-arrow"><Arrow/></span></Link>
  </main><SiteFooter/></>;
}
