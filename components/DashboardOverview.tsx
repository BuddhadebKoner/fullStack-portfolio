'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAdminChat } from '@/hooks/useAdminChat';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const DashboardOverview = () => {
  const [timeRange, setTimeRange] = useState(30);
  const { analytics, isLoading: analyticsLoading } = useAnalytics(timeRange);
  const { messages, pagination, isLoading: chatLoading } = useAdminChat({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  if (analyticsLoading || chatLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  // Process data for charts
  const blogViewsData = analytics.blogs.blogsByDate.map(item => ({
    date: format(parseISO(item._id), 'MMM dd'),
    blogs: item.count,
    views: item.totalViews,
    likes: item.totalLikes
  }));

  const chatActivityData = analytics.chat.messagesByDate.reduce((acc: Array<{
    date: string;
    [key: string]: string | number;
    user: number;
    assistant: number;
  }>, item) => {
    const date = format(parseISO(item._id.date), 'MMM dd');
    const existing = acc.find(d => d.date === date);
    
    if (existing) {
      existing[item._id.sender] = (existing[item._id.sender] as number || 0) + item.count;
    } else {
      acc.push({
        date,
        [item._id.sender]: item.count,
        user: item._id.sender === 'user' ? item.count : 0,
        assistant: item._id.sender === 'assistant' ? item.count : 0
      });
    }
    
    return acc;
  }, []);

  const tagDistribution = analytics.blogs.tagStats.slice(0, 8).map(tag => ({
    name: tag._id,
    value: tag.count,
    views: tag.totalViews
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
          Dashboard Analytics
        </h1>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6">
          <h3 className="text-blue-100 text-sm font-medium">Total Blogs</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {analytics.blogs.totalBlogs}
          </p>
          <p className="text-blue-200 text-sm mt-1">
            {analytics.blogs.publishedBlogs} published
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6">
          <h3 className="text-green-100 text-sm font-medium">Total Views</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {analytics.blogs.totalViews.toLocaleString()}
          </p>
          <p className="text-green-200 text-sm mt-1">
            {analytics.blogs.totalLikes} likes
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6">
          <h3 className="text-purple-100 text-sm font-medium">Chat Messages</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {analytics.chat.totalMessages}
          </p>
          <p className="text-purple-200 text-sm mt-1">
            {analytics.chat.uniqueSessions} sessions
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-lg p-6">
          <h3 className="text-orange-100 text-sm font-medium">Active Users</h3>
          <p className="text-3xl font-bold text-white mt-2">
            {analytics.chat.activeUsers.length}
          </p>
          <p className="text-orange-200 text-sm mt-1">
            This period
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Blog Performance */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Blog Performance Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={blogViewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="views" 
                stackId="1" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.6}
                name="Views"
              />
              <Area 
                type="monotone" 
                dataKey="likes" 
                stackId="1" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.6}
                name="Likes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chat Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Chat Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chatActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Legend />
              <Bar dataKey="user" fill="#8B5CF6" name="User Messages" />
              <Bar dataKey="assistant" fill="#06B6D4" name="AI Responses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Blog Tags */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Popular Blog Tags
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tagDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tagDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Blogs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Top Performing Blogs
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.blogs.topBlogs.slice(0, 8).map((blog, index) => (
              <div key={blog._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {blog.title}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-blue-400">
                      {blog.views} views
                    </span>
                    <span className="text-xs text-green-400">
                      {blog.likes} likes
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Chat Messages */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            Recent Chat Messages
          </h3>
          <span className="text-sm text-gray-400">
            {pagination?.total} total messages
          </span>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages?.slice(0, 10).map((message) => (
            <div key={message._id} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                message.sender === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                {message.sender === 'user' ? 'U' : 'AI'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {message.metadata?.userInfo?.name || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {format(parseISO(message.createdAt), 'MMM dd, HH:mm')}
                  </span>
                  {message.isRead === false && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-sm text-gray-300 truncate">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;