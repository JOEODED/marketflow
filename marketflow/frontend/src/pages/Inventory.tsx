import {useState} from 'react'
import {useQuery} from '@tanstack/react-query'
import {api,ngn} from '../api'
import AddProduct from './AddProduct'
import {Card,Pill,btn} from '../ui'
export default function Inventory(){
 const {data:p=[],isLoading}=useQuery({queryKey:['products'],queryFn:api.products})
 const [q,setQ]=useState(''),[cat,setCat]=useState('All')
 const cats=['All',...new Set(p.map(x=>x.category))]
 const rows=p.filter(x=>(cat==='All'||x.category===cat)&&(x.name+x.sku).toLowerCase().includes(q.toLowerCase()))
 const exportCsv=()=>{const csv=['Name,SKU,Category,Price,Cost,Qty',...rows.map(r=>[r.name,r.sku,r.category,r.price,r.cost,r.qty].join(','))].join('\n')
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='inventory.csv';a.click()}
 return <main className="space-y-4">
  <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-semibold">Inventory</h1><p className="text-sm text-mut">Track what you have and what is running out.</p></div>
   <div className="flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or SKU" aria-label="Search products" className="rounded-full border border-line bg-transparent px-4 py-2 text-sm"/>
   <select value={cat} onChange={e=>setCat(e.target.value)} aria-label="Filter by category" className="rounded-full border border-line bg-card px-3 py-2 text-sm">{cats.map(c=><option key={c}>{c}</option>)}</select>
   <button onClick={exportCsv} className={btn}>Export CSV</button></div></div>
  <AddProduct/>
  <Card className="overflow-x-auto p-0">{isLoading?<p className="p-5 text-mut">Loading products…</p>:rows.length===0?<p className="p-5 text-mut">No products match your search. Clear the filters to see everything.</p>:
  <table className="w-full min-w-[640px] text-left text-sm"><thead className="text-mut"><tr>{['Product','SKU','Category','Price','Qty','Status'].map(h=><th key={h} className="px-5 py-3 font-normal">{h}</th>)}</tr></thead>
   <tbody className="divide-y divide-line">{rows.map(x=><tr key={x.id}><td className="px-5 py-3 font-medium">{x.name}</td><td className="px-5 py-3 text-mut">{x.sku}</td><td className="px-5 py-3">{x.category}</td><td className="px-5 py-3">{ngn(x.price)}</td><td className="px-5 py-3">{x.qty}</td>
    <td className="px-5 py-3">{x.qty===0?<Pill tone="bad">Out of stock</Pill>:x.qty<=x.min?<Pill tone="warn">Low</Pill>:<Pill tone="ok">In stock</Pill>}</td></tr>)}</tbody></table>}</Card></main>}
