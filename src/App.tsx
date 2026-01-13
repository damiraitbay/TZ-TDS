import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UserListPage from './pages/UserListPage';
import UserFormPage from './pages/UserFormPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<UserListPage />} />
        <Route path="/users/new" element={<UserFormPage />} />
        <Route path="/users/:id/edit" element={<UserFormPage />} />
      </Routes>
    </Layout>
  );
}

export default App;

