import { Nav } from "react-bootstrap";
import { FaClipboardList, FaPlusCircle, FaBookOpen } from "react-icons/fa";
import "../../adminPages/style/sidebar.css";

const Sidebar = ({ onSelect, active }) => {
  const menuItems = [
    { key: "questions", label: "Danh sách câu hỏi", icon: <FaClipboardList /> },
    { key: "add", label: "Thêm câu hỏi", icon: <FaPlusCircle /> },
    { key: "exams", label: "Danh sách đề thi", icon: <FaBookOpen /> },
  ];

  return (
    <Nav className="flex-column sidebar-custom bg-dark p-3 shadow-sm">
      {menuItems.map((item) => (
        <Nav.Link
          key={item.key}
          active={active === item.key}
          onClick={() => onSelect(item.key)}
          className={`sidebar-item ${active === item.key ? "active-item" : ""}`}
        >
          <span className="me-2">{item.icon}</span>
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );
};

export default Sidebar;
