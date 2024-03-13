import { RefObject, useEffect, useState } from "react";

export default function useMouse<T extends HTMLElement>(component: RefObject<T>) {
  const [x, setX] = useState(0) 
  const [y, setY] = useState(0) 
  const [down, setDown] = useState(false)
  const [over, setOver] = useState(false)

  const setup = () => {
    if (component.current === null) {
      setTimeout(setup, 100)
      return;
    }

    component.current.addEventListener("mousemove", (e) => {
      setX(e.clientX)
      setY(e.clientY)
    })

    component.current.addEventListener("mousedown", () => {
      setDown(true) 
    })

    component.current.addEventListener("mouseup", () => {
      setDown(true) 
    })

    component.current.addEventListener("mouseenter", () => {
      setOver(true)
    })

    component.current.addEventListener("mouseleave", () => {
      setOver(false)
    })
  }

  useEffect(setup, [component, setup]) 

  return {x, y, down, over}
}