import { useState } from 'react'
import { Routes, Route, Navigate} from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/Home'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { UserDetail } from './pages/UserDetail'
import { Dashboard } from './pages/Dashboard'
import { Stats } from './components/Stats'
import { Settings } from './components/Settings'
import { CompanyPage } from './pages/CompanyPage'
import { TeamPage } from './pages/TeamPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'

function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (
    <div>
      <Navbar />
      Hello everyone, My name is Thanh Tam
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<About />} >
          <Route path="team" element={<TeamPage/>} />
          <Route path="company" element={<CompanyPage/>} />
        </Route>
        <Route path='/contact' element={<Contact />} />
        <Route path='/users/:id' element={<UserDetail />} />
        <Route path='/login' element={<LoginPage onLogin={() => setIsAuth(true)} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuth={isAuth}>
              <Dashboard onLogout={() => setIsAuth(false)} />            
            </ProtectedRoute>
          }
        >
          <Route path="stats" element={<Stats/>} />
          <Route path="settings" element={<Settings/>} />
        </Route>

        {/* Not found */}
        <Route path="*" element={<h2> 404 - Not found this page</h2>} />
      </Routes>
    </div> 
  )
}

export default App
