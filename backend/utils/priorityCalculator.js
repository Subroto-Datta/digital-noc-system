/**
 * Priority Calculator for NOC Requests
 * Calculates priority based on description quality and title analysis
 */

// Keywords that indicate high priority
const HIGH_PRIORITY_KEYWORDS = [
  'urgent', 'asap', 'immediate', 'deadline', 'critical', 'emergency',
  'time-sensitive', 'expires', 'due date', 'last minute', 'rush',
  'priority', 'important', 'essential', 'mandatory', 'required',
  'lease', 'month', 'week', 'day', 'selected', 'competitive', 'opportunity'
];

// Keywords that indicate low priority
const LOW_PRIORITY_KEYWORDS = [
  'flexible', 'whenever', 'no rush', 'optional', 'sometime',
  'when convenient', 'not urgent', 'low priority', 'casual',
  'informal', 'general inquiry', 'just asking'
];

// Quality indicators for descriptions
const QUALITY_INDICATORS = {
  // High quality indicators
  high: [
    'detailed', 'comprehensive', 'specific', 'clear', 'thorough',
    'complete', 'professional', 'formal', 'structured', 'organized',
    'well-written', 'informative', 'descriptive', 'elaborate'
  ],
  
  // Low quality indicators
  low: [
    'brief', 'short', 'quick', 'simple', 'basic', 'minimal',
    'vague', 'unclear', 'incomplete', 'rough', 'draft'
  ]
};

// Title quality indicators
const TITLE_QUALITY_INDICATORS = {
  // High quality title patterns
  high: [
    /^[A-Z][a-zA-Z\s]{10,}$/, // Proper capitalization, good length
    /internship/i,
    /research/i,
    /collaboration/i,
    /conference/i,
    /workshop/i,
    /project/i
  ],
  
  // Low quality title patterns
  low: [
    /^[a-z]/, // Starts with lowercase
    /^.{1,5}$/, // Very short titles
    /test/i,
    /sample/i,
    /draft/i,
    /temp/i,
    /temporary/i
  ]
};

/**
 * Calculate priority based on description and title analysis
 * @param {string} title - NOC request title
 * @param {string} description - NOC request description
 * @param {string} purpose - NOC request purpose
 * @returns {string} - Priority level: 'low', 'medium', or 'high'
 */
