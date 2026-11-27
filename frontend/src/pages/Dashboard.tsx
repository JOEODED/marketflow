import {useQuery} from '@tanstack/react-query'
import {Area,AreaChart,Bar,BarChart,CartesianGrid,Cell,Legend,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts'
import {api,ngn,Sale} from '../api'
import {Card,Pill} from '../ui'
const C=['#2563eb','#14b8a6','#f59e0b','#8b5cf6','#ef4444','#64748b']
const tip={background:'var(--card)',border:'1px solid var(--line)',borderRadius:12,color:'var(--fg)'}
const ax={stroke:'var(--mut)',fontSize:11,tickLine:false,axisLine:false}
const Stat=({label,value,spark,color}:{label:string;value:string;spark?:number[];color:string})=><Card><p className="text-sm text-mut">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
 <div className="mt-2 h-10">{spark&&<ResponsiveContainer><AreaChart data={spark.map(v=>({v}))}><Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={.12} strokeWidth={2}/></AreaChart></ResponsiveContainer>}</div></Card>
export default function Dashboard(){
 const {data:p=[]}=useQuery({queryKey:['products'],queryFn:api.products})
 const {data:rev=[]}=useQuery({queryKey:['revenue'],queryFn:api.revenue})
 const {data:sales=[]}=useQuery<Sale[]>({queryKey:['sales'],queryFn:api.sales})
 const low=p.filter(x=>x.qty>0&&x.qty<=x.min),out=p.filter(x=>x.qty===0)
 const sum=(k:'revenue'|'profit')=>rev.reduce((s,r)=>s+r[k],0)
 const cats=[...new Set(p.map(x=>x.category))]
 const val=cats.map(c=>({name:c,value:p.filter(x=>x.category===c).reduce((s,x)=>s+x.qty*x.cost,0)}))
 const lvl=cats.map(c=>{const g=p.filter(x=>x.category===c);return{name:c,'In stock':g.filter(x=>x.qty>x.min).length,Low:g.filter(x=>x.qty>0&&x.qty<=x.min).length,'Out of stock':g.filter(x=>x.qty===0).length}})
 const items=[...out,...low,...p.filter(x=>x.qty>x.min)].slice(0,6)
 return <main className="space-y-4">
  <div><h1 className="text-2xl font-semibold">Dashboard</h1><p className="text-sm text-mut">Sales, stock and profit for the last 14 days.</p></div>
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
   <Stat label="Total items" value={String(p.reduce((s,x)=>s+x.qty,0))} color={C[0]}/>
   <Stat label="Stock value" value={ngn(p.reduce((s,x)=>s+x.qty*x.cost,0))} color={C[1]}/>
   <Stat label="Sales (14 days)" value={ngn(sum('revenue'))} spark={rev.map(r=>r.revenue)} color={C[0]}/>
   <Stat label="Gross profit" value={ngn(sum('profit'))} spark={rev.map(r=>r.profit)} color={C[1]}/></div>
  <div className="grid gap-4 lg:grid-cols-3">
   <Card className="lg:col-span-2"><h2 className="font-medium">Sales performance</h2><div className="mt-3 h-64"><ResponsiveContainer><AreaChart data={rev}>
    <defs>{[0,1].map(i=><linearGradient key={i} id={`g${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C[i]} stopOpacity={.3}/><stop offset="100%" stopColor={C[i]} stopOpacity={0}/></linearGradient>)}</defs>
    <CartesianGrid stroke="var(--line)" vertical={false}/><XAxis dataKey="day" {...ax}/><YAxis {...ax} width={48}/><Tooltip formatter={(v:number)=>ngn(v)} contentStyle={tip}/><Legend/>
    <Area name="Revenue" type="monotone" dataKey="revenue" stroke={C[0]} strokeWidth={2} fill="url(#g0)"/><Area name="Profit" type="monotone" dataKey="profit" stroke={C[1]} strokeWidth={2} fill="url(#g1)"/></AreaChart></ResponsiveContainer></div></Card>
   <Card><h2 className="font-medium">Stock value by category</h2><div className="mt-3 h-64">{p.length===0?<p className="pt-20 text-center text-sm text-mut">Add products to see this chart.</p>:<ResponsiveContainer><PieChart><Pie data={val} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2} stroke="none">{val.map((_,i)=><Cell key={i} fill={C[i%6]}/>)}</Pie><Tooltip formatter={(v:number)=>ngn(v)} contentStyle={tip}/><Legend/></PieChart></ResponsiveContainer>}</div></Card></div>
  <div className="grid gap-4 lg:grid-cols-3">
   <Card className="lg:col-span-2"><h2 className="font-medium">Stock levels overview</h2><div className="mt-3 h-60"><ResponsiveContainer><BarChart data={lvl}><CartesianGrid stroke="var(--line)" vertical={false}/><XAxis dataKey="name" {...ax}/><YAxis {...ax} allowDecimals={false} width={32}/><Tooltip contentStyle={tip}/><Legend/>
    <Bar dataKey="In stock" stackId="a" fill={C[0]}/><Bar dataKey="Low" stackId="a" fill={C[2]}/><Bar dataKey="Out of stock" stackId="a" fill={C[4]} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Card>
   <Card><h2 className="font-medium">Recent activity</h2>{sales.length===0?<p className="mt-3 text-sm text-mut">No sales yet. They will appear here.</p>:<ul className="mt-3 divide-y divide-line">{sales.slice(0,5).map(s=><li key={s.id} className="py-2.5 text-sm"><p className="font-medium">{ngn(s.total)} <span className="font-normal text-mut">· {s.pay}</span></p><p className="text-xs text-mut">{s.items} items · {s.date}</p></li>)}</ul>}</Card></div>
  <Card className="overflow-x-auto"><h2 className="font-medium">Inventory items</h2>{items.length===0?<p className="mt-3 text-sm text-mut">No products yet. Add some in Inventory.</p>:
   <table className="mt-3 w-full min-w-[520px] text-left text-sm"><thead className="text-mut"><tr>{['Product','SKU','Category','Stock','Status'].map(h=><th key={h} className="py-2 font-normal">{h}</th>)}</tr></thead>
   <tbody className="divide-y divide-line">{items.map(x=><tr key={x.id}><td className="py-2.5 font-medium">{x.name}</td><td className="text-mut">{x.sku}</td><td>{x.category}</td><td>{x.qty}</td><td>{x.qty===0?<Pill tone="bad">Out of stock</Pill>:x.qty<=x.min?<Pill tone="warn">Low</Pill>:<Pill tone="ok">In stock</Pill>}</td></tr>)}</tbody></table>}</Card>
 </main>}
