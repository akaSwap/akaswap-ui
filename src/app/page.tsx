import { Header } from "@/components/header"
import { Children, useContext } from "react"

export default function Home() {
  const logo = <img src="/icons/logo.svg" alt="icon" width={160} />

  return (
    <div>
      {/* <Header
        logo={logo}
        logoUrl="/"
        links={[
          { name: "首頁", url: "/" },
          { name: "我的頁面", url: "/mypage", requiresLogin: true }
        ]}
        loginMethod={"google"}
        identifier={"google"}
        connectLabel="連結錢包"
        disconnectLabel="取消連結"
      /> */}
      <Header
        logo={logo}
        logoUrl="/"
        links={[
          { name: "首頁", url: "/" },
          { name: "我的頁面", url: "/mypage", requiresLogin: true }
        ]}
        theme={{
          bgColor: "#00F",
          textColor: "#F00",
          height: 120,
          buttonBorderColor: "white"
        }}
      />
    </div>
  )
}
