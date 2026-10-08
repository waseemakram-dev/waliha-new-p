export default function Arrow({ direction = "up-right", size = 22, className = "" }) {
  const rotation = { right: 0, down: 90, left: 180, up: -90, "up-right": -45 }[direction] ?? -45;
  return <svg className={`design-arrow ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{rotate:`${rotation}deg`}}><path d="M4 12h15M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
