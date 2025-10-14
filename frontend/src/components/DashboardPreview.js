import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Brain,
  Shield
} from 'lucide-react';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    totalRequests: 0,
    approved: 0,
    pending: 0,
    processingTime: 0
  });

  const tabs = [
    { id: 0, name: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 1, name: 'Analytics', icon: <PieChart className="h-4 w-4" /> },
    { id: 2, name: 'AI Insights', icon: <Brain className="h-4 w-4" /> },
    { id: 3, name: 'Security', icon: <Shield className="h-4 w-4" /> }
  ];

  const stats = [
    { label: 'Total Requests', value: 2847, icon: <FileText className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500', change: '+12%' },
    { label: 'Approved', value: 2634, icon: <CheckCircle className="h-5 w-5" />, color: 'from-green-500 to-emerald-500', change: '+8%' },
    { label: 'Pending', value: 156, icon: <Clock className="h-5 w-5" />, color: 'from-yellow-500 to-orange-500', change: '-5%' },
    { label: 'Avg. Processing', value: 1.2, icon: <Zap className="h-5 w-5" />, color: 'from-purple-500 to-pink-500', change: '-15%' }
  ];

  const recentRequests = [
    { id: 1, title: 'Research Collaboration - MIT', status: 'approved', priority: 'high', time: '2 min ago' },
    { id: 2, title: 'Internship - Google', status: 'pending', priority: 'medium', time: '5 min ago' },
    { id: 3, title: 'Conference Attendance - IEEE', status: 'approved', priority: 'high', time: '8 min ago' },
    { id: 4, title: 'Study Abroad - Oxford', status: 'processing', priority: 'low', time: '12 min ago' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        totalRequests: Math.min(prev.totalRequests + 1, 2847),
        approved: Math.min(prev.approved + 1, 2634),
        pending: Math.max(prev.pending - 1, 156),
        processingTime: Math.max(prev.processingTime - 0.01, 1.2)
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Live Dashboard Preview</h3>
          <p className="text-white/70">Real-time NOC management analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">
                    {stat.value === 1.2 ? `${stat.value.toFixed(1)}h` : stat.value.toLocaleString()}
                  </p>
                  <p className="text-green-400 text-xs">{stat.change}</p>
                </div>
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card className="border-0 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm truncate">{request.title}</p>
                    <p className="text-white/60 text-xs">{request.time}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(request.status)} border-0 text-xs`}>
                      {request.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(request.priority)} border-0 text-xs`}>
                      {request.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-0 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Performance Boost</span>
                </div>
                <p className="text-white/80 text-sm">
                  Processing time reduced by 75% this month through AI optimization
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm font-medium">Priority Alert</span>
                </div>
                <p className="text-white/80 text-sm">
                  12 high-priority requests detected requiring immediate attention
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">Quality Score</span>
                </div>
                <p className="text-white/80 text-sm">
                  Request quality improved by 23% with automated validation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPreview;
