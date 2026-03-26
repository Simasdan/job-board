import { Outlet } from "react-router-dom";
import styles from './MainLayout.module.scss';
import Sidebar from "@/components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <aside className={styles.sidebar}>
        <Sidebar/>
      </aside>
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  )
}

export default MainLayout