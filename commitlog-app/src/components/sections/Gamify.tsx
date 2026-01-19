export default function Gamify() {
    return (
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Gamify Your Growth</h2>
              <p className="text-lg text-brand-muted dark:text-gray-400 mb-8 leading-relaxed">
                Building in public is a marathon, not a sprint. We help you stay consistent by turning your progress into a game.
              </p>
              <div className="space-y-4">
                {["Daily Streak Bonuses", "Rare Achievement Badges", "Community Leaderboards"].map((item) => (
                  <div key={item} className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                    <span className="font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="bg-white dark:bg-white/5 rounded-3xl p-8 border border-[#d3e4dd] dark:border-white/10 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-full bg-primary/30 flex items-center justify-center border-2 border-primary">
                      <span className="material-symbols-outlined text-2xl">person</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg">Alex Rivera</p>
                      <p className="text-xs text-brand-muted uppercase tracking-widest font-bold">Senior Developer</p>
                    </div>
                  </div>
                  <div className="bg-primary/10 px-3 py-1 rounded-full text-xs font-bold text-brand-muted">LVL 24</div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold">Current XP</span>
                      <span className="text-brand-muted">12,450 / 15,000</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Streak", val: "12 Days" },
                      { label: "Posts", val: "48" },
                      { label: "Growth", val: "+12%" }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#f9fbfa] dark:bg-white/5 p-4 rounded-xl text-center border border-[#d3e4dd] dark:border-white/10">
                        <p className="text-xs text-brand-muted mb-1 font-bold uppercase">{stat.label}</p>
                        <p className="text-xl font-extrabold">{stat.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }