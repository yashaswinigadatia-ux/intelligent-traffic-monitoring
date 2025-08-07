import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import Logo from './Logo';
import traffic_icon from '../../images/traffic_icon.png';
import register_icon from './register.svg';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {
  render() {
    return (
      <Layout.Sider style={{
        height: '100vh',
        flex: '0 0 300px',
        background: '#0F0F1C',
        boxShadow: '1px 2px 19px 0px #4c4c73d6'
      }}>
        <Logo />
        <Menu style={styles.titleHeader} mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/">
              <img src={traffic_icon} style={styles.icon} />
              <span style={styles.titleText}>Live Traffic</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="4">
            <Link to="/stats">
              <span style={styles.titleText}>Statistics</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="/fine">
              <span style={styles.titleText}>Fine</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to="/vehicleRegisteration">
              <img style={styles.icon} src={register_icon} />
              <span style={styles.titleText}>Registration</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
    );
  }
}

const styles = {
  icon: {
    width: 30,
    marginRight: 10,
    marginTop: 5,
    verticalAlign: 'top'
  },
  titleHeader: {
    background: '#0F0F1C',
  },
  titleText: {
    color: '#9191d8',
    fontSize: '15px',
    fontWeight: 700
  }
};
