import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    <div>
        <nav>NAVBAR</nav>
        <main>
            <Outlet/>
        </main>
        <footer>FOOTER</footer>
    </div>
  )
}

export default MainLayout