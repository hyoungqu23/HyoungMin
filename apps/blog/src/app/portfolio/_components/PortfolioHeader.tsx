import PortfolioThemeToggle from "./PortfolioThemeToggle";

const PortfolioHeader = () => {
  return (
    <header className="pf-header">
      <a className="pf-brand" href="#top">
        <span className="pf-brand-mark" aria-hidden="true" />
        HYOUNGMIN LEE
      </a>
      <nav className="pf-nav" aria-label="주요 메뉴">
        <a href="#impact">Impact</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
        <PortfolioThemeToggle />
      </nav>
    </header>
  );
};

export default PortfolioHeader;
