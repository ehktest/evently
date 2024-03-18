import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

// auth page'leri navbar ve footer kullanmayacagi icin, 2 ayri route group olusturulup 2 ayri layout tanimlanmistir.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
