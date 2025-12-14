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

export const quizCategories = [
  { id: 'c', name: 'C', icon: '🔧', color: 'from-blue-500 to-blue-600', questions: cQuestions },
  { id: 'cpp', name: 'C++', icon: '⚙️', color: 'from-purple-500 to-purple-600', questions: cppQuestions },
  { id: 'python', name: 'Python', icon: '🐍', color: 'from-green-500 to-green-600', questions: pythonQuestions },
  { id: 'java', name: 'Java', icon: '☕', color: 'from-orange-500 to-orange-600', questions: javaQuestions },
];
