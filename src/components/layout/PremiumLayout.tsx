"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Layers,
  Target,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Shield,
  GitBranch,
  Box,
  Zap,
  Trophy,
  Flame,
  Code2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
  badge?: string;
  progress?: number;
}

interface UserProgress {
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  completedLessons: string[];
  totalLessons: number;
}

// ============================================================================
// MOCK DATA - User Progress (Replace with real data from your backend)
// ============================================================================

const defaultUserProgress: UserProgress = {
  level: 5,
  xp: 750,
  maxXp: 1000,
  streak: 7,
  completedLessons: ["encapsulation-basics", "inheritance-intro"],
  totalLessons: 20,
};

// ============================================================================
// NAVIGATION DATA
// ============================================================================

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: <Home className="w-7 h-7" />,
  },
  {
    id: "four-pillars",
    label: "Four Pillars",
    href: "#pillars",
    icon: <Layers className="w-7 h-7" />,
    children: [
      {
        id: "encapsulation",
        label: "Encapsulation",
        href: "/pillars/encapsulation",
        icon: <Shield className="w-8 h-8" />,
        progress: 65,
      },
      {
        id: "inheritance",
        label: "Inheritance",
        href: "/pillars/inheritance",
        icon: <GitBranch className="w-8 h-8" />,
        progress: 40,
      },
      {
        id: "polymorphism",
        label: "Polymorphism",
        href: "/pillars/polymorphism",
        icon: <Box className="w-8 h-8" />,
        progress: 20,
      },
      {
        id: "abstraction",
        label: "Abstraction",
        href: "/pillars/abstraction",
        icon: <Zap className="w-8 h-8" />,
        progress: 10,
      },
    ],
  },
  {
    id: "practice",
    label: "Practice Arena",
    href: "/practice",
    icon: <Target className="w-7 h-7" />,
    badge: "New",
  },
  {
    id: "progress",
    label: "Progress & Stats",
    href: "/progress",
    icon: <BarChart3 className="w-7 h-7" />,
  },
];

// ============================================================================
// CONTEXT
// ============================================================================

interface LayoutContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  userProgress: UserProgress;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a PremiumLayout");
  }
  return context;
};

// ============================================================================
// COMPONENTS
// ============================================================================

// --- User Progress Indicator Component ---
const UserProgressIndicator: React.FC<{ progress: UserProgress; collapsed?: boolean }> = ({
  progress,
  collapsed = false,
}) => {
  const progressPercentage = (progress.xp / progress.maxXp) * 100;
  const overallProgress = (progress.completedLessons.length / progress.totalLessons) * 100;

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 p-2">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {progress.level}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-0.5">
            <Flame className="w-5 h-5 text-white" />
          </div>
        </div>
        <span className="text-base text-gray-400">{progress.streak}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {progress.level}
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 bg-orange-500 rounded-full p-1"
          >
            <Flame className="w-5 h-5 text-white" />
          </motion.div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-white">Level {progress.level}</span>
            <span className="text-base text-gray-400">{progress.xp}/{progress.maxXp} XP</span>
          </div>
          <div className="mt-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-base">
        <div className="flex items-center gap-1 text-orange-400">
          <Flame className="w-5 h-5" />
          <span>{progress.streak} day streak</span>
        </div>
        <div className="text-gray-400">
          {Math.round(overallProgress)}% complete
        </div>
      </div>
    </motion.div>
  );
};

