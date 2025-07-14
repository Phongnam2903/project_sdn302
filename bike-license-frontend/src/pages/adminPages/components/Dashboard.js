import { useState } from "react";
import { Row, Col, Card, Button, Badge, ProgressBar } from "react-bootstrap";
import {
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  RefreshCw,
  Target,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie as RechartsPie,
  Cell,
} from "recharts";

const Dashboard = ({ questions, exams, users, analytics, onRefresh }) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Mock data for charts
  const examTrendsData = [
    { date: "2024-01-01", exams: 45, passed: 38 },
    { date: "2024-01-02", exams: 52, passed: 44 },
    { date: "2024-01-03", exams: 48, passed: 41 },
    { date: "2024-01-04", exams: 61, passed: 52 },
    { date: "2024-01-05", exams: 55, passed: 47 },
    { date: "2024-01-06", exams: 67, passed: 58 },
    { date: "2024-01-07", exams: 59, passed: 51 },
  ];

  const categoryData = [
    { name: "Biển báo", value: 35, color: "#3b82f6" },
    { name: "Điểm liệt", value: 25, color: "#ef4444" },
    { name: "Luật giao thông", value: 20, color: "#10b981" },
    { name: "Kỹ thuật lái xe", value: 15, color: "#f59e0b" },
    { name: "Khác", value: 5, color: "#8b5cf6" },
  ];

  const stats = [
    {
      title: "Tổng người dùng",
      value: users?.length || 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "primary",
      description: "So với tháng trước",
    },
    {
      title: "Câu hỏi",
      value: questions?.length || 0,
      change: "+5%",
      trend: "up",
      icon: BookOpen,
      color: "success",
      description: "Câu hỏi trong hệ thống",
    },
    {
      title: "Đề thi",
      value: exams?.length || 0,
      change: "+8%",
      trend: "up",
      icon: Award,
      color: "warning",
      description: "Đề thi đã tạo",
    },
    {
      title: "Tỷ lệ đậu",
      value: "87%",
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "info",
      description: "Tỷ lệ đậu trung bình",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "exam_completed",
      user: "Nguyễn Văn A",
      action: "đã hoàn thành đề thi A1-001",
      time: "5 phút trước",
      status: "passed",
    },
    {
      id: 2,
      type: "question_added",
      user: "Admin",
      action: "đã thêm 5 câu hỏi mới",
      time: "15 phút trước",
      status: "success",
    },
    {
      id: 3,
      type: "user_registered",
      user: "Trần Thị B",
      action: "đã đăng ký tài khoản",
      time: "30 phút trước",
      status: "info",
    },
    {
      id: 4,
      type: "exam_failed",
      user: "Lê Văn C",
      action: "không đạt đề thi A1-002",
      time: "1 giờ trước",
      status: "failed",
    },
  ];

  const topPerformers = [
    { name: "Nguyễn Văn A", score: 25, exams: 12, avatar: "👨‍🎓" },
    { name: "Trần Thị B", score: 24, exams: 8, avatar: "👩‍🎓" },
    { name: "Lê Văn C", score: 23, exams: 15, avatar: "👨‍💼" },
    { name: "Phạm Thị D", score: 22, exams: 6, avatar: "👩‍💼" },
    { name: "Hoàng Văn E", score: 21, exams: 9, avatar: "👨‍🔧" },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="dashboard-title">
              <Activity className="title-icon" />
              Dashboard
            </h1>
            <p className="dashboard-subtitle">
              Tổng quan hệ thống quản lý thi bằng lái
            </p>
          </div>
          <div className="header-actions">
            <div className="time-range-selector">
              <Button
                variant={timeRange === "24h" ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setTimeRange("24h")}
              >
                24h
              </Button>
              <Button
                variant={timeRange === "7d" ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setTimeRange("7d")}
              >
                7 ngày
              </Button>
              <Button
                variant={timeRange === "30d" ? "primary" : "outline-secondary"}
                size="sm"
                onClick={() => setTimeRange("30d")}
              >
                30 ngày
              </Button>
            </div>
            <Button
              variant="outline-primary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`me-1 ${refreshing ? "spinning" : ""}`}
                size={16}
              />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="stats-row g-4 mb-4">
        {stats.map((stat, index) => (
          <Col key={index} xl={3} lg={6} md={6}>
            <Card className={`stat-card stat-${stat.color}`}>
              <Card.Body>
                <div className="stat-content">
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-title">{stat.title}</div>
                    <div className="stat-description">{stat.description}</div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <stat.icon className="stat-icon" size={24} />
                  </div>
                </div>
                <div className="stat-footer">
                  <span className={`stat-change ${stat.trend}`}>
                    <TrendingUp size={14} />
                    {stat.change}
                  </span>
                  <span className="stat-period">so với kỳ trước</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* Charts Section */}
        <Col xl={8}>
          {/* Exam Trends Chart */}
          <Card className="chart-card mb-4">
            <Card.Header className="chart-header">
              <div className="chart-title">
                <BarChart3 className="me-2" size={20} />
                Xu hướng thi cử
              </div>
              <div className="chart-actions">
                <Button variant="outline-secondary" size="sm">
                  <Download size={14} className="me-1" />
                  Xuất
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={examTrendsData}>
                    <defs>
                      <linearGradient
                        id="colorExams"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorPassed"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="exams"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorExams)"
                      strokeWidth={2}
                      name="Tổng bài thi"
                    />
                    <Area
                      type="monotone"
                      dataKey="passed"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorPassed)"
                      strokeWidth={2}
                      name="Đã đậu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>

          {/* Recent Activities */}
          <Card className="activity-card">
            <Card.Header className="activity-header">
              <div className="activity-title">
                <Clock className="me-2" size={20} />
                Hoạt động gần đây
              </div>
              <Button variant="outline-secondary" size="sm">
                <Eye size={14} className="me-1" />
                Xem tất cả
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="activity-list">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-avatar">
                      <div className={`activity-icon ${activity.status}`}>
                        {activity.status === "passed" && (
                          <CheckCircle size={16} />
                        )}
                        {activity.status === "failed" && (
                          <AlertTriangle size={16} />
                        )}
                        {activity.status === "success" && (
                          <CheckCircle size={16} />
                        )}
                        {activity.status === "info" && <Users size={16} />}
                      </div>
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <strong>{activity.user}</strong> {activity.action}
                      </div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                    <div className="activity-status">
                      <Badge
                        bg={
                          activity.status === "passed"
                            ? "success"
                            : activity.status === "failed"
                            ? "danger"
                            : "primary"
                        }
                      >
                        {activity.status === "passed"
                          ? "Đậu"
                          : activity.status === "failed"
                          ? "Rớt"
                          : "Mới"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Sidebar */}
        <Col xl={4}>
          {/* Category Distribution */}
          <Card className="chart-card mb-4">
            <Card.Header className="chart-header">
              <div className="chart-title">
                <PieChart className="me-2" size={20} />
                Phân bố câu hỏi
              </div>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPie>
                  <Tooltip />
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                {categoryData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Top Performers */}
          <Card className="performers-card">
            <Card.Header className="performers-header">
              <div className="performers-title">
                <Target className="me-2" size={20} />
                Học viên xuất sắc
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="performers-list">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="performer-item">
                    <div className="performer-rank">#{index + 1}</div>
                    <div className="performer-avatar">{performer.avatar}</div>
                    <div className="performer-info">
                      <div className="performer-name">{performer.name}</div>
                      <div className="performer-stats">
                        {performer.exams} bài thi • Điểm cao nhất:{" "}
                        {performer.score}
                      </div>
                    </div>
                    <div className="performer-score">
                      <div className="score-value">{performer.score}/25</div>
                      <ProgressBar
                        variant="success"
                        now={(performer.score / 25) * 100}
                        className="score-progress"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
