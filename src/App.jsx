import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './views/Home'
import Login from './views/Login'
import Admin from './views/Admin'
import ProtectedRoute from './components/ProtectedRoute'
import Info from './views/Info'
import Events from './views/Events'
import EventDetail from './views/EventDetail'
import Invitation from './views/Invitation'
import Groups from './views/Groups'
import GroupDetail from './views/GroupDetail'
import Districts from './views/Districts'
import DistrictDetail from './views/DistrictDetail'
import Directory from './views/Directory'
import Location from './views/Location'
import Reflections from './views/Reflections'
import ReflectionDetail from './views/ReflectionDetail'
import CommitteeDetail from './views/CommitteeDetail'
import NotFound from './views/NotFound'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="index.php" element={<Home />} />

          <Route path="pages/info/info.php" element={<Info />} />
          <Route path="pages/info/aa_info.php" element={<Info />} />
          <Route path="pages/info/eventos.php" element={<Events />} />

          <Route path="pages/eventos/invitacion_37178.php" element={<Invitation />} />
          <Route path="pages/eventos/:slug" element={<EventDetail />} />

          <Route path="pages/grupos/grupos.php" element={<Groups />} />
          <Route path="pages/grupos/detalle_grupo.php" element={<GroupDetail />} />

          <Route path="pages/distritos/distritos.php" element={<Districts />} />
          <Route path="pages/distritos/detalle_distrito.php" element={<DistrictDetail />} />

          <Route path="pages/directorio/directorio.php" element={<Directory />} />
          <Route path="pages/ubicacion/ubicacion.php" element={<Location />} />

          <Route path="pages/reflections/reflexiones.php" element={<Navigate to="/reflexiones" replace />} />
          <Route path="pages/reflections/detalle_reflexion.php" element={<ReflectionDetail />} />
          <Route path="pages/reflections/:slug" element={<ReflectionDetail />} />

          <Route path="pages/comites/detalle_comite.php" element={<CommitteeDetail />} />

          <Route path="que-es-aa" element={<Navigate to="/pages/info/info.php" replace />} />
          <Route path="eventos" element={<Navigate to="/pages/info/eventos.php" replace />} />
          <Route path="grupos" element={<Navigate to="/pages/grupos/grupos.php" replace />} />
          <Route path="distritos" element={<Navigate to="/pages/distritos/distritos.php" replace />} />
          <Route path="directorio" element={<Navigate to="/pages/directorio/directorio.php" replace />} />
          <Route path="ubicacion" element={<Navigate to="/pages/ubicacion/ubicacion.php" replace />} />
          <Route path="reflexiones" element={<Reflections />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
