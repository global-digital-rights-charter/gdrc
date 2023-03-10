import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import dynamic from "next/dynamic";
import { useAccount } from "wagmi";
import HeaderPlaceholder from "@/components/header/HeaderPlaceholder";

const Header = dynamic(() => import("../components/header/Header"), {
  ssr: false,
  loading: () => <HeaderPlaceholder />,
});

export default function Home() {
  const { address, connector, isConnected } = useAccount();

  return (
    <>
      <Head>
        <title>404 | The Global Digital Rights Charter</title>
        <meta
          property="og:url"
          content={`https://digitalrightscharter.org/404`}
        />
        <meta
          property="og:title"
          content={`404 | The Global Digital Rights Charter`}
        />
        <meta property="og:image" content={`/GDRC_preview.png`} />
      </Head>
      <Header address={address} isConnected={isConnected} />
      <Container
        className={`${styles.main} d-flex align-items-center justify-content-center`}>
        <Row>
          <Col className="text-center">
            <h3>PAGE NOT FOUND</h3>
            <br />
            <a className={styles.takeMeHome} href="/">
              The Global Digital Rights Charter
            </a>
          </Col>
        </Row>
        <br />
      </Container>
    </>
  );
}
