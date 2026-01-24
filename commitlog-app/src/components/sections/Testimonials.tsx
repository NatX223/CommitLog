const testimonials = [
  {
    name: "Sarah Chen",
    role: " ",
    text: "CommitLog has completely changed my building workflow. I no longer have to worry about 'what to post' - it just happens.",
  },
  {
    name: "Marcus Thorne",
    role: " ",
    text: "The AI summaries are scarily accurate. It captures exactly what I worked on and makes me look 10x more productive.",
  },
  {
    name: "Leo Kosta",
    role: " ",
    text: "Gained 2k followers in 3 months just by automating my GitHub updates. Best tool for indie hackers.",
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-[#f9fbfa] dark:bg-background-dark/50" id="community">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Loved by Builders</h2>
          <p className="text-[#578e77] max-w-[600px] mx-auto">
            Join 10,000+ developers, designers, and founders who are growing their audience with CommitLog.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-background-dark p-8 rounded-2xl border border-[#d3e4dd] dark:border-white/10 soft-shadow">
              <div className="flex gap-1 mb-4 text-primary">
                {[...Array(5)].map((_, star) => (
                  <span key={star} className="material-symbols-outlined fill-1">star</span>
                ))}
              </div>
              <p className="italic text-lg mb-6 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200"></div>
                <div>
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-[#578e77]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;