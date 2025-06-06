import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from "react"
import classNames from "classnames"

export const MenuItem = ({ children, menuId, disabled, onClick }) => {
  return (
    <div
      className={disabled ? "text-gray-400 px-3" : "text-black hover:bg-blue-500 hover:text-white px-3 cursor-pointer"}
      onClick={() => disabled || onClick(menuId)}
    >
      {children}
    </div>
  )
}

export const ContextMenu = ({x, y, isOpen, children}) => {
  return (
    <div style={{
      position: "fixed",
      left: x + "px",
      top: y + "px",
    }}
      className={classNames("text-sm bg-white rounded-sm shadow-md shadow-gray-500 p-1", !isOpen && "hidden")}
    >
      {children}
    </div>
  )
}

export const useContextMenu = (onOpen) => {
  const [{ x, y }, setXY] = useState({x: 0, y: 0})
  const [isOpen, setIsOpen] = useState(false)
  const [menuContext, setMenuContext] = useState({});

  useEffect(() => {
    if (isOpen) {
      const handler = (e) => {
        e.preventDefault()
        setIsOpen(false)
      }

      window.addEventListener("click", handler)
      return () => {
        window.removeEventListener("click", handler)
      }
    }
  }, [isOpen])

  const onContextMenu = useCallback((e, context) => {
    e.preventDefault()

    onOpen(context)

    setMenuContext(context)
    setIsOpen(true)
    setXY({x: e.clientX, y: e.clientY})
  }, [])

  return { x, y, isOpen, onContextMenu, menuContext }
}

const ContextMenuContext = createContext(null)

export const ContextMenuProvider = ({ onContextMenu, children}) => {
  return (
    <ContextMenuContext.Provider value={onContextMenu}>
      {children}
    </ContextMenuContext.Provider>
  )
}

export const useOnContextMenu = () => useContext(ContextMenuContext)
