import { SignIn } from "@clerk/nextjs";
import React from "react";

const SignInPage: React.FC = (): React.ReactElement => {
  return <SignIn />;
};

export default SignInPage;

// React.ReactNode: Bu tür, JSX.Element'ten biraz daha geniştir ve React bileşenlerinin, dizelerin, sayıların, boole değerlerin, null veya undefined dahil olmak üzere döndürebileceği her türlü değeri içerir. React.ReactNode, React bileşenlerinin çocuklarını tanımlamak için de yaygın olarak kullanılır.
// React.ReactElement: Bu, React.ReactElement, React.createElement fonksiyonu tarafından döndürülen somut bir element türüdür. Bu tür, bir bileşenin props, type (bileşen türü) ve key gibi özelliklerini içerir. React.ReactElement tipinde bir bileşen de props ve children kullanabilir.
// JSX.Element: Bu, JSX sözdizimini kullanan bir bileşenin dönüş türüdür. JSX, React ile sıkça kullanılan bir XML benzeri sözdizimi olup, bileşenlerinizi HTML gibi yazmanıza olanak tanır. JSX.Element, bir JSX ifadesinin sonucunu ifade eder. Bir JSX.Element döndüren bir bileşen, props ve children özelliklerini alabilir ve kullanabilir.
