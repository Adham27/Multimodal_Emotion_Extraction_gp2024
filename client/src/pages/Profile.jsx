
import React, { useState, useEffect } from 'react';
import '../styles/profile.scss';
import { Card, Button, Avatar, Typography, Input, Upload, message } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';

const { Title, Text } = Typography;

const Profile = () => {
  const userId = localStorage.getItem('user_id');
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const getAccessToken = () => {
    return Cookies.get('access_token_cookie') || localStorage.getItem('Token');
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAccessToken();
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserData(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const token = getAccessToken();
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (imageFile) {
        formDataToSend.append('image', imageFile);
        console.log(imageFile)
      }

      const response = await fetch(`/api/users/update/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
        body: formDataToSend,
      });
      

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        console.error('Error updating user data:', responseText);
        throw new Error(`Network response was not ok`);
      }

      const data = JSON.parse(responseText); // Try parsing the response as JSON
      setUserData(data);
      setEditMode(false);
      window.location.reload(); // Reload the page after successful update
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      setImageFile(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleDelete = () => {
    // Handle delete user data
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : `http://localhost:5000/${userData.image}`;
  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={125} src={imageUrl} />
        </div>
        <div className="profile-content">
          {editMode ? (
            <>
              <Upload
                name="image"
                listType="picture"
                className="upload-list-inline"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleImageChange}
              >
                <Button icon={<UploadOutlined />}>Change Avatar</Button>
              </Upload>
              <Input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First Name"
              />
              <Input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <Input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
              />
              <Input
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="Zip Code"
              />
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                Save
              </Button>
              <Button type="default" icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Title level={3}>{userData.first_name + ' ' + userData.last_name}</Title>
              <Text>@{userData.first_name + userData.last_name}</Text>
              <br />
              <Text>{userData.email}</Text>
              <br />
              <Text>{userData.phone_number}</Text>
              <br />
              <Text>{userData.zipcode}</Text>
              <div className="profile-actions">
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                  Edit
                </Button>
                <Button type="danger" icon={<DeleteOutlined />} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Profile;
