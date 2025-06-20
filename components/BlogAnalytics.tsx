'use client';

import React from 'react';
import { BlogData } from '@/hooks/useBlogs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Eye, Heart, Calendar, Tag } from 'lucide-react';

interface BlogAnalyticsProps {
  blogs: BlogData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const BlogAnalytics: React.FC<BlogAnalyticsProps> = ({ blogs }) => {
  // Calculate analytics data
  const totalViews = blogs.reduce((sum, blog) => sum + blog.views, 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0);
  const publishedBlogs = blogs.filter(blog => blog.isPublished).length;
  const averageViews = publishedBlogs > 0 ? Math.round(totalViews / publishedBlogs) : 0;

  // Top performing blogs
  const topBlogs = [...blogs]
    .filter(blog => blog.isPublished)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map(blog => ({
      title: blog.title.length > 30 ? blog.title.substring(0, 30) + '...' : blog.title,
      views: blog.views,
      likes: blog.likes
    }));

  // Tag distribution
  const tagStats = blogs.reduce((acc, blog) => {
    blog.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const tagData = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tag, count]) => ({ name: tag, value: count }));

  // Monthly blog creation trend
  const monthlyData = blogs.reduce((acc, blog) => {
    const month = format(parseISO(blog.createdAt), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyTrend = Object.entries(monthlyData)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .slice(-12) // Last 12 months
    .map(([month, count]) => ({ month, count }));

  // Engagement rate data
  const engagementData = blogs
    .filter(blog => blog.isPublished && blog.views > 0)
    .map(blog => ({
      title: blog.title.length > 20 ? blog.title.substring(0, 20) + '...' : blog.title,
      views: blog.views,
      likes: blog.likes,
      engagementRate: blog.views > 0 ? ((blog.likes / blog.views) * 100).toFixed(1) : 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Likes</p>
              <p className="text-2xl font-bold text-white">{totalLikes.toLocaleString()}</p>
            </div>
            <Heart className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Published</p>
              <p className="text-2xl font-bold text-white">{publishedBlogs}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Views</p>
              <p className="text-2xl font-bold text-white">{averageViews}</p>
            </div>
            <Tag className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Blogs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Blogs</h3>
          {topBlogs.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBlogs} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="title" type="category" width={120} stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="views" fill="#3B82F6" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No published blogs yet
            </div>
          )}
        </div>

        {/* Tag Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Popular Tags</h3>
          {tagData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tagData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tagData.map((entry, index) => (
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
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No tags found
            </div>
          )}
        </div>

        {/* Monthly Creation Trend */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Blog Creation Trend</h3>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981' }}
                  name="Blogs Created"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Engagement Analysis */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Blog Engagement</h3>
          {engagementData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="title" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="likes" fill="#F59E0B" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No published blogs with engagement data
            </div>
          )}
        </div>
      </div>

      {/* Recent Performance Table */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Blog Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">Title</th>
                <th className="text-left py-3 px-4 text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-gray-300">Views</th>
                <th className="text-left py-3 px-4 text-gray-300">Likes</th>
                <th className="text-left py-3 px-4 text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {blogs.slice(0, 10).map((blog) => (
                <tr key={blog._id} className="border-b border-gray-700 hover:bg-gray-750">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white truncate max-w-xs">
                      {blog.title}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      blog.isPublished 
                        ? 'bg-green-600/20 text-green-400' 
                        : 'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{blog.views}</td>
                  <td className="py-3 px-4 text-gray-300">{blog.likes}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {format(parseISO(blog.createdAt), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogAnalytics;
