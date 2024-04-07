import { useContext, useEffect, useRef } from "react";
import { HeaderContext } from "./HeaderProvider";
import Heading from "../shared/components/Heading";

export default function ScrollToTopHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { showHeader, setShowHeader } = useContext(HeaderContext);
  const showHeaderRef = useRef<boolean>(!!showHeader);
  const setShowHeaderRef = (show: boolean) => {
    showHeaderRef.current = show;
    setShowHeader?.(show);
  };

  useEffect(() => {
    function handleScroll(e: any) {
      if (e.target.scrollTop > 24 && !showHeaderRef.current) {
        setShowHeaderRef(true);
      } else if (e.target.scrollTop <= 24 && showHeaderRef.current) {
        setShowHeaderRef(false);
      }
    }
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <Heading show={!showHeader} title={title} subtitle={subtitle}></Heading>
  );
}
