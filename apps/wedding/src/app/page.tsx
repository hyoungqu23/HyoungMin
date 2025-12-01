import { Section } from "./_components/Section";

const Wedding = () => {
  return (
    <main
      role="main"
      id="main"
      className="w-screen overflow-x-hidden min-h-svh"
    >
      {/* Main */}
      <Section>
        <h1>Our Wedding Day</h1>
      </Section>
      {/* Story */}
      <Section>
        <h2>Our Story </h2>
      </Section>
      {/* Timeline */}
      <Section>
        <h2>Timeline</h2>
      </Section>
      {/* Map */}
      <Section>
        <h2>Map</h2>
      </Section>
      {/* Contact */}
      <Section>
        <h2>Contact</h2>
      </Section>
      {/* Guestbook */}
      <Section>
        <h2>Guestbook</h2>
      </Section>
    </main>
  );
};

export default Wedding;
