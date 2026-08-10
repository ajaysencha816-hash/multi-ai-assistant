export type Provider = "openai" | "gemini" | "demo";
export async function askOpenAI(prompt:string){
  const key=process.env.OPENAI_API_KEY;
  if(!key) throw new Error("OPENAI_API_KEY not configured");
  const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4o-mini",messages:[{role:"user",content:prompt}]})});
  if(!r.ok) throw new Error(`OpenAI ${r.status}`);
  const d=await r.json(); return d.choices?.[0]?.message?.content||"No answer";
}
export async function askGemini(prompt:string){
  const key=process.env.GEMINI_API_KEY;
  if(!key) throw new Error("GEMINI_API_KEY not configured");
  const model=process.env.GEMINI_MODEL||"gemini-2.0-flash";
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}]})});
  if(!r.ok) throw new Error(`Gemini ${r.status}`);
  const d=await r.json(); return d.candidates?.[0]?.content?.parts?.[0]?.text||"No answer";
}
export function demo(prompt:string){
  return `Demo AI answer for: "${prompt}"\n\nExplain the topic in simple language, step by step. Configure OPENAI_API_KEY or GEMINI_API_KEY in Vercel Environment Variables to enable real providers.`;
}
