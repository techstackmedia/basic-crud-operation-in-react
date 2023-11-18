import footerModule from './index.module.css';
const Footer = ({ children }) => {
  return (
    <footer className={footerModule.footer}>
      <p>{children}</p>
    </footer>
  );
};

export default Footer;
