// Mock database for Practice Arena - works without Supabase connection
// Replace this with real Supabase client when ready

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface PracticeQuestion {
  id: string;
  topic_id: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  code_snippet: string | null;
  question_text: string;
  correct_answer: string;
  explanation: string | null;
  topics?: Topic;
}

export const mockTopics: Topic[] = [
  { id: '1', title: 'Access Modifiers', description: 'Understanding public, private, protected, and default access levels in Java' },
  { id: '2', title: 'Constructors', description: 'Default, parameterized, and copy constructors in Java OOP' },
  { id: '3', title: 'Interfaces', description: 'Defining contracts and implementing multiple inheritance through interfaces' },
  { id: '4', title: 'Encapsulation', description: 'Data hiding and getter/setter methods' },
  { id: '5', title: 'Inheritance', description: 'Extending classes and method overriding' },
  { id: '6', title: 'Polymorphism', description: 'Compile-time and runtime polymorphism in Java' },
  { id: '7', title: 'Abstraction', description: 'Abstract classes and interfaces for abstraction' },
  { id: '8', title: 'Static Members', description: 'Static variables, methods, and blocks' },
  { id: '9', title: 'Final Keyword', description: 'Final variables, methods, and classes' },
  { id: '10', title: 'Object Class', description: 'Methods from java.lang.Object class' }
];

