import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Estilos para os links do desktop
  const desktopLinkClasses =
    "px-4 py-2 rounded-md text-sm font-bold transition-colors";
  const desktopActiveLink = "bg-gray-200 text-black";
  const desktopInactiveLink = "bg-white text-black hover:bg-gray-100";

  // Estilos para os links do menu móvel
  const mobileLinkClasses =
    "block px-3 py-2 rounded-md text-base font-medium transition-colors";
  const mobileActiveLink = "bg-gray-900 text-white";
  const mobileInactiveLink = "text-gray-300 hover:bg-gray-700 hover:text-white";

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-black shadow-lg relative">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-lg text-white">
              <span className="font-black text-2xl text-white">K3</span> BANK
            </NavLink>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${desktopLinkClasses} ${
                    isActive ? desktopActiveLink : desktopInactiveLink
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/clients"
                className={({ isActive }) =>
                  `${desktopLinkClasses} ${
                    isActive ? desktopActiveLink : desktopInactiveLink
                  }`
                }
              >
                Clientes
              </NavLink>
              <NavLink
                to="/transfer"
                className={({ isActive }) =>
                  `${desktopLinkClasses} ${
                    isActive ? desktopActiveLink : desktopInactiveLink
                  }`
                }
              >
                Transferir
              </NavLink>
            </div>
          </div>
          {/* Botão do menu móvel */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Painel do menu móvel */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${mobileLinkClasses} ${
                  isActive ? mobileActiveLink : mobileInactiveLink
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/clients"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${mobileLinkClasses} ${
                  isActive ? mobileActiveLink : mobileInactiveLink
                }`
              }
            >
              Clientes
            </NavLink>
            <NavLink
              to="/transfer"
              onClick={closeMenu}
              className={({ isActive }) =>
                `${mobileLinkClasses} ${
                  isActive ? mobileActiveLink : mobileInactiveLink
                }`
              }
            >
              Transferir
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
