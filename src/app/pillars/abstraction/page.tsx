'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function AbstractionPage() {
  const [activeTab, setActiveTab] = useState<'abstract' | 'interface'>('abstract');
  
  const abstractClassCode = `// ABSTRACT CLASSES
// Partial abstraction - can have both abstract and concrete methods

public abstract class Shape {
    // Abstract fields are not allowed
    protected String color;
    protected boolean filled;
    
    // Constructor (allowed in abstract class)
    public Shape(String color, boolean filled) {
        this.color = color;
        this.filled = filled;
    }
    
    // Abstract method - no implementation
    public abstract double calculateArea();
    
    // Abstract method - no implementation
    public abstract double calculatePerimeter();
    
    // Concrete method - has implementation
    public void displayInfo() {
        System.out.println("Color: " + color);
        System.out.println("Filled: " + filled);
        System.out.println("Area: " + calculateArea());
        System.out.println("Perimeter: " + calculatePerimeter());
    }
    
    // Concrete method
    public void setColor(String color) {
        this.color = color;
    }
}

// Concrete subclass must implement all abstract methods
public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, boolean filled, double radius) {
        super(color, filled);
        this.radius = radius;
    }
    
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * Math.PI * radius;
    }
}

public class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(String color, boolean filled, double width, double height) {
        super(color, filled);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public double calculatePerimeter() {
        return 2 * (width + height);
    }
}

// Usage
Shape shape1 = new Circle("Red", true, 5.0);
Shape shape2 = new Rectangle("Blue", false, 4.0, 6.0);

shape1.displayInfo();  // Uses Circle's area/perimeter calculations
shape2.displayInfo();  // Uses Rectangle's area/perimeter calculations`;

  const interfaceCode = `// INTERFACES
// Complete abstraction - all methods are abstract (before Java 8)
// A class can implement multiple interfaces

// Interface 1
public interface Drawable {
    // Implicitly public, static, final
    int MAX_SIZE = 1000;
    
    // Abstract method (implicitly public abstract)
    void draw();
    
    // Default method (Java 8+) - has implementation
    default void printDrawingInfo() {
        System.out.println("Drawing with max size: " + MAX_SIZE);
    }
    
    // Static method (Java 8+)
    static boolean isValidSize(int size) {
        return size > 0 && size <= MAX_SIZE;
    }
}

// Interface 2
public interface Resizable {
    void resize(double factor);
    void resetSize();
}

// Interface 3
public interface Movable {
    void move(int x, int y);
    int getX();
    int getY();
}

// Concrete class implementing multiple interfaces
public class Image implements Drawable, Resizable, Movable {
    private int x, y;
    private int width, height;
    private String filename;
    
    public Image(String filename, int width, int height) {
        this.filename = filename;
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
    }
    
    // From Drawable interface
    @Override
    public void draw() {
        System.out.println("Drawing image: " + filename);
        System.out.println("Dimensions: " + width + "x" + height);
    }
    
    // From Resizable interface
    @Override
    public void resize(double factor) {
        if (factor > 0) {
            width = (int)(width * factor);
            height = (int)(height * factor);
        }
    }
    
    @Override
    public void resetSize() {
        width = 100;
        height = 100;
    }
    
    // From Movable interface
    @Override
    public void move(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    @Override
    public int getX() {
        return x;
    }
    
    @Override
    public int getY() {
        return y;
    }
}

// Usage - polymorphism with interfaces
Drawable drawable = new Image("photo.jpg", 800, 600);
drawable.draw();
drawable.printDrawingInfo();  // Default method

Resizable resizable = (Resizable) drawable;
resizable.resize(0.5);  // Shrink to 50%

Movable movable = (Movable) drawable;
movable.move(100, 200);
System.out.println("Position: (" + movable.getX() + ", " + movable.getY() + ")");`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-yellow-400">Abstraction</h1>
        
        <p className="text-gray-300 mb-6 text-lg">
          Abstraction is the concept of hiding the complex implementation details and showing only 
          the essential features to the user. It reduces programming complexity and effort.
        </p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('abstract')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'abstract' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Abstract Classes
          </button>
          <button
            onClick={() => setActiveTab('interface')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'interface' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Interfaces
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {activeTab === 'abstract' ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">Abstract Classes</h2>
                <p className="text-gray-300 mb-4">
                  Abstract classes are classes that cannot be instantiated and may contain abstract 
                  methods (without implementation) as well as concrete methods (with implementation).
                </p>
                
                <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700 mb-4">
                  <h3 className="font-semibold text-purple-400 mb-2">Key Characteristics:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Cannot create objects directly</li>
                    <li>• Can have both abstract and concrete methods</li>
                    <li>• Can have constructors</li>
                    <li>• Can have fields (instance variables)</li>
                    <li>• Subclass must implement all abstract methods</li>
                    <li>• Single inheritance (one parent only)</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-yellow-400">When to Use</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Partial abstraction needed</li>
                    <li>• Common code to share among subclasses</li>
                    <li>• Related classes with some shared behavior</li>
                    <li>• Non-static, non-final methods needed</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-teal-400">Interfaces</h2>
                <p className="text-gray-300 mb-4">
                  Interfaces are completely abstract types that define a contract of methods a class 
                  must implement. Before Java 8, all methods were abstract.
                </p>
                
                <div className="bg-teal-900/30 p-4 rounded-lg border border-teal-700 mb-4">
                  <h3 className="font-semibold text-teal-400 mb-2">Key Characteristics:</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Cannot create objects</li>
                    <li>• All methods abstract (pre-Java 8)</li>
                    <li>• No constructors allowed</li>
                    <li>• Fields are implicitly public, static, final</li>
                    <li>• Class must implement ALL methods</li>
                    <li>• Multiple inheritance supported</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2 text-yellow-400">When to Use</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Complete abstraction needed</li>
                    <li>• Unrelated classes share behavior</li>
                    <li>• Multiple inheritance required</li>
                    <li>• Defining capabilities (Can-Do relationships)</li>
                  </ul>
                </div>
              </>
            )}

            <div className="mt-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold mb-3 text-green-400">Abstract Class vs Interface</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-2 text-gray-300">Feature</th>
                    <th className="text-left py-2 text-purple-400">Abstract Class</th>
                    <th className="text-left py-2 text-teal-400">Interface</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Methods</td>
                    <td>Abstract + Concrete</td>
                    <td>Abstract (default allowed)</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Variables</td>
                    <td>Any type</td>
                    <td>Static final only</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Constructor</td>
                    <td>Yes</td>
                    <td>No</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Inheritance</td>
                    <td>Single</td>
                    <td>Multiple</td>
                  </tr>
                  <tr>
                    <td className="py-2">Use Case</td>
                    <td>IS-A relationship</td>
                    <td>CAN-DO relationship</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {activeTab === 'abstract' ? 'Abstract Class Example' : 'Interface Example'}
            </h2>
            <div className="h-[600px] border border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={activeTab === 'abstract' ? abstractClassCode : interfaceCode}
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
