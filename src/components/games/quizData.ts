export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const cQuestions: QuizQuestion[] = [
  { question: "What is the correct syntax to print 'Hello World' in C?", options: ["print('Hello World');", "printf('Hello World');", "cout << 'Hello World';", "System.out.println('Hello World');"], correctAnswer: 1 },
  { question: "Which header file is required for printf()?", options: ["<string.h>", "<math.h>", "<stdio.h>", "<conio.h>"], correctAnswer: 2 },
  { question: "What is the size of int in C (typically on 32-bit)?", options: ["2 bytes", "4 bytes", "8 bytes", "1 byte"], correctAnswer: 1 },
  { question: "Which operator is used to access address of a variable?", options: ["*", "&", "->", "."], correctAnswer: 1 },
  { question: "What is the output of: printf(\"%d\", 5/2);?", options: ["2.5", "2", "3", "Error"], correctAnswer: 1 },
  { question: "Which keyword is used to define a constant in C?", options: ["const", "constant", "define", "final"], correctAnswer: 0 },
  { question: "What does malloc() return?", options: ["Integer", "Character", "Pointer to void", "Float"], correctAnswer: 2 },
  { question: "Which loop is guaranteed to execute at least once?", options: ["for", "while", "do-while", "foreach"], correctAnswer: 2 },
  { question: "What is the null character in C?", options: ["\\n", "\\0", "\\t", "\\r"], correctAnswer: 1 },
  { question: "Which function is used to copy strings in C?", options: ["strcpy()", "copy()", "strcat()", "strcmp()"], correctAnswer: 0 },
  { question: "What is the correct way to declare a pointer?", options: ["int *ptr;", "int ptr*;", "*int ptr;", "ptr int*;"], correctAnswer: 0 },
  { question: "What does sizeof() return?", options: ["Address", "Value", "Size in bytes", "None"], correctAnswer: 2 },
  { question: "Which is not a valid data type in C?", options: ["int", "float", "string", "char"], correctAnswer: 2 },
  { question: "What is the index of first element in an array?", options: ["1", "0", "-1", "Depends on array"], correctAnswer: 1 },
  { question: "Which symbol is used for single line comment?", options: ["/* */", "//", "#", "--"], correctAnswer: 1 },
];

export const cppQuestions: QuizQuestion[] = [
  { question: "Which is the correct way to create an object in C++?", options: ["ClassName obj;", "new ClassName obj;", "ClassName = new obj;", "obj ClassName;"], correctAnswer: 0 },
  { question: "What is the use of 'cin' in C++?", options: ["Output", "Input", "Both", "None"], correctAnswer: 1 },
  { question: "Which operator is used for scope resolution?", options: ["::", ":", ".", "->"], correctAnswer: 0 },
  { question: "What is encapsulation?", options: ["Hiding data", "Inheriting data", "Overloading", "Polymorphism"], correctAnswer: 0 },
  { question: "Which keyword is used to inherit a class?", options: ["extends", "inherits", ":", "implements"], correctAnswer: 2 },
  { question: "What is a destructor?", options: ["Creates object", "Destroys object", "Copies object", "Modifies object"], correctAnswer: 1 },
  { question: "Which is not an access specifier in C++?", options: ["public", "private", "protected", "internal"], correctAnswer: 3 },
  { question: "What does 'virtual' keyword do?", options: ["Creates virtual memory", "Enables polymorphism", "Makes variable constant", "None"], correctAnswer: 1 },
  { question: "What is function overloading?", options: ["Same name, different parameters", "Different names, same parameters", "Same name, same parameters", "None"], correctAnswer: 0 },
  { question: "Which header is needed for cout?", options: ["<stdio.h>", "<iostream>", "<string>", "<conio.h>"], correctAnswer: 1 },
  { question: "What is 'this' pointer?", options: ["Points to current object", "Points to parent class", "Points to derived class", "None"], correctAnswer: 0 },
  { question: "Which keyword prevents inheritance?", options: ["static", "const", "final", "sealed"], correctAnswer: 2 },
  { question: "What is a template in C++?", options: ["Generic programming", "Class design", "Memory allocation", "None"], correctAnswer: 0 },
  { question: "What does STL stand for?", options: ["Standard Template Library", "Standard Type Library", "Static Template Library", "None"], correctAnswer: 0 },
  { question: "Which is used for dynamic memory in C++?", options: ["malloc", "new", "alloc", "create"], correctAnswer: 1 },
];

