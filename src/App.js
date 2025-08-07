import React from 'react';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import LiveTraffic from './components/LiveTraffic/LiveTraffic';
import Simulate from './components/LiveTraffic/Simulate';
import AmbulanceTracker from './components/LiveTraffic/AmbulanceTracker';
import Heatmap from './components/LiveTraffic/Heatmap';
import Statistics from './components/LiveTraffic/Statistics';
import Fine from './components/Fine/Fine';
import RegisterationForm from './components/registerationForm/registration';

const { Header, Content } = Layout;

const App = () => {
  return (
    <Layout style={{ flexDirection: 'row', minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={styles.header}>
        <Header
          style={{
            padding: '0 30px',
            color: 'white',
            fontSize: 20,
            fontWeight: 100,
            backgroundColor: '#17172f',
          }}
        >
          Dashboard
        </Header>
        <Content style={{ padding: 20 }}>
          <div style={styles.card}>
            <Routes>
              <Route path="/vehicleRegisteration" element={<RegisterationForm />} />
              <Route path="/heatmap" element={<Heatmap />} />
              <Route path="/corridor" element={<AmbulanceTracker />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/sim" element={<Simulate />} />
              <Route path="/fine" element={<Fine />} />
              <Route path="/" element={<LiveTraffic />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const styles = {
  card: {
    width: '100%',
    height: 'calc(90vh)',
    background: 'white',
    boxShadow: '0px 2px 15px rgba(0,0,0,.2)',
    borderRadius: '3px',
  },
  header: {
    backgroundColor: 'green',
  },
};

export default App;
