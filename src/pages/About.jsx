import { motion } from 'framer-motion';
import { Code2, Clock, CheckCircle, BarChart2, Users, ShieldCheck } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'Problem Library',
      description: 'A curated and searchable set of algorithmic problems across difficulty levels and topics.',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Timed Assessments',
      description: 'Create or join time-boxed assessments with automatic start/end handling and team support.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Real-time Evaluation',
      description: 'Submissions are evaluated and recorded, providing instant feedback and acceptance status.',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: 'Progress & Analytics',
      description: 'Personal dashboards show solved counts, submission history, and improvement over time.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Leaderboard & Community',
      description: 'Compare performance with peers and join a community of learners and competitors.',
      color: 'from-indigo-400 to-violet-500'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Admin Tools',
      description: 'Admin-facing tooling for creating assessments, managing problems, and reviewing submissions.',
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              About OAPlateform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              OAPlateform is a focused platform for practicing algorithmic problems, joining timed assessments,
              and tracking progress — built for learners preparing for coding interviews and competitive events.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About the Project</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-4">
              OAPlateform provides a lightweight, practical environment for developers to practice problems, participate in
              time-boxed assessments, and evaluate performance with a simple dashboard and leaderboard.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              The platform includes user authentication, problem submission and evaluation, contest registration, and
              admin tools for creating assessments. It's built with modern web technologies (React + Vite on the frontend,
              Node/Express and MongoDB on the backend) and styled with Tailwind CSS.
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${value.color} text-white mb-4`}>
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Get Started</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Sign up, solve problems, and join upcoming assessments. Track your progress on the dashboard and compare
              performance with peers on the leaderboard.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <div>
                <div className="text-4xl font-bold">—</div>
                <div className="opacity-90">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold">—</div>
                <div className="opacity-90">Problems</div>
              </div>
              <div>
                <div className="text-4xl font-bold">—</div>
                <div className="opacity-90">Contests</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
