import Link from "next/link";

import { STATS } from "../_content/portfolio-content";

const Stats = () => {
  return (
    <section className="pf-section pf-stats" aria-labelledby="stats-title">
      <div className="pf-section-heading pf-reveal">
        <p className="pf-section-index">{STATS.index}</p>
        <h2 className="pf-section-title" id="stats-title">
          {STATS.titleLines[0]}
          <br />
          {STATS.titleLines[1]}
        </h2>
      </div>

      <div className="pf-stats-grid">
        {STATS.items.map((item) =>
          item.href ? (
            <Link
              key={item.suffix + item.value}
              href={item.href}
              className="pf-stat-card-link"
            >
              <article
                className={`pf-stat-card pf-stat-card--${item.tone} pf-stat-card--linked pf-reveal`}
              >
                {/* SSR에는 최종값을 렌더한다 — 모션이 꺼져도 수치가 그대로 보인다 */}
                <div className="pf-stat-number">
                  <span data-count={item.value}>{item.value}</span>
                  <sup>{item.suffix}</sup>
                </div>
                <p>{item.copy}</p>
              </article>
            </Link>
          ) : (
            <article
              key={item.suffix + item.value}
              className={`pf-stat-card pf-stat-card--${item.tone} pf-reveal`}
            >
              {/* SSR에는 최종값을 렌더한다 — 모션이 꺼져도 수치가 그대로 보인다 */}
              <div className="pf-stat-number">
                <span data-count={item.value}>{item.value}</span>
                <sup>{item.suffix}</sup>
              </div>
              <p>{item.copy}</p>
            </article>
          ),
        )}
      </div>
    </section>
  );
};

export default Stats;
