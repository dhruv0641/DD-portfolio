'use client';

import React, { useState } from 'react';

export default function CodeComparer() {
  const [activeTab, setActiveTab] = useState<'wrapper' | 'orchestration'>('wrapper');

  return (
    <div className="code-toggle-container">
      <div>
        <h2 className="serif-italic" style={{ fontSize: '2.2rem', marginBottom: '2rem', lineHeight: '1.25', color: 'var(--text)' }}>
          Software architecture for stochastic environments.
        </h2>
        <p style={{ marginBottom: '3rem' }}>
          Most portfolios show simple model call wrappers. In production, model wrappers fail. Real systems require strict exception handling, context truncation, rate limiting, and output verification.
        </p>
        <div className="code-tabs">
          <button 
            className={`code-tab ${activeTab === 'wrapper' ? 'active' : ''}`} 
            onClick={() => setActiveTab('wrapper')}
          >
            <h4>Standard Wrapping</h4>
            <p>Exposes raw endpoints. Highly fragile under rate limits or format variances.</p>
          </button>
          <button 
            className={`code-tab ${activeTab === 'orchestration' ? 'active' : ''}`} 
            onClick={() => setActiveTab('orchestration')}
          >
            <h4>Production Architecture</h4>
            <p>Strict type validation, retry mechanisms, context limits, and structured state.</p>
          </button>
        </div>
      </div>

      <div className="code-display">
        <div className="code-header">
          <div className="code-dot red"></div>
          <div className="code-dot yellow"></div>
          <div className="code-dot green"></div>
          <div className="code-file">
            {activeTab === 'wrapper' ? 'wrapper_agent.py' : 'orchestration_agent.py'}
          </div>
        </div>
        
        {/* Code Block 1: Standard Wrapper */}
        {activeTab === 'wrapper' && (
          <div className="code-body active">
            <pre><code>
              <span className="code-keyword">import</span> openai<br /><br />
              <span className="code-keyword">def</span> <span className="code-function">get_research_summary</span>(query, raw_context):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># Fragile: No limit checks, rate limits or format enforcement</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;response = openai.ChatCompletion.create(<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=<span className="code-string">&quot;gpt-4&quot;</span>,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="code-string">&quot;role&quot;</span>: <span className="code-string">&quot;system&quot;</span>, <span className="code-string">&quot;content&quot;</span>: <span className="code-string">&quot;Summarize this context:&quot;</span>&#125;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<span className="code-string">&quot;role&quot;</span>: <span className="code-string">&quot;user&quot;</span>, <span className="code-string">&quot;content&quot;</span>: raw_context + <span className="code-string">&quot;\n\nQuery: &quot;</span> + query&#125;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br />
              &nbsp;&nbsp;&nbsp;&nbsp;)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> response.choices[0].message.content
            </code></pre>
          </div>
        )}

        {/* Code Block 2: Production Orchestration */}
        {activeTab === 'orchestration' && (
          <div className="code-body active">
            <pre><code>
              <span className="code-keyword">import</span> backoff<br />
              <span className="code-keyword">from</span> pydantic <span className="code-keyword">import</span> BaseModel, Field<br />
              <span className="code-keyword">from</span> openai <span className="code-keyword">import</span> OpenAI<br /><br />
              <span className="code-keyword">class</span> <span className="code-decorator">ResearchSummary</span>(BaseModel):<br />
              &nbsp;&nbsp;&nbsp;&nbsp;key_findings: list[str] = Field(description=&quot;Strictly verified facts&quot;)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;confidence: float = Field(ge=0.0, le=1.0)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;sources: list[str]<br /><br />
              client = OpenAI()<br /><br />
              <span className="code-decorator">@backoff.on_exception</span>(backoff.expo, Exception, max_tries=3)<br />
              <span className="code-keyword">def</span> <span className="code-function">process_agent_state</span>(state: dict) -&gt; ResearchSummary:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># 1. Truncate context to protect window limit</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;clean_context = truncate_context(state[&quot;raw_context&quot;], max_tokens=12000)<br /><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># 2. Strict parser matching schema</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;completion = client.beta.chat.completions.parse(<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=&quot;gpt-4o-2024-08-06&quot;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;Extract key facts under format.&quot;&#125;,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: clean_context&#125;<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;response_format=ResearchSummary,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;temperature=0.0,<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timeout=15.0<br />
              &nbsp;&nbsp;&nbsp;&nbsp;)<br />
              &nbsp;&nbsp;&nbsp;&nbsp;result = completion.choices[0].message.parsed<br /><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># 3. Output confidence evaluation layer</span><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">if</span> result.confidence &lt; 0.75:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">raise</span> ValueError(&quot;Confidence fell below acceptance threshold&quot;)<br /><br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> result
            </code></pre>
          </div>
        )}
      </div>
    </div>
  );
}
