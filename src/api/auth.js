// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API响应
const mockResponse = async (data, shouldError = false) => {
  await delay(500); // 模拟网络延迟
  if (shouldError) {
    throw new Error('API Error');
  }
  return { data };
};

export const login = async (username, password) => {
  // 这里模拟登录请求
  return mockResponse({
    username: 'John Doe',
    token: 'fake_token_' + Date.now()
  });
};

export const logout = async () => {
  // 这里模拟登出请求
  return mockResponse({ success: true });
}; 