"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

// Define the user data type
interface UserData {
  userId: string;
  username: string;
  avatarUrl: string;
  hasGithub: boolean;
  hasX: boolean;
  repos?: Array<{
    name: string;
    description: string;
  }>;
  schedules?: Array<{
    id: string;
    repo: string;
    type: string;
    time?: string;
    day?: string;
    createdAt?: string;
  }>;
  history?: Array<{
    id?: string;
    content: string;
    link: string;
    timestamp: Date | string; // Allow both Date objects and ISO strings
  }>;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [aiInput, setAiInput] = useState("");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({
    isOpen: false,
    itemId: "",
    currentRating: 0,
  });
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
  // const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  // Settings state
  const [technicalLevel, setTechnicalLevel] = useState(1); // 0: non-technical, 1: moderately technical, 2: highly technical
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [selectedFocus, setSelectedFocus] = useState("The Whole Story");

  // Handle authentication and fetch user data
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session?.user?.id) {
      redirect("/waitlist");
    }

    // Fetch user data when session is available
    const fetchUserData = async () => {
      setIsLoadingUser(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user?userId=${session.user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data.userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserData();
  }, [session, status]);

  // Show loading while checking authentication or fetching user data
  if (status === "loading" || isLoadingUser) {
    return (
      <div className="bg-background-light-dash min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-dashboard-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-white text-[32px] animate-pulse">
              terminal
            </span>
          </div>
          <p className="text-text-muted">
            {status === "loading"
              ? "Loading dashboard..."
              : "Fetching user data..."}
          </p>
        </div>
      </div>
    );
  }

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Format timestamp to display time in current timezone
  const formatTimestamp = (timestamp: Date | string) => {
    // Handle null, undefined, or empty timestamps
    if (!timestamp) {
      return "Unknown time";
    }

    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid timestamp received:", timestamp);
      return "Invalid time";
    }

    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Process history data for activity items
  const activityItems =
    userData?.history
      ?.map((historyItem, index) => {
        // Use the actual document ID if available, otherwise fall back to index-based ID
        const itemId = historyItem.id || `history-${index}`;

        // Debug logging for timestamp issues
        if (process.env.NODE_ENV === "development") {
          console.log(`Processing history item ${index}:`, {
            id: itemId,
            timestamp: historyItem.timestamp,
            timestampType: typeof historyItem.timestamp,
            content: historyItem.content?.substring(0, 50) + "...",
          });
        }

        return {
          id: itemId,
          time: formatTimestamp(historyItem.timestamp),
          // type: "commit",
          message: historyItem.content || "No content available",
          // icon: "commit",
          iconColor: "text-text-muted",
          dotColor: "bg-dashboard-primary",
          links: historyItem.link
            ? [{ label: "VIEW", url: historyItem.link }]
            : [],
          isAgentGenerated: true, // Mark as agent-generated for rating
          userRating: itemRatings[itemId] || 0,
        };
      })
      .filter(
        (item) => item.message && item.message !== "No content available"
      ) || []; // Filter out items with no content

  const integrations = [
    {
      name: "GitHub",
      icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      connected: userData?.hasGithub || false,
      isImage: true,
      clickable: true,
    },
    {
      name: "X (Twitter)",
      icon: "share",
      iconColor: "text-[#1DA1F2]",
      connected: userData?.hasX || false,
      isImage: false,
      clickable: true,
    },
  ];

  const handleXIntegration = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/x`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          // Navigate to the X OAuth URL
          window.location.href = data.redirectUrl;
        }
      } else {
        console.error("Failed to initiate X integration");
      }
    } catch (error) {
      console.error("Error connecting to X:", error);
    }
  };

  const handleGithubIntegration = async () => {
    try {
      const response = await fetch(`${backendURL}/api/auth/github`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.redirectUrl) {
          // Navigate to the GitHub OAuth URL
          window.location.href = data.redirectUrl;
        }
      } else {
        console.error("Failed to initiate GitHub integration");
      }
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
    }
  };

  // Handle rating submission
  const handleRating = async (itemId: string, score: number) => {
    try {
      // Update local state immediately for better UX
      setItemRatings((prev) => ({ ...prev, [itemId]: score }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_URL}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData?.userId,
            responseId: itemId,
            score: score / 5, // Convert 1-5 scale to 0-1 scale for backend
            improvement: "",
          }),
        }
      );

      if (response.ok) {
        console.log("Rating submitted successfully");
      } else {
        console.error(
          "Failed to submit rating",
          response.status,
          response.statusText
        );
        // Don't revert state on API error - keep the UI rating
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Don't revert state on network error - keep the UI rating
    }
  };

  // Handle detailed feedback submission
  const handleDetailedFeedback = async (
    itemId: string,
    score: number,
    improvement: string
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AGENT_URL}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData?.userId,
            responseId: itemId,
            score: score / 5, // Convert 1-5 scale to 0-1 scale for backend
            improvement,
          }),
        }
      );

      if (response.ok) {
        console.log("Detailed feedback submitted successfully");
        setFeedbackModal({ isOpen: false, itemId: "", currentRating: 0 });
      } else {
        console.error("Failed to submit detailed feedback");
      }
    } catch (error) {
      console.error("Error submitting detailed feedback:", error);
    }
  };

  return (
    <div className="bg-background-light-dash text-text-charcoal min-h-screen flex overflow-hidden font-space-grotesk">
      {/* Sidebar */}
      <aside
        className={`w-64 border-r border-border-light flex flex-col h-screen bg-white shrink-0 transition-transform duration-300 ${
          isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 z-50 lg:relative lg:translate-x-0`}
      >
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
          {/* <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">track_changes</span>
            <span className="font-medium text-sm tracking-wide">Goals</span>
          </a> */}
          {/* <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">forum</span>
            <span className="font-medium text-sm tracking-wide">Chat</span>
          </a> */}
          {/* <a
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all"
            href="#"
          >
            <span className="material-symbols-outlined">insights</span>
            <span className="font-medium text-sm tracking-wide">Progress</span>
          </a> */}
          {/* <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-slate-50 hover:text-text-charcoal transition-all w-full text-left"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-medium text-sm tracking-wide">Settings</span>
          </button> */}
        </nav>

        {/* <div className="p-4 mt-auto">
          <button className="w-full bg-dashboard-primary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity card-shadow">
            <span className="material-symbols-outlined text-[20px]">
              add_circle
            </span>
            <span>Manual Log</span>
          </button>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-border-light flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="lg:hidden p-2 text-text-muted hover:text-text-charcoal hover:bg-slate-50 rounded-lg transition-all"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold text-text-charcoal">Dashboard</h2>
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
                  {userData?.username || "User"}
                </p>
                <p className="text-[10px] text-dashboard-primary uppercase tracking-widest font-black">
                  Level 1
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-dashboard-primary/20 p-0.5">
                {userData?.avatarUrl ? (
                  <img
                    src={userData.avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-300"></div>
                )}
              </div>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            {showSettings ? (
              /* Settings Component */
              <div className="space-y-8">
                {/* Settings Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-2 text-text-muted hover:text-text-charcoal hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <span className="material-symbols-outlined">
                        arrow_back
                      </span>
                    </button>
                    <div>
                      <h2 className="text-2xl font-bold text-text-charcoal">
                        Agent Settings
                      </h2>
                      <p className="text-text-muted">
                        Customize how your AI agent constructs posts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Level Slider */}
                <section className="bg-white border border-border-light rounded-3xl p-6 card-shadow">
                  <h3 className="text-xl font-bold text-text-charcoal mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary">
                      tune
                    </span>
                    Technical Level
                  </h3>
                  <p className="text-text-muted mb-6">
                    How technical should your posts be?
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-text-muted">
                      <span>Non-Technical</span>
                      <span>Moderately Technical</span>
                      <span>Highly Technical</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={technicalLevel}
                        onChange={(e) =>
                          setTechnicalLevel(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between mt-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            technicalLevel === 0
                              ? "bg-dashboard-primary"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <div
                          className={`w-4 h-4 rounded-full ${
                            technicalLevel === 1
                              ? "bg-dashboard-primary"
                              : "bg-slate-300"
                          }`}
                        ></div>
                        <div
                          className={`w-4 h-4 rounded-full ${
                            technicalLevel === 2
                              ? "bg-dashboard-primary"
                              : "bg-slate-300"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-dashboard-primary">
                        {technicalLevel === 0
                          ? "Non-Technical"
                          : technicalLevel === 1
                          ? "Moderately Technical"
                          : "Highly Technical"}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Tone Selection */}
                <section className="bg-white border border-border-light rounded-3xl p-6 card-shadow">
                  <h3 className="text-xl font-bold text-text-charcoal mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary">
                      psychology
                    </span>
                    Tone & Style
                  </h3>
                  <p className="text-text-muted mb-6">
                    Choose the personality for your posts
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "Professional",
                        label: "Professional",
                        desc: "Clean, authoritative, and corporate-ready",
                      },
                      {
                        id: "Hype-Man",
                        label: "Hype-Man",
                        desc: 'High energy, heavy emoji use, "Build in Public" style',
                      },
                      {
                        id: "Minimalist",
                        label: "Minimalist",
                        desc: 'Short, punchy, "no-fluff" technical updates',
                      },
                      {
                        id: "Alpha/Ship",
                        label: "Alpha/Ship",
                        desc: 'Aggressive, fast-paced, "Grind" mindset',
                      },
                    ].map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedTone === tone.id
                            ? "border-green-400 bg-green-50"
                            : "border-border-light bg-white hover:border-dashboard-primary/30"
                        }`}
                      >
                        <h4 className="font-bold text-text-charcoal mb-1">
                          {tone.label}
                        </h4>
                        <p className="text-sm text-text-muted">{tone.desc}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* User Focus */}
                <section className="bg-white border border-border-light rounded-3xl p-6 card-shadow">
                  <h3 className="text-xl font-bold text-text-charcoal mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary">
                      center_focus_strong
                    </span>
                    Focus Area
                  </h3>
                  <p className="text-text-muted mb-6">
                    What aspects of your work should be highlighted?
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        id: "Feature Velocity",
                        label: "Feature Velocity",
                        desc: 'Highlights new buttons, pages, and "visible" stuff',
                      },
                      {
                        id: "Infrastructure & Security",
                        label: "Infrastructure & Security",
                        desc: 'Focuses on "under the hood" logic (APIs, DBs, Auth)',
                      },
                      {
                        id: "Performance/Optimization",
                        label: "Performance/Optimization",
                        desc: "Prioritizes speed wins, refactoring, and code cleanup",
                      },
                      {
                        id: "Bug Squashing",
                        label: "Bug Squashing",
                        desc: 'Focuses on stability and the "war" against errors',
                      },
                      {
                        id: "User Experience (UX/UI)",
                        label: "User Experience (UX/UI)",
                        desc: "Focuses on styling, animations, and frontend polish",
                      },
                      {
                        id: "The Whole Story",
                        label: "The Whole Story",
                        desc: "A balanced mix of all of the above (Default)",
                      },
                    ].map((focus) => (
                      <button
                        key={focus.id}
                        onClick={() => setSelectedFocus(focus.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedFocus === focus.id
                            ? "border-green-400 bg-green-50"
                            : "border-border-light bg-white hover:border-dashboard-primary/30"
                        }`}
                      >
                        <h4 className="font-bold text-text-charcoal mb-1">
                          {focus.label}
                        </h4>
                        <p className="text-sm text-text-muted">{focus.desc}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Save Settings */}
                <div className="flex justify-end">
                  <button className="bg-dashboard-primary text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all card-shadow">
                    Save Settings
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Integrations Section */}
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg lg:text-xl font-bold text-text-charcoal uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-dashboard-primary">
                        integration_instructions
                      </span>
                      Integrations
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {integrations.map((integration, index) => (
                      <div
                        key={index}
                        className={`bg-white border border-border-light rounded-2xl p-6 card-shadow transition-all hover:shadow-lg ${
                          integration.clickable
                            ? "cursor-pointer hover:border-dashboard-primary/30"
                            : ""
                        }`}
                        onClick={
                          integration.clickable
                            ? integration.name === "X (Twitter)"
                              ? handleXIntegration
                              : integration.name === "GitHub"
                              ? handleGithubIntegration
                              : undefined
                            : undefined
                        }
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-border-light flex items-center justify-center">
                              {integration.isImage ? (
                                <img
                                  className="w-6 h-6"
                                  alt={`${integration.name} Logo`}
                                  src={integration.icon}
                                />
                              ) : (
                                <span
                                  className={`material-symbols-outlined text-[24px] ${integration.iconColor}`}
                                >
                                  {integration.icon}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-text-charcoal text-lg">
                                {integration.name}
                              </h4>
                              <p className="text-sm text-text-muted">
                                {integration.name === "GitHub"
                                  ? "Source code repository integration"
                                  : "Social media posting platform"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {integration.connected ? (
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                <span className="text-xs font-bold text-green-600">
                                  CONNECTED
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                                <span className="text-xs font-bold text-text-muted">
                                  NOT CONNECTED
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-text-muted">
                              Status
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                integration.connected
                                  ? "text-green-600"
                                  : "text-slate-500"
                              }`}
                            >
                              {integration.connected ? "Active" : "Inactive"}
                            </span>
                          </div>

                          {!integration.connected && integration.clickable && (
                            <button className="w-full bg-dashboard-primary text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-all text-sm">
                              Connect {integration.name}
                            </button>
                          )}

                          {integration.connected && (
                            <div className="flex gap-2">
                              <button className="flex-1 bg-slate-100 text-text-charcoal font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-all text-sm">
                                Settings
                              </button>
                              <button className="flex-1 bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-all text-sm">
                                Disconnect
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Activity Stream */}
                <section className="bg-white border border-border-light rounded-3xl p-4 lg:p-6 card-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8 gap-4">
                    <h3 className="text-lg lg:text-xl font-bold text-text-charcoal uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-dashboard-primary">
                        history
                      </span>
                      Activity Stream
                    </h3>
                    <div className="flex gap-2">
                      {/* <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="bg-dashboard-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all card-shadow"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      add
                    </span>
                    Create Schedule
                  </button> */}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {activityItems.length > 0 ? (
                      activityItems.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-5 px-4 hover:bg-slate-50 rounded-2xl transition-all border-b border-slate-50 last:border-none"
                        >
                          <div className="lg:col-span-2 flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${item.dotColor}`}
                            ></div>
                            {/* <span className="text-xs font-mono text-text-muted tracking-tighter uppercase font-semibold">
                              {item.time}
                            </span> */}
                          </div>
                          <div className="lg:col-span-6">
                            <p className="text-sm font-medium text-text-charcoal flex items-center gap-2">
                              <span
                                className={`material-symbols-outlined text-[16px] ${item.iconColor}`}
                              >
                                {/* {item.icon} */}
                              </span>
                              {item.message}
                            </p>
                            {item.isAgentGenerated && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-text-muted">
                                  Rate this post:
                                </span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() =>
                                        handleRating(item.id, star)
                                      }
                                      className={`text-sm transition-colors ${
                                        (item.userRating || 0) >= star
                                          ? "text-yellow-400 hover:text-yellow-500"
                                          : "text-gray-300 hover:text-yellow-300"
                                      }`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                                {item.userRating && (
                                  <button
                                    onClick={() =>
                                      setFeedbackModal({
                                        isOpen: true,
                                        itemId: item.id,
                                        currentRating: item.userRating,
                                      })
                                    }
                                    className="text-xs text-dashboard-primary hover:underline ml-2"
                                  >
                                    Add feedback
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="lg:col-span-4 flex items-center justify-start lg:justify-end gap-3">
                            {item.links?.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted hover:text-dashboard-primary bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                                href={typeof link === "object" ? link.url : "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                view tweet
                              </a>
                            ))}
                            {/* {item.xp && (
                          <span
                            className={`text-[10px] font-bold px-2 py-1.5 rounded-lg tracking-widest ${
                              item.xpColor ||
                              "text-dashboard-primary bg-primary-soft"
                            }`}
                          >
                            {item.xp}
                          </span>
                        )} */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-slate-400 text-[32px]">
                            history
                          </span>
                        </div>
                        <h4 className="font-bold text-text-charcoal mb-2">
                          No activity yet
                        </h4>
                        <p className="text-text-muted text-sm">
                          Your commit history and activity will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Schedules Section */}
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg lg:text-xl font-bold text-text-charcoal uppercase tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-dashboard-primary">
                        schedule
                      </span>
                      Schedules
                    </h3>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="bg-dashboard-primary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all card-shadow w-fit"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        add
                      </span>
                      Create Schedule
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {userData?.schedules && userData.schedules.length > 0 ? (
                      userData.schedules.map((schedule, index) => (
                        <div
                          key={index}
                          className="bg-white border border-border-light rounded-2xl p-5 card-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-2 rounded-lg bg-primary-soft">
                              <span className="material-symbols-outlined text-[20px] text-dashboard-primary">
                                {schedule.type === "daily"
                                  ? "today"
                                  : "calendar_month"}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded text-dashboard-primary bg-primary-soft">
                              {schedule.type.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="font-bold text-text-charcoal mb-1">
                            {schedule.repo}
                          </h4>
                          <p className="text-xs text-text-muted mb-4 leading-relaxed">
                            {schedule.type === "daily"
                              ? `Posts daily at ${
                                  schedule.time + ":00" || "9:00 AM"
                                }`
                              : `Posts weekly on ${
                                  schedule.day || "Monday"
                                } at ${schedule.time + ":00" || "9:00 AM"}`}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-text-muted uppercase">
                              Active
                            </span>
                            <button className="text-text-muted hover:text-red-500 transition-colors">
                              <span className="material-symbols-outlined text-[16px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <span className="material-symbols-outlined text-slate-400 text-[32px]">
                            schedule
                          </span>
                        </div>
                        <h4 className="font-bold text-text-charcoal mb-2">
                          No schedules yet
                        </h4>
                        <p className="text-text-muted text-sm mb-4">
                          Create your first schedule to automate your commit
                          logs
                        </p>
                        <button
                          onClick={() => setIsScheduleModalOpen(true)}
                          className="bg-dashboard-primary text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
                        >
                          Create Schedule
                        </button>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>

        {/* Floating Add Schedule Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="bg-dashboard-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Add Schedule
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </button>
        </div>

        {/* AI Input Bar */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-background-light-dash via-background-light-dash to-transparent">
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
        </div> */}
      </main>

      {/* Right Sidebar */}
      <aside
        className={`w-80 border-l border-border-light flex flex-col h-screen bg-white shrink-0 p-8 space-y-8 transition-transform duration-300 ${
          isRightSidebarOpen ? "translate-x-0" : "translate-x-full"
        } fixed right-0 top-0 z-50 xl:relative xl:translate-x-0 ${
          isRightSidebarOpen ? "xl:flex" : "xl:hidden"
        }`}
      >
        {/* Level Progress */}
        {/* <div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">
            Level Progress
          </h4>
          <div className="bg-white border border-border-light rounded-2xl p-5 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="text-lg font-bold text-text-charcoal">
                  Level 1
                </h5>
                <p className="text-xs text-text-muted">{userData?.username || "User"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-dashboard-primary">0 XP</p>
                <p className="text-xs text-text-muted">Next: 100 XP</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase text-text-muted">
                <span>Progress to Level 1</span>
                <span>0%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-dashboard-primary rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Streak Status */}
        {/* <div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">
            Streak Status
          </h4>
          <div className="flex gap-2">
            <div className="flex-1 aspect-square rounded-xl border border-dashboard-primary/20 bg-primary-soft flex flex-col items-center justify-center card-shadow">
              <span className="text-2xl font-black text-dashboard-primary">
                0
              </span>
              <span className="text-[10px] font-bold text-text-muted">
                DAYS
              </span>
            </div>
            <div className="flex-1 aspect-square rounded-xl border border-border-light bg-slate-50 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-charcoal"></span>
              <span className="text-[10px] font-bold text-text-muted">
                LOGS
              </span>
            </div>
            <div className="flex-1 aspect-square rounded-xl border border-border-light bg-slate-50 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-charcoal">0</span>
              <span className="text-[10px] font-bold text-text-muted">
                LATE
              </span>
            </div>
          </div>
        </div> */}

        {/* Upgrade Pro */}
        <div className="mt-auto">
          <div className="p-6 rounded-2xl bg-primary-soft border border-dashboard-primary/20 relative overflow-hidden group hover:border-dashboard-primary/40 transition-all cursor-pointer">
            <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-[100px] text-dashboard-primary">
                rocket_launch
              </span>
            </div>
            <h5 className="text-text-charcoal font-bold mb-1">
              Upgrade To Pro
            </h5>
            <p className="text-xs text-text-muted mb-4">
              Unlock advanced AI analysis and team collaboration.
            </p>
            <button className="text-xs font-black text-dashboard-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
              Coming Soon
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile - Left Sidebar */}
      {isLeftSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsLeftSidebarOpen(false)}
        />
      )}

      {/* Overlay for mobile - Right Sidebar */}
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
          userData={userData}
        />
      )}

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-charcoal">
                Provide Feedback
              </h3>
              <button
                onClick={() =>
                  setFeedbackModal({
                    isOpen: false,
                    itemId: "",
                    currentRating: 0,
                  })
                }
                className="p-2 text-text-muted hover:text-text-charcoal hover:bg-slate-50 rounded-lg transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-charcoal mb-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setFeedbackModal((prev) => ({
                          ...prev,
                          currentRating: star,
                        }))
                      }
                      className={`text-xl transition-colors ${
                        feedbackModal.currentRating >= star
                          ? "text-yellow-400 hover:text-yellow-500"
                          : "text-gray-300 hover:text-yellow-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-text-muted">
                    {feedbackModal.currentRating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-charcoal mb-2">
                  How can we improve? (Optional)
                </label>
                <textarea
                  id="improvement-feedback"
                  rows={3}
                  className="w-full p-3 border border-border-light rounded-lg text-text-charcoal focus:ring-2 focus:ring-dashboard-primary focus:border-dashboard-primary resize-none"
                  placeholder="Share your thoughts on how we can make this better..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() =>
                    setFeedbackModal({
                      isOpen: false,
                      itemId: "",
                      currentRating: 0,
                    })
                  }
                  className="flex-1 py-2 px-4 rounded-lg border border-border-light text-text-muted font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const textarea = document.getElementById(
                      "improvement-feedback"
                    ) as HTMLTextAreaElement;
                    handleDetailedFeedback(
                      feedbackModal.itemId,
                      feedbackModal.currentRating,
                      textarea.value
                    );
                  }}
                  className="flex-1 py-2 px-4 rounded-lg bg-dashboard-primary text-white font-semibold hover:opacity-90 transition-all"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScheduleModal({
  isOpen,
  onClose,
  userData,
}: {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
}) {
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedHour, setSelectedHour] = useState("9");
  const [selectedDay, setSelectedDay] = useState("monday");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Use repositories from userData, fallback to empty array if not available
  const repositories = userData?.repos || [];

  const frequencies = [
    { id: "daily", label: "Daily", description: "Post every day" },
    { id: "weekly", label: "Weekly", description: "Post once a week" },
  ];

  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: `${i.toString().padStart(2, "0")}:00`,
  }));

  const days = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const handleFrequencySelect = (frequencyId: string) => {
    setSelectedFrequency(frequencyId);
  };

  const handleCreateSchedule = async () => {
    if (!selectedRepo || !selectedFrequency) return;

    setIsLoading(true);

    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const scheduleData = {
      userId: userData?.userId,
      repo: selectedRepo,
      type: selectedFrequency,
      time: selectedHour,
      timezone: detectedTz,
      ...(selectedFrequency === "weekly" && { day: selectedDay }),
    };

    try {
      const response = await fetch(`${backendURL}/api/createSchedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        onClose();
        // Show success indicator
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error("Failed to create schedule");
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Success indicator component
  const SuccessIndicator = () => (
    <div
      className={`fixed top-4 right-4 z-[60] bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 card-shadow transition-all duration-300 ${
        showSuccess ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
    >
      <span className="material-symbols-outlined text-[18px]">
        check_circle
      </span>
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
                <span className="material-symbols-outlined text-white text-[24px]">
                  schedule
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-charcoal">
                  Create Schedule
                </h2>
                <p className="text-sm text-text-muted">
                  Automate your commit logs and social posts
                </p>
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
              <span className="material-symbols-outlined text-dashboard-primary">
                folder
              </span>
              Select Repository
            </h3>
            <div className="space-y-3">
              {repositories.map((repo) => (
                <div
                  key={repo.name}
                  onClick={() => setSelectedRepo(repo.name)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedRepo === repo.name
                      ? "border-dashboard-primary bg-primary-soft"
                      : "border-border-light hover:border-dashboard-primary/30 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedRepo === repo.name
                            ? "bg-dashboard-primary"
                            : "bg-slate-100"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ${
                            selectedRepo === repo.name
                              ? "text-white"
                              : "text-text-muted"
                          }`}
                        >
                          folder_open
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-charcoal">
                          {repo.name}
                        </h4>
                        <p className="text-sm text-text-muted">
                          {repo.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequency Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-text-charcoal mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-dashboard-primary">
                repeat
              </span>
              Posting Frequency
            </h3>
            <div className="space-y-3">
              {frequencies.map((frequency) => (
                <div
                  key={frequency.id}
                  onClick={() => handleFrequencySelect(frequency.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedFrequency === frequency.id
                      ? "border-dashboard-primary bg-primary-soft"
                      : "border-border-light hover:border-dashboard-primary/30 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedFrequency === frequency.id
                            ? "bg-dashboard-primary"
                            : "bg-slate-100"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ${
                            selectedFrequency === frequency.id
                              ? "text-white"
                              : "text-text-muted"
                          }`}
                        >
                          {frequency.id === "daily"
                            ? "today"
                            : "calendar_month"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-text-charcoal">
                          {frequency.label}
                        </h4>
                        <p className="text-sm text-text-muted">
                          {frequency.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedFrequency === frequency.id
                          ? "border-dashboard-primary bg-dashboard-primary"
                          : "border-border-light"
                      }`}
                    >
                      {selectedFrequency === frequency.id && (
                        <span className="material-symbols-outlined text-white text-[16px]">
                          check
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Selection for Daily */}
            {selectedFrequency === "daily" && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="text-sm font-bold text-text-charcoal mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-dashboard-primary text-[16px]">
                    schedule
                  </span>
                  Select Time
                </h4>
                <select
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="w-full p-3 border border-border-light rounded-lg text-text-charcoal focus:ring-2 focus:ring-dashboard-primary focus:border-dashboard-primary"
                >
                  {hours.map((hour) => (
                    <option key={hour.value} value={hour.value}>
                      {hour.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Day and Time Selection for Weekly */}
            {selectedFrequency === "weekly" && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-text-charcoal mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary text-[16px]">
                      calendar_today
                    </span>
                    Select Day
                  </h4>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full p-3 border border-border-light rounded-lg text-text-charcoal focus:ring-2 focus:ring-dashboard-primary focus:border-dashboard-primary"
                  >
                    {days.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-charcoal mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-dashboard-primary text-[16px]">
                      schedule
                    </span>
                    Select Time
                  </h4>
                  <select
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    className="w-full p-3 border border-border-light rounded-lg text-text-charcoal focus:ring-2 focus:ring-dashboard-primary focus:border-dashboard-primary"
                  >
                    {hours.map((hour) => (
                      <option key={hour.value} value={hour.value}>
                        {hour.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
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
              disabled={!selectedRepo || !selectedFrequency || isLoading}
              className="flex-1 py-3 px-6 rounded-xl bg-dashboard-primary text-white font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    schedule
                  </span>
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
