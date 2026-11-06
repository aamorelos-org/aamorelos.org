import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ScrollToTop from './components/layout/ScrollToTop'
import Home from './views/Home'
import Info from './views/Info'
import Events from './views/Events'
import EventDetail from './views/EventDetail'
import Invitation from './views/Invitation'
import Groups from './views/Groups'
import GroupDetail from './views/GroupDetail'
import Districts from './views/Districts'
import DistrictDetail from './views/DistrictDetail'
import Directory from './views/Directory'
import Reflections from './views/Reflections'
import DailyReflection from './views/DailyReflection'
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

          <Route path="pages/reflexiones/reflexiones.php" element={<Navigate to="/reflexiones" replace />} />
          <Route path="pages/reflexiones/detalle_reflexion.php" element={<ReflectionDetail />} />
          <Route path="pages/reflexiones/:slug" element={<ReflectionDetail />} />

          <Route path="pages/comites/detalle_comite.php" element={<CommitteeDetail />} />

          <Route path="que-es-aa" element={<Navigate to="/pages/info/info.php" replace />} />
          <Route path="eventos" element={<Navigate to="/pages/info/eventos.php" replace />} />
          <Route path="grupos" element={<Navigate to="/pages/grupos/grupos.php" replace />} />
          <Route path="distritos" element={<Navigate to="/pages/distritos/distritos.php" replace />} />
          <Route path="directorio" element={<Navigate to="/pages/directorio/directorio.php" replace />} />
          <Route path="reflexiones" element={<Reflections />} />
          <Route path="reflexiones-diarias" element={<DailyReflection />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
