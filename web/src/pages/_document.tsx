import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/GDRC_b.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <footer
          id="footer"
          className="d-flex align-items-center justify-content-center flex-wrap">
          <a
            href="https://github.com/global-digital-rights-charter/gdrc"
            target="_blank"
            rel="noreferrer">
            <Image
              loading={"lazy"}
              width="20"
              height="20"
              src="/github.png"
              alt="GitHub"
            />{" "}
            GitHub
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            href={
              process.env.CHAIN_ID == "5"
                ? `https://goerli.etherscan.io/address/${process.env.GDRC1_CONTRACT_ADDRESS}`
                : `https://etherscan.io/address/${process.env.GDRC1_CONTRACT_ADDRESS}`
            }
            target="_blank"
            rel="noreferrer">
            <Image
              loading={"lazy"}
              width="20"
              height="20"
              src="/etherscan.svg"
              alt="Etherscan"
            />{" "}
            Etherscan
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            href={
              process.env.CHAIN_ID == "5"
                ? `https://testnets.opensea.io/assets/ethereum/${process.env.GDRC1_CONTRACT_ADDRESS}`
                : `https://opensea.io/assets/ethereum/${process.env.GDRC1_CONTRACT_ADDRESS}`
            }
            target="_blank"
            rel="noreferrer">
            <Image
              loading={"lazy"}
              width="20"
              height="20"
              src="/opensea.png"
              alt="OpenSea"
            />{" "}
            OpenSea
          </a>
        </footer>
      </body>
    </Html>
  );
}
