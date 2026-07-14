import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const pillars = [
  { name: 'PAL', full: 'Prompt Abstraction Layer', desc: 'Natural language to agent manifest. 5-stage compiler pipeline.', color: '#22d3ee' },
  { name: 'RAG DAL', full: 'Dynamic Acquisition Layer', desc: '3-tier credibility scoring with multi-pass autonomous retrieval.', color: '#fb923c' },
  { name: 'NPAO', full: 'Navigate · Prioritize · Allocate · Orchestrate', desc: '5D phase taxonomy + 4D priority scoring. FIFO is dead.', color: '#34d399' },
  { name: 'Hub', full: 'Rostr Hub — Agent OS', desc: '4-level state management. Knowledge compounds across sessions.', color: '#a78bfa' },
];

const features = [
  { label: 'Core Package', value: '4 modules, 42 tests', color: '#22d3ee' },
  { label: 'API Backend', value: 'FastAPI, 6 endpoints', color: '#fb923c' },
  { label: 'Agent Skills', value: '5 SKILL.md manifests', color: '#34d399' },
  { label: 'Dashboard', value: 'Next.js 15, 5 routes', color: '#a78bfa' },
  { label: 'CLI Deploy', value: 'One command to Vercel', color: '#fbbf24' },
  { label: 'License', value: 'MIT, CI/CD included', color: '#f472b6' },
];

const deploySteps = [
  { step: '01', cmd: 'git clone https://github.com/diamitani/rostr-platform.git' },
  { step: '02', cmd: 'cd rostr-platform/dashboard && npm install && npm run build' },
  { step: '03', cmd: 'npx vercel --prod' },
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="ROSTR + PAL" description={siteConfig.tagline}>
      {/* ── Hero ── */}
      <header style={{
        padding: '6rem 2rem 4rem',
        textAlign: 'left',
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}>
        <div style={{maxWidth: 680}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
            <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'#22d3ee',boxShadow:'0 0 8px rgba(34,211,238,0.6)',animation:'pulse 3s ease-in-out infinite'}} />
            <span style={{fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'monospace',letterSpacing:'0.1em',textTransform:'uppercase'}}>Billion-Dollar Agent OS</span>
          </div>
          <h1 style={{fontSize:'clamp(2.5rem,6vw,4rem)',fontWeight:800,letterSpacing:'-0.03em',lineHeight:1.05,margin:0,color:'#fff'}}>
            ROSTR
            <br />
            <span style={{color:'rgba(255,255,255,0.3)',fontWeight:400,fontSize:'clamp(1.5rem,3.5vw,2.5rem)'}}>
              Runtime, Orchestration, State, Tools, Reference
            </span>
          </h1>
          <p style={{fontSize:'1.1rem',color:'rgba(255,255,255,0.4)',lineHeight:1.6,maxWidth:520,marginTop:20}}>
            A unified architecture for production-grade multi-agent systems.
            PAL compiles natural language into agent manifests.
            One command deploys the entire platform.
          </p>
          <div style={{display:'flex',gap:12,marginTop:28,flexWrap:'wrap'}}>
            <Link className="button button--primary" to="/docs/quick-start">
              Get Started
            </Link>
            <Link className="button button--secondary" to="/docs/pal-whitepaper">
              PAL White Paper
            </Link>
          </div>
        </div>
      </header>

      {/* ── 4 Pillars ── */}
      <section style={{maxWidth:1200,margin:'0 auto',padding:'0 2rem 4rem',display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))',gap:16}}>
        {pillars.map((p) => (
          <div key={p.name} style={{
            background:'rgba(255,255,255,0.02)',
            border:'1px solid rgba(255,255,255,0.06)',
            borderRadius:24,
            padding:28,
            transition:'all 0.5s ease',
          }}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${p.color}15`,border:`1px solid ${p.color}30`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:p.color,fontWeight:800,fontSize:13}}>{p.name.slice(0,2)}</span>
              </div>
              <div>
                <h3 style={{fontSize:16,fontWeight:700,margin:0,color:'#fff'}}>{p.name}</h3>
                <div style={{fontSize:11,color:'rgba(255,255,255,0.25)',textTransform:'uppercase',letterSpacing:'0.08em'}}>{p.full}</div>
              </div>
            </div>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',lineHeight:1.5,margin:0}}>{p.desc}</p>
          </div>
        ))}
      </section>

      {/* ── One-Click Deploy ── */}
      <section style={{maxWidth:1200,margin:'0 auto',padding:'0 2rem 6rem'}}>
        <div style={{
          background:'rgba(255,255,255,0.02)',
          border:'1px solid rgba(34,211,238,0.1)',
          borderRadius:32,
          padding:'3rem',
          position:'relative',
          overflow:'hidden',
        }}>
          <div style={{position:'absolute',top:-100,right:-100,width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',pointerEvents:'none'}} />
          <div style={{position:'relative'}}>
            <h2 style={{fontSize:28,fontWeight:700,color:'#fff',marginBottom:8}}>One-Click Deploy</h2>
            <p style={{color:'rgba(255,255,255,0.35)',marginBottom:28,maxWidth:500}}>Three commands. Under 60 seconds. Production-ready on Vercel.</p>

            {deploySteps.map((s, i) => (
              <div key={s.step} style={{
                display:'flex',alignItems:'center',gap:16,padding:'14px 20px',
                background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)',
                borderRadius:14,marginBottom:8,
                fontFamily:'monospace',fontSize:13,color:'rgba(255,255,255,0.4)',
                transition:'all 0.3s ease',cursor:'pointer',
              }}
              onClick={() => navigator.clipboard.writeText(s.cmd)}
              >
                <span style={{color:'rgba(255,255,255,0.15)',fontSize:11,minWidth:24}}>{s.step}</span>
                <code style={{flex:1,background:'transparent',fontSize:13}}>{s.cmd}</code>
                <span style={{fontSize:10,color:'rgba(255,255,255,0.15)',opacity:0.6}}>COPY</span>
              </div>
            ))}

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginTop:32}}>
              {features.map((f) => (
                <div key={f.label} style={{
                  display:'flex',alignItems:'center',gap:10,
                  padding:'12px 16px',background:'rgba(255,255,255,0.02)',
                  border:'1px solid rgba(255,255,255,0.04)',borderRadius:14,
                }}>
                  <span style={{fontSize:10,color:'rgba(255,255,255,0.2)'}}>{f.label}</span>
                  <span style={{fontSize:11,color:f.color,fontWeight:600,marginLeft:'auto'}}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
