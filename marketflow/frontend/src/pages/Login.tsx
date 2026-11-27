import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {api} from '../api'
import {Card,btnPrimary,input} from '../ui'
export default function Login(){
 const nav=useNavigate();const [reg,setReg]=useState(false),[err,setErr]=useState(''),[f,setF]=useState({businessName:'',fullName:'',email:'',password:''})
 const submit=async(e:React.FormEvent)=>{e.preventDefault();setErr('')
  try{const r=reg?await api.register(f):await api.login(f.email,f.password);localStorage.setItem('mf-token',r.token);nav('/')}catch(x){setErr((x as Error).message)}}
 const set=(k:keyof typeof f)=>(e:React.ChangeEvent<HTMLInputElement>)=>setF({...f,[k]:e.target.value})
 return <main className="grid min-h-screen place-items-center px-4"><Card className="w-full max-w-sm">
  <h1 className="text-2xl font-semibold">{reg?'Create your business account':'Sign in to MarketFlow'}</h1>
  <form className="mt-5 space-y-3" onSubmit={submit}>
   {reg&&<><input required placeholder="Business name" value={f.businessName} onChange={set('businessName')} className={`${input} w-full`}/><input required placeholder="Your full name" value={f.fullName} onChange={set('fullName')} className={`${input} w-full`}/></>}
   <input required type="email" placeholder="Email" value={f.email} onChange={set('email')} className={`${input} w-full`}/>
   <input required type="password" minLength={reg?8:1} placeholder="Password" value={f.password} onChange={set('password')} className={`${input} w-full`}/>
   {err&&<p role="alert" className="text-sm text-red-400">{err}</p>}
   <button className={`${btnPrimary} w-full`}>{reg?'Create account':'Sign in'}</button></form>
  <button onClick={()=>{setReg(!reg);setErr('')}} className="mt-3 text-sm text-acc">{reg?'Already have an account? Sign in':'New here? Create an account'}</button></Card></main>}
