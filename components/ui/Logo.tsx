import Image from "next/image"
import Link from "next/link"


const Logo = ({isAuthenticated=false}: {isAuthenticated?: boolean}) => {

  return (
      <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
        <Image
          src="/images/logos/holastars.png"
          alt="Hola Stars Company Logo"
          width={85}
          height={50}
          unoptimized
        />
      </Link>
  );
};

export default Logo;