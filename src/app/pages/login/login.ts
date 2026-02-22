import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  styles: [`

    :host {
      font-family: 'DM Sans', sans-serif;
    }

    .login-root {
      min-height: 100vh;
      background: #080b12;
      display: flex;
      position: relative;
      overflow: hidden;
    }

    /* Animated grid background */
    .grid-bg {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% { transform: translateY(0); }
      100% { transform: translateY(48px); }
    }

    /* Glow orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: orbPulse 8s ease-in-out infinite;
    }
    .orb-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%);
      top: -150px; left: -100px;
      animation-delay: 0s;
    }
    .orb-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%);
      bottom: -100px; right: -50px;
      animation-delay: -4s;
    }
    .orb-3 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -2s;
    }

    @keyframes orbPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }

    /* Left panel */
    .left-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 60px;
      position: relative;
      z-index: 1;
    }

    .logo-mark {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 64px;
    }

    .logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .logo-text {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 18px;
      color: #f1f5f9;
      letter-spacing: -0.3px;
    }

    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(56,189,248,0.1);
      border: 1px solid rgba(56,189,248,0.2);
      border-radius: 100px;
      padding: 4px 12px;
      font-size: 12px;
      color: #38bdf8;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .hero-tag::before {
      content: '';
      width: 6px; height: 6px;
      background: #38bdf8;
      border-radius: 50%;
      animation: blink 2s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .hero-title {
      font-family: 'Syne', sans-serif;
      font-size: clamp(36px, 4vw, 56px);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -2px;
      color: #f1f5f9;
      margin-bottom: 20px;
    }

    .hero-title .gradient-text {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-sub {
      font-size: 16px;
      color: #64748b;
      line-height: 1.7;
      max-width: 420px;
      margin-bottom: 56px;
      font-weight: 300;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 14px;
      animation: fadeInUp 0.6s ease both;
    }

    .feature-item:nth-child(1) { animation-delay: 0.1s; }
    .feature-item:nth-child(2) { animation-delay: 0.2s; }
    .feature-item:nth-child(3) { animation-delay: 0.3s; }
    .feature-item:nth-child(4) { animation-delay: 0.4s; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .feature-icon {
      width: 36px; height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .feature-icon.blue { background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.15); }
    .feature-icon.purple { background: rgba(129,140,248,0.1); border: 1px solid rgba(129,140,248,0.15); }
    .feature-icon.green { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.15); }
    .feature-icon.orange { background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.15); }

    .feature-text strong {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #cbd5e1;
      margin-bottom: 2px;
    }

    .feature-text span {
      font-size: 12px;
      color: #475569;
    }

    /* Right panel — login card */
    .right-panel {
      width: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;
      z-index: 1;
    }

    .login-card {
      width: 100%;
      background: rgba(15,23,42,0.8);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 24px;
      padding: 48px 40px;
      backdrop-filter: blur(20px);
      box-shadow:
        0 0 0 1px rgba(255,255,255,0.03),
        0 32px 64px rgba(0,0,0,0.4),
        0 0 80px rgba(56,189,248,0.05);
      animation: cardIn 0.8s cubic-bezier(0.16,1,0.3,1) both;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(32px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .card-eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #38bdf8;
      margin-bottom: 12px;
    }

    .card-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: #f1f5f9;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .card-sub {
      font-size: 14px;
      color: #475569;
      margin-bottom: 40px;
      line-height: 1.6;
    }

    .google-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      background: #fff;
      color: #1e293b;
      font-family: 'DM Sans', sans-serif;
      font-size: 15px;
      font-weight: 500;
      padding: 14px 24px;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      position: relative;
      overflow: hidden;
    }

    .google-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .google-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }

    .google-btn:hover::before { opacity: 1; }
    .google-btn:active { transform: translateY(0); }

    .google-btn img {
      width: 20px; height: 20px;
    }

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 28px 0;
      color: #1e293b;
      font-size: 12px;
    }

    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.06);
    }

    .security-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(52,211,153,0.05);
      border: 1px solid rgba(52,211,153,0.1);
      border-radius: 10px;
      padding: 12px 16px;
      margin-top: 24px;
    }

    .security-badge span {
      font-size: 12px;
      color: #34d399;
      line-height: 1.5;
    }

    .terms {
      text-align: center;
      font-size: 11px;
      color: #334155;
      margin-top: 24px;
      line-height: 1.6;
    }

    .error-msg {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 13px;
      color: #f87171;
      margin-top: 16px;
      text-align: center;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .left-panel { display: none; }
      .right-panel {
        width: 100%;
        min-height: 100vh;
        padding: 24px;
      }
      .login-card { padding: 36px 28px; }
    }

    @media (max-width: 480px) {
      .right-panel { padding: 16px; }
      .login-card { padding: 28px 20px; border-radius: 20px; }
      .card-title { font-size: 24px; }
    }
  `],
  template: `
    <div class="login-root">
      <div class="grid-bg"></div>
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <!-- Left Panel -->
      <div class="left-panel">
        <div class="logo-mark">
          <div class="logo-icon">📌</div>
          <span class="logo-text">Markify</span>
        </div>

        <div class="hero-tag">Now in public beta</div>

        <h1 class="hero-title">
          Your links,<br>
          <span class="gradient-text">beautifully</span><br>
          organized.
        </h1>

        <p class="hero-sub">
          Save, organize, and access your bookmarks from anywhere. 
          Real-time sync across all your devices and tabs.
        </p>

        <div class="features-list">
          <div class="feature-item">
            <div class="feature-icon blue">⚡</div>
            <div class="feature-text">
              <strong>Real-time sync</strong>
              <span>Updates across all tabs instantly</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">🔒</div>
            <div class="feature-text">
              <strong>Private by default</strong>
              <span>Your bookmarks, only visible to you</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">🏷️</div>
            <div class="feature-text">
              <strong>Smart categories</strong>
              <span>Organize with tags and filters</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon orange">🔍</div>
            <div class="feature-text">
              <strong>Instant search</strong>
              <span>Find any bookmark in milliseconds</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="right-panel">
        <div class="login-card">
          <p class="card-eyebrow">Welcome back</p>
          <h2 class="card-title">Sign in to Markify</h2>
          <p class="card-sub">One click to access all your saved links and bookmarks.</p>

          <button class="google-btn" (click)="loginWithGoogle()">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
            Continue with Google
          </button>

          <div class="divider">No password required</div>

          <div class="security-badge">
            <span>🛡️</span>
            <span>Secured with Google OAuth. We never store your password or share your data.</span>
          </div>

          @if (error) {
            <div class="error-msg">{{ error }}</div>
          }

          <p class="terms">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  error = '';

  constructor(private supabase: SupabaseService, private router: Router) {
    this.supabase.user$.subscribe(user => {
      if (user) this.router.navigate(['/bookmarks']);
    });
  }

  async loginWithGoogle() {
    try {
      await this.supabase.signInWithGoogle();
    } catch (e: any) {
      this.error = e.message;
    }
  }
}