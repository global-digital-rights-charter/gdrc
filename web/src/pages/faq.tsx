import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

interface Props {
  html: string;
}

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function FAQ(props: Props) {
  const { address, connector, isConnected } = useAccount();

  return (
    <>
      <Head>
        <title>About | The Global Digital Rights Charter</title>
        <meta
          property="og:url"
          content={`https://digitalrightscharter.org/faq`}
        />
        <meta
          property="og:title"
          content={`About | The Global Digital Rights Charter`}
        />
        <meta property="og:image" content={`/GDRC_preview.png`} />
      </Head>
      <Header address={address} isConnected={isConnected} />
      <Container className={`${styles.main}`}>
        <Row className="pb-5">
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
    `https://digitalrightscharter-bucket.s3.eu-west-1.amazonaws.com/faq.html`
  );
  const text = htmlRequest.status == 200 ? await htmlRequest.text() : "";

  return { props: { html: text } };
}
