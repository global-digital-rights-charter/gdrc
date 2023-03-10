import styles from "./MintComponent.module.scss";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import {
  useConnect,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useState } from "react";

interface Props {
  abi: any;
  contract: `0x${string}`;
  video: string;
  poster: string;
  address: `0x${string}` | undefined;
  isConnected: boolean;
}

export default function MintComponent(props: Props) {
  const contractLink =
    process.env.CHAIN_ID == "5"
      ? `https://goerli.etherscan.io/address/${props.contract}`
      : `https://etherscan.io/address/${props.contract}`;

  const [mintCount, setMintCount] = useState<number>();

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  const { config } = usePrepareContractWrite({
    address: props.contract ? props.contract : undefined,
    abi: props.abi,
    args: [mintCount],
    functionName: mintCount ? "mintDigitalRightsCharterTokens" : "",
  });
  const contractWrite = useContractWrite(config);

  const totalSupply = useContractRead({
    address: props.contract ? props.contract : undefined,
    abi: props.abi,
    args: [],
    functionName: "totalSupply",
    watch: true,
  });

  const balanceOf = useContractRead({
    address: props.contract ? props.contract : undefined,
    abi: props.abi,
    args: [props.address],
    functionName: "balanceOf",
    watch: true,
  });

  const waitForTransaction = useWaitForTransaction({
    confirmations: 1,
    hash: contractWrite.data?.hash,
  });

  function getTransactionLink(hash: string) {
    return process.env.CHAIN_ID == "5"
      ? `https://goerli.etherscan.io/tx/${hash}`
      : `https://etherscan.io/tx/${hash}`;
  }

  return (
    <Container className={`pt-4 pb-4 ${styles.main}`}>
      <Row className="pt-2 pb-2">
        <Col xs={12} sm={12} md={9} lg={9} className="text-center pt-2 pb-2 ">
          <video
            className={styles.video}
            src={props.video}
            poster={props.poster}
            autoPlay
            muted
            controls
            playsInline></video>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={3}
          lg={3}
          className="pt-2 pb-2 d-flex align-items-start justify-content-center">
          <Container className="no-padding">
            <Row className="pt-1">
              <Col>
                <h3>
                  Total Minted:{" "}
                  {JSON.stringify(
                    totalSupply.data ? Number(totalSupply.data) : 0
                  )}
                </h3>
              </Col>
            </Row>
            {props.isConnected && (
              <Row>
                <Col>
                  You Own:{" "}
                  {JSON.stringify(balanceOf.data ? Number(balanceOf.data) : 0)}
                </Col>
              </Row>
            )}
            <Row className="pt-3">
              <Col className={styles.mintHeader}>
                <a
                  href={contractLink}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.etherscanLink}>
                  View Contract
                </a>
              </Col>
            </Row>
            {props.isConnected ? (
              <>
                <Row className="pt-4">
                  <Col>
                    <Form.Control
                      autoFocus
                      type="number"
                      min={1}
                      placeholder="Mint Count"
                      aria-label="MintCount"
                      aria-describedby="basic-addon2"
                      onChange={(e: any) => {
                        const newV = e.target.value;
                        if (!isNaN(newV)) {
                          setMintCount(newV);
                        }
                      }}
                    />
                  </Col>
                </Row>
                <Row className="pt-2">
                  <Col>
                    <Button
                      onClick={() => contractWrite.write?.()}
                      disabled={
                        !mintCount ||
                        mintCount < 1 ||
                        contractWrite.isLoading ||
                        waitForTransaction.isLoading
                      }
                      className={styles.mintBtn}>
                      Mint now!
                    </Button>
                  </Col>
                </Row>
                {contractWrite.data && (
                  <>
                    <Row className="pt-3">
                      <Col>
                        {waitForTransaction.isLoading ? (
                          <span>Transaction Submitted...</span>
                        ) : waitForTransaction.data?.status ? (
                          <span className={styles.success}>
                            Transaction Successful!
                          </span>
                        ) : (
                          <span className={styles.error}>
                            Transaction Failed
                          </span>
                        )}
                        <br />
                        <a
                          href={getTransactionLink(contractWrite.data.hash)}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.etherscanLink}>
                          view txn
                        </a>
                      </Col>
                    </Row>
                    {waitForTransaction.isLoading && (
                      <Row>
                        <Col>Waiting for confirmation...</Col>
                      </Row>
                    )}
                  </>
                )}
                {contractWrite.error && (
                  <Row className="pt-3">
                    <Col className={styles.error}>
                      Transaction failed
                      {(contractWrite.error.cause as any).reason
                        ? `: ${(contractWrite.error.cause as any).reason}`
                        : ""}
                    </Col>
                  </Row>
                )}
                {(contractWrite.isLoading || waitForTransaction.isLoading) && (
                  <Row className="pt-3 text-center">
                    <Col>
                      <div className={styles.ripple}>
                        <div></div>
                        <div></div>
                      </div>
                    </Col>
                  </Row>
                )}
              </>
            ) : (
              <Dropdown drop={"down-centered"} className="pt-4">
                <Dropdown.Toggle className={styles.mintBtn}>
                  CONNECT TO MINT
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {connectors.map((connector) => (
                    <Dropdown.Item
                      key={`${connector.name}-dropdown-item`}
                      onClick={() => {
                        if (connector.ready) {
                          connect({ connector });
                        } else if (connector.name == "MetaMask") {
                          window.open(
                            "https://metamask.io/download/",
                            "_blank"
                          );
                        }
                      }}>
                      {connector.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
