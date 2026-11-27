import {useQuery} from '@tanstack/react-query'
import {Area,AreaChart,Cell,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis} from 'recharts'
import {api,ngn} from '../api'
import {Card,Kpi,Pill} from '../ui'
const COLORS=['#f5b544','#d98e2b','#9a6a1f','#6b5a3a','#c9c9cf']
export default function Dashboard(){
 const {data:p=[]}=useQuery({queryKey:['products'],queryFn:api.products})
 const {data:rev=[]}=useQuery({queryKey:['revenue'],queryFn:api.revenue})
 const low=p.filter(x=>x.qty>0&&x.qty<=x.min),out=p.filter(x=>x.qty===0)
 const cats=Object.entries(p.reduce<Record<string,number>>((a,x)=>({...a,[x.category]:(a[x.category]||0)+x.qty*x.cost}),{})).map(([name,value])=>({name,value}))
 const sum=(k:'revenue'|'profit')=>rev.reduce((s,r)=>s+r[k],0)
 return <main className="space-y-4">
  <div><h1 className="text-2xl font-semibold">Dashboard</h1><p className="text-sm text-mut">Sales, stock and profit for the last 14 days.</p></div>
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
   <Kpi label="Sales today" value={ngn(rev.at(-1)?.revenue??0)}/><Kpi label="Gross profit" value={ngn(sum('profit'))} note="Last 14 days"/>
   <Kpi label="Stock value" value={ngn(p.reduce((s,x)=>s+x.qty*x.cost,0))} note={`${p.length} products`}/><Kpi label="Needs restocking" value={String(low.length+out.length)} note={`${out.length} out of stock`}/></div>
  <div className="grid gap-4 lg:grid-cols-3">
   <Card className="lg:col-span-2"><h2 className="font-medium">Revenue</h2><div className="mt-3 h-64"><ResponsiveContainer><AreaChart data={rev}>
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f5b544" stopOpacity={.35}/><stop offset="100%" stopColor="#f5b544" stopOpacity={0}/></linearGradient></defs>
    <XAxis dataKey="day" stroke="#8b8b93" fontSize={11} tickLine={false} axisLine={false}/><Tooltip formatter={(v:number)=>ngn(v)} contentStyle={{background:'#141416',border:'1px solid #26262a',borderRadius:12}}/>
    <Area type="monotone" dataKey="revenue" stroke="#f5b544" strokeWidth={2} fill="url(#g)"/></AreaChart></ResponsiveContainer></div></Card>
   <Card><h2 className="font-medium">Stock value by category</h2><div className="mt-3 h-64"><ResponsiveContainer><PieChart>
    <Pie data={cats} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">{cats.map((_,i)=><Cell key={i} fill={COLORS[i%5]}/>)}</Pie>
    <Tooltip formatter={(v:number)=>ngn(v)} contentStyle={{background:'#141416',border:'1px solid #26262a',borderRadius:12}}/></PieChart></ResponsiveContainer></div></Card></div>
  <Card><h2 className="font-medium">Low and out of stock</h2>
   {low.length+out.length===0?<p className="mt-3 text-mut">Every product is above its minimum level.</p>:<ul className="mt-3 divide-y divide-line">{[...out,...low].map(x=><li key={x.id} className="flex items-center justify-between py-2.5 text-sm"><span>{x.name}</span><span className="flex items-center gap-3 text-mut">{x.qty} left (min {x.min})<Pill tone={x.qty===0?'bad':'warn'}>{x.qty===0?'Out of stock':'Low'}</Pill></span></li>)}</ul>}</Card>
 </main>}
