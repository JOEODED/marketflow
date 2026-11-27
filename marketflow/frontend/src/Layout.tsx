import {useState} from 'react'
import {NavLink,Outlet} from 'react-router-dom'
const links=[['/','Dashboard'],['/inventory','Inventory'],['/pos','Point of sale'],['/sales','Sales'],['/expenses','Expenses'],['/suppliers','Suppliers'],['/reports','Reports'],['/settings','Settings']]
export default function Layout(){
 const [light,setLight]=useState(false)
 const toggle=()=>{document.documentElement.classList.toggle('light');setLight(!light)}
 return <div className="mx-auto max-w-7xl px-4 pb-10">
  <header className="flex items-center gap-3 py-4">
   <span className="text-lg font-bold text-acc">MarketFlow</span>
   <nav className="flex flex-1 gap-1 overflow-x-auto rounded-full border border-line bg-card p-1" aria-label="Main">
    {links.map(([to,l])=><NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`whitespace-nowrap rounded-full px-4 py-1.5 text-sm ${isActive?'border border-acc text-acc':'text-mut hover:text-fg'}`}>{l}</NavLink>)}
   </nav>
   <button onClick={()=>{localStorage.removeItem('mf-token');location.href='/login'}} className="rounded-full border border-line px-3 py-2 text-sm">Log out</button>
   <button onClick={toggle} className="rounded-full border border-line px-3 py-2 text-sm" aria-label="Toggle light or dark theme">{light?'Dark':'Light'}</button>
  </header>
  <Outlet/>
 </div>
}
