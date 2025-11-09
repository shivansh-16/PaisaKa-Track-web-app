import React from 'react'
import Image from 'next/image'
import Protected from '@/components/Protected'

export default function Groups() {
  return (
    <Protected>
    <div className="min-h-dvh px-4 py-6 sm:px-6 md:px-8" style={{ background: 'var(--pk-bg)' }}>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <a href="/" className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ←
        </a>
        <h1 className="text-xl font-bold" style={{ color: 'var(--pk-text-primary)' }}>Groups / ग्रुप्स</h1>
        <button className="p-2 rounded-full shadow-sm border" style={{ background: 'var(--pk-card)', borderColor: 'var(--pk-border)' }}>
          ➕
        </button>
      </header>

      <main className="space-y-6">
        {/* Group Card */}
        <section className="pk-card">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🎉</span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--pk-text-primary)' }}>Ganesh Festival</h2>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Members: 12 👥</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Total Fund</div>
              <div className="pk-amount">₹25,000</div>
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Total Spent</div>
              <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹18,500</div>
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Remaining</div>
              <div className="pk-amount" style={{ color: 'var(--pk-green)' }}>₹6,500</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🛒</span>
                  <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Grocery - Ramesh</span>
                </div>
                <div className="text-sm" style={{ color: 'var(--pk-orange)' }}>💰 Pay Back</div>
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--pk-text-secondary)' }}>Tomato ₹30, Potato ₹50</div>
              <div className="text-sm font-semibold mt-1">Total: ₹105</div>
            </div>

            <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--pk-border)', background: 'var(--pk-card)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>🎨</span>
                  <span className="font-medium" style={{ color: 'var(--pk-text-primary)' }}>Decoration - Papa</span>
                </div>
                <div className="text-sm" style={{ color: 'var(--pk-green)' }}>✅ Paid</div>
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--pk-text-secondary)' }}>Flowers ₹200, Lights ₹150</div>
              <div className="text-sm font-semibold mt-1">Total: ₹350</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <a href="" className="pk-button-primary flex items-center justify-center gap-3 p-4">
              <div className="text-2xl"><Image src="/add.svg" width={25} height={25} alt="Add Expense" /></div>
              <div className="text-[14] font-medium">ADD EXPENSE</div>
            </a>
            <a href="/groups/split/1" className="pk-button-secondary flex items-center justify-center gap-3 p-4">
              <div className="text-2xl"><Image src="/money.svg" width={25} height={25} alt="Add Expense" /></div>
              <div className="text-[14] font-medium">SPLIT EXPENSE</div>
            </a>
          </div>
        </section>

        {/* Room Expenses Group */}
        <section className="pk-card">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏠</span>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--pk-text-primary)' }}>Room Expenses</h2>
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Members: 4 👥</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Total Fund</div>
              <div className="pk-amount">₹5,000</div>
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Total Spent</div>
              <div className="pk-amount" style={{ color: 'var(--pk-red)' }}>₹3,800</div>
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--pk-text-secondary)' }}>Remaining</div>
              <div className="pk-amount" style={{ color: 'var(--pk-green)' }}>₹1,200</div>
            </div>
          </div>

          <button className="pk-button-secondary w-full">
            View Details
          </button>
        </section>
      </main>
    </div>
    </Protected>
  );
}
