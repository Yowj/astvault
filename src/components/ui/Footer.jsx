import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content h-16 p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by Yowj Technologies Ltd
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
