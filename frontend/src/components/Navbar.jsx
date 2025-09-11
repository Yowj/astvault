import { useState } from "react";
import ThemeController from "./ui/ThemeController";
import OnlineUsers from "./templates/OnlineUsers";
import { LogOut, Menu, X, Bot, FileText, Home, User, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { logoutMutation, isPending } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  let name;
  let pic;

  if (authUser) {
    name = authUser.fullName;
    pic = authUser.profilePicture || "/kratos.png";
    console.log(authUser)
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    logoutMutation();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveLink = (path) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/grammar-enhancer", label: "Grammar AI", icon: FileText },
    { path: "/askAi", label: "Chat AI", icon: Bot },
  ];

  return (
    <>
      <nav className="bg-base-300 w-full border-b-2 border-primary shadow-lg sticky top-0 z-50 px-8">
        <div className=" w-full mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-12 sm:h-14 lg:h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 min-w-0">
              <div className="text-lg sm:text-xl lg:text-2xl">📚</div>
              <Link
                to="/"
                className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-105 transition-transform duration-200 truncate"
                onClick={closeMobileMenu}
              >
                <span className="hidden xs:inline">Liber Reverie</span>
                <span className="xs:hidden">LR</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {authUser && (
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`btn btn-xs lg:btn-sm gap-1 lg:gap-2 transition-all duration-200 ${
                      isActiveLink(item.path)
                        ? "btn-primary shadow-md"
                        : "btn-ghost hover:btn-outline"
                    }`}
                  >
                    <item.icon className="w-3 h-3 lg:w-4 lg:h-4" />
                    <span className="text-xs lg:text-sm">{item.label}</span>
                  </Link>
                ))}
                <div className="btn btn-xs lg:btn-sm gap-1 lg:gap-2 transition-all duration-200 btn-ghost hover:btn-outline">
                  <ThemeController />
                </div>
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Theme Controller - Always visible */}

              {authUser && (
                <>
                  {/* Online Users */}
                  <OnlineUsers />
                </>
              )}

              {authUser && (
                <>
                  {/* User Name - Desktop only */}
                  <div className="hidden xl:block">
                    <p className="text-primary text-xs lg:text-sm font-medium truncate max-w-24">
                      AST {name}
                    </p>
                  </div>

                  {/* Profile Button - Desktop */}
                  <Link
                    to="/profile"
                    className="hidden sm:flex btn btn-xs lg:btn-sm gap-1 lg:gap-2 hover:btn-outline transition-all duration-200"
                  >
                    <img
                      src={pic}
                      className="w-4 h-4 lg:w-6 lg:h-6 rounded-full object-cover"
                      alt="Profile"
                    />
                    <span className="hidden lg:inline text-xs lg:text-sm">Profile</span>
                  </Link>

                  {/* Logout Button - Desktop */}
                  <button
                    className="hidden sm:flex btn btn-xs lg:btn-sm gap-1 lg:gap-2 hover:btn-error transition-all duration-200"
                    onClick={handleLogout}
                  >
                    {isPending ? (
                      <span className="animate-spin">
                        <Loader2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      </span>
                    ) : (
                      <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                    <span className="hidden lg:inline text-xs lg:text-sm">Logout</span>
                  </button>

                  {/* Mobile Profile Avatar */}
                  <div className="sm:hidden">
                    <img
                      src={pic}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-primary"
                      alt="Profile"
                    />
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden btn btn-xs sm:btn-sm btn-square btn-ghost"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-base-200 bg-base-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-2 sm:px-3 py-2 sm:py-3 space-y-1 sm:space-y-2">
              {/* Mobile Theme Controller */}
              <div className="flex items-center justify-between py-1 sm:py-2">
                <ThemeController />
              </div>

              <div className="divider my-2"></div>

              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                    isActiveLink(item.path)
                      ? "bg-primary text-primary-content shadow-md"
                      : "hover:bg-base-300"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </Link>
              ))}

              {authUser && (
                <>
                  <div className="divider my-2"></div>

                  {/* Mobile User Info */}
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-base-100 rounded-lg">
                    <img
                      src={pic}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      alt="Profile"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm truncate">AST {name}</p>
                      <p className="text-xs opacity-60">Authenticated User</p>
                    </div>
                  </div>

                  {/* Mobile Profile Link */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-base-300 transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Profile Settings</span>
                  </Link>

                  {/* Mobile Logout */}
                  <button
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-error hover:text-error-content transition-all duration-200 w-full text-left"
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navbar;