export const pythonQuestions: QuizQuestion[] = [
  { question: "What is the correct file extension for Python files?", options: [".pt", ".pyt", ".py", ".python"], correctAnswer: 2 },
  { question: "How do you print 'Hello World' in Python?", options: ["echo('Hello World')", "print('Hello World')", "printf('Hello World')", "cout << 'Hello World'"], correctAnswer: 1 },
  { question: "Which keyword is used to define a function?", options: ["function", "func", "def", "define"], correctAnswer: 2 },
  { question: "What is the output of: print(type([]))?", options: ["<class 'tuple'>", "<class 'list'>", "<class 'dict'>", "<class 'set'>"], correctAnswer: 1 },
  { question: "Which is used for comments in Python?", options: ["//", "/* */", "#", "--"], correctAnswer: 2 },
  { question: "How do you create a variable in Python?", options: ["int x = 5", "x = 5", "var x = 5", "let x = 5"], correctAnswer: 1 },
  { question: "What is a list in Python?", options: ["Immutable sequence", "Mutable sequence", "Key-value pairs", "Set"], correctAnswer: 1 },
  { question: "Which method adds element to list?", options: ["add()", "append()", "insert()", "push()"], correctAnswer: 1 },
  { question: "What does len() function do?", options: ["Finds length", "Finds type", "Finds max", "Finds min"], correctAnswer: 0 },
  { question: "Which is used for exception handling?", options: ["try-catch", "try-except", "catch-throw", "if-else"], correctAnswer: 1 },
  { question: "What is a dictionary in Python?", options: ["Ordered list", "Key-value pairs", "Immutable list", "None"], correctAnswer: 1 },
  { question: "How do you start a for loop?", options: ["for i in range(5):", "for(i=0;i<5;i++)", "foreach i in 5:", "loop i to 5:"], correctAnswer: 0 },
  { question: "What is None in Python?", options: ["Empty string", "Zero", "Null value", "False"], correctAnswer: 2 },
  { question: "Which is immutable in Python?", options: ["List", "Dictionary", "Tuple", "Set"], correctAnswer: 2 },
  { question: "What does pip stand for?", options: ["Python Install Package", "Pip Installs Packages", "Package Install Python", "Python Package Installer"], correctAnswer: 1 },
];

export const javaQuestions: QuizQuestion[] = [
  { question: "What is the entry point of a Java program?", options: ["start()", "main()", "run()", "init()"], correctAnswer: 1 },
  { question: "Which keyword is used to create a class?", options: ["struct", "class", "object", "type"], correctAnswer: 1 },
  { question: "What is JVM?", options: ["Java Virtual Machine", "Java Variable Method", "Java Visual Machine", "None"], correctAnswer: 0 },
  { question: "Which is not a primitive data type?", options: ["int", "boolean", "String", "char"], correctAnswer: 2 },
  { question: "What does 'extends' keyword do?", options: ["Implements interface", "Inherits class", "Creates object", "None"], correctAnswer: 1 },
  { question: "Which collection allows duplicate elements?", options: ["Set", "List", "Map", "None"], correctAnswer: 1 },
  { question: "What is the default value of int?", options: ["null", "0", "undefined", "1"], correctAnswer: 1 },
  { question: "Which keyword makes variable constant?", options: ["const", "final", "static", "constant"], correctAnswer: 1 },
  { question: "What is method overriding?", options: ["Same method in child class", "Multiple methods same name", "Static method call", "None"], correctAnswer: 0 },
  { question: "Which package is imported by default?", options: ["java.util", "java.io", "java.lang", "java.net"], correctAnswer: 2 },
  { question: "What is 'super' keyword used for?", options: ["Call parent constructor", "Create object", "Define interface", "None"], correctAnswer: 0 },
  { question: "Which is used to handle exceptions?", options: ["try-except", "try-catch", "catch-throw", "handle-error"], correctAnswer: 1 },
  { question: "What is an interface?", options: ["Abstract class", "Contract with methods", "Concrete class", "None"], correctAnswer: 1 },
  { question: "What does 'static' mean?", options: ["Instance level", "Class level", "Object level", "None"], correctAnswer: 1 },
  { question: "Which loop is best for unknown iterations?", options: ["for", "while", "do-while", "foreach"], correctAnswer: 1 },
];

