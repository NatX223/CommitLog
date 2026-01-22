"use client";

import { useState } from "react";

export default function Dashboard() {
  const [aiInput, setAiInput] = useState("");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const activityItems = [
    {
      time: "09:42 AM",
      type: "commit",
      message: 'Committed to main: "Feat: implement rate limiting"',
      icon: "commit",
      iconColor: "text-text-muted",
      dotColor: "bg-dashboard-primary",
      links: ["GITHUB", "X / TWITTER"],
      xp: "+50 XP",
    },
    {
      time: "08:15 AM",
      type: "ai",
      message: "AI Agent drafted a social post based on 4 commits",
      icon: "auto_awesome",
      iconColor: "text-dashboard-primary",
      dotColor: "bg-dashboard-primary",
      links: ["X / TWITTER"],
      status: "DRAFTED",
    },
    {
      time: "Yesterday",
      type: "goal",
      message: 'Goal reached: "Complete Database Migration"',
      icon: "flag",
      iconColor: "text-amber-500",
      dotColor: "bg-amber-500",
      links: ["GITHUB"],
      xp: "+500 XP",
      xpColor: "text-amber-600 bg-amber-50",
    },
  ];

  const goals = [
    {
      title: "User Growth",
      description: "Reach 100 active beta testers for the platform.",
      progress: 75,
      status: "Active",
      statusColor: "text-dashboard-primary bg-primary-soft",
      icon: "trending_up",
      iconBg: "bg-primary-soft",
      iconColor: "text-dashboard-primary",
      progressColor: "bg-dashboard-primary",
    },
    {
      title: "API Documentation",
      description: "Complete Swagger/OpenAPI docs for all endpoints.",
      progress: 30,
      status: "On Track",
      statusColor: "text-text-muted bg-slate-100",
      icon: "description",
      iconBg: "bg-slate-50 border border-border-light",
      iconColor: "text-text-muted",
      progressColor: "bg-slate-300",
    },
    {
      title: "99.9% Uptime",
      description: "Maintain high availability during peak traffic windows.",
      progress: 99,
      status: "Stable",
      statusColor: "text-dashboard-primary bg-primary-soft",
      icon: "speed",
      iconBg: "bg-primary-soft",
      iconColor: "text-dashboard-primary",
      progressColor: "bg-dashboard-primary",
      healthLabel: "Health",
      healthValue: "Optimal",
    },
  ];

  const integrations = [
    {
      name: "GitHub",
      icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      connected: true,
      isImage: true,
    },
    {
      name: "X (Twitter)",
      icon: "share",
      iconColor: "text-[#1DA1F2]",
      connected: true,
      isImage: false,
      clickable: true,
    },
    {
      name: "Notion",
      icon: "grid_view",
      iconColor: "text-text-muted",
      connected: false,
      isImage: false,
    },
  ];

  const handleXIntegration = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/x`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          // Navigate to the X OAuth URL
          window.location.href = data.redirectUrl;
        }
      } else {
        console.error('Failed to initiate X integration');
      }
    } catch (error) {
      console.error('Error connecting to X:', error);
    }
  };

  return (
    <div className="bg-background-light-dash text-text-charcoal min-h-screen flex overflow-hidden font-space-grotesk">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-light flex flex-col h-screen bg-white shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-dashboard-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white font-bold">
              terminal
            </span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text-charcoal">
              CommitLog
            </h1>
            <p className="text-[10px] text-dashboard-primary font-bold tracking-widest uppercase">
              Build in Public
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-soft text-dashboard-primary border border-dashboard-primary/10"
            href="#"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-semibold text-sm tracking-wide">
              Dashboard
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">track_changes</span>
            <span className="font-medium text-sm tracking-wide">Goals</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">forum</span>
            <span className="font-medium text-sm tracking-wide">Chat</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">insights</span>
            <span className="font-medium text-sm tracking-wide">Progress</span>
          </a>
          <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium text-sm tracking-wide">Settings</span>
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <button className="w-full bg-dashboard-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity card-shadow">
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            <span>Manual Log</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-border-light flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text-charcoal">
              Main Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-text-muted hover:text-text-charcoal">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-dashboard-primary rounded-full"></span>
            </button>
            <div className="h-8 w-px bg-border-light"></div>
            <button 
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-lg transition-all"
            >
              <div className="text-right">
                <p className="text-sm font-bold text-text-charcoal">
                  The Architect
                </p>
                <p className="text-[10px] text-dashboard-primary uppercase tracking-widest font-black">
                  Level 12
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-dashboard-primary/20 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-300"></div>
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Activity Stream */}
            <section className="bg-white border border-border-light rounded-3xl p-6 card-shadow">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-text-charcoal uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-dashboard-primary">
                    history
                  </span>
                  Activity Stream
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="bg-dashboard-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all card-shadow"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                    Create Schedule
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {activityItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 py-5 px-4 hover:bg-slate-50 rounded-2xl transition-all border-b border-slate-50 last:border-none"
                  >
                    <div className="col-span-2 flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${item.dotColor}`}
                      ></div>
                      <span className="text-xs font-mono text-text-muted tracking-tighter uppercase font-semibold">
                        {item.time}
                      </span>
                    </div>
                    <div className="col-span-6">
                      <p className="text-sm font-medium text-text-charcoal flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined text-[16px] ${item.iconColor}`}
                        >
                          {item.icon}
                        </span>
                        {item.type === "commit" ? (
                          <>
                            Committed to{" "}
                            <code className="text-dashboard-primary bg-primary-soft px-1 rounded font-bold">
                              main
                            </code>
                            : "Feat: implement rate limiting"
                          </>
                        ) : (
                          item.message
                        )}
                      </p>
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-3">
                      {item.links?.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted hover:text-dashboard-primary bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                          href="#"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {link.includes("GITHUB") ? "link" : "share"}
                          </span>
                          {link}
                        </a>
                      ))}
                      {item.status && (
                        <span className="text-[10px] font-bold text-dashboard-primary bg-primary-soft px-2 py-1.5 rounded-lg tracking-widest uppercase">
                          {item.status}
                        </span>
                      )}
                      {item.xp && (
                        <span
                          className={`text-[10px] font-bold px-2 py-1.5 rounded-lg tracking-widest ${
                            item.xpColor ||
                            "text-dashboard-primary bg-primary-soft"
                          }`}
                        >
                          {item.xp}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Goals Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-text-charcoal uppercase tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-dashboard-primary">
                    target
                  </span>
                  Goals
                </h3>
                <button className="bg-dashboard-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all card-shadow">
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  Create Goal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {goals.map((goal, index) => (
                  <div
                    key={index}
                    className="bg-white border border-border-light rounded-2xl p-5 card-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg ${goal.iconBg}`}>
                        <span
                          className={`material-symbols-outlined text-[20px] ${goal.iconColor}`}
                        >
                          {goal.icon}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded ${goal.statusColor}`}
                      >
                        {goal.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-text-charcoal mb-1">
                      {goal.title}
                    </h4>
                    <p className="text-xs text-text-muted mb-4 leading-relaxed">
                      {goal.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-text-muted">
                        <span>{goal.healthLabel || "Progress"}</span>
                        <span>{goal.healthValue || `${goal.progress}%`}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${goal.progressColor}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* AI Input Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light-dash via-background-light-dash to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-border-light rounded-2xl p-2 card-shadow flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-soft rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-dashboard-primary">
                  smart_toy
                </span>
              </div>
              <input
                className="flex-1 border-none focus:ring-0 text-sm text-text-charcoal placeholder:text-text-muted bg-transparent"
                placeholder="Ask AI agent to draft a log or analyze recent commits..."
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
              />
              <button className="bg-dashboard-primary text-white p-2 rounded-xl hover:opacity-90 transition-opacity">
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className={`w-80 border-l border-border-light flex flex-col h-screen bg-white shrink-0 p-8 space-y-8 transition-transform duration-300 ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 z-50 xl:relative xl:translate-x-0 ${isRightSidebarOpen ? 'xl:flex' : 'xl:hidden'}`}>
        {/* Level Progress */}
        <div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">Level Progress</h4>
          <div className="bg-white border border-border-light rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="text-lg font-bold text-text-charcoal">Level 12</h5>
                <p className="text-xs text-text-muted">The Architect</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-dashboard-primary">2,450 XP</p>
                <p className="text-xs text-text-muted">Next: 3,000 XP</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-text-muted">
                <span>Progress to Level 13</span>
                <span>82%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-dashboard-primary rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Status */}
        <div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">Streak Status</h4>
          <div className="flex gap-2">
            <div className="flex-1 aspect-square rounded-xl border border-dashboard-primary/20 bg-primary-soft flex flex-col items-center justify-center card-shadow">
              <span className="text-2xl font-black text-dashboard-primary">14</span>
              <span className="text-[10px] font-bold text-text-muted">DAYS</span>
            </div>
            <div className="flex-1 aspect-square rounded-xl border border-border-light bg-slate-50 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-charcoal">42</span>
              <span className="text-[10px] font-bold text-text-muted">LOGS</span>
            </div>
            <div className="flex-1 aspect-square rounded-xl border border-border-light bg-slate-50 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-charcoal">0</span>
              <span className="text-[10px] font-bold text-text-muted">LATE</span>
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">Integrations</h4>
          <div className="space-y-3">
            {integrations.map((integration, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-border-light ${!integration.connected ? 'opacity-60' : ''} ${integration.clickable ? 'cursor-pointer hover:bg-slate-100 transition-colors' : ''}`}
                onClick={integration.clickable && integration.name === 'X (Twitter)' ? handleXIntegration : undefined}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-border-light flex items-center justify-center">
                    {integration.isImage ? (
                      <img className="w-5 h-5" alt={`${integration.name} Logo`} src={integration.icon} />
                    ) : (
                      <span className={`material-symbols-outlined text-[18px] ${integration.iconColor}`}>
                        {integration.icon}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{integration.name}</span>
                </div>
                {integration.connected ? (
                  <span className="w-2 h-2 rounded-full bg-dashboard-primary"></span>
                ) : (
                  <span className="text-[10px] font-bold text-text-muted">CONNECT</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Pro */}
        <div className="mt-auto">
          <div className="p-6 rounded-2xl bg-primary-soft border border-dashboard-primary/20 relative overflow-hidden group hover:border-dashboard-primary/40 transition-all cursor-pointer">
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[100px] text-dashboard-primary">rocket_launch</span>
            </div>
            <h5 className="text-text-charcoal font-bold mb-1">Upgrade Pro</h5>
            <p className="text-xs text-text-muted mb-4">Unlock advanced AI analysis and team collaboration.</p>
            <button className="text-xs font-black text-dashboard-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
              Learn more <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isRightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={() => setIsRightSidebarOpen(false)}
        />
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <ScheduleModal 
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </div>
  );
}

function ScheduleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock repositories - in real app, fetch from GitHub API
  const repositories = [
    { name: "commitlog-app", description: "Main application repository", commits: 142 },
    { name: "api-backend", description: "Backend API service", commits: 89 },
    { name: "mobile-app", description: "React Native mobile application", commits: 67 },
    { name: "docs-site", description: "Documentation website", commits: 34 },
  ];

  const frequencies = [
    { id: "daily", label: "Daily", description: "Post every day at 9:00 AM" },
    { id: "weekly", label: "Weekly", description: "Post every Monday at 9:00 AM" },
  ];

  const handleFrequencyToggle = (frequencyId: string) => {
    setSelectedFrequency(prev => 
      prev.includes(frequencyId) 
        ? prev.filter(id => id !== frequencyId)
        : [...prev, frequencyId]
    );
  };

  const handleCreateSchedule = async () => {
    if (!selectedRepo || selectedFrequency.length === 0) return;
    
    setIsLoading(true);
    
    const response = await fetch(`${backendURL}/api/createSchedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: '66010132', repo: selectedRepo, schedule: selectedFrequency }),
    });

    if (response.ok) {
      setIsLoading(false);
      onClose();
      
      // Show success indicator
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      console.error('Failed to initiate create schedule');
    }
  };

  // Success indicator component
  const SuccessIndicator = () => (
    <div className={`fixed top-4 right-4 z-[60] bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 card-shadow transition-all duration-300 ${showSuccess ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}>
      <span className="material-symbols-outlined text-[18px]">check_circle</span>
      <span className="font-bold text-sm">Schedule created successfully!</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <SuccessIndicator />
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto card-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-dashboard-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[24px]">schedule</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-charcoal">Create Schedule</h2>
              <p className="text-sm text-text-muted">Automate your commit logs and social posts</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-charcoal hover:bg-slate-50 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Repository Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-text-charcoal mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-dashboard-primary">folder</span>
            Select Repository
          </h3>
          <div className="space-y-3">
            {repositories.map((repo) => (
              <div
                key={repo.name}
                onClick={() => setSelectedRepo(repo.name)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedRepo === repo.name
                    ? 'border-dashboard-primary bg-primary-soft'
                    : 'border-border-light hover:border-dashboard-primary/30 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedRepo === repo.name ? 'bg-dashboard-primary' : 'bg-slate-100'
                    }`}>
                      <span className={`material-symbols-outlined ${
                        selectedRepo === repo.name ? 'text-white' : 'text-text-muted'
                      }`}>
                        folder_open
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-charcoal">{repo.name}</h4>
                      <p className="text-sm text-text-muted">{repo.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-dashboard-primary">{repo.commits}</p>
                    <p className="text-xs text-text-muted">commits</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-text-charcoal mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-dashboard-primary">repeat</span>
            Posting Frequency
          </h3>
          <div className="space-y-3">
            {frequencies.map((frequency) => (
              <div
                key={frequency.id}
                onClick={() => handleFrequencyToggle(frequency.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFrequency.includes(frequency.id)
                    ? 'border-dashboard-primary bg-primary-soft'
                    : 'border-border-light hover:border-dashboard-primary/30 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedFrequency.includes(frequency.id) ? 'bg-dashboard-primary' : 'bg-slate-100'
                    }`}>
                      <span className={`material-symbols-outlined ${
                        selectedFrequency.includes(frequency.id) ? 'text-white' : 'text-text-muted'
                      }`}>
                        {frequency.id === 'daily' ? 'today' : 'calendar_month'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-text-charcoal">{frequency.label}</h4>
                      <p className="text-sm text-text-muted">{frequency.description}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedFrequency.includes(frequency.id)
                      ? 'border-dashboard-primary bg-dashboard-primary'
                      : 'border-border-light'
                  }`}>
                    {selectedFrequency.includes(frequency.id) && (
                      <span className="material-symbols-outlined text-white text-[16px]">check</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-xl border border-border-light text-text-muted font-bold hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateSchedule}
            disabled={!selectedRepo || selectedFrequency.length === 0 || isLoading}
            className="flex-1 py-3 px-6 rounded-xl bg-dashboard-primary text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                Create Schedule
              </>
            )}
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
