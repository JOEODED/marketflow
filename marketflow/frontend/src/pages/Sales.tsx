import {useQuery} from '@tanstack/react-query'
import {api,ngn,Sale} from '../api'
import {Card} from '../ui'
export default function Sales(){
 const {data:s=[]}=useQuery<Sale[]>({queryKey:['sales'],queryFn:api.sales})
 return <main className="space-y-4"><h1 className="text-2xl font-semibold">Sales</h1>
  <Card className="overflow-x-auto p-0">{s.length===0?<p className="p-5 text-mut">No sales yet. Complete a sale in Point of sale and it will appear here.</p>:
  <table className="w-full min-w-[480px] text-left text-sm"><thead className="text-mut"><tr>{['Date','Items','Payment','Total'].map(h=><th key={h} className="px-5 py-3 font-normal">{h}</th>)}</tr></thead>
  <tbody className="divide-y divide-line">{s.map(x=><tr key={x.id}><td className="px-5 py-3">{x.date}</td><td className="px-5 py-3">{x.items}</td><td className="px-5 py-3">{x.pay}</td><td className="px-5 py-3 font-medium">{ngn(x.total)}</td></tr>)}</tbody></table>}</Card></main>}
