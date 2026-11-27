import {useQueryClient} from '@tanstack/react-query'
import {api,Product,Sale,Expense} from '../api'
import {Card,btn,download} from '../ui'
export default function Reports(){
 const qc=useQueryClient()
 const get=<T,>(k:string)=>qc.fetchQuery({queryKey:[k],queryFn:(api as any)[k]}) as Promise<T[]>
 const items:[string,string,()=>void][]=[
  ['Inventory valuation','Stock on hand at cost price.',async()=>download('inventory-valuation.csv',['Product,Qty,Cost,Value',...(await get<Product>('products')).map(p=>[p.name,p.qty,p.cost,p.qty*p.cost].join(','))].join('\n'))],
  ['Sales','Every sale recorded this session.',async()=>download('sales.csv',['Date,Items,Payment,Total',...(await get<Sale>('sales')).map(s=>[s.date.replace(',',''),s.items,s.pay,s.total].join(','))].join('\n'))],
  ['Expenses','All recorded expenses.',async()=>download('expenses.csv',['Date,Category,Note,Amount',...(await get<Expense>('expenses')).map(x=>[x.date,x.category,x.note,x.amount].join(','))].join('\n'))]]
 return <main className="space-y-4"><h1 className="text-2xl font-semibold">Reports</h1><div className="grid gap-4 md:grid-cols-3">{items.map(([t,d,fn])=><Card key={t}><h2 className="font-medium">{t}</h2><p className="mt-1 text-sm text-mut">{d}</p><button onClick={fn} className={`${btn} mt-4`}>Download CSV</button></Card>)}</div></main>}
