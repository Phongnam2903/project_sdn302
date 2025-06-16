import { Nav } from "react-bootstrap";

const Sidebar = ({ onSelect, active }) => {
  return (
    <Nav
      className="flex-column bg-light p-3 h-100"
      style={{ minHeight: "100vh" }}
    >
      <Nav.Link
        active={active === "questions"}
        onClick={() => onSelect("questions")}
      >
        📄 Danh sách câu hỏi
      </Nav.Link>
      <Nav.Link active={active === "add"} onClick={() => onSelect("add")}>
        ➕ Thêm câu hỏi
      </Nav.Link>
    </Nav>
  );
};

export default Sidebar;
