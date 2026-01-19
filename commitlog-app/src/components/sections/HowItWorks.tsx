const steps = [
    {
      title: "Connect",
      desc: "One-click integration with GitHub, Figma, and Linear. We securely sync your activity stream.",
      icon: "link",
    },
    {
      title: "Synthesize",
      desc: "AI distills your commits and designs into human-readable highlights that your audience will love.",
      icon: "bolt",
    },
    {
      title: "Broadcast",
      desc: "Automated, scheduled posts for X, LinkedIn, and Threads. Grow while you sleep.",
      icon: "campaign",
    },
  ];
  
  export default function HowItWorks() {
    return (
      <section className="py-24 bg-[#f9fbfa] dark:bg-background-dark/50" id="how-it-works">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How it Works</h2>
            <p className="text-[#578e77] max-w-[500px]">Three simple steps to automate your build-in-public journey without breaking your flow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.title} className="bg-background-light dark:bg-background-dark p-8 rounded-2xl border border-[#d3e4dd] dark:border-white/10 soft-shadow hover:-translate-y-1 transition-transform">
                <div className="size-12 bg-primary/20 text-[#101915] dark:text-primary rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-[#578e77] dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }