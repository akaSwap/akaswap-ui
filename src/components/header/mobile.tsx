"use client"
// import I18nLink from "../ui/link"
// import Image from "next/image"
// import Logo from "@/../public/icons/logo.svg"
// import LanguageSwitch from "./language-switch"
// import WalletConnect from "./wallet-connect"
// import { Burger } from "./burger"
// import { useContext, useState } from "react"
// import styles from "./styles.module.scss"
// import { Context } from "@/context"

export default function Mobile() {
  // const [isNavOpen, setIsNavOpen] = useState(false)
  // const { address } = useContext(Context)

  return (
    <nav className="flex w-full md:hidden">
      {/* <section className="flex w-full items-center justify-between bg-black px-4">
        <I18nLink href={"/"} effect="none">
          <Image src={Logo} alt="icon" width={130} />
        </I18nLink>
        <div className="flex items-center gap-4">
          <WalletConnect dict={dict} isNavOpen={isNavOpen} />
          <Burger isNavOpen={isNavOpen} setIsNavOpen={async () => setIsNavOpen(!isNavOpen)} />
        </div>
        <div className={isNavOpen ? styles.showNav : styles.hideNav}>
          <ul className="flex flex-col items-center justify-between pb-2 font-black">
            <li>
              <I18nLink
                href={dict.link.games.url}
                callback={() => {
                  setIsNavOpen(false)
                }}
              >
                {dict.link.games.text}
              </I18nLink>
            </li>
            <li>
              <I18nLink
                href={dict.link.explore.url}
                callback={() => {
                  setIsNavOpen(false)
                }}
              >
                {dict.link.explore.text}
              </I18nLink>
            </li>
            {address && (
              <li>
                <I18nLink
                  href={`${dict.link.mypage.url}/${address}`}
                  callback={() => {
                    setIsNavOpen(false)
                  }}
                >
                  {dict.link.mypage.text}
                </I18nLink>
              </li>
            )}

            <li className="w-screen p-4">
              <LanguageSwitch localeKey={dict.localeKey} />
            </li>
          </ul>
        </div>
      </section> */}
    </nav>
  )
}