// --- Breadcrumb Component ---
const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const getBreadcrumbLabel = (segment: string) => {
    const labels: Record<string, string> = {
      "pillars": "Four Pillars",
      "encapsulation": "Encapsulation",
      "inheritance": "Inheritance",
      "polymorphism": "Polymorphism",
      "abstraction": "Abstraction",
      "practice": "Practice Arena",
      "progress": "Progress & Stats",
    };
    return labels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  if (pathname === "/") return null;

  return (
    <nav className="flex items-center gap-2 text-lg text-gray-400 mb-4">
      <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
        <Home className="w-8 h-8" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {pathSegments.map((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={segment}>
            <ChevronRight className="w-8 h-8 text-gray-600" />
            {isLast ? (
              <span className="text-white font-medium">{getBreadcrumbLabel(segment)}</span>
            ) : (
              <Link href={href} className="hover:text-white transition-colors">
                {getBreadcrumbLabel(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// --- Nav Item Component ---
const NavItemComponent: React.FC<{
  item: NavItem;
  depth?: number;
  collapsed?: boolean;
}> = ({ item, depth = 0, collapsed = false }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(isActive);

  useEffect(() => {
    if (isActive && hasChildren) {
      setExpanded(true);
    }
  }, [isActive, hasChildren]);

  const itemContent = (
    <div
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
        ${isActive
          ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30"
          : "text-gray-400 hover:text-white hover:bg-white/5"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <span className={isActive ? "text-blue-400" : ""}>{item.icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 text-lg font-medium">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-base bg-green-500/20 text-green-400 rounded-full">
              {item.badge}
            </span>
          )}
          {item.progress !== undefined && !hasChildren && (
            <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          )}
          {hasChildren && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          )}
        </>
      )}
    </div>
  );

  if (collapsed && hasChildren) {
    return (
      <div className="relative group">
        <Link href={item.href} className="block">
          {itemContent}
        </Link>
        {/* Tooltip for collapsed state */}
        <div className="absolute left-full top-0 ml-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
          <div className="px-3 py-2 text-lg font-semibold text-white border-b border-slate-700">
            {item.label}
          </div>
          {item.children?.map((child) => (
            <Link
              key={child.id}
              href={child.href}
              className={`
                flex items-center gap-2 px-3 py-2 text-lg transition-colors
                ${pathname === child.href ? "text-blue-400 bg-blue-500/10" : "text-gray-400 hover:text-white hover:bg-white/5"}
              `}
            >
              {child.icon}
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {hasChildren ? (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-left"
        >
          {itemContent}
        </button>
      ) : (
        <Link href={item.href} className="block">
          {itemContent}
        </Link>
      )}

      {/* Expandable children */}
      <AnimatePresence>
        {hasChildren && expanded && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 pl-4 border-l border-slate-700/50 mt-1 space-y-1">
              {item.children?.map((child) => (
                <Link key={child.id} href={child.href} className="block">
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                      ${pathname === child.href
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }
                    `}
                  >
                    {child.icon}
                    <span className="flex-1 text-lg">{child.label}</span>
                    {child.progress !== undefined && (
                      <span className="text-base text-gray-600">{child.progress}%</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar: React.FC<{
  collapsed: boolean;
  userProgress: UserProgress;
  onToggle: () => void;
}> = ({ collapsed, userProgress, onToggle }) => {
  return (
    <>
      {/* Overlay backdrop when expanded on smaller screens */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? 80 : 280,
          x: 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-screen z-40
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
          border-r border-slate-800/50
          flex flex-col
          shadow-2xl shadow-black/50
        `}
      >
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold text-white">OOP</span>
                <span className="text-base text-gray-400">Visualizer</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* User Progress */}
      <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
        <UserProgressIndicator progress={userProgress} collapsed={collapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800/50 space-y-2">
        <button
          onClick={onToggle}
          className={`
            flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
            text-gray-400 hover:text-white hover:bg-white/5 w-full
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {collapsed ? <ChevronRight className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </motion.div>
          {!collapsed && <span className="text-lg font-medium">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
};

// --- Mobile Header Component ---
const MobileHeader: React.FC<{
  onMenuToggle: () => void;
  userProgress: UserProgress;
}> = ({ onMenuToggle, userProgress }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 lg:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="w-8 h-8" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-lg font-bold text-white">OOP</span>
          </Link>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-orange-400">
            <Flame className="w-8 h-8" />
            <span className="text-lg font-semibold">{userProgress.streak}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
            {userProgress.level}
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Mobile Menu Overlay ---
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userProgress: UserProgress;
}> = ({ isOpen, onClose, userProgress }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 z-50 bg-slate-900 border-r border-slate-800 lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <Link href="/" className="flex items-center gap-3" onClick={onClose}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Code2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">OOP Visualizer</span>
                    <span className="text-base text-gray-400">Master Java OOP</span>
                  </div>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* User Progress */}
              <div className="p-4">
                <UserProgressIndicator progress={userProgress} />
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                  <div key={item.id} onClick={() => !item.children && onClose()}>
                    <NavItemComponent item={item} />
                  </div>
                ))}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 text-gray-400">
                  <GraduationCap className="w-7 h-7" />
                  <span className="text-lg">Keep learning daily!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Footer Component ---
const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-8 border-t border-slate-800/50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-white font-semibold">OOP Visualizer</span>
              <p className="text-base text-gray-500">Interactive Java OOP Learning</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-lg text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/practice" className="hover:text-white transition-colors">Practice</Link>
            <Link href="/progress" className="hover:text-white transition-colors">Progress</Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-base text-gray-500">
              <BookOpen className="w-8 h-8" />
              <span>© 2024 OOP Visualizer</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Transition Wrapper ---
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// MAIN PREMIUM LAYOUT COMPONENT
// ============================================================================

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export const PremiumLayout: React.FC<PremiumLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProgress] = useState<UserProgress>(defaultUserProgress);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <LayoutContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        mobileMenuOpen,
        toggleMobileMenu,
        userProgress,
      }}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            userProgress={userProgress}
            onToggle={toggleSidebar}
          />
        </div>

        {/* Mobile Header */}
        <MobileHeader onMenuToggle={toggleMobileMenu} userProgress={userProgress} />

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          userProgress={userProgress}
        />

        {/* Main Content Area */}
        <motion.main
          initial={false}
          animate={{
            marginLeft: sidebarCollapsed ? 80 : 280,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="
            min-h-screen
            lg:ml-0
            pt-16 lg:pt-0
            transition-all duration-300
          "
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumb />

            {/* Page Content with Transition */}
            <PageTransition>
              <div className="min-h-[calc(100vh-300px)]">
                {children}
              </div>
            </PageTransition>

            {/* Footer */}
            <Footer />
          </div>
        </motion.main>
      </div>
    </LayoutContext.Provider>
  );
};

export default PremiumLayout;
