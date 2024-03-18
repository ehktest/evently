"use client";
import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Next.js'te custom hook kullanırken componentin client tarafında çalıştırılması gerekip gerekmediği, hook'un yapacağı işleme ve kullanılan özelliklere bağlıdır. Custom hook'lar, React'ın fonksiyonelliğini yeniden kullanılabilir bir şekilde paketlemek için kullanılır. Bir custom hook, içinde herhangi bir DOM manipülasyonu yapmıyorsa veya client-specific API'lar kullanmıyorsa (örneğin, window veya document objelerine erişim), o zaman bu hook herhangi bir ortamda (server veya client) güvenle çalıştırılabilir.

const NavItems: React.FC = (): React.ReactElement => {
  const pathname = usePathname();
  return (
    <ul className="flex w-full flex-col items-start gap-5 md:justify-between md:items-center md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <li
            key={link.route}
            className={`${
              isActive && "text-primary-500"
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
