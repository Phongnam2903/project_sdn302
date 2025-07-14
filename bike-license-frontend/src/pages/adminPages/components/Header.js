import { useState } from "react"
import { Navbar, Container, Nav, Button, Image, Dropdown, Badge } from "react-bootstrap"
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Maximize,
  MessageSquare,
  HelpCircle,
} from "lucide-react"

const Header = ({ user, onLogout, onToggleSidebar, notifications = [] }) => {
  const [darkMode, setDarkMode] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // Implement dark mode logic here
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <Navbar className="admin-header" variant="dark" expand="lg">
      <Container fluid className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <Button variant="ghost" className="sidebar-toggle" onClick={onToggleSidebar}>
            <Menu size={20} />
          </Button>

          <Navbar.Brand className="admin-brand">
            <div className="brand-content">
              <div className="brand-icon">⚡</div>
              <div className="brand-text">
                <span className="brand-title">Admin Panel</span>
                <span className="brand-subtitle">Quản lý hệ thống</span>
              </div>
            </div>
          </Navbar.Brand>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div className={`search-container ${searchFocused ? "focused" : ""}`}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, đề thi, người dùng..."
              className="search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="search-shortcut">⌘K</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="header-right">
          <Nav className="header-nav">
            {/* Quick Actions */}
            <Button variant="ghost" className="header-action" onClick={toggleFullscreen}>
              <Maximize size={18} />
            </Button>

            <Button variant="ghost" className="header-action" onClick={toggleDarkMode}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* Notifications */}
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="ghost" className="header-action notification-btn">
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <Badge bg="danger" className="notification-badge">
                    {unreadNotifications}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="notification-menu">
                <div className="notification-header">
                  <h6>Thông báo</h6>
                  <Badge bg="primary">{unreadNotifications} mới</Badge>
                </div>
                <div className="notification-list">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <div key={index} className={`notification-item ${!notification.read ? "unread" : ""}`}>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-text">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <Button variant="link" size="sm">
                    Xem tất cả thông báo
                  </Button>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* Help */}
            <Button variant="ghost" className="header-action">
              <HelpCircle size={18} />
            </Button>

            {/* User Menu */}
            <Dropdown align="end">
              <Dropdown.Toggle as={Button} variant="ghost" className="user-menu-toggle">
                <div className="user-info">
                  <Image
                    src="/images/avatar_default.png"
                    roundedCircle
                    width={32}
                    height={32}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <span className="user-name">{user.name}</span>
                    <span className="user-role">{user.role}</span>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-menu">
                <div className="user-menu-header">
                  <Image
                    src="/images/avatar_default.png"
                    roundedCircle
                    width={40}
                    height={40}
                    className="user-avatar-large"
                  />
                  <div className="user-info-large">
                    <div className="user-name-large">{user.name}</div>
                    <div className="user-email">admin@example.com</div>
                  </div>
                </div>

                <Dropdown.Divider />

                <Dropdown.Item className="user-menu-item">
                  <User size={16} className="me-2" />
                  Hồ sơ cá nhân
                </Dropdown.Item>

                <Dropdown.Item className="user-menu-item">
                  <Settings size={16} className="me-2" />
                  Cài đặt
                </Dropdown.Item>

                <Dropdown.Item className="user-menu-item">
                  <MessageSquare size={16} className="me-2" />
                  Hỗ trợ
                </Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item className="user-menu-item logout-item" onClick={onLogout}>
                  <LogOut size={16} className="me-2" />
                  Đăng xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  )
}

export default Header
