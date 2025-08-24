import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Radio,
  Upload,
  Button,
  Space,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import useProductStore from '../../store/productStore';

const { Option } = Select;
const { TextArea } = Input;

const ProductForm = ({ visible, product, categories, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { addProduct, updateProduct, loading } = useProductStore();
  const [imageList, setImageList] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // 当弹窗打开时，设置表单初始值
  useEffect(() => {
    if (visible) {
      if (product) {
        // 编辑模式
        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          categoryId: product.categoryId,
          stock: product.stock,
          status: product.status,
        });
        setTags(product.tags || []);
        setImageList(
          product.images.map((url, index) => ({
            uid: `image-${index}`,
            name: `image-${index}.jpg`,
            status: 'done',
            url: url,
          }))
        );
      } else {
        // 新增模式
        form.resetFields();
        form.setFieldsValue({
          status: 'active',
          stock: 0,
        });
        setTags([]);
        setImageList([]);
      }
    }
  }, [visible, product, form]);

  // 处理图片上传
  const handleImageChange = ({ fileList }) => {
    setImageList(fileList);
  };

  // 模拟图片上传
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  // 添加标签
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  // 删除标签
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 处理图片
      const images = imageList.map((file) => {
        if (file.url) {
          return file.url;
        }
        // 这里应该是真实的图片上传逻辑
        return `https://via.placeholder.com/300x300?text=${encodeURIComponent(
          values.name
        )}`;
      });

      const productData = {
        ...values,
        images:
          images.length > 0
            ? images
            : ['https://via.placeholder.com/300x300?text=No+Image'],
        tags,
      };

      let result;
      if (product) {
        // 编辑商品
        result = await updateProduct(product.id, productData);
      } else {
        // 添加商品
        result = await addProduct(productData);
      }

      if (result.success) {
        message.success(result.message);
        onSuccess();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.log('表单验证失败:', error);
    }
  };

  // 取消操作
  const handleCancel = () => {
    form.resetFields();
    setTags([]);
    setImageList([]);
    onCancel();
  };

  return (
    <Modal
      title={product ? '编辑商品' : '添加商品'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="商品名称"
              rules={[
                { required: true, message: '请输入商品名称' },
                { min: 2, message: '商品名称至少2个字符' },
                { max: 100, message: '商品名称最多100个字符' },
              ]}
            >
              <Input placeholder="请输入商品名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="categoryId"
              label="商品分类"
              rules={[{ required: true, message: '请选择商品分类' }]}
            >
              <Select placeholder="请选择商品分类">
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="商品描述"
          rules={[
            { required: true, message: '请输入商品描述' },
            { min: 10, message: '商品描述至少10个字符' },
            { max: 500, message: '商品描述最多500个字符' },
          ]}
        >
          <TextArea
            rows={3}
            placeholder="请输入商品描述"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="price"
              label="销售价格"
              rules={[
                { required: true, message: '请输入销售价格' },
                { type: 'number', min: 0.01, message: '价格必须大于0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入销售价格"
                precision={2}
                min={0.01}
                max={999999}
                addonBefore="¥"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="originalPrice"
              label="原价"
              rules={[{ type: 'number', min: 0.01, message: '原价必须大于0' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入原价"
                precision={2}
                min={0.01}
                max={999999}
                addonBefore="¥"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="stock"
              label="库存数量"
              rules={[
                { required: true, message: '请输入库存数量' },
                { type: 'number', min: 0, message: '库存数量不能小于0' },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入库存数量"
                min={0}
                max={999999}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="status"
          label="商品状态"
          rules={[{ required: true, message: '请选择商品状态' }]}
        >
          <Radio.Group>
            <Radio value="active">在售</Radio>
            <Radio value="inactive">下架</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="商品图片">
          <Upload
            listType="picture-card"
            fileList={imageList}
            onChange={handleImageChange}
            beforeUpload={() => false} // 阻止自动上传
            multiple
          >
            {imageList.length >= 5 ? null : uploadButton}
          </Upload>
          <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
            最多上传5张图片，支持 JPG、PNG 格式，单张图片不超过 2MB
          </div>
        </Form.Item>

        <Form.Item label="商品标签">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space wrap>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {tag}
                  <Button
                    type="text"
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeTag(tag)}
                    style={{ marginLeft: 4 }}
                  />
                </span>
              ))}
            </Space>
            <Space>
              <Input
                placeholder="输入标签"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onPressEnter={addTag}
                style={{ width: 200 }}
              />
              <Button onClick={addTag}>添加标签</Button>
            </Space>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductForm;
