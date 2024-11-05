import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.svg";
const Logo = () => {
  return (
    <Link href="/">
      <Image src={logo} alt="logo" />
    </Link>
  );
};

export default Logo;
