import React, { useState } from 'react';
import { Layout, Menu, theme, Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import {
    HomeOutlined,
    BuildOutlined,
    TeamOutlined,
    FileTextOutlined,
    AppstoreOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { BsBuildingsFill } from "react-icons/bs";


const { Header, Content, Footer, Sider } = Layout;

const PropertyManagerLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    // Convert current path to breadcrumb items
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbItems = [
        { title: <Link to="/">Home</Link> },
        ...pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);
            return { title: <Link to={url}>{title}</Link> };
        })
    ];

    // Navigation items with icons
    const items = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link to="/">Dashboard</Link>,
        },
        // {
        //     key: '/properties',
        //     icon: <AppstoreOutlined />,
        //     label: <Link to="/properties">Properties</Link>,
        // },
        // {
        //     key: '/projects',
        //     icon: <FileTextOutlined />,
        //     label: <Link to="/projects">Projects</Link>,
        // },
        // {
        //     key: '/buildings',
        //     icon: <BuildOutlined />,
        //     label: <Link to="/buildings">Buildings</Link>,
        // },
        {
            key: 'user-management',
            icon: <TeamOutlined />,
            label: 'User Management',
            children: [
                {
                    key: '/leads',
                    label: <Link to="/leads">Leads Management</Link>,
                },
                {
                    key: '/users',
                    label: <Link to="/users">User Management</Link>,
                },
            ],
        },
        {
            key: '/aws-image-gallery',
            icon: <BuildOutlined />,
            label: <Link to="/aws-image-gallery">AWS Image Gallery</Link>,
        },
        ,
        {
            key: 'building',
            icon: <BsBuildingsFill />,
            label: 'Building Management',
            children: [
                {
                    key: '/buildings',
                    label: <Link to="/buildings">AllBuildingsPage</Link>,
                },
                {
                    key: '/buildings/new',
                    label: <Link to="/buildings/new">UploadBuildingPage</Link>,
                },
                {
                    key: '/buildings/edit/:buildingId',
                    label: <Link to="/buildings/edit/:buildingId">EditBuildingPage</Link>,
                },
                {
                    key: '/buildings/:buildingId',
                    label: <Link to="/buildings/:buildingId">BuildingDetailPage</Link>,
                },
                {
                    key: '/buildings/drafts',
                    label: <Link to="/buildings/drafts">DraftBuildingsPage</Link>,
                },
            ]
        }

        ,
        {
            key: 'resources',
            icon: <FileTextOutlined />,
            label: 'List',
            children: [
                {
                    key: '/list-option',
                    label: <Link to="/list-option">List Option</Link>,
                },
                {
                    key: '/new-list-option',
                    label: <Link to="/new-list-option">New List Option</Link>,
                },
            ],
        },
        {
            key: '/deeplink-generator',
            icon: <BuildOutlined />,
            label: <Link to="/deeplink-generator">Deeplink Generator</Link>,
        },
        {
            key: '/cities',
            icon: <BuildOutlined />,
            label: <Link to="/cities">Cities</Link>,
        },
        {
            key: '/color-api',
            icon: <BuildOutlined />,
            label: <Link to="/color-api">Color Api</Link>,
        },
        {
            key: 'Builder',
            icon: <FileTextOutlined />,
            label: 'Builder Management',
            children: [
                {
                    key: '/builder/all',
                    label: <Link to="/builder/all">BuildersListPage</Link>,
                },
                {
                    key: '/builder/upload',
                    label: <Link to="/builder/upload">BuilderUploadPage</Link>,
                },
                {
                    key: '/builder/update/:builderId',
                    label: <Link to="/builder/update/:builderId">BuilderUpdateInfo</Link>,
                },
                {
                    key: '/builder/detail/:id',
                    label: <Link to="/builder/detail/:id">BuilderDetailPage</Link>,
                },
                {
                    key: '/builder-auth-connection',
                    label: <Link to="/builder-auth-connection">Builder Auth Management</Link>,
                },
            ],
        },
        {
            key: 'Ads',
            icon: <FileTextOutlined />,
            label: 'Ads Management',
            children: [
                {
                    key: '/ads',
                    label: <Link to="/ads">View Ads</Link>,
                },
                {
                    key: '/post-new-ad',
                    label: <Link to="/post-new-ad">Post New Ad</Link>,
                },
                {
                    key: '/edit-ad',
                    label: <Link to="/edit-ad/:id">Edit Ad</Link>,
                },
            ],
        },
        {
            key: 'property',
            icon: <AppstoreOutlined />,
            label: 'Properties',
            children: [
                {
                    key: '/properties-management',
                    label: <Link to="/properties-management">All Properties</Link>,
                },
                {
                    key: '/property-add',
                    label: <Link to="/property-add">Add New Property</Link>,
                },
                {
                    key: '/property-edit/:propertyId',
                    label: <Link to="/property-edit/:propertyId">Edit Property</Link>,
                },
                {
                    key: '/property-drafts',
                    label: <Link to="/property-drafts">Property Drafts</Link>,
                }
            ]
        },

        {
            key: 'project',
            icon: <AppstoreOutlined />,
            label: 'Project Management',
            children: [
                {
                    key: '/projects',
                    label: <Link to="/projects">ProjectsListPage</Link>,
                },
                {
                    key: '/projects/add',
                    label: <Link to="/projects/add">AddProjectPage</Link>,
                },
                {
                    key: '/projects/edit/:projectId',
                    label: <Link to="/projects/edit/:projectId">EditProjectPage</Link>,
                },
                {
                    key: '/projects/:projectId',
                    label: <Link to="/projects/:projectId">ProjectDetailPage</Link>,
                },
                {
                    key: '/projects/drafts',
                    label: <Link to="/projects/drafts">ProjectDraftsPage</Link>,
                }
            ]
        },

    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                breakpoint="lg"
                collapsedWidth="80"
            >
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6 }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[location.pathname]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 16 }}>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                            style: { fontSize: 18 }
                        })}
                        <span style={{ marginLeft: 12, fontSize: 18, fontWeight: 'bold' }}>Property Manager</span>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Property Manager ©{new Date().getFullYear()}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default PropertyManagerLayout;