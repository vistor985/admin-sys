import { create } from 'zustand';

// 商品分类数据
const categories = [
  { id: 1, name: '电子产品', description: '手机、电脑等电子设备' },
  { id: 2, name: '服装鞋帽', description: '男女服装、鞋子、帽子等' },
  { id: 3, name: '家居用品', description: '家具、装饰用品等' },
  { id: 4, name: '图书文具', description: '书籍、文具用品等' },
  { id: 5, name: '运动户外', description: '运动器材、户外用品等' },
];

// 模拟商品数据
const mockProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '最新款苹果手机，配备A17芯片',
    price: 7999,
    originalPrice: 8999,
    categoryId: 1,
    categoryName: '电子产品',
    stock: 50,
    status: 'active',
    images: ['https://via.placeholder.com/300x300?text=iPhone+15+Pro'],
    tags: ['热销', '新品'],
    specifications: {
      brand: '苹果',
      model: 'iPhone 15 Pro',
      color: '深空黑',
      storage: '256GB',
    },
    createTime: '2024-07-15 10:30:00',
    updateTime: '2024-08-20 14:20:00',
  },
  {
    id: 2,
    name: 'MacBook Pro 14寸',
    description: 'M3芯片，专业级笔记本电脑',
    price: 14999,
    originalPrice: 16999,
    categoryId: 1,
    categoryName: '电子产品',
    stock: 20,
    status: 'active',
    images: ['https://via.placeholder.com/300x300?text=MacBook+Pro'],
    tags: ['专业'],
    specifications: {
      brand: '苹果',
      model: 'MacBook Pro',
      screen: '14寸',
      chip: 'M3',
    },
    createTime: '2024-06-20 11:15:00',
    updateTime: '2024-08-18 16:45:00',
  },
  {
    id: 3,
    name: '运动休闲鞋',
    description: '舒适透气，适合日常运动',
    price: 299,
    originalPrice: 399,
    categoryId: 2,
    categoryName: '服装鞋帽',
    stock: 100,
    status: 'active',
    images: ['https://via.placeholder.com/300x300?text=运动鞋'],
    tags: ['舒适'],
    specifications: {
      brand: '耐克',
      size: '多尺码',
      material: '透气网布',
      color: '黑白',
    },
    createTime: '2024-05-10 09:20:00',
    updateTime: '2024-08-15 12:30:00',
  },
  {
    id: 4,
    name: '办公椅',
    description: '人体工学设计，久坐不累',
    price: 1299,
    originalPrice: 1599,
    categoryId: 3,
    categoryName: '家居用品',
    stock: 0,
    status: 'inactive',
    images: ['https://via.placeholder.com/300x300?text=办公椅'],
    tags: ['人体工学'],
    specifications: {
      brand: '赫曼米勒',
      material: '网布+合金',
      adjustable: '是',
      warranty: '5年',
    },
    createTime: '2024-04-05 15:45:00',
    updateTime: '2024-08-10 10:15:00',
  },
  {
    id: 5,
    name: 'JavaScript高级程序设计',
    description: '前端开发必读经典教材',
    price: 89,
    originalPrice: 109,
    categoryId: 4,
    categoryName: '图书文具',
    stock: 200,
    status: 'active',
    images: ['https://via.placeholder.com/300x300?text=JS书籍'],
    tags: ['经典', '畅销'],
    specifications: {
      author: 'Matt Frisbie',
      publisher: '人民邮电出版社',
      pages: '896页',
      edition: '第4版',
    },
    createTime: '2024-03-01 08:30:00',
    updateTime: '2024-08-05 14:20:00',
  },
];

const useProductStore = create((set, get) => ({
  // 商品列表
  products: [],

  // 分类列表
  categories: [...categories],

  // 加载状态
  loading: false,

  // 视图模式：table 或 card
  viewMode: 'table',

  // 搜索和筛选
  searchKeyword: '',
  filters: {
    categoryId: 'all',
    status: 'all',
    priceRange: [0, 50000],
  },

  // 分页信息
  pagination: {
    current: 1,
    pageSize: 10,
    total: mockProducts.length,
  },

  // 获取商品列表
  getProducts: async (params = {}) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const {
        page = 1,
        pageSize = 10,
        keyword = '',
        categoryId = 'all',
        status = 'all',
        priceRange = [0, 50000],
      } = params;

      let filteredProducts = [...mockProducts];

      // 关键词搜索
      if (keyword) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(keyword.toLowerCase()) ||
            product.description.toLowerCase().includes(keyword.toLowerCase()) ||
            product.tags.some((tag) => tag.includes(keyword))
        );
      }

      // 分类筛选
      if (categoryId !== 'all') {
        filteredProducts = filteredProducts.filter(
          (product) => product.categoryId === parseInt(categoryId)
        );
      }

      // 状态筛选
      if (status !== 'all') {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === status
        );
      }

      // 价格范围筛选
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // 分页
      const total = filteredProducts.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedProducts = filteredProducts.slice(start, end);

      set({
        products: paginatedProducts,
        loading: false,
        searchKeyword: keyword,
        filters: { categoryId, status, priceRange },
        pagination: {
          current: page,
          pageSize,
          total,
        },
      });

      return { success: true, data: paginatedProducts, total };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '获取商品列表失败' };
    }
  },

  // 添加商品
  addProduct: async (productData) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const category = categories.find(
        (cat) => cat.id === productData.categoryId
      );
      const newProduct = {
        id: Date.now(),
        ...productData,
        categoryName: category?.name || '',
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN'),
      };

      mockProducts.push(newProduct);

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getProducts({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: '商品添加成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '商品添加失败' };
    }
  },

  // 更新商品
  updateProduct: async (id, productData) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const productIndex = mockProducts.findIndex(
        (product) => product.id === id
      );
      if (productIndex !== -1) {
        const category = categories.find(
          (cat) => cat.id === productData.categoryId
        );
        mockProducts[productIndex] = {
          ...mockProducts[productIndex],
          ...productData,
          categoryName: category?.name || '',
          updateTime: new Date().toLocaleString('zh-CN'),
        };
      }

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getProducts({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: '商品更新成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '商品更新失败' };
    }
  },

  // 删除商品
  deleteProduct: async (id) => {
    set({ loading: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const productIndex = mockProducts.findIndex(
        (product) => product.id === id
      );
      if (productIndex !== -1) {
        mockProducts.splice(productIndex, 1);
      }

      // 刷新当前页面数据
      const { pagination, searchKeyword, filters } = get();
      await get().getProducts({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: searchKeyword,
        ...filters,
      });

      return { success: true, message: '商品删除成功' };
    } catch (error) {
      set({ loading: false });
      return { success: false, message: '商品删除失败' };
    }
  },

  // 获取单个商品信息
  getProductById: async (id) => {
    const product = mockProducts.find((product) => product.id === id);
    return product || null;
  },

  // 切换视图模式
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  // 重置筛选条件
  resetFilters: () => {
    set({
      searchKeyword: '',
      filters: {
        categoryId: 'all',
        status: 'all',
        priceRange: [0, 50000],
      },
    });
  },
}));

export default useProductStore;
