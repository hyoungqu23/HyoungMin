import { IMPACT } from "../_content/portfolio-content";

const Impact = () => {
  return (
    <section className="pf-impact" id="impact" aria-labelledby="impact-title">
      <div className="pf-impact-stage">
        <h2 className="pf-eyebrow" id="impact-title">
          {IMPACT.index}
        </h2>
        <div
          className="pf-metric-transform"
          role="img"
          aria-label={IMPACT.ariaLabel}
        >
          <span className="pf-metric pf-metric-before" aria-hidden="true">
            {IMPACT.before}
            <small>{IMPACT.unit}</small>
          </span>
          <span className="pf-metric-arrow" aria-hidden="true" />
          <span className="pf-metric pf-metric-after" aria-hidden="true">
            {IMPACT.after}
            <small>{IMPACT.unit}</small>
          </span>
        </div>
        <div className="pf-impact-caption">
          <span className="pf-impact-label">{IMPACT.label}</span>
          <p className="pf-impact-description">{IMPACT.description}</p>
        </div>
      </div>
    </section>
  );
};

export default Impact;