function calculatePriority(title, description, purpose) {
  if (!title || !description) {
    return 'medium'; // Default for missing data
  }

  let score = 0;
  const analysis = {
    titleScore: 0,
    descriptionScore: 0,
    urgencyScore: 0,
    qualityScore: 0,
    totalScore: 0
  };

  // 1. Analyze Title Quality (0-30 points)
  analysis.titleScore = analyzeTitleQuality(title);
  score += analysis.titleScore;

  // 2. Analyze Description Quality (0-40 points)
  analysis.descriptionScore = analyzeDescriptionQuality(description);
  score += analysis.descriptionScore;

  // 3. Analyze Urgency Keywords (0-20 points)
  analysis.urgencyScore = analyzeUrgencyKeywords(title, description);
  score += analysis.urgencyScore;

  // 4. Analyze Overall Quality (0-10 points)
  analysis.qualityScore = analyzeOverallQuality(title, description, purpose);
  score += analysis.qualityScore;

  analysis.totalScore = score;

  // Determine priority based on total score
  if (score >= 70) {
    return 'high';
  } else if (score >= 40) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Analyze title quality and return score (0-30)
 */
function analyzeTitleQuality(title) {
  let score = 0;
  const titleLower = title.toLowerCase();

  // Base score for title length (0-10 points)
  if (title.length >= 20) {
    score += 10;
  } else if (title.length >= 10) {
    score += 7;
  } else if (title.length >= 5) {
    score += 4;
  }

  // Professional formatting (0-10 points)
  if (/^[A-Z]/.test(title)) { // Starts with capital letter
    score += 5;
  }
  if (!/[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/.test(title)) { // No special characters
    score += 3;
  }
  if (title.split(' ').length >= 3) { // Multiple words
    score += 2;
  }

  // Content quality (0-10 points)
  TITLE_QUALITY_INDICATORS.high.forEach(pattern => {
    if (pattern.test(title)) {
      score += 2;
    }
  });

  TITLE_QUALITY_INDICATORS.low.forEach(pattern => {
    if (pattern.test(title)) {
      score -= 3;
    }
  });

  // Time-sensitive keywords in title (0-5 points)
  const titleLowerForKeywords = title.toLowerCase();
  if (HIGH_PRIORITY_KEYWORDS.some(keyword => titleLowerForKeywords.includes(keyword))) {
    score += 3;
  }

  return Math.max(0, Math.min(30, score));
}

/**
 * Analyze description quality and return score (0-40)
 */
function analyzeDescriptionQuality(description) {
  let score = 0;
  const descLower = description.toLowerCase();

  // Length analysis (0-15 points)
  if (description.length >= 200) {
    score += 15;
  } else if (description.length >= 100) {
    score += 10;
  } else if (description.length >= 50) {
    score += 5;
  } else if (description.length >= 20) {
    score += 2; // Give some points for minimal but meaningful descriptions
  }

  // Word count analysis (0-10 points)
  const wordCount = description.split(/\s+/).length;
  if (wordCount >= 30) {
    score += 10;
  } else if (wordCount >= 15) {
    score += 7;
  } else if (wordCount >= 8) {
    score += 4;
  } else if (wordCount >= 4) {
    score += 1; // Give some points for minimal but meaningful word count
  }

  // Quality indicators (0-10 points)
  QUALITY_INDICATORS.high.forEach(indicator => {
    if (descLower.includes(indicator)) {
      score += 1;
    }
  });

  QUALITY_INDICATORS.low.forEach(indicator => {
    if (descLower.includes(indicator)) {
      score -= 1;
    }
  });

  // Structure analysis (0-5 points)
  if (description.includes('.')) score += 1; // Has sentences
  if (description.includes(',')) score += 1; // Has commas
  if (description.split('.').length >= 3) score += 2; // Multiple sentences
  if (description.includes('\n') || description.includes('  ')) score += 1; // Has formatting

  return Math.max(0, Math.min(40, score));
}

/**
 * Analyze urgency keywords and return score (0-20)
 */
function analyzeUrgencyKeywords(title, description) {
  let score = 10; // Base score
  const text = `${title} ${description}`.toLowerCase();

  // High priority keywords
  HIGH_PRIORITY_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 2;
    }
  });

  // Low priority keywords
  LOW_PRIORITY_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      score -= 3;
    }
  });

  return Math.max(0, Math.min(20, score));
}

/**
 * Analyze overall quality and return score (0-10)
 */
function analyzeOverallQuality(title, description, purpose) {
  let score = 5; // Base score

  // Purpose-based scoring
  const highPriorityPurposes = ['research_collaboration', 'conference_attendance', 'internship'];
  const lowPriorityPurposes = ['workshop_participation', 'other'];

  if (highPriorityPurposes.includes(purpose)) {
    score += 3;
  } else if (lowPriorityPurposes.includes(purpose)) {
    score -= 2;
  }

  // Consistency check
  if (title.toLowerCase().includes(purpose.replace('_', ' '))) {
    score += 2;
  }

  return Math.max(0, Math.min(10, score));
}

/**
 * Get detailed priority analysis for debugging
 */
function getPriorityAnalysis(title, description, purpose) {
  const priority = calculatePriority(title, description, purpose);
  
  return {
    priority,
    analysis: {
      titleScore: analyzeTitleQuality(title),
      descriptionScore: analyzeDescriptionQuality(description),
      urgencyScore: analyzeUrgencyKeywords(title, description),
      qualityScore: analyzeOverallQuality(title, description, purpose)
    },
    recommendations: getRecommendations(title, description, priority)
  };
}

/**
 * Get recommendations for improving priority
 */
function getRecommendations(title, description, priority) {
  const recommendations = [];

  if (priority === 'low') {
    if (title.length < 10) {
      recommendations.push('Consider making the title more descriptive');
    }
    if (description.length < 100) {
      recommendations.push('Add more details to the description');
    }
    if (!HIGH_PRIORITY_KEYWORDS.some(keyword => 
      `${title} ${description}`.toLowerCase().includes(keyword))) {
      recommendations.push('Consider adding urgency indicators if applicable');
    }
  }

  return recommendations;
}

module.exports = {
  calculatePriority,
  getPriorityAnalysis,
  analyzeTitleQuality,
  analyzeDescriptionQuality,
  analyzeUrgencyKeywords,
  analyzeOverallQuality
};
