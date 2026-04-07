export interface Env {
  STORE: KVNamespace;
  DB: D1Database;
  SERVICE_NAME: string;
  VERSION: string;
}
const SVC = "roadview";

function json(d: unknown, s = 200) {
  return new Response(JSON.stringify(d,null,2),{status:s,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","X-BlackRoad-Service":SVC}});
}
async function track(env: Env, req: Request, path: string) {
  const cf=(req as any).cf||{};
  env.DB.prepare("INSERT INTO analytics(subdomain,path,country,ua,ts)VALUES(?,?,?,?,?)").bind(SVC,path,cf.country||"",req.headers.get("User-Agent")?.slice(0,150)||"",Date.now()).run().catch(()=>{});
}

async function search(env: Env, q: string): Promise<{source:string;title:string;excerpt:string;score:number;url:string}[]> {
  if(!q||q.length<2)return[];
  const results: {source:string;title:string;excerpt:string;score:number;url:string}[]=[];
  // Search codex
  try{
    const {results:codex}=await env.DB.prepare(
      "SELECT id,title,body,category,notebook_page FROM codex_entries WHERE title LIKE ? OR body LIKE ? LIMIT 5"
    ).bind(`%${q}%`,`%${q}%`).all();
    for(const r of codex as any[])results.push({source:"codex",title:r.title,excerpt:r.body?.slice(0,120)+"...",score:0.9,url:`https://codex.blackroad.io`});
  }catch{}
  // Search signals
  try{
    const {results:sigs}=await env.DB.prepare(
      "SELECT title,summary,source,url FROM signals_log WHERE title LIKE ? OR summary LIKE ? ORDER BY relevance_score DESC LIMIT 5"
    ).bind(`%${q}%`,`%${q}%`).all();
    for(const r of sigs as any[])results.push({source:"signals:"+r.source,title:r.title||"",excerpt:r.summary?.slice(0,120)||"",score:0.7,url:r.url||""});
  }catch{}
  // Search roadlog
  try{
    const {results:logs}=await env.DB.prepare(
      "SELECT title,body,category FROM roadlog_entries WHERE title LIKE ? OR body LIKE ? LIMIT 3"
    ).bind(`%${q}%`,`%${q}%`).all();
    for(const r of logs as any[])results.push({source:"roadlog",title:r.title,excerpt:r.body?.slice(0,120)+"...",score:0.6,url:`https://roadlog.blackroad.io`});
  }catch{}
  // Search math
  try{
    const {results:math}=await env.DB.prepare(
      "SELECT label,value,type FROM math_log WHERE label LIKE ? LIMIT 3"
    ).bind(`%${q}%`).all();
    for(const r of math as any[])results.push({source:"math",title:r.label,excerpt:`${r.type}: value = ${r.value}`,score:0.8,url:`https://math.blackroad.io`});
  }catch{}
  return results.sort((a,b)=>b.score-a.score);
}

function page(): Response {
  const html=`<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><title>RoadView — BlackRoad Search</title>
<meta name="description" content="Search across BlackRoad OS. Codex, signals, roadlog, math — all in one place.">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#030303;--card:#0a0a0a;--border:#111;--text:#f0f0f0;--sub:#444;--green:#00E676;--grad:linear-gradient(90deg,#00E676,#3E84FF,#FF00D4)}
html,body{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Space Grotesk',sans-serif}
.grad-bar{height:2px;background:var(--grad)}
.hero{text-align:center;padding:60px 20px 40px}
h1{font-size:2.5rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.sub{font-size:.75rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-bottom:32px}
.search-wrap{max-width:680px;margin:0 auto;padding:0 20px}
.search-bar{display:flex;gap:8px;margin-bottom:20px}
.search-bar input{flex:1;padding:14px 18px;background:var(--card);border:1px solid var(--border);border-radius:10px;color:var(--text);font-family:'Space Grotesk',sans-serif;font-size:1rem;outline:none;transition:border-color .15s}
.search-bar input:focus{border-color:#00E676}
.search-bar button{padding:14px 22px;background:#00E676;color:#000;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:.9rem}
.sources{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.src{padding:4px 12px;background:var(--card);border:1px solid var(--border);border-radius:20px;font-size:.68rem;font-family:'JetBrains Mono',monospace;color:var(--sub)}
.results{display:flex;flex-direction:column;gap:10px}
.result{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:16px;transition:border-color .15s}
.result:hover{border-color:#1a1a1a}
.result-source{font-size:.65rem;font-family:'JetBrains Mono',monospace;color:#00E676;text-transform:uppercase;margin-bottom:5px}
.result-title{font-weight:600;font-size:.95rem;margin-bottom:5px}
.result-excerpt{font-size:.78rem;color:var(--sub);line-height:1.5}
.result-url{font-size:.65rem;font-family:'JetBrains Mono',monospace;color:#333;margin-top:6px}
.empty{text-align:center;color:var(--sub);padding:40px;font-size:.85rem}
.score-bar{height:2px;background:var(--border);border-radius:1px;margin-top:10px}
.score-fill{height:2px;border-radius:1px;background:var(--grad)}
</style></head><body>
<div class="grad-bar"></div>
<div class="hero">
  <h1>RoadView</h1>
  <div class="sub">search your codex · signals · roadlog · math pipeline</div>
</div>
<div class="search-wrap">
  <div class="search-bar">
    <input type="text" id="q" placeholder="Search anything — riemann, G(n), convoy, signals..." autocomplete="off">
    <button onclick="doSearch()">Search</button>
  </div>
  <div class="sources">
    <span class="src">codex</span><span class="src">signals</span><span class="src">roadlog</span><span class="src">math</span>
  </div>
  <div id="results"></div>
</div>
<script src="https://cdn.blackroad.io/br.js"></script>
<script>
async function doSearch(){
  var q=document.getElementById('q').value.trim();if(!q)return;
  document.getElementById('results').innerHTML='<div class="empty">Searching...</div>';
  var r=await fetch('/api/search?q='+encodeURIComponent(q));
  var d=await r.json();
  if(!d.results||!d.results.length){document.getElementById('results').innerHTML='<div class="empty">No results for "'+q+'" — try codex, signals, or math terms.</div>';return;}
  document.getElementById('results').innerHTML='<div class="results">'+d.results.map(function(r){
    return '<div class="result">'
      +'<div class="result-source">'+r.source+'</div>'
      +'<div class="result-title">'+r.title+'</div>'
      +(r.excerpt?'<div class="result-excerpt">'+r.excerpt+'</div>':'')
      +(r.url?'<div class="result-url">'+r.url+'</div>':'')
      +'<div class="score-bar"><div class="score-fill" style="width:'+(r.score*100)+'%"></div></div>'
      +'</div>';
  }).join('')+'</div>';
}
document.getElementById('q').addEventListener('keydown',function(e){if(e.key==='Enter')doSearch();});
var params=new URLSearchParams(location.search);
if(params.get('q')){document.getElementById('q').value=params.get('q');doSearch();}
</script>
</body></html>`;
  return new Response(html,{headers:{"Content-Type":"text/html;charset=UTF-8"}});
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*"}});
    const url=new URL(req.url);
    const path=url.pathname;
    track(env,req,path);
    if(path==="/health")return json({service:SVC,status:"ok",version:env.VERSION,ts:Date.now()});
    if(path==="/api/search"){
      const q=url.searchParams.get("q")||"";
      const results=await search(env,q);
      return json({query:q,results,count:results.length,sources:["codex","signals","roadlog","math"]});
    }
    return page();
  }
};
