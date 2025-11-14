import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Trophy,
  Target,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Dashboard = () => {
  const { user, getSubmissionStats, getUpcomingContests, getProblemsSolved } =
    useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    {
      label: "Problems Solved",
      value: 0,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Contest Participated",
      value: 0,
      icon: <Trophy className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-600",
    },
  ]);
  const [recentActivity, setRecentActivity] = useState([
    {
      problem: "Loading...",
      difficulty: "Easy",
      status: "Loading",
      time: "--",
    },
  ]);
  const [upcomingContests, setUpcomingContests] = useState([
    { title: "Loading...", startTime: new Date(), endTime: new Date() },
  ]);
  const [practiceProblems, setPracticeProblems] = useState([]);
  const [loadingPracticeProblems, setLoadingPracticeProblems] = useState(true);

  useEffect(() => {
    // If not logged in, redirect to home
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Fetch submission stats when component mounts and user is available
    if (user) {
      fetchSubmissionStats();
      fetchPracticeProblems();
      fetchUpcomingContests();
    }
  }, [user]);

  const fetchPracticeProblems = async () => {
    setLoadingPracticeProblems(true);
    try {
      const res = await fetch(`${API}/api/problem/allProblem`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        console.warn("Failed to fetch practice problems, status:", res.status);
        setPracticeProblems([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data.problem) ? data.problem : [];
      const mapped = list.map((p, idx) => ({
        id: p._id || p.problemId || idx + 1,
        title: p.name || p.title || `Problem ${idx + 1}`,
        difficulty: p.difficulty || "Medium",
        topic: p.topic || "Misc",
        solved: p.solved || 0,
        acceptance: p.acceptance || "—",
      }));
      setPracticeProblems(mapped);
    } catch (err) {
      console.error("Error fetching practice problems for dashboard:", err);
      setPracticeProblems([]);
    } finally {
      setLoadingPracticeProblems(false);
    }
  };

  const fetchSubmissionStats = async () => {
    try {
      // Get unique problems solved count (lightweight)
      const solvedResp = await getProblemsSolved();
      // Also get detailed submissions for recent activity
      const result = await getSubmissionStats();

      const updatedStats = [...stats];
      if (solvedResp && solvedResp.success) {
        updatedStats[0].value = solvedResp.problemSolved;
      } else if (result && result.success) {
        updatedStats[0].value = result.totalSolved;
      }
      setStats(updatedStats);

      // Update recent activity with actual submissions
      if (result && result.submissions && result.submissions.length > 0) {
        const recent = result.submissions
          .slice(-3)
          .reverse()
          .map((submission) => ({
            problem:
              submission.problemTitle ||
              submission.problem?.title ||
              "Problem " + submission.problem?._id?.slice(-4),
            difficulty: submission.problem?.difficulty || "Unknown",
            status: submission.status === "Accepted" ? "Solved" : "Attempted",
            time: submission.createdAt
              ? new Date(submission.createdAt).toLocaleDateString()
              : "Recently",
          }));
        setRecentActivity(recent);
      }
    } catch (error) {
      console.error("Error fetching submission stats:", error);
    }
  };

  const fetchUpcomingContests = async () => {
    try {
      const result = await getUpcomingContests();
      if (result.success && result.contests && result.contests.length > 0) {
        const contests = result.contests.map((contest) => ({
          _id: contest._id,
          title: contest.title || "Contest",
          description: contest.description || "",
          startTime: new Date(contest.startTime),
          endTime: new Date(contest.endTime),
          maxTeamSize: contest.maxTeamSize || 1,
          createdAt: contest.createdAt ? new Date(contest.createdAt) : null,
        }));
        setUpcomingContests(contests);
      } else {
        setUpcomingContests([]);
      }
    } catch (error) {
      console.error("Error fetching upcoming contests:", error);
      setUpcomingContests([]);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back, Coder!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress and continue your coding journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Practice Problem
                  </h2>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {activity.problem}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              activity.difficulty === "Easy"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                : activity.difficulty === "Medium"
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {activity.difficulty}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          activity.status === "Solved"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Practice Problems
                </h3>
                {loadingPracticeProblems ? (
                  <div className="text-sm text-gray-500">
                    Loading problems...
                  </div>
                ) : practiceProblems.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No practice problems available.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {practiceProblems.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {p.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {p.topic} • {p.difficulty}
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/practice`)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                          >
                            Solve
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <button
                    onClick={() => navigate("/practice")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View all problems
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quick Actions
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/practice")}
                    className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Code2 className="w-8 h-8 mx-auto mb-2" />
                    Practice Problems
                  </button>
                  <button
                    onClick={() => navigate("/contests")}
                    className="p-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    <Trophy className="w-8 h-8 mx-auto mb-2" />
                    Join Contest
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Upcoming Contests
                  </h2>
                </div>
                <div className="space-y-4">
                  {upcomingContests.length > 0 ? (
                    upcomingContests.map((contest, index) => {
                      const durationMs = contest.endTime - contest.startTime;
                      const durationHours = Math.floor(
                        durationMs / (1000 * 60 * 60)
                      );
                      const durationMinutes = Math.floor(
                        (durationMs % (1000 * 60 * 60)) / (1000 * 60)
                      );

                      return (
                        <div
                          key={contest._id || index}
                          className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex-1">
                              {contest.title}
                            </h3>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full ml-2">
                              Team Size: {contest.maxTeamSize}
                            </span>
                          </div>

                          {contest.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {contest.description}
                            </p>
                          )}

                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2 mb-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>
                                Starts: {contest.startTime.toLocaleDateString()}{" "}
                                at{" "}
                                {contest.startTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span>
                                Ends: {contest.endTime.toLocaleDateString()} at{" "}
                                {contest.endTime.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            {durationHours > 0 ||
                              (durationMinutes > 0 && (
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 flex-shrink-0" />
                                  <span>
                                    Duration:{" "}
                                    {durationHours > 0
                                      ? `${durationHours}h `
                                      : ""}
                                    {durationMinutes}m
                                  </span>
                                </div>
                              ))}
                          </div>

                          <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
                            Register Now
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p className="font-medium">
                        No upcoming contests at the moment
                      </p>
                      <p className="text-xs mt-1">
                        Check back soon for new contests!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
