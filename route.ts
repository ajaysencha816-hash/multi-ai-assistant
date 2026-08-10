import {NextResponse} from "next/server";
import {askOpenAI,askGemini,demo} from "@/lib/providers";
export async function POST(req:Request){
  try{
    const {prompt,providers=["openai","gemini","demo"]}=await req.json();
    if(!prompt?.trim()) return NextResponse.json({error:"Enter a question"},{status:400});
    const results=await Promise.all(providers.map(async(p:string)=>{
      try{
        const answer=p==="openai"?await askOpenAI(prompt):p==="gemini"?await askGemini(prompt):demo(prompt);
        return {provider:p,answer,ok:true};
      }catch(e){return {provider:p,answer:(e as Error).message,ok:false};}
    }));
    const good=results.filter(x=>x.ok);
    const combined=good.length?good.map(x=>x.answer).join("\n\n---\n\n"):demo(prompt);
    const diagram=prompt.toLowerCase().match(/router|switch|vlan|ospf|rip|network|topology|flow|process/)?`[User]\n   ↓\n[AI Orchestrator]\n   ↓\n[Providers]\n ├─ OpenAI\n ├─ Gemini\n └─ Demo/Fallback\n   ↓\n[Combined Answer]`:"[Question] → [AI Orchestrator] → [Answer]";
    return NextResponse.json({results,combined,diagram});
  }catch(e){return NextResponse.json({error:(e as Error).message},{status:500});}
}
