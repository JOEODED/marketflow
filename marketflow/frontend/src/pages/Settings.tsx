import {useState} from 'react'
import {Card,btnPrimary,input} from '../ui'
const load=()=>{try{return JSON.parse(localStorage.getItem('mf-settings')||'')}catch{return {name:'',currency:'NGN',vat:'7.5'}}}
export default function Settings(){
 const [s,setS]=useState(load()),[saved,setSaved]=useState(false)
 return <main className="space-y-4"><h1 className="text-2xl font-semibold">Settings</h1>
  <Card className="max-w-lg"><form className="space-y-3" onSubmit={e=>{e.preventDefault();localStorage.setItem('mf-settings',JSON.stringify(s));setSaved(true)}}>
   <label className="block text-sm">Business name<input value={s.name} onChange={e=>{setSaved(false);setS({...s,name:e.target.value})}} className={`${input} mt-1 w-full`}/></label>
   <label className="block text-sm">Currency<select value={s.currency} onChange={e=>setS({...s,currency:e.target.value})} className={`${input} mt-1 w-full bg-card`}>{['NGN','GHS','KES','USD'].map(c=><option key={c}>{c}</option>)}</select></label>
   <label className="block text-sm">VAT rate (%)<input type="number" step="0.1" value={s.vat} onChange={e=>setS({...s,vat:e.target.value})} className={`${input} mt-1 w-full`}/></label>
   <button className={btnPrimary}>Save changes</button>{saved&&<p className="text-sm text-emerald-400">Changes saved.</p>}</form></Card></main>}