export const javascriptQuestions: QuizQuestion[] = [
  { question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "function", "define"], correctAnswer: 1 },
  { question: "What is the output of: typeof null?", options: ["null", "undefined", "object", "boolean"], correctAnswer: 2 },
  { question: "Which method adds element to end of array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 0 },
  { question: "What does '===' check?", options: ["Value only", "Type only", "Value and type", "Reference"], correctAnswer: 2 },
  { question: "Which is not a JavaScript data type?", options: ["undefined", "number", "float", "symbol"], correctAnswer: 2 },
  { question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Online Notation", "None"], correctAnswer: 0 },
  { question: "Which method converts JSON to object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.convert()", "JSON.toObject()"], correctAnswer: 1 },
  { question: "What is a closure?", options: ["Function with access to outer scope", "Closed function", "Private variable", "None"], correctAnswer: 0 },
  { question: "Which keyword creates a constant?", options: ["var", "let", "const", "final"], correctAnswer: 2 },
  { question: "What is 'this' in JavaScript?", options: ["Current function", "Current object", "Global object always", "Undefined"], correctAnswer: 1 },
  { question: "Which is used for async operations?", options: ["Callbacks only", "Promises", "Loops", "Variables"], correctAnswer: 1 },
  { question: "What does map() return?", options: ["Modified original array", "New array", "Boolean", "Undefined"], correctAnswer: 1 },
  { question: "Which creates an arrow function?", options: ["function =>", "=>", "() =>", "arrow()"], correctAnswer: 2 },
  { question: "What is NaN?", options: ["Not a Number", "Null and None", "New Array Number", "None"], correctAnswer: 0 },
  { question: "Which event fires when page loads?", options: ["onload", "onclick", "onchange", "onsubmit"], correctAnswer: 0 },
];

export const sqlQuestions: QuizQuestion[] = [
  { question: "Which SQL statement retrieves data?", options: ["GET", "SELECT", "FETCH", "RETRIEVE"], correctAnswer: 1 },
  { question: "Which clause filters records?", options: ["FILTER", "WHERE", "HAVING", "LIMIT"], correctAnswer: 1 },
  { question: "Which keyword removes duplicates?", options: ["UNIQUE", "DISTINCT", "DIFFERENT", "SINGLE"], correctAnswer: 1 },
  { question: "Which join returns all rows from left table?", options: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "CROSS JOIN"], correctAnswer: 2 },
  { question: "Which adds new records to table?", options: ["ADD", "INSERT", "CREATE", "UPDATE"], correctAnswer: 1 },
  { question: "Which modifies existing records?", options: ["MODIFY", "CHANGE", "UPDATE", "ALTER"], correctAnswer: 2 },
  { question: "Which deletes records from table?", options: ["REMOVE", "DELETE", "DROP", "TRUNCATE"], correctAnswer: 1 },
  { question: "Which creates a new table?", options: ["NEW TABLE", "CREATE TABLE", "ADD TABLE", "MAKE TABLE"], correctAnswer: 1 },
  { question: "Which orders results ascending?", options: ["ORDER BY ASC", "SORT ASC", "ARRANGE ASC", "GROUP ASC"], correctAnswer: 0 },
  { question: "Which counts number of rows?", options: ["SUM()", "COUNT()", "TOTAL()", "NUM()"], correctAnswer: 1 },
  { question: "Which groups rows with same values?", options: ["COMBINE BY", "GROUP BY", "COLLECT BY", "MERGE BY"], correctAnswer: 1 },
  { question: "Which limits number of records?", options: ["TOP", "LIMIT", "MAX", "Both A and B"], correctAnswer: 3 },
  { question: "What does NULL represent?", options: ["Zero", "Empty string", "Unknown/missing value", "False"], correctAnswer: 2 },
  { question: "Which creates an index?", options: ["ADD INDEX", "CREATE INDEX", "NEW INDEX", "MAKE INDEX"], correctAnswer: 1 },
  { question: "Which removes a table completely?", options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "CLEAR TABLE"], correctAnswer: 2 },
];

