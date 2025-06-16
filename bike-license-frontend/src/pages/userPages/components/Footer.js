import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="border-top mt-5 pt-3 pb-4 text-center">
      <Container>
        <p className="mb-1">
          <strong>BẢN QUYỀN THUỘC:</strong>{" "}
          <a
            href="https://hoclaixemoto.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary fw-bold"
          >
            TRƯỜNG DẠY LÁI XE TÂN SƠN
          </a>
        </p>
        <p className="mb-3">
          <strong>HOTLINE:</strong>{" "}
          <a href="tel:0932696911" className="text-primary fw-bold">
            0932696911
          </a>{" "}
          - THẦY TRƯỜNG
        </p>
        <img
          src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=5bd12f7e-cb2f-476f-9ff5-ff8e340ec7d5"
          alt="DMCA Protection"
          width="120"
          height="25"
        />
      </Container>
    </footer>
  );
};

export default Footer;
