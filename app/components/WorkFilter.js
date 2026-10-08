"use client";

export default function WorkFilter({ categories, activeCategory, onSelectCategory, query, onQueryChange }) {
  return <div className="work-filter-bar">
    <label className="work-category-control"><span className="work-sr-only">Filter projects by category</span><select value={activeCategory} onChange={event => onSelectCategory(event.target.value)}>{categories.map(category => <option key={category.id} value={category.id}>{category.id === "all" ? "Category" : category.label}</option>)}</select></label>
    <label className="work-search-control"><span aria-hidden="true">⌕</span><span className="work-sr-only">Search projects</span><input type="search" placeholder="Search..." value={query} onChange={event => onQueryChange(event.target.value)} /></label>
  </div>;
}
