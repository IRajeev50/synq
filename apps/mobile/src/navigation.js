export const initialStack=()=>[{name:'home'}];
export const push=(stack,name,data)=>[...stack,{name,data}];
export const pop=stack=>stack.length>1?stack.slice(0,-1):stack;
export const current=stack=>stack[stack.length-1];
