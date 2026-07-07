import { footerColumns } from '../data/staticContent';

// Footer — the 4-column link footer plus the
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Static footer: 4 columns of links */}
        <div className="footer__cols">
          {footerColumns.map((col) => (
            <div className="footer__col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#!">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="footer__rule" />

        {/* Copyright footer */}
        <div className="footer__bottom">
          <div className="footer__copy">
            © {new Date().getFullYear()} Airbnb clone · Privacy · Terms · Sitemap
          </div>
          <div className="footer__prefs">
            <button className="footer__pref">English (ZA)</button>
            <button className="footer__pref">R ZAR</button>
            <div className="footer__social" aria-label="Social links">
              <a href="#!" aria-label="Facebook">
                Fb
              </a>
              <a href="#!" aria-label="Twitter">
                Tw
              </a>
              <a href="#!" aria-label="Instagram">
                Ig
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
