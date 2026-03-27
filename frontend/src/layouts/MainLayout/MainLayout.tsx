import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './MainLayout.module.scss';
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'

const MainLayout = () => {
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 600 && window.innerWidth < 1050)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      console.log('width:', width, 'isMobile:', width < 600)
      setIsTablet(width >= 600 && width < 1050)
      setIsMobile(width < 600)
      if (width >= 1050) setSidebarExpanded(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.mainLayout}>
      {!isMobile && (
        <Sidebar
          isTablet={isTablet}
          sidebarExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          onNavigate={() => setSidebarExpanded(false)}
        />
      )}

      {isTablet && sidebarExpanded && (
        <>
          <div className={styles.backdrop} onClick={() => setSidebarExpanded(false)} />
          <div className={styles.expandedSidebar}>
            <Sidebar
              isTablet={isTablet}
              sidebarExpanded={true}
              onToggle={() => setSidebarExpanded(false)}
              onNavigate={() => setSidebarExpanded(false)}
            />
          </div>
        </>
      )}

      <div className={styles.content}>
        {isMobile && (
          <div className={styles.mobileTopBar}>
            <div className={styles.mobileLogo}>
              <div className={styles.mobileLogoIcon}>
                <BriefcaseIcon />
              </div>
              <span>Job Board</span>
            </div>
            <button
              className={`${styles.hamburger} ${sidebarExpanded ? styles.hamburgerOpen : ''}`}
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        )}

        {isMobile && sidebarExpanded && (
          <div className={styles.mobileSidebar}>
            <Sidebar
              isTablet={false}
              sidebarExpanded={true}
              onToggle={() => setSidebarExpanded(false)}
              onNavigate={() => setSidebarExpanded(false)}
              isMobileMenu
            />
          </div>
        )}

        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default MainLayout