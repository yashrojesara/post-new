import { useEffect, useState } from "react"

function useScrollEvent() {
  const [isScrollBarAtBottom, setIsScrollBarAtBottom] = useState<boolean>(false)

  const handleScroll = () => {
    const offsetHeight = document.documentElement.offsetHeight;
    const innerHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop;
    const hasReachedBottom = offsetHeight - (innerHeight + scrollTop) <= 10;
    setIsScrollBarAtBottom(hasReachedBottom);   
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return (() => {
        window.removeEventListener("scroll", handleScroll)
    })
  }, [])

  return isScrollBarAtBottom
}

export default useScrollEvent;