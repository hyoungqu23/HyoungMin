import { MARQUEE_ITEMS } from "../_content/portfolio-content";

const Marquee = () => {
  return (
    <div className="pf-marquee" aria-hidden="true">
      {[0, 1].map((track) => (
        <div key={track} className="pf-marquee-track">
          {MARQUEE_ITEMS.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Marquee;
