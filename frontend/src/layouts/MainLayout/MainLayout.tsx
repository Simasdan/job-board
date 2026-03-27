import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from './MainLayout.module.scss';
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";

const MainLayout = () => {
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1050)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 1050)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={styles.mainLayout}>
      <Sidebar
        isTablet={isTablet}
        sidebarExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        onNavigate={() => setSidebarExpanded(false)}
      />
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
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
    </div>
  )
}

export default MainLayout