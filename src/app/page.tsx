import { Header } from "@/components/header"
import { TokenRenderer } from "@/components/token/renderer"
import { MediaLevel, Token } from "@akaswap/core"
import { Children, useContext } from "react"

export default function Home() {
  const logo = <img src="/icons/logo.svg" alt="icon" width={160} />

  const dump_token: Token = {
    contract: "KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj",
    tokenId: 25864,
    creators: ["tz29T8CoJ9HyEMU9G1yC9vCKwK2c8vRZSwSM"],
    aliases: [""],
    royalties: [100],
    royaltyShares: {
      tz29T8CoJ9HyEMU9G1yC9vCKwK2c8vRZSwSM: 100
    },
    royaltyShareAliases: {
      tz29T8CoJ9HyEMU9G1yC9vCKwK2c8vRZSwSM: ""
    },
    owners: {
      tz29T8CoJ9HyEMU9G1yC9vCKwK2c8vRZSwSM: 5000
    },
    ownerAliases: {
      tz29T8CoJ9HyEMU9G1yC9vCKwK2c8vRZSwSM: ""
    },
    amount: 5000,
    highestSoldPrice: null,
    highestSoldTime: null,
    recentlySoldPrice: null,
    recentlySoldTime: null,
    sale: {
      auctions: [],
      bundles: [],
      gachas: [],
      offers: [],
      swaps: []
    },
    metadataUri: "ipfs://QmNk1pmrGFDQpXfG35SutsinrExLEwCWuEaj9hcL1WRSuM",
    name: "行動證明（D）",
    description:
      "現在快去實體門市蒐集D, Y, C, TEAM 四個 NFT 硬幣，即可兌換品牌限量好禮。 『D』，是 Define 的縮寫。 DYCTEAM 以「定義自我」為核心理念，設計靈感主要源自 對日常生活的深入觀察，運用獨特的『丹寧緹花』和『機能性 素材』，打造高實穿性兼具設計感的風格穿搭，為生活注入 更多便利與溫度。 To define your character, that is DYCTEAM. ",
    mimeType: "model/gltf-binary",
    tags: ["DYCTEAM"],
    artifactUri: "ipfs://Qma25gEneGLUdxRajTjMnQp4g5u74r7XZT5aFzevYEHo5w",
    displayUri: "ipfs://QmQoTU2wrzPQ8Dmzdjo9mkQsPfNgEUq5pRhxQJLpNHHLps",
    thumbnailUri: "ipfs://QmY3Kaen2jDxRdEJf2HxMfirdfRcX2cmS7FdLtZ1kcnUR2",
    rights: "None (All rights reserved)",
    rightUri: "",
    attributes: [],
    additionalInfo: null
  }

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
      <div className="w-64 h-64 border">
        <TokenRenderer
          token={dump_token}
          gateway="https://assets.akaswap.com/ipfs"
          level={MediaLevel.artifact}
        />
      </div>
    </div>
  )
}
