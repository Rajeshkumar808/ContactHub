const BASE=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
export async function api(path,{method='GET',body,token}={}){const r=await fetch(`${BASE}${path}`,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json().catch(()=>({message:'Unexpected server response'}));if(!r.ok)throw new Error(data.message||'Request failed');return data;}
export const oauthUrl=provider=>`${BASE}/auth/${provider}`;
