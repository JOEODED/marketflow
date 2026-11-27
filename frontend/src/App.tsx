import {Navigate,Route,Routes} from 'react-router-dom'
import {token} from './api'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import POS from './pages/POS'
import Login from './pages/Login'
import Sales from './pages/Sales'
import Expenses from './pages/Expenses'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
const Guard=()=>token()?<Layout/>:<Navigate to="/login" replace/>
export default function App(){return <Routes>
 <Route path="/login" element={<Login/>}/>
 <Route element={<Guard/>}>
  <Route index element={<Dashboard/>}/><Route path="inventory" element={<Inventory/>}/><Route path="pos" element={<POS/>}/>
  <Route path="sales" element={<Sales/>}/><Route path="expenses" element={<Expenses/>}/><Route path="suppliers" element={<Suppliers/>}/><Route path="reports" element={<Reports/>}/><Route path="settings" element={<Settings/>}/>
 </Route></Routes>}
