import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer: React.FC = (): React.ReactElement => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>
        <p className="text-sm">
          2024
          {new Date().getFullYear() !== 2024 &&
            ` - ${new Date().getFullYear()}`}{" "}
          Evently © All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
