"use client";

import { useState } from "react";
import { ArrowLeft, BrainCircuit, DatabaseZap, Folder, Network, RadioTower, Sparkles } from "lucide-react";

const projects = [
  { id: "cortex", name: "CORTEX", icon: BrainCircuit, status: "Architecture locked", summary: "A local-first context layer for moving between AI tools without losing the plot.", stack: ["Electron", "TypeScript", "SQLite", "Local AI"], note: "Projects are primary. Knowledge beats transcripts. Humans confirm what becomes memory." },
  { id: "forge", name: "FORGE", icon: Sparkles, status: "Active build", summary: "A local terminal coding agent running on Ollama, built from the agent loop upward.", stack: ["Python", "Ollama", "Qwen2.5-Coder", "Tool use"], note: "Can inspect files, write code, run commands, capture failures, and stay inside its workspace." },
  { id: "helios", name: "HELIOS", icon: RadioTower, status: "Designing", summary: "Agent evaluation infrastructure built around record, replay, compare, and inspect.", stack: ["Agent evals", "Traces", "Evidence", "Replay"], note: "The fact/inference wall keeps observed behavior separate from interpretation." },
  { id: "converge", name: "CONVERGE", icon: DatabaseZap, status: "210 tests passing", summary: "A generative-AI-assisted big-data pipeline with explicit hallucination controls.", stack: ["Python", "Spark", "Gemini", "Big data"], note: "Compares Spark-only, AI-only, and hybrid execution before, during, and after processing." },
  { id: "campusos", name: "CAMPUSOS", icon: Network, status: "Hackathon build", summary: "A campus navigation and timetable system that turns a schedule into the next place to be.", stack: ["React", "Maps", "Timetable OCR", "Campus data"], note: "Designed around the academic block, room finding, events, and a campus-wide map." },
  { id: "raksha", name: "RAKSHA MESH", icon: RadioTower, status: "Prototype", summary: "Resilient multi-channel disaster alerts for people with smartphones, feature phones, or neither.", stack: ["FastAPI", "Mesh", "IVR", "Offline-first"], note: "Routes warnings through cell broadcast, FM, IVR, sirens, and local relay networks." },
];

export function ProjectsApp() {
  const [selected, setSelected] = useState(projects[0].id);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const project = projects.find((item) => item.id === (openProject ?? selected)) ?? projects[0];
  return <div className="projects-app">
    <nav className="window-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span></nav>
    <div className="explorer-toolbar"><button onClick={() => setOpenProject(null)} disabled={!openProject}>← Back</button><button onClick={() => setOpenProject(null)}>Up</button><button onClick={() => setOpenProject(project.id)}>Open</button></div>
    <div className="address-row"><span>Address</span><div>C:\DIVS\PROJECTS{openProject ? `\${project.name}` : ""}</div></div>
    {openProject ? <ProjectDetail project={project} onBack={() => setOpenProject(null)} /> : <div className="content-explorer project-explorer"><div className="project-grid">{projects.map((item) => { const Icon = item.icon; return <button key={item.id} className={selected === item.id ? "selected" : ""} onClick={() => setSelected(item.id)} onDoubleClick={() => setOpenProject(item.id)}><Folder className="project-folder" size={43} fill="#f3d45d" /><Icon className="project-folder-mark" size={18} /><strong>{item.name}</strong><small>{item.status}</small></button>; })}</div><aside className="content-preview"><span className="content-kicker">{project.status}</span><h2>{project.name}</h2><p>{project.summary}</p><div className="project-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div><button className="win95-button" onClick={() => setOpenProject(project.id)}>Open project</button></aside></div>}
    <footer className="window-status"><span>{openProject ? "Project details" : `${projects.length} object(s)`}</span><span>{project.name}</span></footer>
  </div>;
}

function ProjectDetail({ project, onBack }: { project: (typeof projects)[number]; onBack: () => void }) {
  const Icon = project.icon;
  return <div className="project-detail"><button className="detail-back" onClick={onBack}><ArrowLeft size={15} /> All projects</button><div className="project-detail-title"><Icon size={43} /><div><span>{project.status}</span><h2>{project.name}</h2></div></div><p className="project-lead">{project.summary}</p><h3>System note</h3><p>{project.note}</p><h3>Built with</h3><div className="project-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div></div>;
}
