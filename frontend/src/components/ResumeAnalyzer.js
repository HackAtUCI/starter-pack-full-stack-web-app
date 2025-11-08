// src/components/ResumeAnalyzer.js

/**
 * A placeholder analysis function that returns a fixed set of suggestions
 * for demonstration.
 * * @param {string} resumeText - The text content of the uploaded resume.
 * @returns {Array<Object>} An array of suggestion objects.
 */
 export const analyzeResume = (resumeText) => {
    console.log("Analyzing resume text:", resumeText.substring(0, 50) + "...");

    // Basic check to ensure some text was provided
    if (!resumeText || resumeText.length < 50) {
        return [{
            id: 999,
            title: "Input Too Short",
            description: "Please paste or upload a full resume for proper analysis.",
            priority: "high",
            category: "Input Check",
            completed: false
        }];
    }

    // Return mock data (pure JS objects)
    return [
        {
            id: 1,
            title: "Quantify Achievements",
            description: "Replace 'Managed team' with 'Managed 5-person team, boosting productivity by 20%'.",
            priority: "high",
            category: "Content & Impact",
            completed: false,
        },
        {
            id: 2,
            title: "Check Keywords",
            description: "Ensure 3-5 keywords from the target job description are present.",
            priority: "medium",
            category: "Targeting",
            completed: false,
        },
        {
            id: 3,
            title: "Font Consistency",
            description: "Verify that only one or two standard fonts are used throughout.",
            priority: "low",
            category: "Formatting",
            completed: false,
        },
        {
            id: 4,
            title: "Remove 'References Available'",
            description: "This phrase is unnecessary; recruiters assume references are available.",
            priority: "medium",
            category: "Brevity",
            completed: false,
        },
    ];
};

//resume analyzer.js