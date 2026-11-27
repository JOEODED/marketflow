export type Product={id:string;name:string;sku:string;category:string;price:number;cost:number;qty:number;min:number}
export type Sale={id:string;date:string;total:number;pay:string;items:number}
export type Expense={id:string;date:string;category:string;note:string;amount:number}
export type Supplier={id:string;name:string;phone:string;address:string}
export const ngn=(n:number)=>new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(n)
const BASE=import.meta.env.VITE_API_URL||'http://localhost:8080'
export const token=()=>localStorage.getItem('mf-token')
async function req<T>(path:string,init:RequestInit={}):Promise<T>{
 const r=await fetch(BASE+path,{...init,headers:{'Content-Type':'application/json',...(token()?{Authorization:`Bearer ${token()}`}:{})}})
 if(r.status===401&&token()){localStorage.removeItem('mf-token');location.href='/login'}
 if(!r.ok){const b=await r.json().catch(()=>({}));throw new Error(b.error||`Request failed (${r.status})`)}
 return r.json()}
const send=(method:string,body:unknown)=>({method,body:JSON.stringify(body)})
const toProduct=(p:any):Product=>({id:p.id,name:p.name,sku:p.sku,category:p.category||'General',price:+p.sellingPrice,cost:+p.purchasePrice,qty:p.quantity,min:p.minStock})
// Suppliers have no backend module yet: kept in memory for the session.
const suppliers:Supplier[]=[]
export const api={
 login:(email:string,password:string)=>req<{token:string}>('/api/auth/login',send('POST',{email,password})),
 register:(b:{businessName:string;fullName:string;email:string;password:string})=>req<{token:string}>('/api/auth/register',send('POST',b)),
 products:async():Promise<Product[]>=>(await req<any[]>('/api/products')).map(toProduct),
 createProduct:(b:object)=>req('/api/products',send('POST',b)),
 sales:async():Promise<Sale[]>=>(await req<any[]>('/api/sales')).map(s=>({id:s.id,date:new Date(s.createdAt).toLocaleString('en-NG'),total:+s.total,pay:s.paymentMethod,items:s.items.reduce((n:number,i:any)=>n+i.quantity,0)})),
 createSale:(items:{productId:string;quantity:number}[],paymentMethod:string)=>req('/api/sales',send('POST',{items,paymentMethod})),
 revenue:async()=>{const s=await req<any[]>('/api/sales');return Array.from({length:14},(_,i)=>{const d=new Date(Date.now()-(13-i)*864e5),day=s.filter(x=>new Date(x.createdAt).toDateString()===d.toDateString()),r=day.reduce((a,x)=>a+ +x.subtotal,0);return{day:d.toLocaleDateString('en-NG',{day:'numeric',month:'short'}),revenue:r,profit:r-day.reduce((a,x)=>a+ +x.cogs,0)}})},
 expenses:async():Promise<Expense[]>=>(await req<any[]>('/api/expenses')).map(e=>({id:e.id,date:e.expenseDate,category:e.category,note:e.description||'',amount:+e.amount})),
 createExpense:(e:{category:string;note:string;amount:number;date:string})=>req('/api/expenses',send('POST',{category:e.category,description:e.note,amount:e.amount,expenseDate:e.date,paymentMethod:'CASH'})),
 suppliers:async():Promise<Supplier[]>=>suppliers}
