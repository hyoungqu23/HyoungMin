import Link from "next/link";
import type { CSSProperties } from "react";

import { WORK } from "../_content/portfolio-content";

const Work = () => {
  return (
    <section
      className="pf-section pf-work"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="pf-section-heading pf-reveal">
        <p className="pf-section-index">{WORK.index}</p>
        <h2 className="pf-section-title" id="work-title">
          {WORK.titleLines[0]}
          <br />
          {WORK.titleLines[1]}
        </h2>
      </div>
      <p className="pf-work-intro pf-reveal">{WORK.intro}</p>

      <div className="pf-project-stack">
        {WORK.projects.map((project, index) =>
          project.href ? (
            <Link
              key={project.number}
              href={project.href}
              className="pf-project-card-link"
            >
              <article
                className={`pf-project-card pf-project-card--${project.tone} pf-project-card--linked`}
                style={{ "--index": index } as CSSProperties}
              >
                <div className="pf-project-number">
                  <span>{project.meta}</span>
                  <strong aria-hidden="true">{project.number}</strong>
                </div>
                <div className="pf-project-content">
                  <div>
                    <p className="pf-project-kicker">{project.kicker}</p>
                    <h3 className="pf-project-title">{project.title}</h3>
                  </div>
                  <div className="pf-project-footer">
                    <p className="pf-project-description">
                      {project.description}
                    </p>
                    <div
                      className="pf-project-tags"
                      role="group"
                      aria-label="사용 기술"
                    >
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ) : (
            <article
              key={project.number}
              className={`pf-project-card pf-project-card--${project.tone}`}
              style={{ "--index": index } as CSSProperties}
            >
              <div className="pf-project-number">
                <span>{project.meta}</span>
                <strong aria-hidden="true">{project.number}</strong>
              </div>
              <div className="pf-project-content">
                <div>
                  <p className="pf-project-kicker">{project.kicker}</p>
                  <h3 className="pf-project-title">{project.title}</h3>
                </div>
                <div className="pf-project-footer">
                  <p className="pf-project-description">
                    {project.description}
                  </p>
                  <div
                    className="pf-project-tags"
                    role="group"
                    aria-label="사용 기술"
                  >
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
};

export default Work;
