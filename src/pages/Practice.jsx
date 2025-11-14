import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Code2, Trophy, Clock } from "lucide-react";
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const Practice = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");

  // Local fallback problems used if backend fetch fails
  const fallbackProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      topic: "Array",
      solved: 12543,
      acceptance: "48%",
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      topic: "Linked List",
      solved: 8234,
      acceptance: "42%",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      topic: "String",
      solved: 7123,
      acceptance: "35%",
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      topic: "Array",
      solved: 3456,
      acceptance: "28%",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      topic: "String",
      solved: 6789,
      acceptance: "38%",
    },
    {
      id: 6,
      title: "ZigZag Conversion",
      difficulty: "Medium",
      topic: "String",
      solved: 4567,
      acceptance: "41%",
    },
    {
      id: 7,
      title: "Reverse Integer",
      difficulty: "Easy",
      topic: "Math",
      solved: 9876,
      acceptance: "52%",
    },
    {
      id: 8,
      title: "String to Integer (atoi)",
      difficulty: "Medium",
      topic: "String",
      solved: 5432,
      acceptance: "33%",
    },
    {
      id: 9,
      title: "Palindrome Number",
      difficulty: "Easy",
      topic: "Math",
      solved: 11234,
      acceptance: "55%",
    },
    {
      id: 10,
      title: "Regular Expression Matching",
      difficulty: "Hard",
      topic: "String",
      solved: 2345,
      acceptance: "25%",
    },
  ];

  const [problems, setProblems] = useState(fallbackProblems);
  const [loadingProblems, setLoadingProblems] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProblems = async () => {
      try {
        const res = await fetch(`${API}/api/problem/allProblem`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          console.warn("Failed to fetch problems, status:", res.status);
          return;
        }
        const data = await res.json();
        // backend returns { problem: [...] }
        const list = Array.isArray(data.problem) ? data.problem : [];
        if (mounted && list.length > 0) {
          // Map backend problem format to UI-friendly fields if necessary
          const mapped = list.map((p, idx) => ({
            id: p.problemId || idx + 1,
            title: p.name || p.title || `Problem ${idx + 1}`,
            difficulty: p.difficulty || "Medium",
            topic: p.topic || "Misc",
            solved: p.solved || 0,
            acceptance: p.acceptance || "—",
          }));
          setProblems(mapped);
        }
      } catch (err) {
        console.error("Error fetching practice problems:", err);
      } finally {
        if (mounted) setLoadingProblems(false);
      }
    };
    fetchProblems();
    return () => {
      mounted = false;
    };
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "Medium":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "Hard":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "all" || problem.difficulty === selectedDifficulty;
    const matchesTopic =
      selectedTopic === "all" || problem.topic === selectedTopic;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const renderedProblemCards = filteredProblems.map((problem, index) => (
    <motion.div
      key={problem.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 dark:border-gray-700 group"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-500 dark:text-gray-400 font-mono">
              #{problem.id}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {problem.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
              {problem.topic}
            </span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Trophy className="w-4 h-4" />
              {problem.solved} solved
            </span>
            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              {problem.acceptance} acceptance
            </span>
          </div>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
          Solve
        </button>
      </div>
    </motion.div>
  ));

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
              Practice Problems
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Master coding with our curated collection of problems
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-gray-900 dark:text-white"
                >
                  <option value="all" className="text-gray-900 dark:text-white">
                    All Difficulty
                  </option>
                  <option
                    value="Easy"
                    className="text-gray-900 dark:text-white"
                  >
                    Easy
                  </option>
                  <option
                    value="Medium"
                    className="text-gray-900 dark:text-white"
                  >
                    Medium
                  </option>
                  <option
                    value="Hard"
                    className="text-gray-900 dark:text-white"
                  >
                    Hard
                  </option>
                </select>
              </div>

              <div className="relative">
                <Code2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none text-gray-900 dark:text-white"
                >
                  <option value="all" className="text-gray-900 dark:text-white">
                    All Topics
                  </option>
                  <option
                    value="Array"
                    className="text-gray-900 dark:text-white"
                  >
                    Array
                  </option>
                  <option
                    value="String"
                    className="text-gray-900 dark:text-white"
                  >
                    String
                  </option>
                  <option
                    value="Linked List"
                    className="text-gray-900 dark:text-white"
                  >
                    Linked List
                  </option>
                  <option
                    value="Math"
                    className="text-gray-900 dark:text-white"
                  >
                    Math
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loadingProblems ? (
              <div className="text-center py-12">Loading problems...</div>
            ) : (
              renderedProblemCards
            )}
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-12">
              <Code2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No problems found matching your criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Practice;
