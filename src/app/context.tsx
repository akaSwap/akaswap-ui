// "use client"

// import { createContext, useCallback, useEffect, useState } from "react"
// import { ContextState } from "./context.interface"
// import { AkaswapUser } from "@akaswap/core"

// export const Context = createContext<ContextState>(null!)

// export const ContextProvider = (props: any) => {
//   const [isInitLoading, setIsInitLoading] = useState<boolean>(true)
//   const [user, setUser] = useState<AkaswapUser | null>(null)

//   const initUser = useCallback(async () => {
//     const _user = new AkaswapUser()
//     setUser(_user)
//     setIsInitLoading(false)
//   }, [user])

//   useEffect(() => {
//     if (isInitLoading) {
//       initUser()
//     }
//   }, [initUser])

//   return <Context.Provider value={{ isInitLoading, user }}>{props.children}</Context.Provider>
// }
