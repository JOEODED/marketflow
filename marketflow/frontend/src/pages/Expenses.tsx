import {useState} from 'react'
import {useQuery,useQueryClient} from '@tanstack/react-query'
import {api,ngn,Expense} from '../api'
import {Card,btnPrimary,input} from '../ui'
const CATS=['Transportation','Electricity','Rent','Salaries','Maintenance','Packaging','Miscellaneous']
export default function Expenses(){
 const qc=useQueryClient()
 const {data:e=[]}=useQuery<Expense[]>({queryKey:['expenses'],queryFn:api.expenses})
 const [f,setF]=useState({category:CATS[0],note:'',amount:'',date:new Date().toISOString().slice(0,10)}),[flt,setFlt]=useState('All')
 const rows=e.filter(x=>flt==='All'||x.category===flt)
 const add=async(ev:React.FormEvent)=>{ev.preventDefault();await api.createExpense({category:f.category,note:f.note,amount:+f.amount,date:f.date});await qc.invalidateQueries({queryKey:['expenses']});setF({...f,note:'',amount:''})}
 return <main className="space-y-4"><h1 className="text-2xl font-semibold">Expenses</h1>
  <Card><form onSubmit={add} className="flex flex-wrap gap-2">
   <select value={f.category} onChange={x=>setF({...f,category:x.target.value})} aria-label="Category" className={`${input} bg-card`}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
   <input required value={f.note} onChange={x=>setF({...f,note:x.target.value})} placeholder="Description" className={`${input} flex-1`}/>
   <input required type="number" min={1} value={f.amount} onChange={x=>setF({...f,amount:x.target.value})} placeholder="Amount (₦)" className={`${input} w-36`}/>
   <input type="date" value={f.date} onChange={x=>setF({...f,date:x.target.value})} aria-label="Date" className={input}/><button className={btnPrimary}>Add expense</button></form></Card>
  <div className="flex items-center justify-between"><p className="text-sm text-mut">Total: <span className="font-semibold text-fg">{ngn(rows.reduce((s,x)=>s+x.amount,0))}</span></p>
   <select value={flt} onChange={x=>setFlt(x.target.value)} aria-label="Filter category" className={`${input} bg-card`}>{['All',...CATS].map(c=><option key={c}>{c}</option>)}</select></div>
  <Card className="p-0">{rows.length===0?<p className="p-5 text-mut">No expenses in this category.</p>:<ul className="divide-y divide-line">{rows.map(x=><li key={x.id} className="flex justify-between px-5 py-3 text-sm"><span>{x.note} <span className="text-mut">· {x.category} · {x.date}</span></span><span className="font-medium">{ngn(x.amount)}</span></li>)}</ul>}</Card></main>}
