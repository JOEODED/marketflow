import {useState} from 'react'
import {useQuery,useQueryClient} from '@tanstack/react-query'
import {api,ngn,Product} from '../api'
import {Card,btnPrimary} from '../ui'
const TAX=0.075
export default function POS(){
 const qc=useQueryClient()
 const {data:p=[]}=useQuery({queryKey:['products'],queryFn:api.products})
 const [q,setQ]=useState(''),[cart,setCart]=useState<Record<string,number>>({}),[pay,setPay]=useState('Cash'),[msg,setMsg]=useState('')
 const add=(x:Product)=>setCart(c=>({...c,[x.id]:Math.min((c[x.id]||0)+1,x.qty)}))
 const set=(id:string,n:number)=>setCart(c=>{const{[id]:_,...rest}=c;return n>0?{...rest,[id]:n}:rest})
 const lines=p.filter(x=>cart[x.id]),sub=lines.reduce((s,x)=>s+x.price*cart[x.id],0),tax=Math.round(sub*TAX)
 const PAY:Record<string,string>={Cash:'CASH','Bank transfer':'TRANSFER',Card:'CARD',Other:'OTHER'}
 const done=async()=>{try{await api.createSale(Object.entries(cart).map(([productId,quantity])=>({productId,quantity})),PAY[pay]);await qc.invalidateQueries();setMsg(`Sale of ${ngn(sub+tax)} paid by ${pay.toLowerCase()} recorded.`);setCart({})}catch(e){setMsg((e as Error).message)}}
 return <main className="grid gap-4 lg:grid-cols-3">
  <div className="space-y-3 lg:col-span-2"><h1 className="text-2xl font-semibold">Point of sale</h1>
   <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products" aria-label="Search products" className="w-full rounded-full border border-line bg-transparent px-4 py-2 text-sm"/>
   <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{p.filter(x=>(x.name+x.sku).toLowerCase().includes(q.toLowerCase())).map(x=>
    <button key={x.id} disabled={x.qty===0||(cart[x.id]||0)>=x.qty} onClick={()=>{setMsg('');add(x)}} className="rounded-2xl border border-line bg-card p-4 text-left hover:border-acc disabled:opacity-40">
     <p className="font-medium">{x.name}</p><p className="mt-1 text-acc">{ngn(x.price)}</p><p className="text-xs text-mut">{x.qty===0?'Out of stock':`${x.qty} available`}</p></button>)}</div></div>
  <Card className="h-fit"><h2 className="font-medium">Current sale</h2>
   {lines.length===0?<p className="mt-3 text-sm text-mut">{msg||'Tap a product to add it to the sale.'}</p>:<>
   <ul className="mt-3 divide-y divide-line">{lines.map(x=><li key={x.id} className="flex items-center justify-between gap-2 py-2 text-sm"><span className="flex-1">{x.name}</span>
    <input type="number" min={0} max={x.qty} value={cart[x.id]} onChange={e=>set(x.id,Math.min(+e.target.value,x.qty))} aria-label={`Quantity of ${x.name}`} className="w-14 rounded-lg border border-line bg-transparent px-2 py-1"/><span className="w-24 text-right">{ngn(x.price*cart[x.id])}</span></li>)}</ul>
   <dl className="mt-3 space-y-1 text-sm"><div className="flex justify-between"><dt className="text-mut">Subtotal</dt><dd>{ngn(sub)}</dd></div><div className="flex justify-between"><dt className="text-mut">VAT (7.5%)</dt><dd>{ngn(tax)}</dd></div><div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{ngn(sub+tax)}</dd></div></dl>
   <select value={pay} onChange={e=>setPay(e.target.value)} aria-label="Payment method" className="mt-3 w-full rounded-xl border border-line bg-card px-3 py-2 text-sm">{['Cash','Bank transfer','Card','Other'].map(m=><option key={m}>{m}</option>)}</select>
   <button onClick={done} className={`${btnPrimary} mt-3 w-full`}>Complete sale</button>{msg&&<p role="alert" className="mt-2 text-sm text-red-400">{msg}</p>}</>}</Card></main>}
