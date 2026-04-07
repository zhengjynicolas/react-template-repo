import { Link, Route, Routes } from "react-router";
import { useEffect } from "react";
import { useAutomationStore } from "./stores/automation-store";

function HomePage() {
  useEffect(() => {
    document.title = "Template Project";
  }, []);

  const runCount = useAutomationStore((state) => state.runCount);
  const increaseRunCount = useAutomationStore((state) => state.increaseRunCount);
  const setProjectReady = useAutomationStore((state) => state.setProjectReady);
  const projectReady = useAutomationStore((state) => state.projectReady);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Automation Starter</p>
        <h1>Template Project</h1>
        <p className="hero-copy">
          A TypeScript-first React template for local automation dashboards,
          internal tools, and workflow launchers.
        </p>
        <div className="hero-actions">
          <button type="button" onClick={increaseRunCount}>
            Simulate Run
          </button>
          <button type="button" onClick={() => setProjectReady(!projectReady)}>
            {projectReady ? "Mark as Draft" : "Mark as Ready"}
          </button>
        </div>
      </section>

      <section className="feature-grid">
        <article>
          <h2>Fast setup</h2>
          <p>Clone, rename, and start building without touching boilerplate.</p>
        </article>
        <article>
          <h2>Typed by default</h2>
          <p>
            TypeScript, typed routes, and a lightweight Zustand store are ready
            out of the box.
          </p>
        </article>
        <article>
          <h2>Automation-focused</h2>
          <p>
            A simple structure that is ready for task runners, APIs, and admin
            flows.
          </p>
        </article>
      </section>

      <section className="status-panel">
        <div>
          <span className="status-label">Project status</span>
          <strong>{projectReady ? "Ready to automate" : "Still configuring"}</strong>
        </div>
        <div>
          <span className="status-label">Demo run count</span>
          <strong>{runCount}</strong>
        </div>
      </section>

      <nav className="inline-nav">
        <Link to="/about">About this template</Link>
      </nav>
    </main>
  );
}

function AboutPage() {
  useEffect(() => {
    document.title = "About Template Project";
  }, []);

  return (
    <main className="page-shell page-shell--narrow">
      <h1>About Template Project</h1>
      <p>
        This starter is intended for automation products that need a web UI,
        lightweight routing, predictable local setup, and centralized client
        state.
      </p>
      <Link to="/">Back home</Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
