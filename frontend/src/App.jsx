import { useState } from 'react';
import { Upload, FileText, Download, CheckCircle2, AlertCircle, Clock, Sparkles, Trophy, Target, Zap, PartyPopper, Rocket } from 'lucide-react';
import { analyzeResume } from './components/ResumeAnalyzer'; 
import { generatePDF } from './components/PDFGenerator';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [suggestions, setSuggestions] = useState([]); 
  const [analyzed, setAnalyzed] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // --- [ FUNCTIONS ARE UNCHANGED ] ---

  const extractTextFromPDF = async (file) => {
    // ... (rest of function remains the same)
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  };

  const handleFileUpload = async (event) => {
    // ... (rest of function remains the same)
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsLoading(true);

      try {
        if (file.type === 'application/pdf') {
          const text = await extractTextFromPDF(file);
          setResumeText(text);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result;
            setResumeText(text);
          };
          reader.readAsText(file);
        }
      } catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAnalyze = () => {
    // ... (rest of function remains the same)
    if (resumeText.trim()) {
      const results = analyzeResume(resumeText);
      setSuggestions(results);
      setAnalyzed(true);
    }
  };

  const handleDownloadPDF = () => {
    // ... (rest of function remains the same)
    generatePDF(suggestions, fileName || 'My Resume');
  };

  const fireConfetti = () => {
    // ... (rest of function remains the same)
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const toggleSuggestion = (id) => {
    // ... (rest of function remains the same)
    const suggestion = suggestions.find(s => s.id === id);
    const wasCompleted = suggestion?.completed || false;
    
    setSuggestions(prev =>
      prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s)
    );

    if (!wasCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
      });
    }

    const updatedSuggestions = suggestions.map(s => s.id === id ? { ...s, completed: !wasCompleted } : s);
    const allComplete = updatedSuggestions.every(s => s.completed);
    
    if (allComplete && updatedSuggestions.length > 0) {
      setTimeout(() => {
        fireConfetti();
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }, 300);
    }
  };

  const getPriorityIcon = (priority) => {
    // ... (rest of function remains the same)
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'low':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    // ... (rest of function remains the same)
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return '';
    }
  };

  const categorizedSuggestions = suggestions.reduce((acc, suggestion) => {
    // ... (rest of function remains the same)
    if (!acc[suggestion.category]) {
      acc[suggestion.category] = [];
    }
    acc[suggestion.category].push(suggestion);
    return acc;
  }, {});

  const completedCount = suggestions.filter(s => s.completed).length;
  const progress = suggestions.length > 0 ? (completedCount / suggestions.length) * 100 : 0;
  
  // --- [ START RENDER FUNCTION (MODIFIED) ] ---
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* ... (motion divs remain unchanged) */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Celebration Modal (Unchanged) */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <motion.div
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-8 rounded-3xl shadow-2xl text-white text-center"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 3,
                }}
              >
                <Trophy className="w-20 h-20 mx-auto mb-4" />
                <h2 className="text-3xl mb-2">🎉 Amazing Work! 🎉</h2>
                <p className="text-xl">You've completed all suggestions!</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header (Unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-10 h-10 text-purple-600" />
            </motion.div>
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Resume Coach
            </h1>
            <motion.div
              animate={{
                rotate: [0, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <Rocket className="w-10 h-10 text-pink-600" />
            </motion.div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 max-w-2xl mx-auto text-lg"
          >
            ✨ Upload or paste your resume to get personalized suggestions and a downloadable improvement checklist! 
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section - Now using DIVs and HTML elements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6 rounded-xl border-2 border-purple-200/50 shadow-xl hover:shadow-2xl transition-shadow backdrop-blur-sm bg-white/80">
              <header className="mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Your Resume
                </h2>
                <p className="text-gray-500 text-sm">
                  Upload a PDF or text file, or paste your resume content below
                </p>
              </header>
              <div className="space-y-4">
                {/* File Upload */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <label
                    htmlFor="file-upload"
                    className={`flex items-center justify-center gap-2 p-6 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <motion.div
                      animate={isLoading ? {
                        rotate: 360,
                      } : {}}
                      transition={{
                        duration: 1,
                        repeat: isLoading ? Infinity : 0,
                        ease: "linear"
                      }}
                    >
                      <Upload className="w-5 h-5 text-purple-500" />
                    </motion.div>
                    <span className="text-gray-700">
                      {isLoading ? '⏳ Processing file...' : fileName || '📄 Click to upload a .pdf or .txt file'}
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </motion.div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                  <span className="text-gray-400 text-sm">or paste text</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                </div>

                {/* Text Area (replaced Textarea component with native textarea) */}
                <textarea
                  placeholder="Paste your resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full min-h-[300px] p-3 border rounded-md font-mono text-sm border-purple-200 focus:border-purple-400"
                  disabled={isLoading}
                />

                {/* Analyze Button (replaced Button component with native button) */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={handleAnalyze}
                    disabled={!resumeText.trim() || isLoading}
                    className="w-full p-3 rounded-md text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Zap className="w-4 h-4 mr-2 inline-block" />
                    Analyze Resume
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Results Section - Now using DIVs and HTML elements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-6 rounded-xl border-2 border-blue-200/50 shadow-xl hover:shadow-2xl transition-shadow backdrop-blur-sm bg-white/80">
              <header className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      Analysis Results
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {analyzed
                        ? `🎯 ${suggestions.length} suggestions found`
                        : 'Results will appear here'}
                    </p>
                  </div>
                  {analyzed && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button onClick={handleDownloadPDF} className="p-2 border rounded-md border-blue-300 text-blue-600 hover:bg-blue-50">
                        <Download className="w-4 h-4 mr-2 inline-block" />
                        Download PDF
                      </button>
                    </motion.div>
                  )}
                </div>
              </header>
              <div>
                {!analyzed ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-12 text-center"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <FileText className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">
                      Upload or paste your resume and click "Analyze Resume" to get started 🚀
                    </p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Progress (Unchanged) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <motion.span 
                          className="text-gray-900"
                          key={completedCount}
                          initial={{ scale: 1.3, color: '#8b5cf6' }}
                          animate={{ scale: 1, color: '#111827' }}
                        >
                          {completedCount} / {suggestions.length} completed
                        </motion.span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      {progress === 100 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-sm text-purple-600"
                        >
                          <PartyPopper className="w-4 h-4 inline mr-1" />
                          Perfect score! 🎉
                        </motion.div>
                      )}
                    </div>

                    {/* Stats (Unchanged) */}
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-900 text-sm">High</span>
                        </div>
                        <motion.div 
                          className="text-2xl text-red-600"
                          key={suggestions.filter(s => s.priority === 'high' && !s.completed).length}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                        >
                          {suggestions.filter(s => s.priority === 'high' && !s.completed).length}
                        </motion.div>
                      </motion.div>
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-900 text-sm">Medium</span>
                        </div>
                        <motion.div 
                          className="text-2xl text-orange-600"
                          key={suggestions.filter(s => s.priority === 'medium' && !s.completed).length}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                        >
                          {suggestions.filter(s => s.priority === 'medium' && !s.completed).length}
                        </motion.div>
                      </motion.div>
                      <motion.div 
                        className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 shadow-sm hover:shadow-md transition-shadow"
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="text-green-900 text-sm">Low</span>
                        </div>
                        <motion.div 
                          className="text-2xl text-green-600"
                          key={suggestions.filter(s => s.priority === 'low' && !s.completed).length}
                          initial={{ scale: 1.3 }}
                          animate={{ scale: 1 }}
                        >
                          {suggestions.filter(s => s.priority === 'low' && !s.completed).length}
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Suggestions List */}
                    <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                      <AnimatePresence>
                        {Object.entries(categorizedSuggestions).map(([category, items], categoryIndex) => (
                          <motion.div 
                            key={category} 
                            className="space-y-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                          >
                            <h3 className="text-blue-900 pb-1 border-b-2 border-gradient-to-r from-blue-300 to-purple-300">
                              {category}
                            </h3>
                            <div className="space-y-2">
                              {items.map((suggestion, index) => (
                                <motion.div
                                  key={suggestion.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                                  whileHover={{ scale: 1.02, x: 4 }}
                                  className={`p-3 rounded-lg border transition-all ${
                                    suggestion.completed
                                      ? 'bg-gray-50 border-gray-200 opacity-60'
                                      : 'bg-white/90 border-purple-200 hover:border-purple-400 hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {/* Checkbox replaced with native INPUT type="checkbox" */}
                                    <input
                                      type="checkbox"
                                      checked={suggestion.completed}
                                      onChange={() => toggleSuggestion(suggestion.id)}
                                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center gap-2">
                                        {getPriorityIcon(suggestion.priority)}
                                        <span className={suggestion.completed ? 'line-through text-gray-500' : 'text-gray-900'}>
                                          {suggestion.title}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600">
                                        {suggestion.description}
                                      </p>
                                      {/* Badge replaced with simple span */}
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}
                                      >
                                        {suggestion.priority} priority
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Tips (Unchanged) */}
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mt-6 p-6 rounded-xl border-2 border-green-200/50 shadow-xl backdrop-blur-sm bg-white/80">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                </motion.div>
                <div>
                  <p className="text-gray-700 mb-2">
                    <strong>💡 Pro Tips:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <span>🎯</span>
                      <span>Focus on high priority items first for maximum impact</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>✨</span>
                      <span>Tailor your resume for each job application</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>📥</span>
                      <span>Use the downloadable PDF checklist to track your progress offline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🔄</span>
                      <span>Review your resume regularly and keep it updated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}