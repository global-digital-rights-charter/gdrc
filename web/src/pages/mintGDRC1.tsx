import Head from "next/head";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import { GRDC1_ABI } from "@/abis/GDRC1";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";
import MintComponentPlaceholder from "@/components/mintComponent/MintComponentPlaceholder";
import { Container, Row, Col } from "react-bootstrap";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

const MintComponent = dynamic(
  () => import("../components/mintComponent/MintComponent"),
  {
    ssr: false,
    loading: () => <MintComponentPlaceholder />,
  }
);

interface Props {
  html: string;
}

export default function MintGDRC1(props: Props) {
  const { address, connector, isConnected } = useAccount();

  const grdc1ContractAddress = process.env
    .GDRC1_CONTRACT_ADDRESS as `0x${string}`;

  return (
    <>
      <Head>
        <title>Mint GDRC1 | The Global Digital Rights Charter</title>
        <meta
          property="og:url"
          content={`https://digitalrightscharter.org/faq`}
        />
        <meta
          property="og:title"
          content={`Mint GDRC1 | The Global Digital Rights Charter`}
        />
        <meta property="og:image" content={`/GDRC_preview.png`} />
      </Head>
      <Header address={address} isConnected={isConnected} />
      <MintComponent
        contract={grdc1ContractAddress}
        abi={GRDC1_ABI}
        video="https://digitalrightscharter-bucket.s3.eu-west-1.amazonaws.com/GDRC1.mp4"
        poster="/GDRC_preview.png"
        address={address}
        isConnected={isConnected}
      />
      <Container className="pb-4">
        <Row>
          <Col
            dangerouslySetInnerHTML={{
              __html: props.html,
            }}></Col>
        </Row>
      </Container>
    </>
  );
}

export async function getServerSideProps(req: any, res: any, resolvedUrl: any) {
  const htmlRequest = await fetch(
    `https://digitalrightscharter-bucket.s3.eu-west-1.amazonaws.com/mintGDRC1.html`
  );
  const text = await htmlRequest.text();

  return { props: { html: text } };
}
