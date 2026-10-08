"use client";

import LazyVideo from "@/app/LazyVideo";

export default function ProjectCard({ project, priority = false, onOpen }) {
  return <article className="alta-project-card" data-work-reveal>
    <div className="card-media-wrapper">
      {project.video ? <LazyVideo src={project.video} poster={project.poster} ariaLabel={project.title} /> : <img src={project.image} alt={project.title} loading={priority ? "eager" : "lazy"} className="card-static-image" />}
    </div>
    <div className="card-caption"><h3>{project.title}</h3><p>{project.categoryLabel}<span>·</span>{project.year}</p></div>
    <button type="button" className="card-open" onClick={onOpen} aria-label={`View ${project.title}`}><span aria-hidden="true">↗</span></button>
    <span className="card-web-thread" aria-hidden="true" />
  </article>;
}
