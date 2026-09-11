import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

type Lead = {
  name?: unknown; company?: unknown; role?: unknown; email?: unknown; market?: unknown;
  project_type?: unknown; budget?: unknown; timeline?: unknown; objective?: unknown;
  context?: unknown; language?: unknown; website?: unknown; page?: unknown; recaptcha_token?: unknown;
  privacy_consent?: unknown;
};

const json = (status:number, body:unknown, origin?:string) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "content-type":"application/json; charset=utf-8",
    "cache-control":"no-store",
    "x-content-type-options":"nosniff",
    "referrer-policy":"no-referrer",
    ...(origin ? {"access-control-allow-origin":origin, "vary":"origin"} : {})
  }
});

const clean = (v:unknown,max:number) => String(v ?? "").trim().slice(0,max);
const allowed = (v:string, set:string[]) => set.includes(v) ? v : "";
const emailOK = (v:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 160;

function scoreLead(budget:string,timeline:string,type:string,objective:string,company:string,role:string){
  let s=0;
  s += ({"1500plus":28,"500-1500":24,"100-500":17,"under100":8,"undisclosed":10} as Record<string,number>)[budget] ?? 0;
  s += ({"90-180":18,"180plus":20,"30-90":14,"lt30":6} as Record<string,number>)[timeline] ?? 0;
  s += ({partnerships:22,advisory:18,orchestration:18,experience:14,other:7} as Record<string,number>)[type] ?? 0;
  s += Math.min(18, Math.floor(objective.length/70)*3);
  if(company.length>2) s+=6; if(role.length>2) s+=4;
  return Math.min(100,s);
}

async function verifyRecaptcha(token:string, secret:string, ip:string|null){
  const params=new URLSearchParams({secret,response:token}); if(ip) params.set("remoteip",ip);
  const r=await fetch("https://www.google.com/recaptcha/api/siteverify",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:params});
  if(!r.ok) return false;
  const out=await r.json();
  return Boolean(out.success) && (typeof out.score !== "number" || out.score >= 0.5) && (!out.action || out.action === "project_intake");
}

Deno.serve(async (req:Request) => {
  const origin=req.headers.get("origin") ?? "";
  const allowedOrigins=(Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map(s=>s.trim()).filter(Boolean);
  if(!origin || !allowedOrigins.includes(origin)) return json(403,{error:"origin_not_allowed"});

  if(req.method === "OPTIONS") return new Response(null,{status:204,headers:{
    "access-control-allow-origin":origin,"vary":"origin","access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"content-type","access-control-max-age":"86400"
  }});
  if(req.method !== "POST") return json(405,{error:"method_not_allowed"},origin);

  const type=req.headers.get("content-type") ?? "";
  if(!type.includes("application/json")) return json(415,{error:"json_required"},origin);
  const len=Number(req.headers.get("content-length") ?? 0); if(len > 12000) return json(413,{error:"payload_too_large"},origin);

  let body:Lead; try{body=await req.json();}catch{return json(400,{error:"invalid_json"},origin)}
  if(clean(body.website,200)) return json(200,{ok:true},origin); // honeypot: acknowledge without storing.
  if(body.privacy_consent !== "on" && body.privacy_consent !== true) return json(400,{error:"privacy_consent_required"},origin);

  const name=clean(body.name,100), company=clean(body.company,140), role=clean(body.role,120), email=clean(body.email,160).toLowerCase();
  const market=allowed(clean(body.market,40),["Saudi Arabia","GCC","MENA","International"]);
  const project_type=allowed(clean(body.project_type,40),["partnerships","advisory","orchestration","experience","other"]);
  const budget=allowed(clean(body.budget,40),["under100","100-500","500-1500","1500plus","undisclosed"]);
  const timeline=allowed(clean(body.timeline,40),["lt30","30-90","90-180","180plus"]);
  const objective=clean(body.objective,1400), context=clean(body.context,1000), language=allowed(clean(body.language,4),["en","ar","fr","es"]) || "en";
  if(!name || !emailOK(email) || !market || !project_type || !budget || !timeline || objective.length < 10) return json(422,{error:"validation_failed"},origin);

  const secret=Deno.env.get("RECAPTCHA_SECRET") ?? "";
  const token=clean(body.recaptcha_token,5000);
  if(!secret || !token) return json(503,{error:"recaptcha_not_configured"},origin);
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if(!await verifyRecaptcha(token,secret,ip)) return json(403,{error:"recaptcha_failed"},origin);

  const url=Deno.env.get("SUPABASE_URL")!; const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const lead_score=scoreLead(budget,timeline,project_type,objective,company,role);
  const { error }=await db.from("website_leads").insert({
    name,company:company||null,role:role||null,email,market,project_type,budget,timeline,objective,context:context||null,language,lead_score,
    source_page:clean(body.page,500)||null,user_agent:clean(req.headers.get("user-agent"),500)||null
  });
  if(error){console.error(error);return json(500,{error:"storage_failed"},origin)}
  return json(200,{ok:true,lead_score},origin);
});
