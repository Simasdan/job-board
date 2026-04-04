import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './MainLayout.module.scss';
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";
import BriefcaseIcon from '@/assets/icons/briefcase-business.svg?react'
import axiosInstance from "@/api/axiosInstance";

const MainLayout = () => {
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 600 && window.innerWidth < 1050)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isWakingUp, setIsWakingUp] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsTablet(width >= 600 && width < 1050)
      setIsMobile(width < 600)
      if (width >= 1050) setSidebarExpanded(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const wakeUpServer = async () => {
      const timer = setTimeout(() => setIsWakingUp(true), 2000)

      const tryPing = async (): Promise<void> => {
        try {
          await axiosInstance.get('/jobposts')
          clearTimeout(timer)
          setIsWakingUp(false)
        } catch {
          await new Promise(res => setTimeout(res, 3000))
          return tryPing()
        }
      }

      await tryPing()
    }
    wakeUpServer()
  }, [])

  return (
    <div className={styles.mainLayout}>

      {isWakingUp && (
        <div className={styles.wakeUpOverlay}>
          <div className={styles.wakeUpModal}>
            <div className={styles.wakeUpIcon}>
              <BriefcaseIcon />
            </div>
            <h2>Waking up the server...</h2>
            <p>
              This app runs on a free hosting plan which spins down after inactivity.
              The server is starting up — this usually takes 30–60 seconds.
            </p>
            <div className={styles.wakeUpSpinner} />
          </div>
        </div>
      )}

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