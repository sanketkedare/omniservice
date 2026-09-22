"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Utility ───────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="feature-card group">
      {badge && (
        <span className="feature-badge">{badge}</span>
      )}
      <div className="feature-icon-wrap">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  );
}

// ── Step Item ─────────────────────────────────────────────────────────────────
function StepItem({
  number,
  title,
  description,
  isLast,
}: {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="step-item">
      <div className="step-left">
        <div className="step-number">{number}</div>
        {!isLast && <div className="step-connector" />}
      </div>
      <div className="step-content">
        <h4 className="step-title">{title}</h4>
        <p className="step-desc">{description}</p>
      </div>
    </div>
  );
}

// ── Animated Status Pill ──────────────────────────────────────────────────────
function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="status-pill"
      style={{ "--pill-color": color } as React.CSSProperties}
    >
      <span className="status-dot" />
      {label}
    </span>
  );
}

// ── Hero Mock UI ──────────────────────────────────────────────────────────────
function HeroMockUI() {
  const steps = [
    "Analyzing video...",
    "Detecting components...",
    "Generating scope of work...",
    "Finding professionals...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="hero-mock">
      {/* Phone frame */}
      <div className="mock-phone">
        <div className="mock-notch" />
        {/* App Header */}
        <div className="mock-header">
          <div className="mock-logo-text">ForgeLocal</div>
          <div className="mock-avatar" />
        </div>

        {/* Video thumbnail */}
        <div className="mock-video-thumb">
          <div className="mock-video-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div className="mock-video-label">Kitchen sink video</div>
        </div>

        {/* AI Analysis */}
        <div className="mock-analysis-card">
          <div className="mock-analysis-header">
            <div className="mock-ai-dot" />
            <span className="mock-ai-label">{steps[step]}</span>
          </div>
          <div className="mock-progress-bar">
            <div
              className="mock-progress-fill"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
                transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>

        {/* SOW Preview */}
        <div className="mock-sow-card">
          <div className="mock-sow-title">Scope of Work</div>
          <div className="mock-sow-row">
            <span>P-trap replacement</span>
            <span className="mock-sow-price">₹850</span>
          </div>
          <div className="mock-sow-row">
            <span>Labor (30–45 min)</span>
            <span className="mock-sow-price">₹1,500–₹2,000</span>
          </div>
          <div className="mock-sow-divider" />
          <div className="mock-sow-row mock-sow-total">
            <span>Estimated Total</span>
            <span>₹2,780–₹3,280</span>
          </div>
        </div>

        {/* CTA */}
        <button className="mock-cta-btn">
          Find Professionals →
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="landing-root">
      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="nav-logo-mark">F</div>
            <span className="nav-logo-text">ForgeLocal</span>
          </div>
          <div className="nav-links">
            <Link href="#how-it-works" className="nav-link">How it works</Link>
            <Link href="#modules" className="nav-link">Platform</Link>
            <Link href="/login" className="nav-link-btn">Sign in</Link>
            <Link href="/register" className="nav-cta-btn">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <StatusPill label="AI-Powered" color="#f05a28" />
              <StatusPill label="Local Services" color="#16a34a" />
            </div>
            <h1 className="hero-headline">
              Show the problem.{" "}
              <span className="hero-headline-accent">Let AI</span>{" "}
              understand it.
            </h1>
            <p className="hero-subheadline">
              ForgeLocal connects you to verified local professionals
              with AI-generated diagnostics, transparent pricing,
              and visual proof of work — all before you pay.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="hero-primary-btn">
                Request a service
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/professional/register" className="hero-secondary-btn">
                Join as Professional
              </Link>
            </div>
            <div className="hero-trust-row">
              <div className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 12l2 2 4-4M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10z" />
                </svg>
                Verified professionals
              </div>
              <div className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Payment held in escrow
              </div>
              <div className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 10l-4 4-2-2M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                </svg>
                Visual verification
              </div>
            </div>
          </div>
          <div className="hero-right">
            <HeroMockUI />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="how-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">How ForgeLocal Works</span>
            <h2 className="section-headline">From problem to verified solution</h2>
            <p className="section-subtext">
              The entire local services lifecycle — intelligently automated.
            </p>
          </div>
          <div className="steps-grid">
            <div className="steps-column">
              <StepItem
                number="01"
                title="Show the problem"
                description="Record a short video or take photos. No need to know the service category — just show what's wrong."
              />
              <StepItem
                number="02"
                title="AI diagnoses it"
                description="InspectAI analyzes your media, identifies components, estimates parts and labor, and generates a Scope of Work."
              />
              <StepItem
                number="03"
                title="Get transparent pricing"
                description="See an itemized price range — parts, labor, travel, and platform fee — before you book anything."
              />
              <StepItem
                number="04"
                title="Match with a professional"
                description="SmartRoute finds verified professionals near you who have the skills, schedule, and parts already in their vehicle."
              />
              <StepItem
                number="05"
                title="Payment in escrow"
                description="Your payment is held securely until work is verified. No payment without proof."
              />
              <StepItem
                number="06"
                title="Visual verification"
                description="TrustLock compares before and after evidence. Funds release only when the job is confirmed complete."
                isLast
              />
            </div>
            <div className="steps-visual">
              <div className="steps-visual-card">
                <div className="svc-tag">Case Study</div>
                <div className="svc-title">Leaking bathroom drain line</div>
                <div className="svc-flow">
                  {[
                    { label: "Video submitted", icon: "📹", status: "done" },
                    { label: "P-trap leak identified (91% confidence)", icon: "🔍", status: "done" },
                    { label: "SOW generated — ₹2,780–₹3,280", icon: "📋", status: "done" },
                    { label: "Apex Plumbing matched — 2.4 km", icon: "📍", status: "done" },
                    { label: "Professional arrived — pre-work captured", icon: "📸", status: "done" },
                    { label: "Repair completed — verified", icon: "✅", status: "done" },
                    { label: "Payment released — HomePass updated", icon: "🏠", status: "active" },
                  ].map((item, i) => (
                    <div key={i} className={cn("svc-flow-item", item.status === "active" ? "svc-flow-item--active" : "")}>
                      <span className="svc-flow-icon">{item.icon}</span>
                      <span className="svc-flow-label">{item.label}</span>
                      {item.status === "done" && (
                        <svg className="svc-flow-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Modules ── */}
      <section id="modules" className="modules-section">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">AI Platform</span>
            <h2 className="section-headline">Four AI systems. One seamless experience.</h2>
          </div>
          <div className="modules-grid">
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              }
              title="InspectAI"
              description="Multimodal diagnostic engine. Analyzes video, photos, and voice to identify components, damage, required parts, and risk flags."
              badge="Phase 3"
            />
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M3 11l19-9-9 19-2-8-8-2z" />
                </svg>
              }
              title="SmartRoute"
              description="Intelligent dispatch. Matches professionals by distance, skills, availability, vehicle inventory, and job economics."
              badge="Phase 4"
            />
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
              title="TrustLock"
              description="Visual proof-of-work verification. Compares pre-work and post-work evidence. Payment releases only after AI confirms completion."
              badge="Phase 6"
            />
            <FeatureCard
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
              title="HomePass"
              description="Property digital passport. Every completed job builds your property's service history, appliance records, and predictive maintenance intelligence."
              badge="Phase 7"
            />
          </div>
        </div>
      </section>

      {/* ── For Professionals ── */}
      <section className="pro-section">
        <div className="section-inner">
          <div className="pro-card">
            <div className="pro-left">
              <span className="section-eyebrow" style={{ color: "var(--color-volcanic-400)" }}>For Professionals</span>
              <h2 className="section-headline pro-headline">
                No upfront lead fees. Earn on completed jobs.
              </h2>
              <p className="section-subtext">
                ForgeLocal matches you with structured, pre-diagnosed jobs —
                not vague inquiries. Get paid faster after verified completion.
              </p>
              <ul className="pro-benefits">
                {[
                  "Receive AI-structured job briefs with SOW already written",
                  "Match only jobs that fit your skills, radius, and schedule",
                  "Inventory-aware dispatch — fewer supply house trips",
                  "Fast settlement after TrustLock verification",
                  "Built-in invoicing, mileage, and earnings tracking",
                ].map((benefit, i) => (
                  <li key={i} className="pro-benefit-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link href="/professional/register" className="pro-cta-btn">
                Join as a Professional
              </Link>
            </div>
            <div className="pro-right">
              <div className="pro-mock-dashboard">
                <div className="pro-mock-header">
                  <span className="pro-mock-title">Today&apos;s Jobs</span>
                  <span className="pro-mock-count">3 scheduled</span>
                </div>
                {[
                  { time: "9:00 AM", title: "P-trap replacement", location: "Koramangala", amount: "₹2,850", status: "In progress" },
                  { time: "12:30 PM", title: "Pipe leak fix", location: "Indiranagar", amount: "₹1,800", status: "Confirmed" },
                  { time: "3:00 PM", title: "Basin faucet repair", location: "HSR Layout", amount: "₹1,200", status: "Confirmed" },
                ].map((job, i) => (
                  <div key={i} className="pro-mock-job">
                    <div className="pro-mock-time">{job.time}</div>
                    <div className="pro-mock-job-info">
                      <div className="pro-mock-job-title">{job.title}</div>
                      <div className="pro-mock-job-loc">{job.location}</div>
                    </div>
                    <div className="pro-mock-job-right">
                      <div className="pro-mock-amount">{job.amount}</div>
                      <div className={cn(
                        "pro-mock-status",
                        job.status === "In progress" ? "pro-mock-status--active" : "pro-mock-status--default"
                      )}>
                        {job.status}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pro-mock-earnings">
                  <span>Today&apos;s Earnings</span>
                  <span className="pro-mock-earnings-amount">₹5,850</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="final-cta-section">
        <div className="final-cta-inner">
          <h2 className="final-cta-headline">
            The OS for local services.<br />
            <span className="final-cta-accent">Built for trust. Built for proof.</span>
          </h2>
          <p className="final-cta-sub">
            Join ForgeLocal — the first AI-native platform where payment only
            releases when work is visually verified.
          </p>
          <div className="final-cta-actions">
            <Link href="/register" className="final-cta-primary">
              Get started free
            </Link>
            <Link href="/professional/register" className="final-cta-secondary">
              Join as a Professional
            </Link>
          </div>
          <div className="final-cta-brand">
            A <strong>Volcanic.World</strong> product
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo-mark" style={{ width: "1.5rem", height: "1.5rem", fontSize: "0.7rem" }}>F</div>
            <span className="footer-brand-text">ForgeLocal</span>
          </div>
          <div className="footer-links">
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/terms" className="footer-link">Terms</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>
          <div className="footer-copy">
            © {new Date().getFullYear()} Volcanic.World. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ── Styles ── */}
      <style>{`
        /* Root */
        .landing-root {
          background: #fafafa;
          min-height: 100dvh;
          font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
          color: #1a1a1a;
        }

        /* Navigation */
        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid #e5e5e5;
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 3.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-logo-mark {
          width: 2rem;
          height: 2rem;
          background: #f05a28;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }
        .nav-logo-text {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #0d0d0d;
          letter-spacing: -0.03em;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          font-size: 0.875rem;
          color: #525252;
          text-decoration: none;
          font-weight: 500;
          transition: color 150ms;
        }
        .nav-link:hover { color: #0d0d0d; }
        .nav-link-btn {
          font-size: 0.875rem;
          color: #0d0d0d;
          text-decoration: none;
          font-weight: 500;
        }
        .nav-cta-btn {
          background: #f05a28;
          color: white;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: background 150ms, transform 100ms;
        }
        .nav-cta-btn:hover { background: #c44a1e; transform: translateY(-1px); }

        @media (max-width: 640px) {
          .nav-links .nav-link { display: none; }
          .nav-link-btn { display: none; }
        }

        /* Hero */
        .hero-section {
          padding: 5rem 1.5rem 4rem;
          background: linear-gradient(135deg, #fff8f6 0%, #fafafa 50%, #f5f5f5 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(240,90,40,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; gap: 2.5rem; }
          .hero-right { order: -1; }
        }
        .hero-eyebrow {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }
        .hero-headline {
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.04em;
          color: #0d0d0d;
          margin-bottom: 1.25rem;
        }
        .hero-headline-accent {
          color: #f05a28;
        }
        .hero-subheadline {
          font-size: 1.0625rem;
          color: #525252;
          line-height: 1.65;
          margin-bottom: 2rem;
          max-width: 500px;
        }
        .hero-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .hero-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f05a28;
          color: white;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(240,90,40,0.3);
          transition: background 150ms, transform 100ms, box-shadow 150ms;
        }
        .hero-primary-btn:hover {
          background: #c44a1e;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(240,90,40,0.35);
        }
        .hero-secondary-btn {
          display: inline-flex;
          align-items: center;
          background: white;
          color: #0d0d0d;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          border: 1.5px solid #e5e5e5;
          transition: border-color 150ms, transform 100ms;
        }
        .hero-secondary-btn:hover { border-color: #c4c4c4; transform: translateY(-1px); }
        .hero-trust-row {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }
        .hero-trust-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: #737373;
          font-weight: 500;
        }

        /* Status Pill */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #525252;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--pill-color, #f05a28);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.85); }
        }

        /* Hero Mock */
        .hero-mock {
          display: flex;
          justify-content: center;
          perspective: 1200px;
        }
        .mock-phone {
          width: 280px;
          background: white;
          border-radius: 2rem;
          box-shadow: 0 32px 64px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06);
          padding: 1.5rem 1rem 1.25rem;
          transform: rotateY(-4deg) rotateX(2deg);
          transition: transform 0.4s ease;
          position: relative;
        }
        .mock-phone:hover { transform: rotateY(0deg) rotateX(0deg); }
        .mock-notch {
          width: 60px;
          height: 6px;
          background: #e5e5e5;
          border-radius: 9999px;
          margin: 0 auto 1.25rem;
        }
        .mock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.875rem;
        }
        .mock-logo-text {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #0d0d0d;
          letter-spacing: -0.03em;
        }
        .mock-avatar {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f05a28, #f8a48c);
        }
        .mock-video-thumb {
          background: #0d0d0d;
          border-radius: 0.75rem;
          height: 5.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          margin-bottom: 0.75rem;
          position: relative;
          overflow: hidden;
        }
        .mock-video-thumb::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(240,90,40,0.15), transparent);
        }
        .mock-video-icon { color: white; opacity: 0.9; }
        .mock-video-label { font-size: 0.6875rem; color: rgba(255,255,255,0.7); font-weight: 500; }
        .mock-analysis-card {
          background: #f5f5f5;
          border-radius: 0.625rem;
          padding: 0.625rem 0.75rem;
          margin-bottom: 0.625rem;
        }
        .mock-analysis-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-bottom: 0.5rem;
        }
        .mock-ai-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f05a28;
          animation: pulse 1.2s ease-in-out infinite;
        }
        .mock-ai-label { font-size: 0.6875rem; color: #525252; font-weight: 500; }
        .mock-progress-bar {
          height: 3px;
          background: #e5e5e5;
          border-radius: 9999px;
          overflow: hidden;
        }
        .mock-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #f05a28, #f8a48c);
          border-radius: 9999px;
        }
        .mock-sow-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 0.75rem;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .mock-sow-title {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #0d0d0d;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.5rem;
        }
        .mock-sow-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: #525252;
          padding: 0.2rem 0;
        }
        .mock-sow-price { color: #0d0d0d; font-weight: 500; }
        .mock-sow-divider {
          height: 1px;
          background: #e5e5e5;
          margin: 0.375rem 0;
        }
        .mock-sow-total {
          font-weight: 700;
          color: #0d0d0d;
          font-size: 0.75rem;
        }
        .mock-cta-btn {
          width: 100%;
          background: #f05a28;
          color: white;
          border: none;
          border-radius: 0.75rem;
          padding: 0.625rem;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 150ms;
        }
        .mock-cta-btn:hover { background: #c44a1e; }

        /* Sections */
        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .section-eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #f05a28;
          margin-bottom: 0.75rem;
        }
        .section-headline {
          font-size: clamp(1.625rem, 3vw, 2.25rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0d0d0d;
          line-height: 1.15;
          margin-bottom: 0.875rem;
        }
        .section-subtext {
          font-size: 1rem;
          color: #737373;
          max-width: 540px;
          margin: 0 auto;
        }

        /* How It Works */
        .how-section {
          padding: 6rem 1.5rem;
          background: white;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        .step-item {
          display: flex;
          gap: 1rem;
          position: relative;
        }
        .step-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }
        .step-number {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f05a28, #c44a1e);
          color: white;
          font-size: 0.6875rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(240,90,40,0.3);
          flex-shrink: 0;
        }
        .step-connector {
          width: 1.5px;
          flex: 1;
          background: linear-gradient(to bottom, #f8a48c, transparent);
          min-height: 1.5rem;
          margin-top: 0.25rem;
        }
        .step-content {
          padding-bottom: 1.75rem;
        }
        .step-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 0.25rem;
        }
        .step-desc {
          font-size: 0.9375rem;
          color: #737373;
          line-height: 1.6;
        }
        .steps-visual-card {
          background: white;
          border: 1.5px solid #e5e5e5;
          border-radius: 1.25rem;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          position: sticky;
          top: 5rem;
        }
        .svc-tag {
          display: inline-block;
          background: #fef0ec;
          color: #f05a28;
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .svc-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 1.25rem;
        }
        .svc-flow {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .svc-flow-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem 0.625rem;
          border-radius: 0.5rem;
          background: #fafafa;
          font-size: 0.8125rem;
          color: #525252;
          transition: background 150ms;
        }
        .svc-flow-item--active {
          background: #fef0ec;
          color: #c44a1e;
          font-weight: 600;
        }
        .svc-flow-icon { flex-shrink: 0; }
        .svc-flow-label { flex: 1; }
        .svc-flow-check { margin-left: auto; color: #16a34a; flex-shrink: 0; }

        /* AI Modules */
        .modules-section {
          padding: 6rem 1.5rem;
          background: #fafafa;
        }
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .modules-grid { grid-template-columns: 1fr; }
        }
        .feature-card {
          background: white;
          border: 1.5px solid #e5e5e5;
          border-radius: 1.25rem;
          padding: 1.75rem;
          position: relative;
          transition: border-color 200ms, transform 200ms, box-shadow 200ms;
        }
        .feature-card:hover {
          border-color: rgba(240,90,40,0.3);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .feature-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #f5f5f5;
          color: #737373;
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.1875rem 0.5rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .feature-icon-wrap {
          width: 2.75rem;
          height: 2.75rem;
          background: linear-gradient(135deg, #fff8f6, #fef0ec);
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f05a28;
          margin-bottom: 1rem;
          border: 1px solid rgba(240,90,40,0.15);
        }
        .feature-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #0d0d0d;
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          font-size: 0.9375rem;
          color: #737373;
          line-height: 1.6;
        }

        /* For Professionals */
        .pro-section {
          padding: 6rem 1.5rem;
          background: #0d0d0d;
        }
        .pro-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .pro-card { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        .pro-headline { color: white !important; }
        .pro-section .section-subtext { color: #a3a3a3; }
        .pro-benefits {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .pro-benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.9375rem;
          color: #a3a3a3;
          line-height: 1.5;
        }
        .pro-benefit-item svg { color: #f05a28; flex-shrink: 0; margin-top: 0.2rem; }
        .pro-cta-btn {
          display: inline-block;
          background: #f05a28;
          color: white;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.75rem;
          transition: background 150ms, transform 100ms;
        }
        .pro-cta-btn:hover { background: #c44a1e; transform: translateY(-1px); }
        .pro-mock-dashboard {
          background: #1a1a1a;
          border-radius: 1.25rem;
          padding: 1.25rem;
          border: 1px solid #2d2d2d;
        }
        .pro-mock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .pro-mock-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
        }
        .pro-mock-count {
          font-size: 0.75rem;
          color: #737373;
        }
        .pro-mock-job {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #2d2d2d;
          border-radius: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .pro-mock-time {
          font-size: 0.6875rem;
          color: #737373;
          font-weight: 500;
          white-space: nowrap;
          min-width: 4.5rem;
        }
        .pro-mock-job-info { flex: 1; }
        .pro-mock-job-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: white;
        }
        .pro-mock-job-loc {
          font-size: 0.6875rem;
          color: #737373;
        }
        .pro-mock-job-right { text-align: right; }
        .pro-mock-amount {
          font-size: 0.8125rem;
          font-weight: 700;
          color: white;
        }
        .pro-mock-status {
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          display: inline-block;
        }
        .pro-mock-status--active { background: rgba(240,90,40,0.2); color: #f05a28; }
        .pro-mock-status--default { background: rgba(22,163,74,0.2); color: #22c55e; }
        .pro-mock-earnings {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #2d2d2d;
          font-size: 0.875rem;
          color: #737373;
        }
        .pro-mock-earnings-amount {
          font-size: 1rem;
          font-weight: 800;
          color: white;
        }

        /* Final CTA */
        .final-cta-section {
          padding: 7rem 1.5rem;
          background: linear-gradient(135deg, #fff8f6 0%, #fafafa 100%);
          text-align: center;
        }
        .final-cta-inner { max-width: 700px; margin: 0 auto; }
        .final-cta-headline {
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0d0d0d;
          line-height: 1.15;
          margin-bottom: 1rem;
        }
        .final-cta-accent { color: #f05a28; }
        .final-cta-sub {
          font-size: 1rem;
          color: #737373;
          margin-bottom: 2rem;
          line-height: 1.65;
        }
        .final-cta-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .final-cta-primary {
          background: #f05a28;
          color: white;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 700;
          padding: 0.875rem 2rem;
          border-radius: 0.875rem;
          box-shadow: 0 4px 16px rgba(240,90,40,0.3);
          transition: background 150ms, transform 100ms;
        }
        .final-cta-primary:hover { background: #c44a1e; transform: translateY(-2px); }
        .final-cta-secondary {
          background: white;
          color: #0d0d0d;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.875rem 2rem;
          border-radius: 0.875rem;
          border: 1.5px solid #e5e5e5;
          transition: border-color 150ms;
        }
        .final-cta-secondary:hover { border-color: #c4c4c4; }
        .final-cta-brand {
          font-size: 0.8125rem;
          color: #a3a3a3;
        }
        .final-cta-brand strong { color: #525252; }

        /* Footer */
        .landing-footer {
          background: #0d0d0d;
          padding: 2rem 1.5rem;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-brand-text {
          font-size: 0.9375rem;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
        }
        .footer-links {
          display: flex;
          gap: 1.5rem;
        }
        .footer-link {
          font-size: 0.875rem;
          color: #737373;
          text-decoration: none;
          transition: color 150ms;
        }
        .footer-link:hover { color: white; }
        .footer-copy {
          font-size: 0.8125rem;
          color: #525252;
        }
      `}</style>
    </div>
  );
}
