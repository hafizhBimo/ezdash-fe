import React, { useState, useEffect } from 'react';
import { Card, Upload, Table, Tag, Typography, message, Space, Button, Alert } from 'antd';
import { InboxOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

const UploadHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/upload/history');
      setHistory(response.data.data);
    } catch (error) {
      message.error('Failed to load upload history.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        message.success(`${file.name} uploaded and processed successfully!`);
        onSuccess(response.data);
        fetchHistory();
      } catch (error) {
        const errMsg = error.response?.data?.message || `Failed to process ${file.name}`;
        message.error(errMsg);
        onError(error);
      } finally {
        setUploading(false);
      }
    }
  };

  const columns = [
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Uploaded Date',
      dataIndex: 'upload_date',
      key: 'upload_date',
      render: (dateStr) => new Date(dateStr).toLocaleString('id-ID')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gold';
        if (status === 'SUCCESS') color = 'green';
        if (status === 'FAILED') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Error Log',
      dataIndex: 'error_message',
      key: 'error_message',
      render: (text) => text ? <Text type="danger">{text}</Text> : <Text type="secondary">-</Text>
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Upload Snapshot Harian</Title>
        <Paragraph>Import data excel harian untuk mengupdate status inventaris gudang dan consignment secara berkala.</Paragraph>
      </div>

      <Card className="glass-card">
        <Dragger {...uploadProps} disabled={uploading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">Klik atau seret file Excel ke area ini untuk mengunggah</p>
          <p className="ant-upload-hint">
            Hanya mendukung file .xlsx dengan sheet lengkap (DATA_MASTER + STOCK WHS, STOCK-WHS, STOCK-COGS, USAGE, KALKULASI).
          </p>
        </Dragger>
      </Card>

      <Card 
        title="Riwayat Import Data" 
        className="glass-card"
        extra={
          <Button 
            type="text" 
            icon={<ReloadOutlined />} 
            onClick={fetchHistory} 
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <Table
          dataSource={history}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </Space>
  );
};

export default UploadHistoryPage;
