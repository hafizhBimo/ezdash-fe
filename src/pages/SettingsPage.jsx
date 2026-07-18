import React, { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, Typography, message, Skeleton, Divider } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/settings');
      const settingsArray = response.data.data;
      
      const formValues = {};
      settingsArray.forEach(s => {
        formValues[s.key] = parseInt(s.value, 10);
      });
      
      form.setFieldsValue(formValues);
    } catch (error) {
      console.error('Failed to load settings:', error);
      message.error('Gagal memuat pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await api.put('/settings', values);
      message.success('Pengaturan berhasil disimpan!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      message.error('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Skeleton active padding="24px" />;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>
        <SettingOutlined style={{ marginRight: 8, color: '#1890ff' }} /> 
        System Settings
      </Title>
      <Paragraph>
        Ubah parameter threshold (batas kritis) untuk penentuan status dan peringatan (alert) stok di seluruh dashboard.
      </Paragraph>

      <Card className="glass-card" bordered={false} style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          autoComplete="off"
        >
          <Title level={4}>Alert & Exception Thresholds</Title>
          <Divider style={{ margin: '12px 0 24px 0' }} />

          <Form.Item
            label={<Text strong>Critical Days (Hari)</Text>}
            name="CRITICAL_DAYS"
            rules={[{ required: true, message: 'Harap masukkan nilai Critical Days' }]}
            help="Batas jumlah hari dimana stok dianggap sangat menipis (Critical). Default: 15 hari."
          >
            <InputNumber style={{ width: '100%' }} min={1} max={365} />
          </Form.Item>

          <Form.Item
            label={<Text strong>Overstock Days (Hari)</Text>}
            name="OVERSTOCK_DAYS"
            rules={[{ required: true, message: 'Harap masukkan nilai Overstock Days' }]}
            help="Batas jumlah hari dimana stok mulai dianggap menumpuk berlebih (Overstock). Default: 90 hari."
          >
            <InputNumber style={{ width: '100%' }} min={1} max={730} />
          </Form.Item>

          <Form.Item
            label={<Text strong>Dead Stock Days (Hari)</Text>}
            name="DEADSTOCK_DAYS"
            rules={[{ required: true, message: 'Harap masukkan nilai Dead Stock Days' }]}
            help="Batas jumlah hari dimana stok dianggap stok mati / tidak laku (Dead Stock). Default: 180 hari."
          >
            <InputNumber style={{ width: '100%' }} min={1} max={3650} />
          </Form.Item>

          <Form.Item style={{ marginTop: 32, marginBottom: 0, textAlign: 'right' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={saving}
              size="large"
            >
              Simpan Pengaturan
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage;
