'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function PolymorphismPage() {
  const [activeTab, setActiveTab] = useState<'compile' | 'runtime'>('compile');
  
  const compileTimeCode = `// COMPILE-TIME POLYMORPHISM (Method Overloading)
// Same method name, different parameters

public class Calculator {
    
    // Overloaded add methods
    public int add(int a, int b) {
        return a + b;
    }
    
    public double add(double a, double b) {
        return a + b;
    }
    
    public int add(int a, int b, int c) {
        return a + b + c;
    }
    
    public String add(String a, String b) {
        return a + b;
    }
}

// Usage
Calculator calc = new Calculator();
int sum1 = calc.add(5, 3);           // Calls add(int, int)
double sum2 = calc.add(5.5, 3.3);    // Calls add(double, double)
int sum3 = calc.add(1, 2, 3);        // Calls add(int, int, int)
String text = calc.add("Hello, ", "World!"); // Calls add(String, String)

// Compiler decides which method to call based on arguments
// This decision is made at COMPILE TIME`;

  const runtimeCode = `// RUNTIME POLYMORPHISM (Method Overriding)
// Same method signature, different implementations in child classes

public class Animal {
    public void makeSound() {
        System.out.println("Animal makes a sound");
    }
    
    public void move() {
        System.out.println("Animal moves");
    }
}

public class Dog extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Dog barks: Woof! Woof!");
    }
    
    @Override
    public void move() {
        System.out.println("Dog runs on 4 legs");
    }
}

public class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Cat meows: Meow!");
    }
    
    @Override
    public void move() {
        System.out.println("Cat sneaks quietly");
    }
}

public class Bird extends Animal {
    @Override
    public void makeSound() {
        System.out.println("Bird chirps: Tweet!");
    }
    
    @Override
    public void move() {
        System.out.println("Bird flies in the sky");
    }
}

// Usage - Runtime Polymorphism in action
Animal myPet;

myPet = new Dog();
myPet.makeSound();  // Output: Dog barks: Woof! Woof!
myPet.move();       // Output: Dog runs on 4 legs

myPet = new Cat();
myPet.makeSound();  // Output: Cat meows: Meow!

myPet = new Bird();
myPet.makeSound();  // Output: Bird chirps: Tweet!

// Same reference type (Animal), different actual objects
// Method called depends on ACTUAL OBJECT TYPE at RUNTIME`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">Polymorphism</h1>
        
        <p className="text-gray-300 mb-6 text-lg">
          Polymorphism means &quot;many forms.&quot; It allows objects of different classes to be treated 
          as objects of a common superclass, while each object responds differently to the same method call.
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('compile')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'compile' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Compile-Time (Overloading)
          </button>
          <button
            onClick={() => setActiveTab('runtime')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'runtime' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Runtime (Overriding)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {activeTab === 'compile' ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">Compile-Time Polymorphism</h2>
                <p className="text-gray-300 mb-4">
                  Also known as <strong>Method Overloading</strong>. Multiple methods in the same class 
                  share the same name but have different parameter lists.
                </p>
                
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700 mb-4">
                  <h3 className="font-semibold text-blue-400 mb-2">Rules for Overloading:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Same method name</li>
                    <li>• Different number of parameters</li>
                    <li>• OR different types of parameters</li>
                    <li>• OR different order of parameters</li>
                    <li>• Return type can be different</li>
                    <li>• Access modifier can be different</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-green-400">How It Works</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>1. Compiler examines method call arguments</p>
                    <p>2. Matches the signature with method definitions</p>
                    <p>3. Binds the call to the appropriate method</p>
                    <p>4. Decision made at <strong>compile time</strong></p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-orange-400">Runtime Polymorphism</h2>
                <p className="text-gray-300 mb-4">
                  Also known as <strong>Method Overriding</strong> or <strong>Dynamic Method Dispatch</strong>. 
                  A subclass provides a specific implementation of a method already defined in its parent class.
                </p>
                
                <div className="bg-orange-900/30 p-4 rounded-lg border border-orange-700 mb-4">
                  <h3 className="font-semibold text-orange-400 mb-2">Rules for Overriding:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Same method name</li>
                    <li>• Same parameter list (number and types)</li>
                    <li>• Same return type (or covariant)</li>
                    <li>• Cannot reduce visibility (public → private not allowed)</li>
                    <li>• Use <code className="bg-gray-700 px-1 rounded">@Override</code> annotation</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-green-400">How It Works</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>1. Reference type determines what methods can be called</p>
                    <p>2. Actual object type determines which implementation runs</p>
                    <p>3. JVM resolves method call at <strong>runtime</strong></p>
                    <p>4. Enables dynamic behavior based on actual object</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {activeTab === 'compile' ? 'Method Overloading Example' : 'Method Overriding Example'}
            </h2>
            <div className="h-[500px] border border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={activeTab === 'compile' ? compileTimeCode : runtimeCode}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
