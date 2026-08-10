'use client';
import {useState} from "react";
import {Send,Paperclip,Settings,Plus,History,Sparkles,GitCompareArrows} from "lucide-react";

type Result={provider:string,answer:string,ok:boolean};
export default function Home(){
 const [prompt,setPrompt]=useState(""); const [loading,setLoading]=useState(false);
 const [combined,setCombined]=useState(""); const [diagram,setDiagram]=useState("");
 const [results,setResults]=useState<Result[]>([]); const [history,setHistory]=useState<string[]>([]);
 async function ask(){
  if(!prompt.trim()||loading)return; setLoading(true);
  const q=prompt.trim(); setHistory(h=>[q,...h].slice(0,10));
  const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:q})});
  const d=await r.json(); setCombined(d.combined||d.error); setDiagram(d.diagram||""); setResults(d.results||[]); setLoading(false);
 }
 return <main className="min-h-screen flex">
  <aside className="hidden md:flex w-64 border-r border-white/10 p-4 flex-col gap-5">
   <div className="text-xl font-bold flex gap-2 items-center"><Sparkles size={20}/> Multi-AI</div>
   <button onClick={()=>{setPrompt("");setCombined("");setResults([])}} className="rounded-xl bg-white text-black py-2 flex gap-2 justify-center"><Plus size={18}/> New chat</button>
   <div className="text-xs uppercase text-zinc-500">History</div>
   <div className="space-y-2 overflow-auto">{history.map((h,i)=><div key={i} className="text-sm p-2 rounded-lg hover:bg-white/5 truncate">{h}</div>)}</div>
   <div className="mt-auto text-sm text-zinc-400 flex gap-2"><Settings size={17}/> Provider settings</div>
  </aside>
  <section className="flex-1 max-w-6xl mx-auto w-full p-5 md:p-10">
   <header className="flex items-center justify-between mb-8"><div><h1 className="text-3xl font-bold">Ask anything.</h1><p className="text-zinc-400 mt-1">ChatGPT + Gemini + multi-AI fallback, in simple language.</p></div><div className="text-xs px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-300">No app credits</div></header>
   {!combined&&!loading&&<div className="grid md:grid-cols-3 gap-3 mb-8">{["Explain OSPF simply","Create a VTP topology","Compare RIP vs OSPF"].map(x=><button key={x} onClick={()=>setPrompt(x)} className="text-left p-4 rounded-2xl border border-white/10 bg-white/[.03] hover:bg-white/[.06]">{x}</button>)}</div>}
   {loading&&<div className="rounded-2xl border border-white/10 p-6 mb-5 animate-pulse">AI providers are thinking…</div>}
   {combined&&<div className="space-y-5 mb-6">
    <div className="rounded-2xl border border-white/10 bg-white/[.03] p-6"><h2 className="font-semibold mb-3">Combined answer</h2><pre className="whitespace-pre-wrap font-sans text-zinc-200 leading-7">{combined}</pre></div>
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6"><h2 className="font-semibold mb-3">Visual diagram</h2><pre className="text-sm text-cyan-200 whitespace-pre">{diagram}</pre></div>
    <div className="grid md:grid-cols-3 gap-3">{results.map(r=><div key={r.provider} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between mb-2"><b className="capitalize">{r.provider}</b><span className={r.ok?"text-emerald-400":"text-red-400"}>{r.ok?"Ready":"Unavailable"}</span></div><p className="text-sm text-zinc-400 whitespace-pre-wrap">{r.answer}</p></div>)}</div>
   </div>}
   <div className="sticky bottom-5 rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur p-3 shadow-2xl">
    <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask()}}} placeholder="Ask a question… e.g. Why do we need a router?" className="w-full bg-transparent outline-none resize-none min-h-20 p-2"/>
    <div className="flex justify-between items-center"><div className="flex gap-2 text-zinc-500"><Paperclip size={18}/><span className="text-xs px-2 py-1 rounded bg-white/5">OpenAI</span><span className="text-xs px-2 py-1 rounded bg-white/5">Gemini</span><span className="text-xs px-2 py-1 rounded bg-white/5">Fallback</span></div><button onClick={ask} className="bg-white text-black rounded-xl px-4 py-2 flex gap-2 items-center"><Send size={16}/>{loading?"Thinking":"Ask"}</button></div>
   </div>
  </section>
 </main>
}
