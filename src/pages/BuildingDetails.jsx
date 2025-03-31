import React, { useState, useEffect } from 'react';
import {
    Modal,
    Typography,
    Spin,
    Button,
    Alert,
    Descriptions,
    Card,
    Progress,
    Carousel,
    Row,
    Col,
    Image,
    Space,
    Divider,
    Tag,
    Statistic,
    List
} from 'antd';
import {
    CloseOutlined,
    LeftOutlined,
    RightOutlined,
    HomeOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    UserOutlined,
    BuildOutlined,
    KeyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
import { base_url } from "../../utils/base_url"


const BuildingDetails = ({ buildingId, onClose, visible }) => {
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        if (visible && buildingId) {
            fetchBuildingDetails();
        }
    }, [buildingId, visible]);

    const fetchBuildingDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${base_url}/api/buildings/${buildingId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch building details: ${response.status}`);
            }

            const data = await response.json();
            setBuilding(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching building details:', error);
            setError('Failed to load building details. Please try again.');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle image navigation
    const nextImage = () => {
        const galleryImages = building?.galleryList || [];
        setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        const galleryImages = building?.galleryList || [];
        setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    // Calculate allocation statistics
    const getTotalProperties = () => building?.totalProperties || 0;
    const getAllocatedProperties = () => building?.allocatedProperties || 0;
    const getFreeProperties = () => building?.freeProperties || 0;
    const getAllocationPercentage = () => {
        const total = getTotalProperties();
        const allocated = getAllocatedProperties();
        return total > 0 ? Math.round((allocated / total) * 100) : 0;
    };

    // Render loading content
    const renderLoading = () => (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading building details...</div>
        </div>
    );

    // Render error content
    const renderError = () => (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
            />
            <Button
                type="primary"
                onClick={fetchBuildingDetails}
                style={{ marginTop: 16 }}
            >
                Try Again
            </Button>
        </div>
    );

    // Render gallery
    const renderGallery = () => {
        const galleryImages = building?.galleryList || [];

        if (galleryImages.length === 0) {
            return (
                <Card style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text type="secondary">No Images Available</Text>
                </Card>
            );
        }

        return (
            <div style={{ position: 'relative' }}>
                <div style={{ height: 320, overflow: 'hidden', borderRadius: 8, position: 'relative' }}>
                    <img
                        src={galleryImages[activeImageIndex]}
                        alt={`Building ${activeImageIndex + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />

                    {galleryImages.length > 1 && (
                        <>
                            <Button
                                icon={<LeftOutlined />}
                                onClick={prevImage}
                                shape="circle"
                                style={{
                                    position: 'absolute',
                                    left: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white'
                                }}
                            />
                            <Button
                                icon={<RightOutlined />}
                                onClick={nextImage}
                                shape="circle"
                                style={{
                                    position: 'absolute',
                                    right: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(0, 0, 0, 0.5)',
                                    color: 'white'
                                }}
                            />
                        </>
                    )}
                </div>

                {galleryImages.length > 1 && (
                    <Row gutter={8} style={{ marginTop: 8 }}>
                        {galleryImages.map((img, index) => (
                            <Col key={index} span={4}>
                                <div
                                    onClick={() => setActiveImageIndex(index)}
                                    style={{
                                        cursor: 'pointer',
                                        height: 60,
                                        borderRadius: 4,
                                        overflow: 'hidden',
                                        border: index === activeImageIndex ? '2px solid #1890ff' : 'none',
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        );
    };

    // Render building details
    const renderBuildingDetails = () => (
        <>
            {renderGallery()}

            <Divider />

            <Descriptions title="Building Information" bordered column={{ xs: 1, sm: 2, md: 3 }}>
                <Descriptions.Item label="Building Name">
                    <Text strong>{building.name || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                    <Space>
                        <EnvironmentOutlined />
                        {building.location || 'N/A'}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Built Date">
                    <Space>
                        <CalendarOutlined />
                        {formatDate(building.builtDate)}
                    </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Building Type">
                    <Tag color="blue">{building.type || 'N/A'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                    <Tag color={building.status === 'Active' ? 'green' : 'orange'}>
                        {building.status || 'N/A'}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Property Allocation</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Properties"
                            value={getTotalProperties()}
                            prefix={<HomeOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Allocated"
                            value={getAllocatedProperties()}
                            prefix={<KeyOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Available"
                            value={getFreeProperties()}
                            prefix={<BuildOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
                <Text>Allocation Status</Text>
                <Progress percent={getAllocationPercentage()} status="active" />
            </div>

            {building.description && (
                <>
                    <Divider />
                    <Title level={4}>Description</Title>
                    <Text>{building.description}</Text>
                </>
            )}

            {building.connectedProperties && building.connectedProperties.length > 0 && (
                <>
                    <Divider />
                    <Title level={4}>Connected Properties</Title>
                    <List
                        grid={{ gutter: 16, column: 3 }}
                        dataSource={building.connectedProperties}
                        renderItem={property => (
                            <List.Item>
                                <Card title={property.name} size="small">
                                    <Text type="secondary">ID: {property.propertyId}</Text>
                                </Card>
                            </List.Item>
                        )}
                    />
                </>
            )}
        </>
    );

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={900}
            title={building?.name || 'Building Details'}
            bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
            destroyOnClose
        >
            {loading ? renderLoading() : error ? renderError() : renderBuildingDetails()}
        </Modal>
    );
};

export default BuildingDetails;