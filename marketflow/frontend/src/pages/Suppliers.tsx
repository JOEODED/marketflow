import {useState} from 'react'
import {useQuery,useQueryClient} from '@tanstack/react-query'
import {api,Supplier} from '../api'
import {Card,btnPrimary,input} from '../ui'
export default function Suppliers(){
 const qc=useQueryClient()
 const {data:s=[]}=useQuery<Supplier[]>({queryKey:['suppliers'],queryFn:api.suppliers})
 const [f,setF]=useState({name:'',phone:'',address:''})
 const add=(e:React.FormEvent)=>{e.preventDefault();qc.setQueryData<Supplier[]>(['suppliers'],o=>[{id:String(Date.now()),...f},...(o||[])]);setF({name:'',phone:'',address:''})}
 return <main className="space-y-4"><h1 className="text-2xl font-semibold">Suppliers</h1>
  <Card><form onSubmit={add} className="flex flex-wrap gap-2">
   <input required value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="Supplier name" className={`${input} flex-1`}/>
   <input required value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} placeholder="Phone" className={input}/>
   <input value={f.address} onChange={e=>setF({...f,address:e.target.value})} placeholder="Address" className={`${input} flex-1`}/><button className={btnPrimary}>Add supplier</button></form></Card>
  <Card className="p-0"><ul className="divide-y divide-line">{s.map(x=><li key={x.id} className="px-5 py-3 text-sm"><p className="font-medium">{x.name}</p><p className="text-mut">{x.phone} · {x.address}</p></li>)}</ul></Card></main>}
