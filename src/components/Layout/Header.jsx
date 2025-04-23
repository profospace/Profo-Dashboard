import React, { useState } from 'react';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice'; // Adjust path as needed

const Header = ({ collapsed, setCollapsed, colorBgContainer }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle logout action
    const handleLogout = () => {
        dispatch(logout());
        message.success('Logged out successfully');
        navigate('/login');
    };

    // Dropdown menu items for the avatar
    const items = [
        {
            key: '1',
            label: 'Sign Out',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
        },
    ];

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '100%',
                paddingLeft: 16,
                paddingRight: 16
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setCollapsed(!collapsed),
                        style: { fontSize: 18 }
                    })}
                    <span style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold' }}>Property Manager</span>
                </div>

                {/* User Avatar with Dropdown */}
                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Avatar
                        src="https://avatar.iran.liara.run/public/boy"
                        size="large"
                        style={{
                            cursor: 'pointer',
                            border: '2px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                </Dropdown>
            </div>
        </Header>
    );
};

export default Header;