import {useState} from 'react'
import {NavLink,Outlet} from 'react-router-dom'
const links=[['/','Dashboard','▦'],['/inventory','Inventory','▤'],['/pos','Point of sale','◉'],['/sales','Sales','↗'],['/expenses','Expenses','₦'],['/suppliers','Suppliers','⌂'],['/reports','Reports','▥'],['/settings','Settings','⚙']]
const b='rounded-lg border border-line px-3 py-1.5 text-sm text-mut hover:text-fg'
export default function Layout(){
 const [dark,setDark]=useState(false)
 const toggle=()=>{document.documentElement.classList.toggle('dark');setDark(!dark)}
 const out=()=>{localStorage.removeItem('mf-token');location.href='/login'}
 const actions=<><button onClick={toggle} className={b} aria-label="Toggle light or dark theme">{dark?'Light':'Dark'}</button><button onClick={out} className={b}>Log out</button></>
 return <div className="min-h-screen md:flex">
  <aside className="border-b border-line bg-card md:sticky md:top-0 md:flex md:h-screen md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
   <div className="flex items-center gap-2 px-4 py-3 md:py-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-acc font-bold text-white">M</span><span className="font-semibold">MarketFlow</span><div className="ml-auto flex gap-2 md:hidden">{actions}</div></div>
   <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:px-3">
    {links.map(([to,l,i])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${isActive?'bg-acc/10 font-medium text-acc':'text-mut hover:bg-bg hover:text-fg'}`}><span aria-hidden className="w-4 text-center">{i}</span>{l}</NavLink>)}
   </nav>
   <div className="hidden gap-2 p-3 md:flex">{actions}</div>
  </aside>
  <div className="min-w-0 flex-1 px-4 pb-10 pt-5 md:px-8"><Outlet/></div></div>}
