import {ReactNode} from 'react'
export const Card=({children,className=''}:{children:ReactNode;className?:string})=><section className={`rounded-2xl border border-line bg-card p-5 ${className}`}>{children}</section>
export const Kpi=({label,value,note}:{label:string;value:string;note?:string})=><Card><p className="text-sm text-mut">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>{note&&<p className="mt-1 text-xs text-mut">{note}</p>}</Card>
export const Pill=({tone,children}:{tone:'ok'|'warn'|'bad';children:ReactNode})=>{const c={ok:'text-emerald-400 bg-emerald-400/10',warn:'text-acc bg-acc/10',bad:'text-red-400 bg-red-400/10'}[tone];return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c}`}>{children}</span>}
export const btn='rounded-full border border-line px-4 py-2 text-sm hover:border-acc'
export const btnPrimary='rounded-full bg-acc px-4 py-2 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40'
export const download=(name:string,csv:string)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=name;a.click()}
export const input='rounded-xl border border-line bg-transparent px-3 py-2 text-sm'
