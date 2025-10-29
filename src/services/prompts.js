/**
 * Prompt templates for Gemini API
 */

export const generateExercisesPrompt = (category, level) => {
  const levelDescriptions = {
    1: 'beginner (simple, single-concept problems)',
    2: 'intermediate (multi-step problems combining concepts)',
    3: 'advanced (complex scenarios with edge cases)'
  }

  const categoryContext = {
    'Data Engineering': 'data pipelines, ETL processes, data storage, data modeling, and batch/stream processing',
    'Analytics Engineering': 'data transformation, SQL queries, data cleaning, aggregations, joins, and data quality',
    'Data Analysis': 'exploratory data analysis, pandas operations, statistical analysis, and data visualization concepts',
    'Data Science': 'machine learning fundamentals, model evaluation, feature engineering, and predictive modeling',
    'Other': category
  }

  const context = categoryContext[category] || category

  return `You are an expert coding instructor specializing in data skills.

Generate 10 practice exercises focused on: ${context}

Requirements:
- Difficulty level: ${levelDescriptions[level] || levelDescriptions[1]}
- Mix of Python (60%) and SQL (40%) exercises
- Each exercise should be completable in 2-5 minutes
- Include practical, real-world scenarios
- Provide the expected solution code

CRITICAL: Solutions MUST be syntactically valid and executable code:
- Python: NEVER split 'with' statement across lines - use nested with statements instead
- Python: Use proper line continuation (backslashes \\) ONLY when absolutely necessary
- Python: Test all syntax before including
- SQL: Use standard SQL syntax that works in SQLite
- NO syntax errors, NO incomplete statements

WRONG Python (causes SyntaxError):
with open('file1.txt') as f1,
     open('file2.txt') as f2:

CORRECT Python (use nested with):
with open('file1.txt') as f1:
    with open('file2.txt') as f2:

For SQL exercises, assume these tables exist:
- customers (id, name, email, country, signup_date)
- orders (id, customer_id, product_id, quantity, order_date, total_amount)
- products (id, name, category, price, stock)

Return ONLY valid JSON in this exact format, no other text:
[
  {
    "id": "unique-id-1",
    "question": "Clear exercise description with any necessary context",
    "solution": "expected code solution",
    "language": "python",
    "difficulty": "beginner"
  }
]

Make sure questions are clear, specific, and test practical skills.`
}

export const generateHintPrompt = (question, userAnswer, correctSolution) => {
  return `You are a helpful coding tutor. A student is stuck on this exercise.

Exercise: ${question}

Student's attempt:
${userAnswer}

The correct solution (hidden from student):
${correctSolution}

Provide a helpful hint (1-2 sentences) that guides them toward the right approach without giving away the full solution. Be encouraging and specific about what to consider next.

Return only the hint text, no extra formatting.`
}

export const generateFeedbackPrompt = (question, userAnswer, correctSolution, errorMessage = null) => {
  const errorContext = errorMessage ? `\n\nError encountered:\n${errorMessage}` : ''
  
  return `You are a coding instructor reviewing a student's answer.

Exercise: ${question}

Student's answer:
${userAnswer}

Expected answer:
${correctSolution}${errorContext}

Provide brief, constructive feedback (2-3 sentences) on:
1. What's wrong or missing
2. How to improve

Be specific and encouraging. Return only the feedback text.`
}

