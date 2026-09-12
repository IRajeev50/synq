const configured=process.env.EXPO_PUBLIC_API_URL;
export const API_URL=configured||'http://localhost:3000/api/v1';
export async function api(path,{method='GET',token,body}={}){const res=await fetch(`${API_URL}${path}`,{method,headers:{'content-type':'application/json',...(token?{authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});if(!res.ok)throw new Error((await res.json().catch(()=>({}))).title||`Request failed ${res.status}`);return res.status===204?null:res.json();}
export const isApiConfigured=Boolean(configured);
