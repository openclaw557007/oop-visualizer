-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create practice_questions table
CREATE TABLE IF NOT EXISTS practice_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
    code_snippet TEXT,
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_questions_topic_id ON practice_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_practice_questions_difficulty ON practice_questions(difficulty_level);

-- Insert sample topics for Java OOP
INSERT INTO topics (title, description) VALUES
('Access Modifiers', 'Understanding public, private, protected, and default access levels in Java'),
('Constructors', 'Default, parameterized, and copy constructors in Java OOP'),
('Interfaces', 'Defining contracts and implementing multiple inheritance through interfaces'),
('Encapsulation', 'Data hiding and getter/setter methods'),
('Inheritance', 'Extending classes and method overriding'),
('Polymorphism', 'Compile-time and runtime polymorphism in Java'),
('Abstraction', 'Abstract classes and interfaces for abstraction'),
('Static Members', 'Static variables, methods, and blocks'),
('Final Keyword', 'Final variables, methods, and classes'),
('Object Class', 'Methods from java.lang.Object class');

-- Insert sample practice questions
INSERT INTO practice_questions (topic_id, difficulty_level, code_snippet, question_text, correct_answer, explanation)
SELECT 
    (SELECT id FROM topics WHERE title = 'Access Modifiers'),
    'easy',
    'public class Car {\n    private String color;\n    public String brand;\n}',
    'Which of the following can be accessed directly from outside the Car class?',
    'brand',
    'The brand field is declared as public, making it accessible from anywhere. The color field is private and can only be accessed within the Car class.'
UNION ALL
SELECT 
    (SELECT id FROM topics WHERE title = 'Constructors'),
    'medium',
    'public class Book {\n    String title;\n    Book(String t) {\n        title = t;\n    }\n}',
    'What happens when you try to create an object with: Book b = new Book();',
    'Compilation error',
    'Since we defined a parameterized constructor, Java does not provide a default no-arg constructor. We must explicitly define one if needed.'
UNION ALL
SELECT 
    (SELECT id FROM topics WHERE title = 'Inheritance'),
    'medium',
    'class Animal {\n    void speak() {\n        System.out.println("Animal speaks");\n    }\n}\n\nclass Dog extends Animal {\n    void speak() {\n        System.out.println("Dog barks");\n    }\n}',
    'What is the output of: Animal a = new Dog(); a.speak();',
    'Dog barks',
    'This demonstrates runtime polymorphism. Even though the reference is of type Animal, the actual object is Dog, so the overridden speak() method in Dog is called.'
UNION ALL
SELECT 
    (SELECT id FROM topics WHERE title = 'Polymorphism'),
    'hard',
    'class Calculator {\n    int add(int a, int b) { return a + b; }\n    double add(double a, double b) { return a + b; }\n    int add(int a, int b, int c) { return a + b + c; }\n}',
    'Which type of polymorphism is demonstrated here?',
    'Compile-time polymorphism (Method Overloading)',
    'This shows method overloading where multiple methods have the same name but different parameters. The method to call is determined at compile time.'
UNION ALL
SELECT 
    (SELECT id FROM topics WHERE title = 'Encapsulation'),
    'easy',
    'public class Account {\n    private double balance;\n    public void setBalance(double b) {\n        if (b >= 0) balance = b;\n    }\n    public double getBalance() {\n        return balance;\n    }\n}',
    'What OOP principle is primarily demonstrated in this code?',
    'Encapsulation',
    'The balance field is private (data hiding) and can only be accessed through getter and setter methods. The setter also includes validation logic, showing controlled access.';
