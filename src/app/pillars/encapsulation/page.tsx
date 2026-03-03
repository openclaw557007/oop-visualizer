'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function EncapsulationPage() {
  const [code, setCode] = useState(`public class BankAccount {
    // Private fields - data hiding
    private String accountNumber;
    private double balance;
    private String ownerName;
    
    // Constructor
    public BankAccount(String accountNumber, String ownerName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        if (initialBalance >= 0) {
            this.balance = initialBalance;
        }
    }
    
    // Public getter methods
    public String getAccountNumber() {
        return accountNumber;
    }
    
    public double getBalance() {
        return balance;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    // Public setter with validation
    public void setOwnerName(String ownerName) {
        if (ownerName != null && !ownerName.isEmpty()) {
            this.ownerName = ownerName;
        }
    }
    
    // Controlled access to modify balance
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: $" + amount);
        }
    }
    
    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrawn: $" + amount);
        } else {
            System.out.println("Insufficient funds or invalid amount");
        }
    }
}`);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">Encapsulation</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What is Encapsulation?</h2>
            <p className="text-gray-300 mb-4">
              Encapsulation is the bundling of data (variables) and methods that operate on the data 
              into a single unit called a class. It restricts direct access to some of an object&apos;s 
              components, which is a fundamental principle of object-oriented programming.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-green-400">Key Benefits:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li><strong>Data Hiding:</strong> Private fields cannot be accessed directly</li>
              <li><strong>Controlled Access:</strong> Getters and setters provide controlled access</li>
              <li><strong>Validation:</strong> Setters can validate data before modification</li>
              <li><strong>Flexibility:</strong> Internal implementation can change without affecting users</li>
            </ul>

            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="font-semibold mb-2 text-yellow-400">Visual Representation</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-red-900/50 p-3 rounded border border-red-700">
                  <strong className="text-red-400">Private Zone</strong>
                  <p>balance, accountNumber, ownerName</p>
                  <p className="text-xs text-gray-400">Cannot be accessed directly from outside</p>
                </div>
                <div className="text-center text-2xl">↓</div>
                <div className="bg-green-900/50 p-3 rounded border border-green-700">
                  <strong className="text-green-400">Public Interface</strong>
                  <p>getBalance(), deposit(), withdraw()</p>
                  <p className="text-xs text-gray-400">Controlled access points</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Interactive Example</h2>
            <p className="text-gray-400 text-sm mb-2">
              BankAccount class demonstrating proper encapsulation
            </p>
            <div className="h-96 border border-gray-700 rounded-lg overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="java"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  readOnly: false,
                }}
              />
            </div>
            <div className="mt-4 bg-blue-900/30 p-4 rounded-lg border border-blue-700">
              <h4 className="font-semibold text-blue-400 mb-2">Try This:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Notice how all fields are <code className="bg-gray-700 px-1 rounded">private</code></li>
                <li>• Public methods provide controlled access</li>
                <li>• The <code className="bg-gray-700 px-1 rounded">withdraw()</code> method includes validation</li>
                <li>• Internal balance cannot be directly modified</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
