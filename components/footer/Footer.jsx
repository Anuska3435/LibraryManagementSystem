import {
  FaArrowUp,
  FaBook,
  FaBookOpen,
  FaChartBar,
  FaClock,
  FaCog,
  FaEnvelope,
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
  FaUsers,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { name: "Dashboard", href: "#" },
    { name: "Browse Books", href: "#" },
    { name: "Member Portal", href: "#" },
    { name: "Digital Library", href: "#" },
    { name: "Reservations", href: "#" },
    { name: "Help Center", href: "#" },
  ];

  const services = [
    { name: "Book Lending", href: "#" },
    { name: "Digital Resources", href: "#" },
    { name: "Research Assistance", href: "#" },
    { name: "Study Rooms", href: "#" },
    { name: "Events & Programs", href: "#" },
    { name: "Inter-library Loans", href: "#" },
  ];

  const support = [
    { name: "FAQ", href: "#" },
    { name: "Contact Support", href: "#" },
    { name: "User Guide", href: "#" },
    { name: "System Status", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      href: "#",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      href: "#",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "#",
      color: "hover:text-pink-600",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      href: "#",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white font-display">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FaBook className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">LibraryMS</h3>
                <p className="text-sm text-gray-400">Management System</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your comprehensive library management solution. Streamlining book
              lending, member management, and digital resources for modern
              libraries.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <FaMapMarkerAlt className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Library Street, Knowledge City, KC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <FaPhone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <FaEnvelope className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">info@libraryms.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <FaClock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">
                  Mon-Fri: 8AM-8PM, Sat-Sun: 10AM-6PM
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">
              Support & Updates
            </h4>
            <ul className="space-y-3 mb-6">
              {support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter Signup */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="text-sm font-semibold mb-3 text-white">
                Newsletter
              </h5>
              <p className="text-xs text-gray-400 mb-3">
                Get updates about new features and library news.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <FaBookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15,240</div>
              <div className="text-sm text-gray-400">Books Available</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <FaUsers className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3,567</div>
              <div className="text-sm text-gray-400">Active Members</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <FaChartBar className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">89%</div>
              <div className="text-sm text-gray-400">User Satisfaction</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <FaCog className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-gray-400">System Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© 2025 LibraryMS. Made with</span>
              <FaHeart className="h-4 w-4 text-red-500" />
              <span>for libraries everywhere.</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`text-gray-400 ${social.color} transition-colors duration-200`}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <span>Back to top</span>
              <FaArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
