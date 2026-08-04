import Link from "next/link";

import { CONTACT } from "../_content/portfolio-content";

const Contact = () => {
  return (
    <section
      className="pf-contact"
      id="contact"
      aria-labelledby="contact-title"
    >
      <h2 className="pf-contact-title pf-reveal" id="contact-title">
        LET&apos;S BUILD
        <br />
        WHAT <em>LASTS.</em>
      </h2>
      <div className="pf-contact-grid">
        <p className="pf-contact-copy pf-reveal">{CONTACT.copy}</p>
        <div className="pf-contact-links pf-reveal">
          {CONTACT.links.map((link) => {
            if (!link.external) {
              return (
                <Link key={link.id} className="pf-contact-link" href="/">
                  <span>{link.id}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              );
            }

            const isMailto = link.href.startsWith("mailto:");

            return (
              <a
                key={link.id}
                className="pf-contact-link"
                href={link.href}
                target={isMailto ? undefined : "_blank"}
                rel={isMailto ? undefined : "noreferrer"}
              >
                <span>{link.id}</span>
                <span aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
      </div>
      <footer className="pf-contact-footer">
        <span>{CONTACT.footer.copyright}</span>
        <span>{CONTACT.footer.slogan}</span>
      </footer>
    </section>
  );
};

export default Contact;
