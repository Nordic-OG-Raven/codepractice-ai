import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFileSync } from 'fs';

const API_KEY = 'AIzaSyDDE_x50yEZ7PilrLNmkLOaFJmXkeQ9ppY';
const genAI = new GoogleGenerativeAI(API_KEY);

const categories = [
  'Data Engineering',
  'Analytics Engineering', 
  'Data Analysis',
  'Data Science',
  'General Programming'
];

const generateExercisesPrompt = (category, count) => {
  const categoryContext = {
    'Data Engineering': 'data pipelines, ETL processes, data storage, data modeling, and batch/stream processing',
    'Analytics Engineering': 'data transformation, SQL queries, data cleaning, aggregations, joins, and data quality',
    'Data Analysis': 'exploratory data analysis, pandas operations, statistical analysis, and data visualization concepts',
    'Data Science': 'machine learning fundamentals, model evaluation, feature engineering, and predictive modeling',
    'General Programming': 'algorithms, data structures, string manipulation, list operations, and problem solving'
  };

  const context = categoryContext[category] || category;

  return `You are an expert coding instructor specializing in data skills.

Generate ${count} practice exercises focused on: ${context}

Requirements:
- Mix of beginner (30%), intermediate (50%), and advanced (20%) difficulty
- Mix of Python (60%) and SQL (40%) exercises
- Each exercise should be completable in 2-5 minutes
- Include practical, real-world scenarios
- Provide the expected solution code

CRITICAL: Solutions MUST be syntactically valid and executable code:
- Python: Use proper line continuation (backslashes) if splitting long lines
- Python: For multiple files in 'with' statement, either use one line OR nested with statements
- Python: Test all syntax before including
- SQL: Use standard SQL syntax that works in SQLite
- NO syntax errors, NO incomplete statements

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

Make sure questions are clear, specific, and test practical skills.`;
};

async function generateExercisesForCategory(category, count) {
  console.log(`\n🤖 Generating ${count} exercises for ${category}...`);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = generateExercisesPrompt(category, count);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from API');
    }
    
    const exercises = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(exercises) || exercises.length === 0) {
      throw new Error('No exercises generated');
    }
    
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0;
    console.log(`✅ Generated ${exercises.length} exercises (${tokensUsed} tokens)`);
    
    return exercises;
  } catch (error) {
    console.error(`❌ Error for ${category}:`, error.message);
    return [];
  }
}

async function generateAllExercises() {
  const allExercises = {};
  let totalTokens = 0;
  
  for (const category of categories) {
    const exercises = await generateExercisesForCategory(category, 25);
    allExercises[category] = exercises;
    
    // Wait 2 seconds between requests to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Write to file
  const outputPath = './src/data/preGeneratedExercises.json';
  writeFileSync(outputPath, JSON.stringify(allExercises, null, 2));
  
  const totalExercises = Object.values(allExercises).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\n✨ Done! Generated ${totalExercises} exercises across ${categories.length} categories`);
  console.log(`📁 Saved to: ${outputPath}`);
}

generateAllExercises();