export const mockQuestions: PracticeQuestion[] = [
  {
    id: '1',
    topic_id: '1',
    difficulty_level: 'easy',
    code_snippet: `public class Car {
    private String color;
    public String brand;
    protected int year;
    String model;
}`,
    question_text: 'Which field can be accessed directly from any class in the same package?',
    correct_answer: 'brand, model',
    explanation: 'In the same package: public (brand) and default/package-private (model) are accessible. Private (color) is never accessible directly, and protected (year) requires inheritance for access from other packages.',
    topics: mockTopics[0]
  },
  {
    id: '2',
    topic_id: '1',
    difficulty_level: 'medium',
    code_snippet: `public class BankAccount {
    private double balance;
    
    public double getBalance() {
        return balance;
    }
    
    private void setBalance(double amount) {
        balance = amount;
    }
}`,
    question_text: 'Why is the setBalance method declared as private?',
    correct_answer: 'To prevent direct modification and enforce controlled access through business logic',
    explanation: 'Private setters ensure balance can only be modified through controlled methods like deposit() and withdraw() that can validate business rules (e.g., no negative amounts).',
    topics: mockTopics[0]
  },
  {
    id: '3',
    topic_id: '2',
    difficulty_level: 'easy',
    code_snippet: `public class Student {
    String name;
    
    Student(String name) {
        this.name = name;
    }
}`,
    question_text: 'What happens when you try: Student s = new Student();',
    correct_answer: 'Compilation error',
    explanation: 'Since we defined a parameterized constructor, Java does not provide a default no-arg constructor. The call new Student() fails because there is no matching constructor.',
    topics: mockTopics[1]
  },
  {
    id: '4',
    topic_id: '2',
    difficulty_level: 'medium',
    code_snippet: `public class Book {
    String title;
    String author;
    
    Book(Book other) {
        this.title = other.title;
        this.author = other.author;
    }
}`,
    question_text: 'What type of constructor is demonstrated above?',
    correct_answer: 'Copy constructor',
    explanation: 'This is a copy constructor - it takes an object of the same type as parameter and creates a new object with copied values. This enables deep copying of objects.',
    topics: mockTopics[1]
  },
  {
    id: '5',
    topic_id: '4',
    difficulty_level: 'easy',
    code_snippet: `public class Employee {
    private String id;
    private String name;
    private double salary;
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}`,
    question_text: 'Which OOP principle is primarily demonstrated?',
    correct_answer: 'Encapsulation',
    explanation: 'Encapsulation is demonstrated through private fields and public getter/setter methods. This hides the internal state and provides controlled access.',
    topics: mockTopics[3]
  },
  {
    id: '6',
    topic_id: '4',
    difficulty_level: 'medium',
    code_snippet: `public class SecureVault {
    private String password;
    
    public void setPassword(String pwd) {
        if (pwd != null && pwd.length() >= 8) {
            this.password = pwd;
        } else {
            throw new IllegalArgumentException("Password must be at least 8 characters");
        }
    }
}`,
    question_text: 'What additional benefit of encapsulation is shown here?',
    correct_answer: 'Data validation in setter',
    explanation: 'Beyond data hiding, this demonstrates validation logic in setters. The setter enforces business rules (minimum 8 characters) before allowing state modification.',
    topics: mockTopics[3]
  },
  {
    id: '7',
    topic_id: '5',
    difficulty_level: 'easy',
    code_snippet: `class Animal {
    void speak() { System.out.println("Animal speaks"); }
}

class Dog extends Animal {
    void speak() { System.out.println("Dog barks"); }
}

Animal a = new Dog();
a.speak();`,
    question_text: 'What is the output of this code?',
    correct_answer: 'Dog barks',
    explanation: 'This demonstrates runtime polymorphism. Despite the reference being Animal type, the actual object is Dog, so Dog\'s speak() method is called at runtime.',
    topics: mockTopics[4]
  },
  {
    id: '8',
    topic_id: '5',
    difficulty_level: 'medium',
    code_snippet: `class Vehicle {
    protected String brand = "Unknown";
}

class Car extends Vehicle {
    public void printBrand() {
        System.out.println(brand);
    }
}`,
    question_text: 'Why can Car access the brand variable directly?',
    correct_answer: 'Protected access allows subclass access',
    explanation: 'The protected modifier allows the field to be accessed within the same package AND by subclasses (even in different packages). Car extends Vehicle, so it can access brand.',
    topics: mockTopics[4]
  },
  {
    id: '9',
    topic_id: '6',
    difficulty_level: 'easy',
    code_snippet: `class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }
    int add(int a, int b, int c) { return a + b + c; }
}`,
    question_text: 'What type of polymorphism is this?',
    correct_answer: 'Compile-time polymorphism',
    explanation: 'This is method overloading - same method name with different parameters. The compiler determines which method to call based on the arguments at compile time.',
    topics: mockTopics[5]
  },
  {
    id: '10',
    topic_id: '6',
    difficulty_level: 'hard',
    code_snippet: `abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double radius;
    Circle(double r) { radius = r; }
    double area() { return Math.PI * radius * radius; }
}

Shape s = new Circle(5.0);
System.out.println(s.area());`,
    question_text: 'Which polymorphism types are demonstrated? (Select all that apply)',
    correct_answer: 'Runtime polymorphism and abstraction',
    explanation: 'Runtime polymorphism: Shape reference calls Circle\'s area(). Abstraction: Shape is abstract with abstract method. This combines inheritance, abstraction, and runtime polymorphism.',
    topics: mockTopics[5]
  },
  {
    id: '11',
    topic_id: '7',
    difficulty_level: 'easy',
    code_snippet: `public abstract class Animal {
    public abstract void makeSound();
    
    public void sleep() {
        System.out.println("Sleeping...");
    }
}`,
    question_text: 'What characterizes this abstract class?',
    correct_answer: 'Has both abstract and concrete methods',
    explanation: 'This demonstrates partial abstraction. Abstract classes can have both abstract methods (no implementation) and concrete methods (with implementation).',
    topics: mockTopics[6]
  },
  {
    id: '12',
    topic_id: '7',
    difficulty_level: 'medium',
    code_snippet: `interface Drawable {
    void draw();
    default void printInfo() {
        System.out.println("Drawing...");
    }
}

interface Resizable {
    void resize(double factor);
}

class Image implements Drawable, Resizable {
    public void draw() { }
    public void resize(double f) { }
}`,
    question_text: 'What Java features are demonstrated here?',
    correct_answer: 'Multiple interface implementation and default methods',
    explanation: 'Image implements both Drawable and Resizable (multiple inheritance of type). Also shows default method in interface (Java 8+ feature allowing method implementation in interfaces).',
    topics: mockTopics[6]
  },
  {
    id: '13',
    topic_id: '3',
    difficulty_level: 'medium',
    code_snippet: `interface PaymentProcessor {
    boolean processPayment(double amount);
    void refund(String transactionId);
}

class CreditCardProcessor implements PaymentProcessor {
    public boolean processPayment(double amount) {
        // Process credit card
        return true;
    }
    public void refund(String transactionId) {
        // Process refund
    }
}`,
    question_text: 'What is the relationship between PaymentProcessor and CreditCardProcessor?',
    correct_answer: 'CAN-DO relationship (interface implementation)',
    explanation: 'Interfaces define capabilities. CreditCardProcessor CAN process payments and refunds. This is a "CAN-DO" relationship vs the "IS-A" relationship of inheritance.',
    topics: mockTopics[2]
  },
  {
    id: '14',
    topic_id: '3',
    difficulty_level: 'hard',
    code_snippet: `interface Flyable {
    void fly();
}

interface Swimmable {
    void swim();
}

class Duck implements Flyable, Swimmable {
    public void fly() { System.out.println("Duck flying"); }
    public void swim() { System.out.println("Duck swimming"); }
}`,
    question_text: 'Why are interfaces preferred over abstract classes here?',
    correct_answer: 'Duck can inherit multiple behaviors',
    explanation: 'Java doesn\'t support multiple class inheritance. By using interfaces, Duck can be both Flyable AND Swimmable. With abstract classes, Duck could only extend one parent class.',
    topics: mockTopics[2]
  },
  {
    id: '15',
    topic_id: '8',
    difficulty_level: 'easy',
    code_snippet: `public class Counter {
    static int count = 0;
    
    Counter() {
        count++;
    }
}`,
    question_text: 'What is true about the count variable?',
    correct_answer: 'Shared across all instances of Counter',
    explanation: 'Static variables belong to the class, not instances. All Counter objects share the same count variable. Incrementing in any constructor affects the shared value.',
    topics: mockTopics[7]
  },
  {
    id: '16',
    topic_id: '8',
    difficulty_level: 'medium',
    code_snippet: `public class MathUtils {
    public static final double PI = 3.14159;
    
    public static int square(int x) {
        return x * x;
    }
}

// Usage:
MathUtils.square(5);
MathUtils.PI;`,
    question_text: 'Why can we access square() and PI without creating an object?',
    correct_answer: 'They are static members of the class',
    explanation: 'Static members belong to the class itself, not instances. They can be accessed directly via ClassName.member without needing to instantiate the class.',
    topics: mockTopics[7]
  },
  {
    id: '17',
    topic_id: '9',
    difficulty_level: 'easy',
    code_snippet: `public final class SecurityManager {
    // class implementation
}

public class CustomSecurity extends SecurityManager {
    // ERROR!
}`,
    question_text: 'Why does this code produce a compilation error?',
    correct_answer: 'Cannot extend final class',
    explanation: 'The final keyword prevents a class from being inherited. SecurityManager is declared as final, so CustomSecurity cannot extend it. This is often used for security-sensitive classes.',
    topics: mockTopics[8]
  },
  {
    id: '18',
    topic_id: '9',
    difficulty_level: 'medium',
    code_snippet: `public class Constants {
    public static final int MAX_USERS = 100;
    public static final String APP_NAME = "JavaOOP";
    
    public void attemptModification() {
        MAX_USERS = 200;  // ERROR!
    }
}`,
    question_text: 'Why is MAX_USERS = 200 an error?',
    correct_answer: 'final variables cannot be reassigned',
    explanation: 'final variables are constants that can only be assigned once. Attempting to reassign MAX_USERS causes a compilation error. This ensures constants remain unchanged.',
    topics: mockTopics[8]
  },
  {
    id: '19',
    topic_id: '10',
    difficulty_level: 'easy',
    code_snippet: `public class Person {
    String name;
    
    public Person(String name) {
        this.name = name;
    }
}

Person p1 = new Person("Alice");
Person p2 = new Person("Alice");
boolean result = p1.equals(p2);`,
    question_text: 'What is the value of result?',
    correct_answer: 'false',
    explanation: 'Object class\'s default equals() compares memory addresses (reference equality), not content. p1 and p2 are different objects in memory. To compare content, override equals() and hashCode().',
    topics: mockTopics[9]
  },
  {
    id: '20',
    topic_id: '10',
    difficulty_level: 'medium',
    code_snippet: `public class Employee {
    String name;
    int id;
    
    @Override
    public String toString() {
        return "Employee[id=" + id + ", name=" + name + "]";
    }
}

Employee e = new Employee();
e.name = "John";
e.id = 101;
System.out.println(e);`,
    question_text: 'What is printed to the console?',
    correct_answer: 'Employee[id=101, name=John]',
    explanation: 'Overriding toString() provides a meaningful string representation. Without this override, it would print the default: ClassName@hashcode. toString() is called automatically when an object is passed to println().',
    topics: mockTopics[9]
  }
];

// Mock Supabase client
export const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      order: (column: string, { ascending = true } = {}) => ({
        eq: (column: string, value: any) => ({
          then: (callback: any) => {
            let data = mockQuestions;
            if (table === 'topics') {
              data = mockTopics;
            }
            if (column && value) {
              data = data.filter((q: any) => q[column as keyof typeof q] === value);
            }
            return Promise.resolve({ data, error: null });
          }
        }),
        then: (callback: any) => {
          let data = table === 'topics' ? mockTopics : mockQuestions;
          return Promise.resolve({ data, error: null });
        }
      }),
      eq: (column: string, value: any) => ({
        then: (callback: any) => {
          let data = table === 'topics' ? mockTopics : mockQuestions;
          data = data.filter((q: any) => q[column as keyof typeof q] === value);
          return Promise.resolve({ data, error: null });
        },
        order: () => ({
          then: (callback: any) => {
            let data = table === 'topics' ? mockTopics : mockQuestions;
            data = data.filter((q: any) => q[column as keyof typeof q] === value);
            return Promise.resolve({ data, error: null });
          }
        })
      }),
      then: (callback: any) => {
        const data = table === 'topics' ? mockTopics : mockQuestions;
        return Promise.resolve({ data, error: null });
      }
    })
  })
};
