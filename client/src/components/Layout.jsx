import React, { useState, useEffect } from 'react';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Button,
  Layout,
  Menu,
  theme,
  message
} from 'antd';
import Cookies from 'js-cookie';

const AuthenticatedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(() => {
    const user_id = localStorage.getItem('user_id');
    const user_token = localStorage.getItem('Token');
    return user_id && user_token;
  });

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    const user_token = localStorage.getItem('Token');
    const isAuthenticated = user_id && user_token;
    setAuthenticated(isAuthenticated);
  }, []);

  if (!authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const { Header, Sider, Content } = Layout;

const ProtectedRoute = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      message.success('Logged out successfully');
      Cookies.remove('access_token_cookie');
      Cookies.remove('user_id');
      localStorage.removeItem('Token');
      localStorage.removeItem('user_id');
      navigate('/');
    } catch (error) {
      message.error('Failed to logout');
    }
  };

  return (
    <AuthenticatedRoute>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <div className="p-2 text-white">
            {collapsed ? <h2>EXP</h2> : <h2>EXPRESSIFY</h2>}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <HomeOutlined />,
                label: <Link to={`/users/${userId}/dashboard`}>Dashboard</Link>,
              },
              {
                key: '2',
                icon: <AppstoreOutlined />,
                label: <Link to={`/users/${userId}/app`}>app</Link>,
              },
              {
                key: '3',
                icon: <UserOutlined />,
                label: <Link to={`/users/${userId}/profile`}>profile</Link>,
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
            className='  '
          >
            <div className="d-flex justify-content-between">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
              <Button danger className='mt-3 m-4' onClick={logout}>Logout</Button>
            </div>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 300,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className="container height-container">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </AuthenticatedRoute>
  );
};

export default ProtectedRoute;
