import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:3001';

// Mock product data
const mockProducts = [
  {
    _id: '1',
    userId: 'test-user',
    title: 'Protein Powder',
    description: 'High-quality whey protein',
    category: 'sports nutrition',
    price: 49.99,
    commissionPercent: 15,
    referralLink: 'https://example.com/ref/protein-powder',
    clicks: 25,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    userId: 'test-user',
    title: 'Resistance Bands',
    description: 'Set of resistance training bands',
    category: 'equipment',
    price: 29.99,
    commissionPercent: 20,
    referralLink: 'https://example.com/ref/resistance-bands',
    clicks: 12,
    createdAt: '2024-01-02T00:00:00.000Z'
  }
];

// Mock analytics data
const mockAnalytics = {
  totalProducts: 2,
  totalClicks: 37,
  totalEarnings: 89.98,
  topPerformingProducts: mockProducts,
  periodStart: '2024-01-01',
  periodEnd: '2024-12-31'
};

export const handlers = [
  // Products endpoints
  http.get(`${API_BASE_URL}/api/products`, () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get(`${API_BASE_URL}/api/products/:id`, ({ params }) => {
    const product = mockProducts.find((p) => p._id === params.id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.post(`${API_BASE_URL}/api/products`, async ({ request }) => {
    const newProduct = (await request.json()) as any;
    const product = {
      ...newProduct,
      _id: Math.random().toString(),
      userId: 'test-user',
      referralLink: `https://example.com/ref/${newProduct.title.toLowerCase().replace(/\s+/g, '-')}`,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    return HttpResponse.json(product, { status: 201 });
  }),

  http.put(`${API_BASE_URL}/api/products/:id`, async ({ params, request }) => {
    const updates = (await request.json()) as any;
    const product = mockProducts.find((p) => p._id === params.id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    const updatedProduct = { ...product, ...updates };
    return HttpResponse.json(updatedProduct);
  }),

  http.delete(`${API_BASE_URL}/api/products/:id`, ({ params }) => {
    const productIndex = mockProducts.findIndex((p) => p._id === params.id);
    if (productIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // Analytics endpoints
  http.get(`${API_BASE_URL}/api/analytics/dashboard`, () => {
    return HttpResponse.json(mockAnalytics);
  }),

  http.get(`${API_BASE_URL}/api/analytics/products/:id`, ({ params }) => {
    const product = mockProducts.find((p) => p._id === params.id);
    if (!product) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      productId: params.id,
      clicks: product.clicks,
      potentialEarnings:
        ((product.price * product.commissionPercent) / 100) * product.clicks,
      clickHistory: []
    });
  })
];
