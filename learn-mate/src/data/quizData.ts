export interface Question {
  id: string;
  type: "mcq" | "short";
  text: string;
  options?: string[];
  correctAnswer?: string;
}

export interface QuizTopic {
  id: string;
  skill: string;
  questions: Question[];
}

export const QUIZ_DATA: Record<string, Question[]> = {
  "React JS": [
    {
      id: "r1",
      type: "mcq",
      text: "What is the primary benefit of React's Virtual DOM?",
      options: ["Faster development", "Reduced direct DOM manipulation", "Better SEO", "Smaller bundle size"],
      correctAnswer: "Reduced direct DOM manipulation"
    },
    {
      id: "r2",
      type: "mcq",
      text: "Which hook is used for side effects?",
      options: ["useState", "useEffect", "useMemo", "useReducer"],
      correctAnswer: "useEffect"
    },
    {
      id: "r3",
      type: "mcq",
      text: "What does JSX stand for?",
      options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Xerox"],
      correctAnswer: "JavaScript XML"
    },
    {
      id: "r4",
      type: "mcq",
      text: "Which hook manages state?",
      options: ["useEffect", "useState", "useRef", "useCallback"],
      correctAnswer: "useState"
    },
    {
      id: "r5",
      type: "mcq",
      text: "React is primarily used for?",
      options: ["Backend", "UI building", "Database", "Networking"],
      correctAnswer: "UI building"
    },
    {
      id: "r6",
      type: "mcq",
      text: "What is a component?",
      options: ["Reusable UI piece", "Database", "Function only", "CSS file"],
      correctAnswer: "Reusable UI piece"
    },
    {
      id: "r7",
      type: "mcq",
      text: "Which method renders UI?",
      options: ["render()", "display()", "show()", "mount()"],
      correctAnswer: "render()"
    },
    {
      id: "r8",
      type: "mcq",
      text: "Props are?",
      options: ["Immutable", "Mutable", "Functions", "Hooks"],
      correctAnswer: "Immutable"
    },
    {
      id: "r9",
      type: "mcq",
      text: "Key prop is used for?",
      options: ["Styling", "List rendering", "State", "Routing"],
      correctAnswer: "List rendering"
    },
    {
      id: "r10",
      type: "mcq",
      text: "Which hook improves performance?",
      options: ["useMemo", "useState", "useEffect", "useRef"],
      correctAnswer: "useMemo"
    }
  ],

  "TypeScript": [
    {
      id: "t1",
      type: "mcq",
      text: "Main advantage of TypeScript?",
      options: ["Static typing", "Faster runtime", "Less code", "UI support"],
      correctAnswer: "Static typing"
    },
    {
      id: "t2",
      type: "mcq",
      text: "Define interface keyword?",
      options: ["interface", "type", "class", "define"],
      correctAnswer: "interface"
    },
    {
      id: "t3",
      type: "mcq",
      text: "Optional property symbol?",
      options: ["?", "*", "!", "&"],
      correctAnswer: "?"
    },
    {
      id: "t4",
      type: "mcq",
      text: "Type assertion uses?",
      options: ["as", "is", "type", "assert"],
      correctAnswer: "as"
    },
    {
      id: "t5",
      type: "mcq",
      text: "Union type symbol?",
      options: ["|", "&", "%", "+"],
      correctAnswer: "|"
    },
    {
      id: "t6",
      type: "mcq",
      text: "Enum is used for?",
      options: ["Constants", "Functions", "Arrays", "Objects"],
      correctAnswer: "Constants"
    },
    {
      id: "t7",
      type: "mcq",
      text: "TypeScript compiles to?",
      options: ["JavaScript", "Python", "Java", "C++"],
      correctAnswer: "JavaScript"
    },
    {
      id: "t8",
      type: "mcq",
      text: "Readonly keyword?",
      options: ["readonly", "const", "static", "fixed"],
      correctAnswer: "readonly"
    },
    {
      id: "t9",
      type: "mcq",
      text: "Generic syntax?",
      options: ["<T>", "{T}", "[T]", "(T)"],
      correctAnswer: "<T>"
    },
    {
      id: "t10",
      type: "mcq",
      text: "Any type means?",
      options: ["No type checking", "Strict type", "Number", "String"],
      correctAnswer: "No type checking"
    }
  ],

  "Python": [
    { id: "p1", type: "mcq", text: "Function keyword?", options: ["def", "func", "lambda", "function"], correctAnswer: "def" },
    { id: "p2", type: "mcq", text: "3 * 'abc' output?", options: ["abcabcabc", "Error", "3abc", "abc 3"], correctAnswer: "abcabcabc" },
    { id: "p3", type: "mcq", text: "Immutable structure?", options: ["Tuple", "List", "Set", "Dict"], correctAnswer: "Tuple" },
    { id: "p4", type: "mcq", text: "List is?", options: ["Mutable", "Immutable", "Static", "None"], correctAnswer: "Mutable" },
    { id: "p5", type: "mcq", text: "Dictionary key type?", options: ["Immutable", "Mutable", "List", "Dict"], correctAnswer: "Immutable" },
    { id: "p6", type: "mcq", text: "Loop keyword?", options: ["for", "loop", "iterate", "repeat"], correctAnswer: "for" },
    { id: "p7", type: "mcq", text: "Import module?", options: ["import", "require", "include", "use"], correctAnswer: "import" },
    { id: "p8", type: "mcq", text: "Lambda is?", options: ["Anonymous function", "Class", "Loop", "Module"], correctAnswer: "Anonymous function" },
    { id: "p9", type: "mcq", text: "len() does?", options: ["Length", "Loop", "List", "None"], correctAnswer: "Length" },
    { id: "p10", type: "mcq", text: "Indentation is?", options: ["Mandatory", "Optional", "Ignored", "Error"], correctAnswer: "Mandatory" }
  ],

  "Node.js": [
    { id: "n1", type: "mcq", text: "Node engine?", options: ["V8", "Gecko", "Chakra", "SpiderMonkey"], correctAnswer: "V8" },
    { id: "n2", type: "mcq", text: "Web server module?", options: ["http", "fs", "path", "os"], correctAnswer: "http" },
    { id: "n3", type: "mcq", text: "npm stands for?", options: ["Node Package Manager", "New Package Manager", "Node Project Manager", "None"], correctAnswer: "Node Package Manager" },
    { id: "n4", type: "mcq", text: "File system module?", options: ["fs", "http", "url", "path"], correctAnswer: "fs" },
    { id: "n5", type: "mcq", text: "Async nature?", options: ["Non-blocking", "Blocking", "Sync only", "None"], correctAnswer: "Non-blocking" },
    { id: "n6", type: "mcq", text: "Global object?", options: ["global", "window", "this", "root"], correctAnswer: "global" },
    { id: "n7", type: "mcq", text: "Package file?", options: ["package.json", "config.json", "node.json", "app.json"], correctAnswer: "package.json" },
    { id: "n8", type: "mcq", text: "Install package?", options: ["npm install", "node install", "install", "pkg add"], correctAnswer: "npm install" },
    { id: "n9", type: "mcq", text: "Express is?", options: ["Framework", "Library", "Language", "DB"], correctAnswer: "Framework" },
    { id: "n10", type: "mcq", text: "Event loop?", options: ["Handles async", "UI", "DB", "None"], correctAnswer: "Handles async" }
  ],

  "AI/ML": [
    { id: "a1", type: "mcq", text: "Supervised learning?", options: ["Labeled data", "No data", "Random", "Trial"], correctAnswer: "Labeled data" },
    { id: "a2", type: "mcq", text: "Deep learning lib?", options: ["TensorFlow", "React", "Django", "Flask"], correctAnswer: "TensorFlow" },
    { id: "a3", type: "mcq", text: "Unsupervised?", options: ["No labels", "Labels", "Rules", "Manual"], correctAnswer: "No labels" },
    { id: "a4", type: "mcq", text: "Regression predicts?", options: ["Continuous", "Discrete", "Images", "Text"], correctAnswer: "Continuous" },
    { id: "a5", type: "mcq", text: "Classification?", options: ["Categories", "Numbers", "Images", "None"], correctAnswer: "Categories" },
    { id: "a6", type: "mcq", text: "Overfitting?", options: ["Too complex model", "Too simple", "Perfect", "None"], correctAnswer: "Too complex model" },
    { id: "a7", type: "mcq", text: "Underfitting?", options: ["Too simple", "Too complex", "Perfect", "None"], correctAnswer: "Too simple" },
    { id: "a8", type: "mcq", text: "Neural network?", options: ["Brain inspired", "DB", "API", "None"], correctAnswer: "Brain inspired" },
    { id: "a9", type: "mcq", text: "Training data?", options: ["Learn from", "Ignore", "Delete", "None"], correctAnswer: "Learn from" },
    { id: "a10", type: "mcq", text: "Model accuracy?", options: ["Correctness", "Speed", "Size", "None"], correctAnswer: "Correctness" }
  ],

  "UI/UX": [
    { id: "u1", type: "mcq", text: "UX stands for?", options: ["User Experience", "User Extend", "Unit X", "None"], correctAnswer: "User Experience" },
    { id: "u2", type: "mcq", text: "Visual weight principle?", options: ["Balance", "Contrast", "Hierarchy", "Rhythm"], correctAnswer: "Hierarchy" },
    { id: "u3", type: "mcq", text: "UI means?", options: ["User Interface", "User Input", "Unit Interface", "None"], correctAnswer: "User Interface" },
    { id: "u4", type: "mcq", text: "Wireframe?", options: ["Layout sketch", "Code", "Color", "Image"], correctAnswer: "Layout sketch" },
    { id: "u5", type: "mcq", text: "Prototype?", options: ["Interactive model", "Final product", "Code", "None"], correctAnswer: "Interactive model" },
    { id: "u6", type: "mcq", text: "Consistency?", options: ["Uniform design", "Random", "None", "Error"], correctAnswer: "Uniform design" },
    { id: "u7", type: "mcq", text: "Accessibility?", options: ["Inclusive design", "Private", "Hidden", "None"], correctAnswer: "Inclusive design" },
    { id: "u8", type: "mcq", text: "Hierarchy?", options: ["Importance order", "Random", "Flat", "None"], correctAnswer: "Importance order" },
    { id: "u9", type: "mcq", text: "Contrast?", options: ["Difference", "Same", "Flat", "None"], correctAnswer: "Difference" },
    { id: "u10", type: "mcq", text: "Whitespace?", options: ["Empty space", "Filled", "Text", "None"], correctAnswer: "Empty space" }
  ],

  "Tailwind CSS": [
    { id: "tw1", type: "mcq", text: "Tailwind is?", options: ["Utility CSS", "JS lib", "Framework", "Grid only"], correctAnswer: "Utility CSS" },
    { id: "tw2", type: "mcq", text: "Responsive prefix?", options: ["md:", "res:", "sm-", "media"], correctAnswer: "md:" },
    { id: "tw3", type: "mcq", text: "Flex class?", options: ["flex", "grid", "block", "inline"], correctAnswer: "flex" },
    { id: "tw4", type: "mcq", text: "Center items?", options: ["items-center", "align-center", "center", "middle"], correctAnswer: "items-center" },
    { id: "tw5", type: "mcq", text: "Padding class?", options: ["p-4", "pad-4", "padding", "pd"], correctAnswer: "p-4" },
    { id: "tw6", type: "mcq", text: "Margin?", options: ["m-4", "mg-4", "margin", "mr"], correctAnswer: "m-4" },
    { id: "tw7", type: "mcq", text: "Text size?", options: ["text-lg", "font-lg", "size-lg", "txt-lg"], correctAnswer: "text-lg" },
    { id: "tw8", type: "mcq", text: "Color class?", options: ["bg-blue-500", "color-blue", "blue-bg", "bgcolor"], correctAnswer: "bg-blue-500" },
    { id: "tw9", type: "mcq", text: "Grid?", options: ["grid", "flex", "block", "inline"], correctAnswer: "grid" },
    { id: "tw10", type: "mcq", text: "Hover?", options: ["hover:", "onHover", "hover()", "hvr"], correctAnswer: "hover:" }
  ]
};