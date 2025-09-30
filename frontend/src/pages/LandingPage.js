import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  FileText, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Eye, 
  Building,
  Clock,
  UserCheck,
  Settings,
  BarChart3,
  Award,
  Zap,
  Globe,
  Smartphone,
  Laptop,
  Database,
  Lock,
  Activity,
  PieChart,
  TrendingUp,
  FileCheck,
  MessageSquare,
  Calendar,
  Target,
  BookOpen,
  HelpCircle,
  Info
} from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeFeature, setActiveFeature] = useState(0);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Digital NOC Requests",
      description: "Submit and track No Objection Certificate requests through our secure online platform.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Role-Based Access",
      description: "Different interfaces for Students, Faculty, and Administrators with appropriate permissions.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security with encrypted data transmission and secure authentication.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive reporting and analytics for administrators to monitor system usage.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Certificate Generation",
      description: "Automated generation of official NOC certificates with digital signatures.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Priority Management",
      description: "Intelligent priority calculation based on request content and urgency indicators.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const userRoles = [
    {
      role: "Student",
      icon: <GraduationCap className="h-6 w-6" />,
      description: "Submit NOC requests, track status, and download certificates",
      features: [
        "Create new NOC requests",
        "Upload required documents",
        "Track request status",
        "Download approved certificates",
        "View request history"
      ],
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      role: "Faculty",
      icon: <UserCheck className="h-6 w-6" />,
      description: "Review and approve student NOC requests",
      features: [
        "Review submitted requests",
        "Approve or reject requests",
        "Add review comments",
        "View analytics dashboard",
        "Generate certificates"
      ],
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      role: "Administrator",
      icon: <Shield className="h-6 w-6" />,
      description: "Full system access and management capabilities",
      features: [
        "Manage all NOC requests",
        "System analytics and reports",
        "User management",
        "Priority configuration",
        "System settings"
      ],
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Access System",
      description: "Log in with your institutional credentials to access the NOC management system.",
      icon: <Users className="h-6 w-6" />
    },
    {
      step: "02",
      title: "Submit Request",
      description: "Students can create NOC requests with required documents and detailed descriptions.",
      icon: <FileText className="h-6 w-6" />
    },
    {
      step: "03",
      title: "Review Process",
      description: "Faculty and administrators review requests, add comments, and make approval decisions.",
      icon: <Eye className="h-6 w-6" />
    },
    {
      step: "04",
      title: "Receive Certificate",
      description: "Once approved, students can download their official NOC certificates.",
      icon: <Award className="h-6 w-6" />
    }
  ];

  const [systemStats, setSystemStats] = useState([
    { label: "Total Requests", value: "1,247", icon: <FileText className="h-5 w-5" /> },
    { label: "Active Users", value: "456", icon: <Users className="h-5 w-5" /> },
    { label: "Departments", value: "12", icon: <Building className="h-5 w-5" /> },
    { label: "Success Rate", value: "94%", icon: <CheckCircle className="h-5 w-5" /> }
  ]);

  // Simulate realistic metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prevStats => 
        prevStats.map(stat => {
          if (stat.label === "Total Requests") {
            const currentValue = parseInt(stat.value.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 3) + 1; // 1-3 new requests
            return { ...stat, value: (currentValue + increment).toLocaleString() };
          }
          if (stat.label === "Active Users") {
            const currentValue = parseInt(stat.value);
            const change = Math.floor(Math.random() * 6) - 3; // -3 to +3 users
            const newValue = Math.max(400, Math.min(500, currentValue + change));
            return { ...stat, value: newValue.toString() };
          }
          if (stat.label === "Success Rate") {
            const currentValue = parseFloat(stat.value.replace('%', ''));
            const change = (Math.random() - 0.5) * 2; // -1 to +1 percentage
            const newValue = Math.max(90, Math.min(98, currentValue + change));
            return { ...stat, value: newValue.toFixed(1) + '%' };
          }
          return stat;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  NOC Management System
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Institutional Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Info className="h-4 w-4" />
              <span>Institutional NOC Management Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Digital No Objection
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Certificate System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A comprehensive platform for managing NOC requests, approvals, and certificate generation 
              for academic institutions. Streamline your workflow with our secure and efficient system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/signup" className="flex items-center space-x-2">
                  <span>Access System</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login" className="flex items-center space-x-2">
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* System Statistics */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">System Statistics</h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live data updates every 5 seconds</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {systemStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 transition-all duration-500">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools for efficient NOC request management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                data-animate
                id={`feature-${index}`}
                className={`hover:shadow-lg transition-all duration-300 ${
                  isVisible[`feature-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } ${activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">User Access Levels</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different interfaces and permissions for various user types
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((user, index) => (
              <Card 
                key={index} 
                data-animate
                id={`role-${index}`}
                className={`hover:shadow-lg transition-all duration-300 ${
                  isVisible[`role-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mx-auto mb-4">
                    {user.icon}
                  </div>
                  <CardTitle className="text-2xl">{user.role}</CardTitle>
                  <CardDescription>{user.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {user.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Badge className={`mt-6 ${user.color} border-0`}>
                    {user.role} Access
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Workflow</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process for NOC request management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                data-animate
                id={`step-${index}`}
                className={`text-center ${
                  isVisible[`step-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-8"></div>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Requirements Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">System Requirements</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Technical specifications and compatibility information
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Web Browser</h3>
                <p className="text-gray-600">Compatible with all modern browsers including Chrome, Firefox, Safari, and Edge</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Access</h3>
                <p className="text-gray-600">Fully responsive design optimized for mobile devices and tablets</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Security</h3>
                <p className="text-gray-600">Enterprise-grade security with encrypted connections and secure authentication</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Need Help?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Access system documentation, user guides, and support resources
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link to="/signup" className="flex items-center space-x-2">
                <span>Access System</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login" className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Get Help</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">NOC Management System</h3>
                  <p className="text-blue-300 text-sm">Institutional Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                A comprehensive platform for managing No Objection Certificate requests, 
                approvals, and certificate generation for academic institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">System Access</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400">User Guide</span></li>
                <li><span className="text-gray-400">System Documentation</span></li>
                <li><span className="text-gray-400">Technical Support</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NOC Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;