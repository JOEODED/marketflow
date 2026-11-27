import {useState} from 'react'
import {useQueryClient} from '@tanstack/react-query'
import {api} from '../api'
import {Card,btnPrimary,input} from '../ui'
const empty={name:'',sku:'',category:'',cost:'',price:'',qty:'0',min:'0'}
const labels:Record<string,string>={name:'Product name',sku:'SKU',category:'Category',cost:'Cost price (₦)',price:'Selling price (₦)',qty:'Opening stock',min:'Minimum stock'}
export default function AddProduct(){
 const qc=useQueryClient();const [f,setF]=useState(empty),[err,setErr]=useState('')
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setErr('')
  try{await api.createProduct({name:f.name,sku:f.sku,category:f.category,purchasePrice:+f.cost,sellingPrice:+f.price,quantity:+f.qty,minStock:+f.min});setF(empty);await qc.invalidateQueries({queryKey:['products']})}catch(x){setErr((x as Error).message)}}
 return <Card><h2 className="mb-3 font-medium">Add product</h2><form onSubmit={submit} className="grid gap-2 sm:grid-cols-4">
  {(Object.keys(empty) as (keyof typeof empty)[]).map(k=><input key={k} required={k!=='category'} type={['cost','price','qty','min'].includes(k)?'number':'text'} min={0} step="any" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})} placeholder={labels[k]} aria-label={labels[k]} className={input}/>)}
  <button className={btnPrimary}>Add product</button></form>{err&&<p role="alert" className="mt-2 text-sm text-red-400">{err}</p>}</Card>}
