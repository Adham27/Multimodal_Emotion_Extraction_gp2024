import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Typography, message } from 'antd'; 
import Search from 'antd/es/transfer/search';
import Cookies from 'js-cookie';
const { Text } = Typography;

const onSearch = (value, _e, info) => console.log(info?.source, value);

const Home = () => {
  const [reportNumber, setNumber] = useState(0);
  const [data, setData] = useState([]);
  const getAccessToken = () => {
    return Cookies.get('access_token_cookie') || localStorage.getItem('Token');
  };
  
  const columns = [
    {
      title: '#',
      dataIndex: 'key', 
      key: 'key', 
    },
    {
      title: 'Report ID',
      dataIndex:'id', 
      key:'id'
    },
    {
      title: 'Report Name',
      dataIndex: 'reportname',
      key: 'Report_Name',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: 'Download',
      key: 'download',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleDownload(record)}>Download</Button>
        </Space>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (_, record) => (
        <Space size="middle">
          <Button danger onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = getAccessToken();
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`/api/users/${userId}/report`, {
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
      const reports = await response.json();
      setData(reports.map((report, index) => ({ key: index + 1, ...report })));
      setNumber(reports.length);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleDownload = (record) => {
    const token = getAccessToken();
    const userId = localStorage.getItem('user_id');
    const url = `/api/users/${userId}/report/${record.id}/download`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error('Error downloading report');
    })
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${record.reportname}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(error => {
      console.error('Error downloading report:', error);
      message.error('Error downloading report');
    });
  };
  const handleDelete = async (record) => {
    const token = getAccessToken();
    const userId = localStorage.getItem('user_id');
    const url = `/api/users/${userId}/report/${record.id}/delete`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (response.ok) {
        message.success(result.message);
        fetchReports();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      message.error('Error deleting report');
    }
  };

  return (
    <>
      <div className="">
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
      </div>
      <div className="d-flex justify-content-between mt-5">
        <h4>Dashboard</h4>
        <span>Total reports: <Text strong>{reportNumber}</Text></span>
      </div>
      <div className="mt-4 ">
        <Table columns={columns} dataSource={data} />
      </div>
    </>
  );
};

export default Home;
