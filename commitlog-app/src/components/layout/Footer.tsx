const Footer = () => {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-[#e9f1ee] dark:border-white/10 py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand Info */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-6 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xs">
                  terminal
                </span>
              </div>
              <h2 className="text-md font-extrabold tracking-tight">
                CommitLog
              </h2>
            </div>
            <p className="text-[#578e77] text-sm leading-relaxed">
              The world's first AI-driven build-in-public platform. Documenting
              your journey shouldn't be a chore.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="font-bold text-sm mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-[#578e77]">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Integrations
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-[#578e77]">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Documentation
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Guides
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-[#578e77]">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Terms
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-[#e9f1ee] dark:border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-[#578e77]">
            © 2026 CommitLog Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              className="text-[#578e77] hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a
              className="text-[#578e77] hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">group</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
