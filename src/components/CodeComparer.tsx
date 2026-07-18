'use client';

import React, { useState } from 'react';

type StepType = 'naive' | 'retry' | 'structured' | 'validation' | 'pipeline';

export default function CodeComparer() {
  const [activeStep, setActiveStep] = useState<StepType>('naive');

  const steps = [
    {
      id: 'naive' as StepType,
      title: '1. Naive Prompt',
      short: 'Basic Endpoint Call',
      desc: 'Simple API call returning raw string. Mismatches formatting schemas, fails on rate limits, and hallucinates key values.',
      fileName: 'naive_prompt.py',
      code: (
        <pre><code>
          <span className="code-keyword">import</span> openai<br /><br />
          <span className="code-keyword">def</span> <span className="code-function">call_naive_prompt</span>(raw_context, query):<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># Fragile: raw string output, zero schema control, no exceptions handled</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;response = openai.chat.completions.create(<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=<span className="code-string">&quot;gpt-4o&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[&#123;<span className="code-string">&quot;role&quot;</span>: <span className="code-string">&quot;user&quot;</span>, <span className="code-string">&quot;content&quot;</span>: raw_context + <span className="code-string">&quot;\n\nQuery: &quot;</span> + query&#125;]<br />
          &nbsp;&nbsp;&nbsp;&nbsp;)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> response.choices[0].message.content
        </code></pre>
      )
    },
    {
      id: 'retry' as StepType,
      title: '2. Retry Logic',
      short: 'Backoff Resilience',
      desc: 'Adds exponential backoff decorators to handle network failures and API rate limit restrictions automatically.',
      fileName: 'retry_logic.py',
      code: (
        <pre><code>
          <span className="code-keyword">import</span> backoff<br />
          <span className="code-keyword">import</span> openai<br /><br />
          <span className="code-decorator">@backoff.on_exception</span>(backoff.expo, openai.RateLimitError, max_tries=3)<br />
          <span className="code-keyword">def</span> <span className="code-function">call_with_retry</span>(raw_context, query):<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># Retries dynamically with jitter if rate-limits or exceptions fire</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;response = openai.chat.completions.create(<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=<span className="code-string">&quot;gpt-4o&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[&#123;<span className="code-string">&quot;role&quot;</span>: <span className="code-string">&quot;user&quot;</span>, <span className="code-string">&quot;content&quot;</span>: raw_context + <span className="code-string">&quot;\n\nQuery: &quot;</span> + query&#125;]<br />
          &nbsp;&nbsp;&nbsp;&nbsp;)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> response.choices[0].message.content
        </code></pre>
      )
    },
    {
      id: 'structured' as StepType,
      title: '3. Structured Output',
      short: 'Schema Enforcement',
      desc: 'Forces the model response to strictly adhere to a predefined JSON schema schema using type casting and strict modes.',
      fileName: 'structured_output.py',
      code: (
        <pre><code>
          <span className="code-keyword">from</span> pydantic <span className="code-keyword">import</span> BaseModel, Field<br />
          <span className="code-keyword">from</span> openai <span className="code-keyword">import</span> OpenAI<br /><br />
          <span className="code-keyword">class</span> <span className="code-decorator">WorkflowOutput</span>(BaseModel):<br />
          &nbsp;&nbsp;&nbsp;&nbsp;extracted_data: dict = Field(description=<span className="code-string">&quot;Metrics mapping&quot;</span>)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;confidence: float<br /><br />
          client = OpenAI()<br /><br />
          <span className="code-keyword">def</span> <span className="code-function">call_structured_output</span>(raw_context):<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># Enforces output to align matching Pydantic class definition</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;completion = client.beta.chat.completions.parse(<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=<span className="code-string">&quot;gpt-4o-2024-08-06&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[&#123;<span className="code-string">&quot;role&quot;</span>: <span className="code-string">&quot;user&quot;</span>, <span className="code-string">&quot;content&quot;</span>: raw_context&#125;],<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;response_format=WorkflowOutput,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> completion.choices[0].message.parsed
        </code></pre>
      )
    },
    {
      id: 'validation' as StepType,
      title: '4. Validation Layer',
      short: 'Deterministic Rules',
      desc: 'Applies programmatic constraints (e.g. database cross-checks, checksums, and boundaries) to verify output accuracy.',
      fileName: 'validation.py',
      code: (
        <pre><code>
          <span className="code-keyword">def</span> <span className="code-function">validate_output</span>(parsed_output):<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># Mathematical check: verify grand total equals sum of items</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;totals = parsed_output.extracted_data.get(<span className="code-string">&quot;subtotals&quot;</span>, [])<br />
          &nbsp;&nbsp;&nbsp;&nbsp;checksum = sum(totals)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;grand_total = parsed_output.extracted_data.get(<span className="code-string">&quot;total&quot;</span>, 0)<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">if</span> grand_total != checksum:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">raise</span> ValueError(f<span className="code-string">&quot;Checksum mismatch: &#123;grand_total&#125; != &#123;checksum&#125;&quot;</span>)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> <span className="code-keyword">True</span>
        </code></pre>
      )
    },
    {
      id: 'pipeline' as StepType,
      title: '5. Production Pipeline',
      short: 'Robust Orchestration',
      desc: 'Integrates all four features into a single high-performance pipeline ensuring total reliability in active runtime workloads.',
      fileName: 'production_pipeline.py',
      code: (
        <pre><code>
          <span className="code-keyword">import</span> backoff<br />
          <span className="code-keyword">from</span> pydantic <span className="code-keyword">import</span> BaseModel<br />
          <span className="code-keyword">from</span> openai <span className="code-keyword">import</span> OpenAI<br /><br />
          client = OpenAI()<br /><br />
          <span className="code-decorator">@backoff.on_exception</span>(backoff.expo, Exception, max_tries=3)<br />
          <span className="code-keyword">def</span> <span className="code-function">run_production_pipeline</span>(state: dict) -&gt; WorkflowOutput:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># 1. Truncate context to fit token window limit</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;context = truncate_context(state[<span className="code-string">&quot;context&quot;</span>], max_tokens=10000)<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># 2. Strict parser matching schema</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;completion = client.beta.chat.completions.parse(<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;model=<span className="code-string">&quot;gpt-4o-2024-08-06&quot;</span>,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;messages=[&#123;<span className="code-string">&quot;role&quot;</span>: <span className="code-string">&quot;user&quot;</span>, <span className="code-string">&quot;content&quot;</span>: context&#125;],<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;response_format=WorkflowOutput,<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;temperature=0.0<br />
          &nbsp;&nbsp;&nbsp;&nbsp;)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;result = completion.choices[0].message.parsed<br /><br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-comment"># 3. Output checksum verification layer</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;validate_output(result)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="code-keyword">return</span> result
        </code></pre>
      )
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep) || steps[0];

  return (
    <div className="code-toggle-container">
      <div>
        <h2 className="serif-italic" style={{ fontSize: '2.2rem', marginBottom: '2rem', lineHeight: '1.25', color: 'var(--text)' }}>
          Software architecture for stochastic environments.
        </h2>
        <p style={{ marginBottom: '3rem' }}>
          Most portfolios show simple, fragile model call wrappers. In production, simple wrappers fail. Real systems require strict exception handling, context truncation, rate limiting, and output validation.
        </p>
        <div className="code-tabs" style={{ gap: '0.8rem' }}>
          {steps.map(step => (
            <button 
              key={step.id}
              className={`code-tab ${activeStep === step.id ? 'active' : ''}`} 
              onClick={() => setActiveStep(step.id)}
              style={{ padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 500 }}>{step.title}</h4>
              <p style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: activeStep === step.id ? 'var(--text-muted)' : 'var(--text-dim)' }}>
                {step.short}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="code-display" style={{ alignSelf: 'stretch' }}>
        <div className="code-header">
          <div className="code-dot red"></div>
          <div className="code-dot yellow"></div>
          <div className="code-dot green"></div>
          <div className="code-file">{currentStep.fileName}</div>
        </div>
        
        <div className="code-body active">
          {currentStep.code}
        </div>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--grid-line)', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.5 }}>
          {currentStep.desc}
        </div>
      </div>
    </div>
  );
}

