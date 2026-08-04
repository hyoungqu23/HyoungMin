import { EXPERIENCE } from "../_content/portfolio-content";

const Experience = () => {
  return (
    <section
      className="pf-section pf-experience"
      aria-labelledby="experience-title"
    >
      <div className="pf-section-heading pf-reveal">
        <p className="pf-section-index">{EXPERIENCE.index}</p>
        <h2 className="pf-section-title" id="experience-title">
          {EXPERIENCE.titleLines[0]}
          <br />
          {EXPERIENCE.titleLines[1]}
        </h2>
      </div>

      <div className="pf-timeline">
        {EXPERIENCE.rows.map((row) => (
          <article key={row.company} className="pf-timeline-row pf-reveal">
            <span className="pf-timeline-period">{row.period}</span>
            <div>
              <h3 className="pf-timeline-company">{row.company}</h3>
              <span className="pf-timeline-role">{row.role}</span>
            </div>
            <p className="pf-timeline-copy">{row.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Experience;
