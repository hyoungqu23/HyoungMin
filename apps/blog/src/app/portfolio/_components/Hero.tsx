import Image from "next/image";

import { HERO } from "../_content/portfolio-content";

const Hero = () => {
  const { intro } = HERO;

  return (
    <section className="pf-hero" id="top">
      <figure className="pf-portrait">
        <Image
          src="/images/identification_photo.png"
          alt="이형민 프로필 사진"
          fill
          priority
          sizes="(max-width: 640px) 188px, 27vw"
        />
      </figure>
      <div className="pf-sticker" aria-hidden="true">
        {HERO.sticker[0]}
        <br />
        {HERO.sticker[1]}
      </div>

      <div className="pf-hero-copy">
        <p className="pf-eyebrow pf-reveal">{HERO.eyebrow}</p>
        <h1 className="pf-hero-title" aria-label={HERO.titleLabel}>
          {HERO.titleLines.map((line) => (
            <span key={line} className="pf-line" data-split>
              {line}
            </span>
          ))}
        </h1>
      </div>

      <div className="pf-hero-bottom pf-reveal">
        <div>
          <p className="pf-hero-intro">
            {intro.main.before}
            <strong>{intro.main.strongA}</strong>
            {intro.main.middle}
            <strong>{intro.main.strongB}</strong>
          </p>
          <div className="pf-hero-meta" role="group" aria-label="기본 정보">
            <span className="pf-tag">{HERO.tags[0]}</span>
            <span className="pf-tag pf-tag--cyan">{HERO.tags[1]}</span>
            <span className="pf-tag pf-tag--acid">{HERO.tags[2]}</span>
          </div>
        </div>
        <p className="pf-hero-intro">{intro.sub}</p>
      </div>

      <div className="pf-scroll-cue" aria-hidden="true">
        SCROLL TO EXPLORE
      </div>
    </section>
  );
};

export default Hero;
