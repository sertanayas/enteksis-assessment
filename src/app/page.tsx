import { RequestForm } from "@/components/request-form";
import { serviceOptions } from "@/lib/request-schema";
const descriptions = [
  "Connect your tools and automate repetitive tasks, from lead capture to customer follow-ups.",
  "Give your team an AI assistant that helps draft responses, organize knowledge, and handle routine questions.",
  "Turn scattered data into useful reports with automated collection, clean-up, and delivery.",
];
export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header container">
      <a className="brand" href="#" aria-label="FlowPilot home"><span aria-hidden="true" className="brand-icon">↗</span>FlowPilot<span className="brand-dot">.</span></a>
      <nav aria-label="Main navigation"><a href="#services">Services</a><a href="#how-it-works">How it works</a><a className="nav-cta" href="#request">Let’s talk <span aria-hidden="true">↗</span></a></nav>
    </header>
    <main id="main">
      <section className="hero container" aria-labelledby="hero-title">
        <div><p className="eyebrow"><span className="status-dot" />SMALL TEAMS. BIG POSSIBILITIES.</p>
          <h1 id="hero-title">Less busywork.<br />More <span>forward.</span></h1>
          <p className="hero-copy">Your team has better things to do than repeat the same tasks. FlowPilot connects your tools and puts AI to work, so your small business can focus on what comes next.</p>
          <a className="button" href="#request">Find your next automation <span aria-hidden="true">↗</span></a>
          <p className="hero-note">Built around your business. Designed for your team.</p>
        </div>
        <div className="workflow" role="group" aria-label="Example automation workflow">
          <div className="workflow-heading"><span>YOUR WORKFLOW, CONNECTED</span><span className="live-label">● Example</span></div>
          <ol className="flow-list">
            <li className="flow-step"><span className="step-icon">01</span><div><strong>A new enquiry arrives</strong><p>From your website to your workspace</p></div><span className="check" aria-hidden="true">✓</span></li>
            <li className="flow-step featured"><span className="step-icon">02</span><div><strong>AI handles the busywork</strong><p>Summarize, categorize, and prepare a reply</p></div><span className="check" aria-hidden="true">✓</span></li>
            <li className="flow-step"><span className="step-icon">03</span><div><strong>Your team takes it from here</strong><p>The right information, in the right place</p></div><span className="check" aria-hidden="true">✓</span></li>
          </ol>
          <div className="workflow-footer"><span aria-hidden="true">✦</span> Less copying and pasting. More getting things done.</div>
        </div>
      </section>
      <section id="services" className="services section" aria-labelledby="services-title"><div className="container">
        <p className="eyebrow">WHAT WE CAN TAKE OFF YOUR PLATE</p>
        <div className="section-heading"><h2 id="services-title">Make everyday work<br />work better.</h2><p>Practical automation for small businesses, growing teams, and the people wearing more than one hat.</p></div>
        <div className="service-grid">{serviceOptions.map((service, index) => <article className="service-card" key={service}><span className="service-number">0{index + 1} /</span><h3>{service}</h3><p>{descriptions[index]}</p><a href="#request" aria-label={`Explore the possibilities for ${service}`}>Explore the possibilities <span aria-hidden="true">↗</span></a></article>)}</div>
      </div></section>
      <section id="how-it-works" className="section container" aria-labelledby="process-title">
        <p className="eyebrow">A SIMPLE WAY FORWARD</p><h2 id="process-title">From repetitive to effortless.</h2>
        <ol className="process-grid"><li><span>01</span><h3>Tell us what slows you down</h3><p>Share the tasks, tools, and bottlenecks that take up your team’s day.</p></li><li><span>02</span><h3>We map a smarter workflow</h3><p>We identify useful automations and agree on a clear approach with you.</p></li><li><span>03</span><h3>Build, test, and put it to work</h3><p>We connect the pieces, test the workflow, and help your team get comfortable.</p></li></ol>
      </section>
      <section id="request" className="request-section section" aria-labelledby="request-title"><div className="container request-grid">
        <div><p className="eyebrow">LET’S MAKE ROOM FOR BETTER WORK</p><h2 id="request-title">What would you<br />like to automate?</h2><p className="request-copy">Tell us a little about your business and the work you want to simplify. We’ll use your details to follow up about your request.</p><div className="request-aside"><span aria-hidden="true">↗</span><p>You don’t need a technical brief.<br />A real problem is a great place to start.</p></div></div><RequestForm />
      </div></section>
    </main>
    <footer className="container site-footer"><a className="brand" href="#">FlowPilot<span className="brand-dot">.</span></a><p>A fictional service. A practical step forward.</p><span>© 2026 FlowPilot</span></footer>
  </>;
}