export const htmlCssQuestions: QuizQuestion[] = [
  { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"], correctAnswer: 0 },
  { question: "Which tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], correctAnswer: 1 },
  { question: "Which CSS property changes text color?", options: ["text-color", "font-color", "color", "foreground"], correctAnswer: 2 },
  { question: "Which is the correct CSS syntax?", options: ["body:color=black", "body {color: black;}", "{body;color:black}", "body = color: black"], correctAnswer: 1 },
  { question: "Which HTML tag is for largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], correctAnswer: 2 },
  { question: "Which CSS property adds space inside element?", options: ["margin", "padding", "spacing", "border"], correctAnswer: 1 },
  { question: "Which creates an unordered list?", options: ["<ol>", "<ul>", "<li>", "<list>"], correctAnswer: 1 },
  { question: "Which CSS display value hides element?", options: ["hidden", "invisible", "none", "disappear"], correctAnswer: 2 },
  { question: "Which HTML5 tag is for navigation?", options: ["<navigate>", "<nav>", "<menu>", "<navbar>"], correctAnswer: 1 },
  { question: "Which CSS property makes text bold?", options: ["font-weight", "text-bold", "font-style", "text-weight"], correctAnswer: 0 },
  { question: "Which is external CSS?", options: ["<style> tag", "style attribute", "<link> tag", "All of above"], correctAnswer: 2 },
  { question: "Which creates a line break?", options: ["<break>", "<lb>", "<br>", "<newline>"], correctAnswer: 2 },
  { question: "Which CSS positions element relative to viewport?", options: ["relative", "absolute", "fixed", "static"], correctAnswer: 2 },
  { question: "Which HTML attribute specifies image source?", options: ["href", "src", "link", "source"], correctAnswer: 1 },
  { question: "Which CSS property creates rounded corners?", options: ["corner-radius", "border-radius", "round-corner", "edge-radius"], correctAnswer: 1 },
];

export const dataStructuresQuestions: QuizQuestion[] = [
  { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: 1 },
  { question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: 1 },
  { question: "What is time complexity of array access?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctAnswer: 2 },
  { question: "Which is not a linear data structure?", options: ["Array", "Stack", "Queue", "Tree"], correctAnswer: 3 },
  { question: "What is a binary tree?", options: ["Max 2 children per node", "Exactly 2 children", "Min 2 children", "None"], correctAnswer: 0 },
  { question: "Which traversal visits root first?", options: ["Inorder", "Preorder", "Postorder", "Level order"], correctAnswer: 1 },
  { question: "What is a hash table?", options: ["Key-value storage", "Sequential list", "Tree structure", "Graph"], correctAnswer: 0 },
  { question: "Which sorting has O(n log n) average?", options: ["Bubble sort", "Selection sort", "Quick sort", "Insertion sort"], correctAnswer: 2 },
  { question: "What is a linked list?", options: ["Continuous memory", "Nodes with pointers", "Fixed size array", "None"], correctAnswer: 1 },
  { question: "Which search has O(log n)?", options: ["Linear search", "Binary search", "Jump search", "Both B and C"], correctAnswer: 1 },
  { question: "What is a heap?", options: ["Complete binary tree", "Random tree", "Linked list", "Array only"], correctAnswer: 0 },
  { question: "Which is used in BFS?", options: ["Stack", "Queue", "Array", "Linked List"], correctAnswer: 1 },
  { question: "Which is used in DFS?", options: ["Queue", "Stack", "Heap", "Hash Table"], correctAnswer: 1 },
  { question: "What is Big O notation?", options: ["Time complexity", "Space complexity", "Algorithm efficiency", "All of above"], correctAnswer: 3 },
  { question: "What is a graph edge?", options: ["Node", "Connection between nodes", "Root element", "Leaf"], correctAnswer: 1 },
];

export const quizCategories = [
  { id: 'c', name: 'C', icon: '🔧', color: 'from-blue-500 to-blue-600', questions: cQuestions },
  { id: 'cpp', name: 'C++', icon: '⚙️', color: 'from-purple-500 to-purple-600', questions: cppQuestions },
  { id: 'python', name: 'Python', icon: '🐍', color: 'from-green-500 to-green-600', questions: pythonQuestions },
  { id: 'java', name: 'Java', icon: '☕', color: 'from-orange-500 to-orange-600', questions: javaQuestions },
  { id: 'javascript', name: 'JavaScript', icon: '⚡', color: 'from-yellow-500 to-yellow-600', questions: javascriptQuestions },
  { id: 'sql', name: 'SQL', icon: '🗃️', color: 'from-cyan-500 to-cyan-600', questions: sqlQuestions },
  { id: 'htmlcss', name: 'HTML/CSS', icon: '🎨', color: 'from-pink-500 to-pink-600', questions: htmlCssQuestions },
  { id: 'dsa', name: 'DSA', icon: '🧮', color: 'from-indigo-500 to-indigo-600', questions: dataStructuresQuestions },
];
